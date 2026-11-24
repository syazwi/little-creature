package com.syazwi.littlecreature;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.DisplayCutout;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

/**
 * Little Creature for Android: a fullscreen, landscape WebView that runs the exact same HTML5 game as the
 * PC version. The game files are bundled in the APK (assets/www) and served from a virtual https origin
 * by WebViewAssetLoader, so saving (localStorage), fonts and audio all behave like a normal browser, offline.
 */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/www/index.html?platform=android";
    private static final int MIC_REQUEST = 17;
    private static final int MIC_ASK = 18;   // v3.17.5: the game asks first (LCAndroid.askMic), then turns the microphone on
    private static final String PREFS = "littleCreature", MIC_ASKED = "micAsked";
    private WebView web;
    private String safeJs = null;   // last reported cutout insets, as a JS call
    private PermissionRequest pendingMic = null;   // the game asked for the microphone; waiting for the player's answer

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // Draw the game edge to edge, including the area beside a camera notch / punch-hole.
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = Build.VERSION.SDK_INT >= 30
                    ? WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
                    : WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web = new WebView(this);
        web.setBackgroundColor(0xFF120D0A);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);

        web.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (HOST.equals(uri.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (Exception ignored) { }
                return true;   // external links open in the browser, never inside the game
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pushSafeArea();
            }
        });

        // v3.17: the microphone, only for Chapter 17's spoken mantera (and only after the player agrees). Nothing else
        // is ever granted to the page.
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    boolean audio = false;
                    for (String r : request.getResources()) if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) audio = true;
                    if (!audio || !HOST.equals(request.getOrigin().getHost())) { request.deny(); return; }
                    if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                        request.grant(new String[] { PermissionRequest.RESOURCE_AUDIO_CAPTURE });
                        return;
                    }
                    if (pendingMic != null) pendingMic.deny();
                    pendingMic = request;
                    markMicAsked();
                    requestPermissions(new String[] { Manifest.permission.RECORD_AUDIO }, MIC_REQUEST);
                });
            }

            @Override
            public void onPermissionRequestCanceled(PermissionRequest request) {
                if (request == pendingMic) pendingMic = null;
            }
        });

        // v3.17.5: asking from inside a WebView permission request paused the game behind Android's dialog, and on
        // some phones the microphone never started. Now the game asks Android first (askMic), waits for the answer
        // (LC.onMicAnswer), and only then turns the microphone on, which onPermissionRequest grants at once.
        web.addJavascriptInterface(new MicBridge(), "LCAndroid");

        // The game art fills the whole screen; only the HUD is nudged away from the cutout.
        web.setOnApplyWindowInsetsListener((v, insets) -> {
            readCutout(insets);
            return v.onApplyWindowInsets(insets);
        });

        setContentView(web);
        hideSystemBars();
        if (state != null) web.restoreState(state);
        else web.loadUrl(START_URL);
    }

    /** Tells the game how far the camera cutout reaches into each edge, in CSS px (= dp). */
    private void readCutout(WindowInsets insets) {
        int l = 0, t = 0, r = 0, b = 0;
        if (Build.VERSION.SDK_INT >= 28 && insets != null) {
            DisplayCutout c = insets.getDisplayCutout();
            if (c != null) {
                float d = getResources().getDisplayMetrics().density;
                l = Math.round(c.getSafeInsetLeft() / d);
                t = Math.round(c.getSafeInsetTop() / d);
                r = Math.round(c.getSafeInsetRight() / d);
                b = Math.round(c.getSafeInsetBottom() / d);
            }
        }
        safeJs = "window.LC&&LC.setSafeArea&&LC.setSafeArea(" + l + "," + t + "," + r + "," + b + ")";
        pushSafeArea();
    }

    private void pushSafeArea() {
        if (web != null && safeJs != null) web.evaluateJavascript(safeJs, null);
    }

    private void hideSystemBars() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN);
        }
    }

    private boolean micGranted() {
        return checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
    }

    private void markMicAsked() {
        getSharedPreferences(PREFS, MODE_PRIVATE).edit().putBoolean(MIC_ASKED, true).apply();
    }

    /** "granted", "prompt" (Android will show its question), or "blocked" (the player chose Don't allow for good). */
    private String micState() {
        if (micGranted()) return "granted";
        boolean asked = getSharedPreferences(PREFS, MODE_PRIVATE).getBoolean(MIC_ASKED, false);
        return asked && !shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO) ? "blocked" : "prompt";
    }

    private void answerMic(String state) {
        if (web != null) web.evaluateJavascript("window.LC&&LC.onMicAnswer&&LC.onMicAnswer('" + state + "')", null);
    }

    /** The game's way to ask about the microphone. Only the bundled game is ever loaded here (links open outside). */
    private class MicBridge {
        @JavascriptInterface
        public String micState() {
            return MainActivity.this.micState();
        }

        @JavascriptInterface
        public void askMic() {
            runOnUiThread(() -> {
                if (micGranted()) { answerMic("granted"); return; }
                markMicAsked();
                requestPermissions(new String[] { Manifest.permission.RECORD_AUDIO }, MIC_ASK);
            });
        }

        @JavascriptInterface
        public void openSettings() {
            runOnUiThread(() -> {
                try {
                    startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", getPackageName(), null)));
                } catch (Exception ignored) { }
            });
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode == MIC_ASK) {
            boolean ok = results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED;
            answerMic(ok ? "granted" : shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO) || results.length == 0 ? "denied" : "blocked");
            return;
        }
        if (requestCode != MIC_REQUEST || pendingMic == null) return;
        if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED)
            pendingMic.grant(new String[] { PermissionRequest.RESOURCE_AUDIO_CAPTURE });
        else pendingMic.deny();   // the game falls back to tapping the words
        pendingMic = null;
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        // Let the game decide: close a menu / open the pause menu. On the title screen, go to the background.
        web.evaluateJavascript("(window.LC && LC.onBack) ? LC.onBack() : false", value -> {
            if (!"true".equals(value)) moveTaskToBack(true);
        });
    }

    @Override
    protected void onPause() {
        web.evaluateJavascript("window.LC && LC.autoSave && LC.autoSave()", null);
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        hideSystemBars();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.evaluateJavascript("window.LC && LC.autoSave && LC.autoSave()", null);
            web.destroy();
        }
        super.onDestroy();
    }
}
