# Working in the shared repository

Codex and Claude Code share this project. Check `git status --short --branch` before editing and again before committing. Preserve existing edits and staged changes. Use a separate worktree when tasks need to run in parallel on overlapping files, or coordinate the handoff before editing those files.

Stage files by name and review `git diff --cached` before committing. Keep each commit scoped to the current task, including any generated files it needs. If another task already has changes staged, preserve that index and use a separate worktree or coordinate before committing.

Fetch `origin/main` before publishing. If it has advanced, integrate those commits and recheck your update before pushing. Use normal fast-forward pushes to `main`.

# Publishing updates

Push completed game updates to `origin/main` and verify GitHub Pages serves the new build at https://syazwi.github.io/little-creature/.

For each game release, bump the Android version code and name, then rebuild the browser downloads and signed Android APK with `tools/build.ps1` before pushing.
