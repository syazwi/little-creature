# Little Creature: rebuilds everything that ships.
#   dist/LittleCreature.html  single self-contained file, double-click to play on any computer
#   dist/LittleCreature.apk   Android app (release-signed if android/keystore.properties exists)
#   dist/LittleCreature_dev.apk   Android developer app with chapter jumps and autoplay
#   play/LittleCreature.aab   (with -Play) the app bundle to upload to Google Play: no GitHub updater (src/store-play.js);
#                             kept out of git, signed with android/keystore.properties (your upload key)
# Usage (PowerShell, from the project folder):  .\tools\build.ps1        add -SkipApk to only rebuild the HTML, -Play for the bundle
param([switch]$SkipApk, [switch]$Play)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# ---- Node (for the single-file HTML build)
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node -and (Test-Path 'C:\Program Files\nodejs\node.exe')) { $node = 'C:\Program Files\nodejs\node.exe' }
if (-not $node) { throw 'Node.js not found. Install it from https://nodejs.org' }
& $node tools/build-web.mjs
if ($LASTEXITCODE) { throw 'HTML build failed' }
if ($SkipApk) { return }

# ---- Java 17+ and the Android SDK (for the APK)
if (-not $env:JAVA_HOME) {
  $jdk = @(Get-ChildItem 'C:\Program Files\Microsoft\jdk-*', 'C:\Program Files\Eclipse Adoptium\jdk-*', 'C:\Program Files\Android\Android Studio\jbr' -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending)[0]
  if (-not $jdk) { throw 'No JDK found. Install JDK 17+ (or Android Studio) or set JAVA_HOME.' }
  $env:JAVA_HOME = $jdk.FullName
}
$sdk = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
if (-not (Test-Path 'android/local.properties')) {
  if (-not (Test-Path $sdk)) { throw 'Android SDK not found. Install Android Studio or set ANDROID_HOME.' }
  "sdk.dir=$($sdk -replace '\\','\\' -replace ':','\:')" | Set-Content 'android/local.properties' -Encoding ascii
}
if (-not (Test-Path 'android/keystore.properties')) {
  if ($Play) { throw 'android/keystore.properties missing: Google Play needs the bundle signed with your upload key.' }
  Write-Warning 'android/keystore.properties missing: the APK will be signed with the debug key.'
}

$tasks = @('assembleRelease', 'assembleDeveloper'); if ($Play) { $tasks += 'bundlePlay' }
Push-Location android
try { & .\gradlew.bat @tasks --no-daemon --console=plain; if ($LASTEXITCODE) { throw 'Gradle build failed' } }
finally { Pop-Location }

New-Item -ItemType Directory -Force dist | Out-Null
Copy-Item 'android/app/build/outputs/apk/release/app-release.apk' 'dist/LittleCreature.apk' -Force
Copy-Item 'android/app/build/outputs/apk/developer/app-developer.apk' 'dist/LittleCreature_dev.apk' -Force
$out = @('dist/LittleCreature.html', 'dist/LittleCreature.apk', 'dist/LittleCreature_dev.apk')
if ($Play) {
  New-Item -ItemType Directory -Force play | Out-Null
  Copy-Item 'android/app/build/outputs/bundle/play/app-play.aab' 'play/LittleCreature.aab' -Force
  $out += 'play/LittleCreature.aab'
}
Get-Item $out | Select-Object Name, @{n = 'MB'; e = { [math]::Round($_.Length / 1MB, 2) } }
