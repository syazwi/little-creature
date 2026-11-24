# The app only uses framework WebView APIs plus androidx.webkit; no reflection.
# v3.17.5: the microphone bridge (window.LCAndroid) is called from the game's JavaScript by name, so keep its methods.
-keepclassmembers class com.syazwi.littlecreature.MainActivity$MicBridge {
    @android.webkit.JavascriptInterface <methods>;
}
