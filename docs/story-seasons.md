# Little Creature story seasons

## Season 1

Chapters 1–20 make up Season 1. Chapter 20, **Janji Buaya Putih** (The White Crocodile's Promise), is the finale. Both parts belong to Season 1, including the voyage to Sabah, Kenduri Terakhir, the group photo, the credits, and the epilogue at Nenek's jetty.

The chapter closes Pelita and Seri Putih's story for the season. The farm stays playable afterward, and players can keep their rewards and replay completed chapters. Existing saves finish the finale when `quests.ch20 >= LC.C20.end`. The `c20tamat` and `c20epi` flags still track the credits and epilogue.

## Season 2

**Chapter 21 opens Season 2.** Continue chapter numbering and build from the player's existing farm, companions, and Chapter 20 rewards. Start Chapter 21 after the Season 1 epilogue so the farewell at Nenek's jetty has room to land. The Chapter 21 title, story, and release date are open.

These are story seasons. The in-game farming calendar uses its own seasons.

## Where the game shows the boundary

- `src/scenes/UIBuaya.js` marks Chapter 20 with `seasonFinale: 1` in `LC.CHAPTER_LIST`.
- `src/scenes/UIChecklist.js` uses that marker in the Journal and Chapter Progress.
- `src/buaya2.js` and `src/scenes/UIBuaya2.js` hold the ending text, Season 1 credits, and Tamat badge. The credits cover Chapters 1–20.
