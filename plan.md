# Little Creature — Game Plan

> A cozy pixel-art farming game where you keep a small, lonely household spirit fed and happy.
> The setting is a riverside village built from shared Southeast Asian traditions.

---

## 1. Pitch

Your grandmother (Nenek) has passed away and left you her **rumah panggung** (stilt house) and a little farm by the river.
Next to the house is an old **spirit house**. Nobody has left an offering there in months.
Something small lives inside it: **Pelita**, a tiny spirit whose glow has nearly gone out.

You farm by day, cook at the clay stove, and leave offerings at night.
Pelita grows from a weak flicker into the **Guardian of the Kampung**.
Neglect it and it gets mischievous. Love it and it blesses your fields.

**Genre:** cozy farm sim + virtual pet.
**Tone:** warm, gentle, a little spooky after dark, never scary.
**Session length:** about 6 real minutes per in-game day. It is a complete loop that you can play for weeks.

---

## 2. Cultural pillars (Southeast Asia)

The village blends Malay, Indonesian, Thai, Filipino, Lao, Khmer and Vietnamese folk elements. Each is drawn respectfully, as everyday village life.

| Element | Inspiration | Use in game |
|---|---|---|
| Spirit house | Thai/Lao/Khmer *san phra phum* | Pelita's home. Offerings go here. |
| Stilt house | Malay *rumah panggung*, Filipino *bahay kubo* | Player home and bed (sleep / save) |
| Conical hat | *nón lá*, *salakot*, *terendak* | Player character silhouette |
| Rice paddy (*sawah*) | Region-wide | Flooded plots where only rice grows |
| Daily flower offering | Balinese *canang sari* | Craftable offering (flowers in a leaf tray) |
| Jasmine garland | Thai *phuang malai* | Craftable offering |
| Incense sticks | Region-wide | Bought at the warung |
| Red soda | Thai custom of offering red drinks to spirits | Bought at the warung. Pelita's treat. |
| Frangipani (*kemboja*) | Malay/Indonesian spirit folklore | Tree beside the spirit house |
| Hungry Ghost Night | Zhongyuan, celebrated across Malaysia/Singapore | Every 7th night: spirit eats double, bond ×2 |
| Floating lanterns | Loy Krathong / Yi Peng | Ending festival when Pelita becomes Guardian |
| Food | Nasi lemak, pisang goreng, kuih pandan, mango sticky rice, bubur | Cooking recipes |
| Currency | *Kepeng* (old holed coins of Bali/Java) | Money |
| Music | Gamelan-style pentatonic scales | Procedural Web Audio music with metallophone-like tones |
| Village animals | *Kerbau* (water buffalo), *ayam kampung* (village chickens) | Ambient wandering critters |

---

## 3. Core loop

```
 Morning ──► Farm (till, plant, water, harvest) ──► Sell / buy at Warung
    ▲                                                    │
    │                                                    ▼
 Sleep (save)  ◄── Offerings at the spirit house ◄── Cook at the Dapur (stove)
                       & feed / pet Pelita
```

1. **Farm.** Till the soil with the *cangkul* (hoe), plant seeds, and water with the *gembor* (watering can) at the well. Crops grow one stage per watered day. Rice grows only in the flooded paddy and needs no water.
2. **Gather.** Banana trees, coconut palms and the mango tree drop fruit every few days.
3. **Cook.** The *dapur* (clay stove) turns crops into dishes. Dishes feed Pelita far better than raw crops.
4. **Offer.** Incense, garlands and *canang* placed at the spirit house raise Pelita's **Glow**.
5. **Care.** Feed Pelita, pet it, and meet its **daily craving**.
6. **Sleep.** The day ends, crops grow, the game saves, and Pelita's mood is resolved (a blessing or a prank).

---

## 4. Pelita (the spirit)

### Needs (0–100)
| Need | Falls when | Raised by |
|---|---|---|
| **Kenyang** (Fullness) | Over time (×2 on Hungry Ghost Night) | Food (dishes > raw crops) |
| **Gembira** (Joy) | Slowly, and faster when hungry | Petting (cooldown), favourite food, the daily craving, red soda |
| **Cahaya** (Glow) | Each day | Incense, garland, canang at the spirit house |

**Bond (XP)** comes from every act of care. Bond thresholds unlock growth stages.

### Growth stages
| # | Stage | Bond | Look | Blessing |
|---|---|---|---|---|
| 0 | Flicker | 0 | Tiny faint orb | — |
| 1 | Little Spirit | 30 | Round ghost with a face. Follows you. | Shows its daily craving |
| 2 | Lantern Spirit | 150 | Carries a small lantern | Waters crops overnight if Glow ≥ 50 |
| 3 | Garden Spirit | 380 | Frangipani flower on its head | 30% chance per crop to grow an extra stage. Finds kepeng. |
| 4 | Guardian of the Kampung | 750 | Golden glow, ornate headdress | Floating-lantern festival ending (play continues) |

### Mood resolution at sleep
- **Content** (all needs ≥ 50): bonus bond, and the stage blessing applies.
- **Neglected** (any need < 20): one harmless prank. Pelita dries out watered soil, takes a few kepeng, or pulls one crop back a stage. Never permanent loss.

### Behaviour
- Floats and bobs behind the player. Sometimes drifts back to the spirit house.
- Is faint in daylight and bright and glowing at night.
- Shows a thought bubble with the craving icon when hungry.
- Has these expressions: normal, happy, sad, sleepy.

---

## 5. Content

### Crops
| Crop | Seed price | Days | Sells | Notes |
|---|---|---|---|---|
| Ubi (sweet potato) | 10 | 3 | 25 | |
| Pandan | 12 | 3 | 28 | |
| Cili (chili) | 15 | 4 | 35 | |
| Marigold | 15 | 3 | 30 | Offering flower |
| Melati (jasmine) | 20 | 4 | 45 | Offering flower |
| Padi (rice) | 20 | 5 | 15 ×3 | Paddy tiles only, no watering |

**Trees:** Pisang (banana), Kelapa (coconut), Mangga (mango). Each regrows fruit every 2–3 days.

### Recipes (Dapur)
| Dish | Ingredients | Fullness / Joy |
|---|---|---|
| Nasi (steamed rice) | Padi | 25 / 5 |
| Ubi Rebus | Ubi | 25 / 5 |
| Pisang Goreng | Pisang + Padi | 35 / 15 |
| Bubur Ubi | Ubi + Kelapa | 40 / 15 |
| Kuih Pandan | Pandan + Kelapa + Padi | 40 / 25 |
| Nasi Lemak | Padi + Cili + Kelapa | 55 / 20 |
| Pulut Mangga | Padi + Mangga + Kelapa | 50 / 30 |

### Offerings
| Offering | Source | Glow |
|---|---|---|
| Colok (incense) | Warung, 15 kepeng | +20 |
| Phuang Malai (garland) | Craft: 2 Melati | +35 |
| Canang | Craft: Marigold + Melati | +45 (+Joy) |
| Air Merah (red soda) | Warung, 25 kepeng | Food: +15 fullness, +30 joy |

### Places on the map
Stilt house (bed), spirit house + frangipani, dapur (stove), well (perigi), fenced farm field, rice paddy, warung run by Mak Ani, river with jetty, coconut palms, banana grove, mango tree, a kerbau, chickens, and path lanterns that light at night.

---

## 6. Controls
| Key | Action |
|---|---|
| WASD / Arrows | Move |
| E / Space | Interact / use the selected item |
| 1–9, mouse wheel | Select a hotbar slot |
| Q | Quick-select the next tool |
| X | Eat the selected food yourself (restores energy) |
| Tab / I | Inventory |
| M | Map |
| N | Toggle music |
| Esc | Close menu |
| J | Journal (requests, places, spirits, fish, levels) |
| R | Ride / get off the bicycle or car |
| G | Put on / take off the Bunian glasses |
| F | Fullscreen |

Mouse clicks also work on all menus.

---

## 7. Technical design

- **Engine:** [Phaser 3.80.1](https://phaser.io), MIT licence. It is vendored to `lib/phaser.min.js` so the game runs offline, with a CDN fallback.
- **No build step.** Plain `<script>` files share one global namespace `LC`. That makes double-clicking `index.html` (`file://`) work.
- **Resolution:** the layout is designed at 960×640. The world uses 16 px tiles at camera zoom 3 with `pixelArt: true`. The UI is drawn at native resolution so text stays crisp.
- **Any screen shape, no black bars (v1.2):** `LC.viewSize()` keeps the height at 640 and widens the canvas to the screen's aspect ratio (e.g. 1421×640 on a 20:9 phone, 1138×640 at 16:9), or keeps the width at 960 and heightens it on squarer screens (960×720 at 4:3). Ratios outside 1:1 to 2.6:1 are letterboxed. It refits on resize, rotation and fullscreen changes. The camera simply shows more of the farm. In `UI.js`, HUD groups are pinned to an edge (`pin(anchor, objs)`: tl/tc/tr/bl/bc/br), and menus and dialogs are centred containers (`modalC`). The safe area (camera notch) insets the HUD only: the Android app reports it through `LC.setSafeArea()`, and browsers through CSS `env(safe-area-inset-*)`. New HUD elements must be pinned, and new menus must use `modalC`, or they will drift on non-3:2 screens.
- **Fullscreen:** the Android app is immersive. Phone browsers request fullscreen and lock to landscape on the first tap. On a PC, press F or use the pause menu.
- **Art:** every sprite is **generated at boot in code** (`src/art.js`), using pixel-string sprites and small drawing routines. There are no external image files, so there are no licence issues and the look is consistent and Southeast Asian throughout.
  - *Optional swap-in:* any CC0 16×16 pack (for example Kenney's "Tiny Town") can replace the generated textures by loading PNGs under the same texture keys.
- **Font:** "Pixelify Sans" (SIL OFL), bundled in `lib/fonts/`, so offline play has no network stall.
- **Audio:** Web Audio only. Gamelan-like pentatonic music, plus synthesised sound effects (till, water, harvest, coin, spirit chime).
- **Save:** `localStorage`, three slots (v1.6): slot 1 is `LC.SAVE_KEY`, slots 2-3 add `.2`/`.3`, and `.last` remembers the slot in play. It saves automatically on every sleep and when the game is hidden; the pause menu saves to or loads from any slot. The title screen has Continue (last slot), Load Game and New Game (pick a slot; overwriting asks twice).

### File layout
```
index.html          canvas host, loads scripts
plan.md             this document
README.md           how to run, controls, credits
lib/phaser.min.js   vendored engine
src/
  data.js           items, crops, recipes, offerings, stages, levels, forage, fishing tables, houses, farm map, dialogue
  areas.js          every place: tile maps, objects, exits/gates, critters, ambience (v1.3)
  folk.js           villagers (roles, shops, requests, gifts) and folk spirits (wishes, blessings) (v1.3)
  art2.js           v1.3 textures: new tiles, buildings, villagers, critters, spirits, forage, icons
  art3.js           v1.4 textures: bicycles, cars (one per outfit colour), sea-floor tiles, coral, underwater buildings, sea folk
  data2.js          v1.5 data: seasons, seasonal crops and orchard trees, animals, chests, Pesta contests, weapons, enemies, new villagers
  areas2.js         v1.5 places: Kampung Bunian (hidden), Lombong Puaka (the haunted mine), new objects in old places, the map atlas
  undersea.js       v1.5 deep sea: Kapal Karam (Si Tanggang), Istana Laut Selatan (Ratu Kidul), Kota Atlantis (Poseidon)
  art4.js           v1.5 textures: cave/ship/jade/marble tiles, crops, orchard, animals, enemies, buildings, deep-sea folk, icons
  scenes/WorldFarm.js    animals, chests, rain, glasses and hidden things, keris, mine and sea gates
  scenes/WorldCombat.js  enemies (day/night/escort groups, telegraphed attacks), swinging, battle FX and music, Sumpahan Batu, Restu Ibu, fainting
  battle.js         v1.6 data: wild enemies per place, the stone curse and Restu Ibu, Mak Deruma, alive villagers (LC.villager)
  art5.js           v1.6 textures: boar, rock crab, scorpion, fire jellyfish, Mak Deruma (ghost and alive), Si Tanggang alive, battle FX, ability icons
  scenes/WorldTanggang.js  guiding Si Tanggang to his mother, the reunion cutscene
  scenes/UISettings.js     sound & music volumes, save/load slot menus, ability slots, damage numbers, hurt flash
  badang.js         v1.7 data: Badang (skinny and strong), the hantu's spots, bubu, Ladang Badang, Batu Badang, Lempar Batu, his story lines
  art6.js           v1.7 textures: Badang (both), the river hantu, bubu, stumps and boulders, Batu Badang, the contest stone, icons
  scenes/WorldBadang.js    Badang at your side (fighting), the night watch and wish cutscene, bubu traps, clearing the land
  scenes/UIBadang.js       the grab game, Badang's Talk rows, the Lempar Batu game, Journal row
  home.js           v1.8 data + night work: house stages, helpers (LC.Home dusk/dawn), bag sizes, Lv 21-30, Mak Thuy and Pak Tam, the tower path
  art7.js           v1.8 textures: the house wings and carved gables, helpers, pottery yard, fruit stall, dragon-fruit crop, icons
  scenes/WorldHome.js      the house as it grows, the helpers on the farm, the restored tower path
  scenes/UIHome.js         the house menu, the scrolling bag with Throw away, Mak Thuy's pots and tower quest
  barunai.js        v1.9 Chapter 2 data: the Barunai map, the 14 brothers and the princess, items, trails, story text
  art8.js           v1.9 textures: stilt houses, the Balai, the camp, hoofprints, feathers, the tembadau, the pinggai bird, the magic tempayan
  scenes/WorldBarunai.js   the letter, trails, the founding scene, the bird, the chest, the vase, Langkah Semaun (dash)
  scenes/UIBarunai.js      the brothers' Talk rows, the kenduri, the Journal Chapters page, the goal line, the dash button
  kampong.js        v2.0 Chapter 3 data: nibong and belian, the building stages, workshops, house pilings, the padian, Teluk Barunai, the craftspeople, Senuai, the King of Majapahit, story text
  art9.js           v2.0 textures: workshops, pilings, a third stilt house, padian boats, the roosters (and the ghost and the stone one), the Majapahit jong, the little perahu, icons
  scenes/WorldKampong.js   the village growing (reloads the place), the water taxi hop, padian boats, the cockfight scene, the stone rooster, the ghost of Asmara
  scenes/UIKampong.js      Berbai's building rows, the craftspeople's services, the padian and pilings menus, the training and cockfight games, Chapter 3 in the Journal and goal line
  cheats.js         test build only (dist/LittleCreature_full.html)
  scenes/UIGames.js      map, chest, reban, Pesta and its contest games, strength training, quests, the journal's You page
  art.js            procedural pixel-art texture generation
  audio.js          procedural music and sound effects
  state.js          game state model, save/load, day simulation
  scenes/Boot.js    generates textures, waits for the font
  scenes/Title.js   title screen (new game / continue)
  scenes/World.js   the current place (loaded per area), player, Pelita, crops, critters, day/night, travel, interactions
  scenes/WorldLife.js  villagers, folk spirits + companion, fishing, house building, boats, shrines, krathong, kites
  scenes/UIMenus.js    fishing minigame, villager / build / spirit menus, Journal, place banner
  scenes/UI.js      HUD (clock, kepeng, needs, hotbar), menus (shop, cook, craft, inventory), dialogue, toasts
  main.js           Phaser game config
  version.js        v1.7.1, generated by tools/build-web.mjs: LC.VERSION {code, name, built} and the GitHub URLs
  update.js         v1.7.1 update check (LC.Update): reads dist/version.json on GitHub, title button, reminder, Pause > Updates
```

### Scene architecture
- `Boot` → `Title` → `World` + `UI`. They run in parallel, and UI listens to World events.
- `LC.state` is the single source of truth (plain object, serialisable). World and UI read and write it, and an event bus (`game.events`) signals changes.

---

### Platforms (added in v1.0)
- **PC:** double-click `index.html`, or the single-file `dist/LittleCreature.html` built by `tools/build-web.mjs`. Everything is inlined in it.
- **Android:** `android/` holds a minimal Java WebView app. Gradle copies the web game into `assets/www`, and `WebViewAssetLoader` serves it from a virtual https origin so localStorage, fonts and audio behave like a browser, offline. The app is fullscreen, locked to landscape, draws into the display cutout (and reports it to the game), maps the Back button to the pause menu, and autosaves on pause. The output is `dist/LittleCreature.apk`.
- **Touch controls:** a floating joystick on the left half, USE/EAT/BAG buttons, a pause button, and tappable menu scrolling. They turn on automatically on touch devices and can be toggled in the pause menu.
- **Autosave:** the game saves on `visibilitychange`/`pagehide`, as well as at bedtime.
- **Hosted web (optional):** GitHub Pages with `manifest.webmanifest` and `sw.js` (network-first) for an installable, offline-capable web app.

### Co-op multiplayer (added in v1.1)
- **Transport:** PeerJS (WebRTC data channels). Matchmaking uses the free public PeerJS server; the room code is the host's peer id `littlecreature-XXXXX`. Game traffic is peer-to-peer, with PeerJS's public TURN relay as a fallback. The topology is a star: guests talk only to the host.
- **Authority:** the host owns the shared farm (fields, trees, clock, Pelita, offerings). Every shared change goes through `LC.Sim` (`src/sim.js`): single-player and the host call it directly, and guests send `op` requests that the host runs and broadcasts as `sync` slices. Personal state (bag, kepeng, energy, water) stays on each device. Costs are paid locally and refunded if the host rejects the op (for example, a friend got there first).
- **Streaming:** the host sends a 10 Hz `tick` (time, Pelita's position, expression and needs, every player's position). Guests send a `pos` update at about 10 Hz.
- **Day cycle:** the host sleeps for everyone (`sleepStart` → `dayStart` with the summary and a new snapshot). In co-op the clock does not pause for menus.
- **Saving:** the host saves the farm as usual. A guest's bag is saved separately (`littleCreature.coopBag`) and never touches their own single-player save.
- **UI:** a DOM lobby (`src/lobby.js`) with real inputs for names and codes; a co-op badge; name tags in each player's outfit colour; up to 4 outfits; pause-menu invite, close and leave options.

### Audio (chill mix)
Slow pads, sparse bells, a soft bass pulse and a distant gong through a generated convolution reverb, at 56 bpm by day and 46 bpm by night. A separate nature bus carries the river, koels and bulbuls by day, and crickets and frogs (*kodok*) at night. Music and nature sounds can be toggled independently.

### Beyond the farm (v1.3)
**Pelita's levels.** `LC.LEVELS` gives the bond needed for Lv 1–20. The evolutions keep their old bond thresholds, so they land on Lv 3, 6, 9 and 12. `LC.LEVEL_REWARDS` lists what each level opens or gives (places, spirit paths at Lv 7, a bigger gembor at Lv 10, max energy, kepeng and pearls). `State.addBond` queues `pendingLevel`. The host or single player shows each celebration (`World.levelUp`) and broadcasts `event{ev:'level'}`, so every player gets the personal gift. Old saves get their level from their bond on load, with no celebrations.

**Places.** Each place is a tile map plus objects in `areas.js`. Travelling restarts the World scene with `{ area, spawn, dir }` while the UI scene keeps running. Exits are walk-off zones at a map edge; a locked exit shows a gate (vines, rockfall, a sand drift) until `LC.areaOpen`. The island is reached by sampan. Wild places scatter trees with a seeded RNG, kept clear of paths, entrances, spirits and buildings.

| Place | Lv | Water (fish table) | Gather | Critters |
|---|---|---|---|---|
| Nenek's Farm | 1 | river | crops, fruit trees | chickens, kerbau |
| Kampung Tepian | 2 | river | fruit trees | chickens, kerbau |
| Hutan Rimba | 3 | forest pool (stream) | kayu, rotan, cendawan, herba, durian | kancil |
| Pulau Mutiara | 5 | sea | atap (nipa), kerang (+mutiara), kelapa | ketam, penyu |
| Gunung Kabus | 8 | lake | daun teh, strawberi, batu | — (mist) |
| Bukit Pasir | 11 | oasis | buah naga, tanah liat, duit lama | biawak |

**Gathering** reuses the fruit-tree system: every tree and forage spot has an id, and its regrow timer lives in `S.trees` (shared). `Sim.shake` handles both and rolls rare extras (pearls, coins).

**Fishing** is personal: a rod (*joran*), a UI-modal minigame (wait, strike in time, stop the marker in the green zone with 2 tries). Difficulty sets the zone width and marker speed. `LC.FISHING` weights the catch by water; night fish bite twice as often after dark. Each cast costs 2 energy and about 8 minutes.

**Villagers** (`folk.js`): Tok Penghulu, Pak Mat and Tukang Leong are there from the start; Cik Siti, Auntie Lai, Mbak Dewi and Kak Mai move in as houses are built. Each has a daily request from a pool (reward ≈ 1.6× value), a once-a-day chat, friendship points (4 per heart, gifts at 3/6/10 hearts), and optionally a shop and better prices for their trade. Friendship and requests are personal (`S.folk`). Delivering a request runs `Sim.kind` (+4 Pelita bond).

**Houses** (gotong-royong): four plots. `Sim.build` records `S.buildings[plot]` (shared). Materials are paid locally and refunded if the host refuses. `endDay` finishes each house and assigns the next villager in `LC.MOVE_IN`.

**Folk spirits**: Semangat Padi (farm), Orang Bunian (forest), Naga (island), Kenyalang (mountain), Nuno sa Punso (dunes; say *tabi-tabi po* first). Granting a wish runs `Sim.befriend` (shared `S.spirits`, +15 bond). Blessings: +2 padi per rice harvest (`Sim.harvest`); morning forest gifts (`State.personalMorning`); faster bites, a wider reeling zone and more rare fish (`State.rollFish`, `UI.openFishing`); +30 max energy (`State.recalc`); a 50% chance unwatered crops still grow (`endDay`). `Sim.play` works once a day per spirit (+3 bond). One befriended spirit can be your companion (`S.companion`, personal, streamed to friends as `cp`).

**Krathong**: crafted (pisang + marigold + colok) or bought from Dewi; floated on any water after 6 PM via `Sim.krathong` (+30 glow, +10 joy, +8 bond).

**Co-op with places** (protocol 2): `pos` and `tick` carry each player's area (`ar`) and companion (`cp`). Players only draw friends in the same place. The host streams Pelita's area (`g.a`): Pelita follows whoever cared for it last, even into another place, and is only drawn where it is. At night the host must be home to sleep; guests anywhere are carried to the farm for the summary. Every new shared action must go through `LC.Sim` and `LC.Sim.part`.

**Culture, drawn with respect:** gotong-royong and the kenduri, wau kites, batik and jamu, tea terraces, Mũi Né-style red dunes with dragon fruit and a Cham tower, rafflesia and tualang trees, Sang Kancil, sea turtles, and the five folk spirits, each with a short lore line in the game.

### Getting around, and the village beneath the waves (v1.4)
**Vehicles.** `basikal` (×1.75) and `kereta` (×2.4) are `vehicle` items sold by Abang Zul, the kampung mechanic. The car needs 3 ♥ with him (`shopNeeds`). `S.riding` is personal. Press R, or use the item, to toggle. `A.ride` lists the vehicles each place allows; on arrival anywhere else you dismount automatically, as you do when sleeping. Actions marked `tile`/`work` (farming, fishing, gathering) make you hop off first. `World.drawRider` draws a bicycle under the rider, or a car (in the player's outfit colour) instead of them, for you and for co-op friends (protocol 3 adds `rd` to `pos`/`tick`).

**Kampung Karang** (`laut`) needs Lv 5 and the Naga's friendship (`A.needs`, checked by `State.isOpen`). It is entered from the dive ring on Pulau Mutiara and left through the light column. Underwater: a permanent blue multiply tint, light rays, rising bubbles, a diving mask on the player, 0.8× swimming speed, a muffled music low-pass and a deep-water ambience. Sea folk: Tok Duyung (reef clean-up: rubbish hand-in at 8 kepeng a piece, gifts at 10/25/50 in `LC.CLEAN_GIFTS`), Nila (buys treasures ×1.3) and Pak Ketam (sea shop, buys sea produce ×1.3). Villagers now have an `area` (default kampung), and sea folk use their own sprites (`sprite: true`, drawn in art3.js). Forage: seaweed, sea cucumber, giant clam (20% pearl), rubbish, and the shipwreck chest (40% porcelain). A one-time turtle rescue runs `Sim.kind {n: 10}`. New dishes: kerabu rumpai and agar-agar (loved).

### Seasons, animals, the Pesta, the hidden village, the haunted mine and the deep (v1.5)
**Seasons.** `LC.seasonOf(day)`: four 7-day seasons (menanam, buah, kemarau, tengkujuh). Crops can have `seasons`; out of season they rest (no growth). Orchard trees have `season: 'buah'` and only bear then (`Sim.shake` returns `{off}`); in Musim Buah every fruit tree gives +1. Monsoon: `endDay` wets every tilled tile for the new day, and `WorldFarm.refreshSeason` shows rain (also each morning). Menanam: seeds -20% at the warung. Kemarau: wau prizes x2 and a warm tint.

**Animals (shared).** `S.animals` [{id, kind, name, born, fedDay, petDay, groomDay, love 0-20}], `S.coop` (eggs and milk waiting), `S.nest` (eggs hatching). Ops: `animal_add`, `animals_feed`, `animal_pet`, `animal_groom`, `coop_collect` / `coop_return`, `nest_add`. `endDay`: fed animals produce (love 10+ = 30% double), chicks grow after 3 days, nest eggs hatch after 3 nights (30% Serama if you own one), unfed animals lose love. Animals wander the farm as critters with `aid`.

**Chests (shared).** `S.chests` {id: {area, x, y, kind, items[]}}; ops `chest_place` (checked by `LC.chestSpotOk`), `chest_put`, `chest_take`, `chest_pick`. Peti Kayu 24 stacks, Peti Ukir 48.

**Pesta.** `State.isPesta()` (every Sabtu). Three one-button games in UIGames (wau tension, gasing power + aim, Serama care + three poses), three rounds vs rivals, once per contest per Pesta (`S.contest`), trophies in `S.trophies`.

**Strength and combat (personal).** `S.str` (10-100) from the batu angkat and silat (once a day each), dishes (twice a day), jamu kuat; `maxHp = 50 + str/2` (+20 from Poseidon). In places with `A.enemies` you swing the selected weapon with USE (damage = weapon + str/25, knockback, arc in front). Enemies run on each device only (not synced). At 0 HP you faint: half your gold ore, nuggets and crystals are lost and you wake at the farm. The stone guardian can be beaten once a day.

**Bunian.** The Bunian request (`LC.BUNIAN_QUEST`) gives the glasses (`S.wear.glasses`, G). Objects with `hidden: 'glasses'` only exist while worn; `A.wear` gates the hidden village. The keris needs `LC.STR_KERIS` (60).

**The deep.** Kapal Karam (Lv 5 + Naga): Si Tanggang's quest (`S.quests.tanggang`, selendang from Tok Duyung). Istana Laut Selatan (Lv 12): the Queen's gift (`LC.KIDUL_GIFT`, flag `kidul`: sea forage +1). Kota Atlantis (Lv 15): Poseidon's tribute (`LC.POSEIDON_TRIBUTE`: trident and +20 max HP). Co-op protocol is now 4.

### Battles everywhere, Si Tanggang's mother, save slots and volume (v1.6)
**Enemies in the wild.** `battle.js` adds groups to `A.enemies` in the forest (boars; shadows at night), the island (rock crabs; shadows at night), the mountain (a centipede; ghost bats at night), the dunes (scorpions), Kampung Karang (fire jellyfish; escort shadows) and the sunken junk (shadows). `LC.SAFE_AREAS` (farm, kampung, Bunian, the palaces) have none. Group flags: `night` (19:00-06:00; they fade in and out, checked every second) and `escort` (only while `S.escort`). AI states: drift, hunt, wind-up (0.32 s, boss 0.6 s, boar 0.55 s: the sprite shivers and flashes), strike (a lunge; damage only lands during it), rest (back off), and stone. `D.charge` (boar), `D.side` (crab), `D.floaty` (bob).

**Battle feedback.** The weapon icon sweeps a 140° arc (the keris is held point-up), plus a slash arc, a hit spark, a 50 ms hit-stop, a white flash, knockback, and floating damage numbers drawn by the UI scene from world coordinates (`UI.floatText`). Getting hurt: a red screen flash and a red number. The cangkul is an improvised weapon (1 damage) when an enemy is within 70 px.

**Battle music.** `Audio.setBattle(on, boss)` from `updateEnemies`: on while any enemy is within its sight (+10 px), off 4 s later. A separate `battleBus` (low-passed at 5.2 kHz) plays a 112 bpm kendang groove, gong, ostinato and pelog saron melody (64-step loop; a drone and a lower voice with the boss); the calm music ducks to 0 unless the battle volume is 0. Volumes: `Audio.vol` {music, battle, sfx, amb} in localStorage `littleCreature.vol`, set in Pause → Sound & music (`UI.openSound`, with a live preview on the battle row).

**Sumpahan Batu** (`LC.hasStone()`: `quests.tanggang >= 2` or 3 ♥ with him). V, or the stone slot beside the hotbar: enemies within 80 px turn to stone for 4 s (bosses 1.5 s), with a 15 s cooldown (`LC.stoneReadyAt`, global so travelling does not reset it). Stoned enemies freeze, turn grey and take double damage. With Restu Ibu: 120 px, 6 s, 10 s cooldown.

**Si Tanggang's mother.** `quests.tanggang`: 1 met, 2 at peace (shawl), 3 escorting (`S.escort`), 4 reunited. Mak Deruma (`deruma`) is a ghost villager on Pulau Mutiara (ghosts are present day and night). The escort follows you across places; the reunion triggers within 44 px of her: a scripted cutscene (movement locked by `World.reuniting`), then both switch to their `alive` definitions (`LC.villager(vid)` merges `v.alive` once `tanggang >= 4`: kampung posts, human sprites `npc_tanggangH`/`npc_derumaH`, new chat). Fainting or a new day ends an escort. **Restu Ibu** (`LC.hasRestu()`): once a day (`S.restuDay`) a lethal blow instead heals fully, gives 2.5 s of invulnerability and turns everything within 120 px to stone.

**Save slots and co-op.** `State.slot`, `slotInfo`, `slotText`, `saveTo(n)`, `load(n)`, `lastSlot()`. The lobby's host column has a slot picker. Co-op protocol 5 adds `reload{world, by}` (the host loaded a slot: guests apply the snapshot, save their bag and restart on the farm) and `saved{by}` (guests save their bag when the host saves). Guests' pause menu has "Save my bag" and no Load.

### Badang, the strongest man in the land (v1.7)
From the tale in the *Sejarah Melayu*. The player does **not** become Badang: he is a friend who gets the strength and helps you.

**Story** (`quests.badang`, personal): 1 met (asked), 2 keeping watch, 3 strong, 4 Lempar Batu champion. Skinny Badang stands by the forest pool (`LC.VILLAGERS.badang`, post 28,22, `sprite: true`). While he keeps watch (`LC.badangWatch()`) he stays out all night, and from 19:00 the **river hantu** sits at one of `LC.HANTU_SPOTS` around the pool (kept clear of trees via `A.clear`). It is a world entity, not an enemy: `objAt` type `hantu`, action "Grab the hantu!". The grab game (`UI.openGrab`): three hits in the green before two misses; a miss or giving up makes it dive and pop up at another spot. Sumpahan Batu also stones it (`hantuInRange`/`stoneHantu`), and a stoned hantu is caught at once. The wish cutscene (`World.cutscene` locks movement): choices (let Badang wish / ask for gold: the hantu refuses), the glowing lump, the gulp, a growth tween and texture swap to `npc_badangK`, the hantu dives, and Badang gives you 2 `bubu` (kept for you if your bag is full: `quests.bubuOwed`). `LC.villager` now takes `v.aliveIf(S)` (default: `tanggang >= 4`), so strong Badang lives in Kampung Tepian by the batu angkat.

**At your side** (`S.buddy`/`S.buddyDay`, personal, once a day): he follows you (no collisions; he catches up if left far behind), targets the nearest enemy within 110 px of you, walks to it at 120 px/s and punches (3 damage, double on stone, 260 knockback, shockwave, "BAM!"), with a 1.5 s cooldown (`LC.BADANG_FIGHT`). He stays ashore in underwater places. Fainting ends his day (and he carries you home). Simulated per device, like enemies.

**Ladang Badang** (shared `S.ladang`: 0 / 1 tonight / 2 done; in the snapshot). `Sim.ladang` (a feast of 3 nasi lemak + 300 kepeng, paid by whoever asked); `endDay` turns 1 into 2. The strip x 6-17, y 23-25 south of the fence holds six `tunggul` objects (stumps and boulders, `when: ladang !== 2`). `LC.syncLadang()` rewrites those tiles in the cached farm grid (`.` or `f`) whenever a World is built and each morning (`World.refreshLadang`), and `Sim`'s tile checks use that same grid, so tilling works for guests too. Decor never lands on the strip. Objects may now have `when(S)`; `World.objImgs` keeps their images by id.

**Houses at once.** `Sim.build` with `quick` (sent when `LC.hasBadang()`) finishes the house straight away (`State.moveIn`, shared with `endDay`).

**Bubu** (personal `S.bubus` [{area, x, y, day, kind}], max 3, in the co-op bag): set on any water tile on land (not underwater); each later morning a check gives 1-2 fish per night (up to 3 nights, max 4), never junk; or pick it up again.

**Lempar Batu.** `LC.CONTESTS.lempar` uses new optional contest hooks: `show`, `ready`, `play` (the game function), `champLine` and `onChamp`. Badang throws, you cheer: three timing taps (lift, spin, throw) give 28 + 11 × accuracy + 0.6 × hearts depa against the rival's flag (34-42, 42-50, 48-56; the last rival is Benderang). The first championship sets `quests.badang = 4` and shows **Batu Badang**, a 2×2 rock in the kampung river (`when: trophies.lempar > 0`).

**Fixes found while testing.** `warungImgs`/`portalImg` and the spirit companion's sprite are reset for each new place: before, a Pelita level-up at Lv 10+ away from the farm froze the game, and the companion vanished after travelling. Co-op protocol 6.

### Update check (v1.7.1)
A sideloaded APK cannot update itself, so the game tells players when a newer build is on GitHub. `tools/build-web.mjs` reads `versionCode`/`versionName` from `android/app/build.gradle`, takes the build time, and writes `src/version.js` (`LC.VERSION`, `LC.UPDATE_URLS`, the repo taken from the git remote) and `dist/version.json` ({code, name, built}). `LC.Update` (`src/update.js`) fetches `raw.githubusercontent.com/<repo>/main/dist/version.json` (CORS is open, a cache-busting query, 9 s timeout, once per session unless forced). If `code` is higher: the title screen shows a box with the new version and its date and time (click, tap or U), the UI gives one reminder toast, and Pause → Updates has a "Get" row. Download: on Android `location.href` to the APK (the WebView hands outside links to the browser via `shouldOverrideUrlLoading`, which downloads it; the player taps Install, and the same signing key keeps the save); on a computer the HTML's GitHub page in a new tab (the test build points at `LittleCreature_full.html`). Dates show in the device's time zone (`en-GB`, 12-hour). Offline or on an error, the game just plays; the row says it could not reach GitHub.

### Home, helpers, a bigger bag and the dunes' folk (v1.8)
Players piled up kepeng with nothing big to spend it on, and full bags were a chore. Everything here is a money sink with a payoff.

**Nenek's house** (shared `S.house` 0-3, `S.houseBuild` for a stage being built tonight; both in the snapshot). `Sim.house_up` (paid locally by whoever asked, refunded on failure; `quick` with Badang finishes at once). `LC.HOUSE_STAGES`: Serambi (2,000 k, room 1, pantry), Rumah Tengah (6,000 k, room 2, dapur cooks x5, +20 energy), Rumah Dapur (15,000 k incl. 2 tempayan, room 3, 48-stack pantry, +20 energy, carved gables). The new wing is an object (`h_wing`, type `house_wing`, x 7-8, `when: house >= 1`) with textures `wing_1..3`; the main house swaps to `house_ukir` at stage 3 (`World.refreshHouse`). The house object now opens `UI.openHouse` (Sleep, pantry, helpers, expand). The tiles beside the house are kept free of decor.

**Helpers** (shared `S.helpers`; `Sim.hire`/`Sim.fire`, host or solo only; rooms = house stage). The pantry is a fixed chest `S.chests.pantry` (`fixed: true`, area `home`: never drawn, never picked up), opened with the normal chest menu. `endDay` calls `LC.Home.dusk` before the crops grow (wages from the host's kepeng; unpaid helpers skip the night; the farmhand wets every tilled tile) and `LC.Home.dawn` after the trees regrow (a finished house stage; the farmhand harvests ripe crops into the pantry and replants from pantry seeds; the gatherer runs `Sim.shake` on every ready farm tree and forage spot and empties `S.coop`; the cook makes up to 5 dishes, best `sell` first, at most 2 of each, from pantry ingredients). Each writes a summary line; a long summary shrinks its font to fit. Helpers stand at fixed farm spots (06:00-21:00), and their spots count as villager posts so chests are not placed there.

**Bag and levels.** `LC.bagSize(lv)` = 18 + 9 per reached level in `LC.BAG_LEVELS` [5, 10, 15, 20, 25, 30]; `State.recalc` grows `S.inv` (never shrinks), and guests keep a bigger saved bag. `LC.LEVELS` runs to Lv 30 (`LC.MAX_LEVEL` 30); Lv 21-30 rewards in `home.js`; the legend glow stays at `LC.LEGEND_LEVEL` 20. The bag (`UI.openInventory`, rewritten in UIHome.js) shows the hotbar and 4 backpack rows at a time, with big scroll buttons, wheel and keys; **Throw away** (button, T or Delete) asks with "Keep it" first, then 1 or all; `LC.FIXED_ITEMS` can't be thrown away.

**Menus.** `UI.scrollBtn` draws big tappable up/down buttons beside `openMenu` lists (and the bag); each tap turns a page. They show only when the list is longer than the view. v1.8.1 made the cards roomier (a 780-wide panel, 5 cards of 84 px per page): a title shrinks (18, 16, 14 px) so it never meets the price on the right, and a description gets two lines at 13 px, three at 12 or 11 px, and is only shortened with "..." beyond that.

**Bukit Pasir.** Mak Thuy (Cham potter, post 31,7, pottery yard object) makes pots from clay (`LC.POTS`: periuk tanah, pelita tanah (an offering), tempayan) and has the tower quest (`LC.TOWER_QUEST`, `quests.menaraAsked`/`menara`): it restores the brick path (`LC.syncDesert` turns x 34-35, y 6-11 into stone path, live via `World.refreshDesertPath`). The Cham tower is treated as a place of memory and heritage, not of worship. Pak Tam (dragon-fruit farmer, post 15,13, stall object) sells `seed_buahnaga` (crop `buahnaga`, 6 days, 3 fruit, kemarau and menanam) and `jus_buah_naga` (also a dapur recipe), and buys fruit at x1.4. Co-op protocol 7.

### Chapter 2: Barunai (v1.9)
The user asked for Chapter 1 (everything before) to stay exactly as it was, with Barunai as a continuation chapter on the same save. Source: the Bruneian epic *Syair Awang Semaun* (I-Pai Samaring and the tembadau, the fourteen brothers, Awang Alak Betatar gathering them, "Baru nah!", Awang Semaun bringing the Johor princess whose pinggai bird and sinking ship are part of the tale, and the magic jar of Temburong folklore). Left out: the wars of conquest (they cast real peoples as enemies), the religious conversion, and present-day titles.

**Progress** (personal `quests.ch2`): 0 Chapter 1; 1 the letter (shown on the farm once Pelita is Lv `LEGEND_LEVEL` 20, also for old saves already past it); 2 met Alak Betatar; 3 brothers gathered (`quests.ch2found`); 4 tembadau befriended (`ch2t1` = hoofprint index); 5 founded; 6 Semaun sailed (`ch2day`: he is away that day; the princess arrives the next); 7 bird and chest done (`ch2t2`, `ch2bird`, `ch2ship`); 8 kenduri (5 dishes) and Langkah Semaun. `LC.ch2Goal()` feeds the goal line and the Journal's Chapters tab.

**Barunai** (`LC.AREAS.barunai`, Lv 20, reached by the perahu at the farm jetty, which appears via `when` once Lv 20 or later). Hills, the old track, sand, the river; the camp, a jetty, an old landing. `LC.syncBarunai` turns the `BARUNAI_WALKS` (the main walkway, four spurs and a landing) from water into jetty tiles once founded; houses and the Balai are `when: founded` objects. The founding scene (`World.foundBarunai`) brings you to the bank and gathers all 14 brother sprites, then `applyFounding` redraws the tiles live (and drops them from the water animation) and `World.refreshWhen` adds the objects. Trails, the tembadau, the bird, the chest bubbles and the magic tempayan are placed per step by `World.refreshBarunai`/`placeThing`.

**The brothers** are villagers with `chapter2: true`. `LC.villager` hides them (area `none`) until Chapter 2 begins (`hideIf`), so Chapter 1 is unchanged. Twelve wait in their mothers' places with a `find` request; once found, `aliveIf` moves them to their Barunai posts. Every spot was checked to be free and walkable. Hapu Awang sells ambuyat and kelupis; Pateh Berbai buys treasures.

**Langkah Semaun** (`LC.LANGKAH` 4 s, 56 px): Shift or the footprints button. A 4 px step-wise dash that stops at anything solid, with 0.45 s of invulnerability, golden afterimages and dust. The Restu Ibu chip moved above the stone slot to make room. Co-op protocol 8.

### Chapter 3: Kampong Ayer, part 1 (v2.0)
Continues on the same save after Chapter 2 (`quests.ch2` 8). Sources: the history of Kampong Ayer (nibong and belian pilings, craft villages such as the blacksmiths' and brassmiths', the *padian* women's floating market) and the Brunei Bay legend of Raden Angsuka Dewa of Majapahit and the cockfight between his Asmara and Awang Senuai's Mutiara (Asmara flees and becomes Pulau Pilong-Pilongan; Mutiara, cursed, becomes Lumut Lunting, which is said never to sink). The ghost of Asmara is our own addition. The fight is shown without blood (feints, wing-beats, a crow). The wars (part 2, v2.1) are not built yet.

**Progress** (personal `quests.ch3`, `LC.ch3Step()`): 0 talk to Pateh Berbai; 1-3 build stage n (`quests.kaStage`, `LC.KA_STAGES` costs: nibong, belian, atap, rotan, kepeng); 4 the fleet (talk to Alak Betatar); 5 training (`ch3train` 0-3, `ch3trainDay`); 6 the cockfight; 7 Teluk Barunai (`buluMutiara`, the ghost needs `pinggan_emas` + `bulu_mutiara`, after 19:00); 8 part 1 done (`asmara`: +15 max energy in `recalc`, a 25% extra egg in `endDay`). `LC.ch3Goal()` feeds the goal line (via the `LC.ch2Goal` wrapper) and the Journal. Other flags: `tempered` (+1 weapon damage in `WorldCombat.attack`), `gembor` (+10 max water), `perahu` (free water taxi), `kaPlots` {plot id: house texture}, `kaHomes` (the 1000-kepeng thank-you).

**Barunai grows** through `LC.syncBarunai` (wrapped): the `KA_WALKS` of each built stage become jetty tiles. Workshops, pilings (`kplot`), the jong (ch3 4-6) and the Teluk perahu (ch3 7+) are `when` objects. A new stage or the fleet reloads Barunai around the player (`World.applyKampong` → `goArea` to the same place), so the new villagers appear. The craftspeople and Senuai/the king use `hideIf` (generalised for non-chapter2 villagers in kampong.js). The padian boats appear at stage 2+ from 06:00 to 14:00, with 4 items a day picked from `LC.PADIAN_POOL` by a day-seeded generator. The water taxi (`World.hopTo`) fades and moves the player within the place (20 kepeng, free with your own perahu).

**Teluk Barunai** (`LC.AREAS.teluk`, 44x32): Pulau Pilong-Pilongan (sand, rock and a cliff), its jetty, and the Lumut Lunting sandbank, joined by two little `hop` boats. The ghost rooster (`LC.GHOST_SPOT`) is placed by `updateKampong` at night while ch3 is 7. Co-op protocol 9.

## 8. Milestones

1. **Skeleton.** Phaser boots, procedural textures, tilemap, player movement with collision, camera.
2. **Farming.** Till, plant, water, grow, harvest. Paddy. Trees. Well refill.
3. **Spirit.** Pelita follows, needs decay, feeding and petting, expressions, thought bubble.
4. **Economy.** Warung buy/sell, dapur cooking, offering crafting, spirit-house offerings.
5. **Day/night.** Clock, darkness and glow lights, sleeping, day summary, blessings and pranks, Hungry Ghost Night, saving.
6. **Polish.** Title screen, music and sound effects, critters, particles, tutorial dialogue from Nenek's letter, festival ending.
7. **QA.** Headless-browser smoke test (no console errors, screenshots of day and night).

---

## 9. Out of scope (future ideas)
- Interiors, and upgrading your own house and farm buildings.
- A night market (pasar malam), wayang kulit nights, sepak takraw with the villagers.
- Saving a co-op guest's villager friendships and fish log with their bag.
- Gamepad support, and a Play Store release (that would need an AAB build).
- Co-op extras: shared (synced) enemies, gifting items between players, a "everyone ready to sleep" vote, chat emotes, and a self-hosted PeerJS server for reliability.
