# Publishing updates

Push completed game updates to `origin/main` and verify GitHub Pages serves the new build at https://syazwi.github.io/little-creature/.

For each game release, bump the Android version code and name, then rebuild the browser downloads and signed Android APK with `tools/build.ps1` before pushing.
