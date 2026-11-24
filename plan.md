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
| R | Ride / get off the bicycle |
| G | Put on / take off the Bunian glasses |
| F | Fullscreen |
| C | Call Nek Lampir (after Chapter 6); in a fight with her beside you, her green circle |
| B | Call Sang Bualang (after Chapter 7; he takes 10-20 s on the wind); in a fight with him beside you, a spin at once |
| U | Angin Bualang: blow back every enemy around you (after Chapter 7) |
| R | Also rides Naga Kecil (after Chapter 8): always under the sea; on land when holding the Seruling Naga (or with no bike) |
| L | Lagu Mayang: every enemy around you sways in a trance (after Chapter 9) |

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
  scenes/UISettings.js     sound & music volumes, the font switch (LC.setFont), save/load slot menus, ability slots, damage numbers, hurt flash
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
  kampong2.js       v2.1 Chapter 3 part 2 data: the fish skin, Bilanapura and the soldiers, the stone lamp, the Kampong Ayer (1521/1578) map, Jerambak, Tok Gergasi, Antonio, Pak Damit, story text
  art10.js          v2.1 textures: Bilanapura, the soldiers, the tall ship, the meriam, flames, the elephant, Pelita's stone lamp, three families, icons
  scenes/WorldKampong2.js  the jinn battle with the three heroes, the visions, Antonio's tour, the four waves of 1578
  scenes/UIKampong2.js     part 2 Talk rows (Semaun, Jerambak, the ogre's trade, Antonio, Pak Damit), the meriam game, the goal line from step 8
  majapahit.js      v2.2 Chapter 4 data: the soldiers and the admiral, the farm and kampung battle groups, the stockade and cannons, the trading jong, story text
  art11.js          v2.2 textures: Majapahit soldiers, Laksamana Kebo Taruna, the bamboo stockade, icons (Keris Majapahit, celengan, batik)
  scenes/WorldMajapahit.js the alarm, the four waves, the heroes fighting beside you, the fires on the farm, the king's arrival, a cutscene safety net
  bayang.js         v2.3 Chapter 5 data: the shadows and Si Kelam, Java and Pulau Kelam (maps and objects), Empu Lintang, Kebo Taruna, Juragan Wira, the guard lamps, the damar tree, story text, LC.ghostTex
  art12.js          v2.3 textures: the shadows, Si Kelam, Pelita Purnama (ghost_5_*), Juragan Wira, the guard lamps, the damar tree, the stone torches, the pendopo, the split gate, Javanese houses, market stalls, icons
  scenes/WorldBayang.js    the night the lamps go out, Pelita growing pale, the torches failing, wilted crops, the voyages, the king, the damar tree, the stone torches, Si Kelam's shield, the finale
  scenes/UIBayang.js       Chapter 5 Talk rows (the Penghulu, Leong, Tok Batin, Empu Lintang), the jong's voyage menu, the market of Majapahit, the goal line and Journal
  ledang.js         v2.4 Chapter 6 data: Gunung Ledang (map, the bridge sync), Hang Tuah, Hang Jebat, the princess, Nenek, Nek Lampir, the duels and the last fight, story text
  art13.js          v2.4 textures: Nenek asleep on the pangkin, areca palms, the waterfall, the princess's pavilion, the Bunga Ledang, the duellists, Mak Lampir again, icons
  scenes/WorldLedang.js    Nenek's homecoming and the curse, the voyage, the silat duels (three touches), the areca palms, the bridge rails, the last fight (curse circles, stolen light, Hang Tuah), waking Nenek
  scenes/UILedang.js       Chapter 6 Talk rows (Tuah, Jebat, the princess, the tears, Leong's bridge), the jong's new destination, the goal line and Journal
  neklampir.js      v2.4.1 Nek Lampir the helper: tuning (LC.NEK), unlock checks, real-clock cooldowns (LC.nekLeft), teleport places and prices, her lines
  art14.js          v2.4.1 textures: her button (ic_nek), the green circle icon (ic_bulatan), the pepper pouch
  scenes/WorldNek.js       calling her and her refusals, following and blinking, Serbuk Lada, Bulatan Hijau (playerHurt hook), the rescue, the paid teleport, the peace scene
  scenes/UINek.js          her button beside the hotbar (C), the "what do you want?" dialogue, the teleport menu, her Talk rows and Journal line
  santubong.js      v2.5 Chapter 7: items, Kampung Santubong and Pulau Satang, Mak Dayang, the two princesses, Putera Serapi, Sang Bualang, the storm creatures, LC.C7 tuning, the story (LC.CH7TEXT)
  bualang.js        v2.5 Sang Bualang the helper and Angin Bualang (LC.BUALANG, real-clock cooldowns), Pelita's daylight, Nek Lampir's refusal
  art15.js          v2.5 textures: the two mountains, the meeting stone, loom, lesung, houses, dye plants, the crag, Bualang (villager, boss), storm creatures, whirlwind, Raja Kayangan, icons
  scenes/WorldSantubong.js the mist, the princesses at night, dyes, weaving and pounding, the storm, the sampan, the boss, the finale
  scenes/WorldBualang.js   calling Bualang (the wind takes time), his spin, Angin Bualang, catching up after travel, Pelita's daylight
  scenes/UISantubong.js    goal line, Journal page, the jong to Santubong, Talk rows, the rice-pounding game
  scenes/UIBualang.js      the wau and gust buttons (B, U), the edge arrow, Journal rows, the daylight switch
  gelora.js         v2.6 Chapter 8: items, the Selat Gelora, the jars, both armies, the two dragons and the two rulers as foes, the Naga Mother and Ketos, the river silt, LC.C8 tuning, the story (LC.CH8TEXT)
  art16.js          v2.6 textures: soldiers, ink, the dragons (furious, calm, faces), the rulers in the duel, Naga Kecil to ride, the strait, the jars, Nek's pot, spears, wave, whirlpool, jet, flood water, icons
  scenes/WorldGelora.js the flood, the dark water, the battlefield, the dragons, the rulers' duel, the truth, the peace under the arch, the clean-up
  scenes/WorldNaga.js   riding Naga Kecil and its water jet; livelier fights everywhere
  scenes/UIGelora.js    goal line, Journal page, Talk rows (Tok Duyung, the rulers, Nek Lampir and her cure, the Naga Mother, Nenek)
  mayang.js         v2.7 Chapter 9: items, Kampung Pantai Kabus, Pantai Bakau, Gua Puteri Tujuh, the villagers and Puteri Bongsu, LC.C9 tuning, the story (LC.CH9TEXT)
  art17.js          v2.7 textures: Terengganu houses, the hut, boats, the sleepers, the mangrove, the palm, the well, the swing, lamps, clams, mirrors, the seven princesses, faces, the jump-scare face, the vignette, icons
  lagu.js           v2.7 sound: LC.Singer (the singing voices), LC.SING, the horror drone, new sound effects
  belalang.js       v3.0 Chapter 10 data: Negeri Tanjung Bunga and Hutan Merbau, Belalang, Pak Belalang, Sultan Muzaffar, the Kerengga gang, the Sumpit, LC.C10, the story (LC.CH10TEXT)
  art20.js          v3.0 textures: the palace, the hut and tempayan, the foreign ship and sampan, grasshoppers, footprints, the camp, the chest, the gang, Belalang, the Sumpit and its dart
  scenes/WorldBelalang.js  Pelita away (needs frozen), the grasshopper trail, hide-and-seek, the bucket chore, Belalang following you, the glowing footprints, the gang, the sampan, the finale, the Sumpit's darts
  scenes/UIBelalang.js     Chapter 10 Talk rows, the jong's new destination, the goal line and Journal, the riddle contest, Belalang in the Companions tab
  scenes/WorldMayang.js the dark, finding the song, the chase, the ritual, the cave of clams, the dawn; Lagu Mayang (L) and the trance
  scenes/UIMayang.js    goal line, Journal page, Talk rows, the jong to Pantai Kabus, the Ulek Mayang minigame, jump scares, the vignette and song light, the Lagu Mayang button
  scenes/UIGuide.js     v2.7.1 the guide arrow (LC.GUIDES; Chapter 2's targets) and its pause-menu switch
  scenes/UIChecklist.js v2.7.2 the story checklist (every chapter: steps, the parts of the current step, what opens the next chapter); v2.8.2 LC.chapterProgress (percent), Pause > Chapter N: X%, openChapter
  masjid.js         v2.7.4 the masjid of Kampung Tepian: the five prayer times, the masjid object and its path, the texts
  art18.js          v2.7.4 the masjid and its map icon
  scenes/WorldMasjid.js v2.7.4 the beduk and prayer reminders, praying with the jemaah, the lighter day after all five
  scenes/UIMasjid.js v2.7.4 the masjid on the maps, Journal > You, Pause > Prayer times
  lombong2.js       v2.9 the lower workings of Lombong Puaka (a build wrapper), the hidden door, Bilik Rahsia (LC.AREAS.rahsia), the Puaka Emas, LC.PUAKA tuning, its loot, the new treasures, the texts
  art19.js          v2.9 textures: the hidden door, the Puaka Emas, the vault's chest, pillars, gold heaps, falling ore, the old pickaxe, the crown and ruby icons
  scenes/WorldLombong.js v2.9 the draught hint, the door (and its glow), the boss's falling ore, its call and its wild phase, its health bar, the chest
  scenes/UICompanions.js v2.8 Pause > My stats and Companions (openStats, statRows, companionRows), the travelling bonuses (compSpeed, companionBonus, companionTill), stopEscort
  field.js          v2.7.5 Nenek's field grows with Pelita's level (96 to 135 tiles), Badang's land as wide as it
  khemah.js         v2.7.5 the khemah (tent): the item, Mak Ani stocks it from Lv 6, the texts
  posts.js          v2.7.6 villagers moved where you can see them; older chests and tents moved off their new spots
  bagsort.js        v2.7.9 Pelita sorts the bag: LC.BAG_SORTS (the kinds, their pictures and levels), LC.bagSortOf, the level texts
  scenes/WorldField.js v2.7.5 the field redrawn on the morning it grows, Journal > You
  scenes/WorldKhemah.js v2.7.5 pitching, sleeping in and packing up the khemah, Journal > You
  worldview.js      v2.7.2 co-op shared looks: everyone's building progress (prog messages), LC.worldQuests / LC.worldS
  scenes/WorldShared.js v2.7.2 sends your progress, redraws a place live when a friend's arrives, friends' house plots
  scenes/UIMajapahit.js    Chapter 4 Talk rows (Pak Mat, the Penghulu, Leong, Kemala, Semaun, Badang), the trading jong's shop, the goal line and Journal
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
- **Hosted web:** GitHub Pages with `manifest.webmanifest` and `sw.js` for an installable, offline-capable web app. From v2.4.2 this is how iPhones play it (see "iPhone" below).

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
**Vehicles.** `basikal` (×1.75) is a `vehicle` item sold by Abang Zul, the kampung mechanic. (v2.7.4: the user asked to remove the car: `kereta`, its textures and its code are gone; `State.load` takes any kereta out of the bag and every chest and pays 1,200 kepeng each, `flags.carBack` shows the note.) `S.riding` is personal. Press R, or use the item, to toggle. `A.ride` lists the vehicles each place allows; on arrival anywhere else you dismount automatically, as you do when sleeping. Actions marked `tile`/`work` (farming, fishing, gathering) make you hop off first. `World.drawRider` draws a bicycle under the rider, for you and for co-op friends (protocol 3 adds `rd` to `pos`/`tick`).

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

**v2.7.1 (the user: "add a house to sleep", "sometimes the game feels stuck, please guide the player"):** the guest house `b_tamu` (type `tamu2`) calls `UI.confirmSleep(stay)` → `World.sleep(false, stay)`, which restarts into the same place with `spawn` and the day summary (fainting still carries you home). `UIGuide.js`: `LC.GUIDES` providers return `{ x, y, label }` in the current place; `drawGuide` (from `drawSkills`) bounces an arrow over it, or points from the screen edge (kept below the HUD); Pause > Guide arrow (`flags.noGuide`). Chapter 2 has a provider; other chapters can add one. `UI.goalText` now puts an open chapter before the kampung's optional tasks (fishing, the hen, the first house), which used to hide the chapter goal forever if skipped. `LC.CH2.findHow` says where each brother's item comes from.

**v2.9 (the user: "update the lombong puaka, make the map twice bigger. Include the invisible door which can see using the bunian glass. The door leads to secret boss, if they are defeated, reward the players with gold and rare items"):** `lombong2.js` wraps `LC.AREAS.lombong.build`: the old 44 x 34 grid is copied unchanged (so every old object keeps its place) into a 44 x 68 one, and rows 32-66 are carved below: the lift shaft (x 21-22, y 32-37) from the guardian's hall, Simpang Tiga (the crossroads, y 38-42), the west and east galleries with rails, Gua Kristal (west), Kolam Hitam (east, with a pool), the miners' camp (centre, safe: no enemy zone), two ways down, Lubang Emas and Sarang Kala, the deep gallery (y 64-65), and Hujung Lombong (x 18-25, y 57-61, `A.endRoom`). 12 more gold seams (`g_vein13-24`), 4 crystals, a second strongbox (`g_chest2`; old saves get them ready via the `trees` fill-in on load), 9 torches, a sign, the camp's tent and cart, and six new enemy groups (kelawar, bayang, lipan, kala); decor 104. The hidden door `l_pintu` (type `pintu_rahsia`, x 21-22, y 57, `hidden: 'glasses'`) stands against the end chamber's north wall; `WorldLombong` wraps `refreshHidden` to give it a light. Walking into the end chamber without the glasses: a toast about a cold draught (once per visit; names Pelita if it is following). The old pickaxe and lamp `l_nota` tells the story (1931, the Bunian sealed the hall). `LC.AREAS.rahsia` (Bilik Rahsia, 32 x 24, `cave`, not in `AREA_ORDER`, so it is on no map or travel list): a paved hall, four pillars, six gold heaps (type `timbun`, lit), four torches; walking off the bottom (y 23) returns you in front of the door. `LC.ENEMIES.puaka_emas` (hp 110, speed 20, dmg 13, sight 300, w 13, boss, floaty). `LC.PUAKA`: ore falls every 4.2 s (2.8 s when wild), 3 (4) at once: one where you stand, the rest within 56 px, each shown as a shadow for 0.95 s before it lands (9 damage within 14 px); at 70% and 40% health it calls 3 bayang (groups with `summon: true`, on only while it stands; they do not respawn); below 35% its own `e.def` copy is 1.45x faster and +2 damage. Turned to stone, it does nothing. Its health bar is drawn over its head. `groupOn`: it is away once `quests.puaka.day === S.day` (once a day). `puakaDown`: `quests.puaka` {day, won, chest} (personal); `LC.puakaLoot(first)` is added to whatever is still in the chest; the chest (`peti_harta`, 2 tiles at `A.chest`) appears with a glow, never on top of you. `openHarta` pays kepeng (counted in `stats.earned`) and as much of each item as `LC.State.room` allows; the rest stays in the chest (shown again on the next visit). New treasures `mahkota_emas` (2500) and `delima` (450); Dang Melur and Berbai buy them; Dang Melur has a hint line. Journal's Battles row counts the wins. Tested on PC and phone sizes: the mine is 44 x 68 and every carved tile is reachable from the entrance with every object on open floor (flood fill), the vault likewise; the hint shows without glasses, the door appears and is usable with them; intro lines; 3 shadows at 70%; warning shadows and a hit; wild below 35% (speed 29, base def unchanged); the first chest pays exactly the first-win loot; calm for the rest of the day; the next day a second win; a full bag keeps the rest in the chest; walking out returns you at the door; no errors.

**v2.8.3 (the user: "what are the benefit of 5 daily prayer? example subuh prayer give you rezqi"; they chose the proposed set):** `masjid.js`: each `LC.SOLAT` entry has `gift` (name), `does`, `short` and `feel` (a quiet line as you come out); `LC.MASJID.rezeki 0.15 / sihatEvery 2 / lindung 0.5 / isyakGrow 0.3`. `WorldMasjid.solatBerjemaah` sets, in `quests.solat`: Subuh `rezeki = day` + `seen = stats.earned`; Zohor energy to max; Asar `sihat = day`; Maghrib `lindung = day`; Isyak `isyak = day`; then a second toast with the blessing. `solatBless()` (in `solatTick`, once a second, when nothing is open): Asar +1 health every 2 s until midnight (the day ends at midnight); Subuh pays 15% of the rise in `S.stats.earned` (every sale and reward adds to it; it is reset each morning) as kepeng, with a toast. A `playerHurt` wrapper halves damage (at least 1) while `lindung === day` (until you wake). `state.js endDay`: a crop that grew tonight grows one more day with chance `isyakGrow` when `isyak === day` ("After Isyak, N crops grew an extra day overnight."). `UIMasjid`: Journal > You row "Prayer blessings: <active>" (`LC.solatBlessings()`), the Pause > Prayer times text, and the masjid between prayers names the next prayer's blessing. Tested on PC and phone sizes: +15 on 100 earned, Zohor full energy, Asar +3 health in 6.5 s, Maghrib 10 → 5 damage, Isyak +1 day on all 6 test crops (chance set to 1), Maghrib ends at morning; no overlaps, no errors.

**v2.8.2 (the user: "show percentage of completion of chapter on the menu. So the player knows what to do and how they can proceed to the next chapter"):** `UIChecklist.js`: `LC.chapterProgress()` = { n, name, pct, done, total, L (the checklist) }. Every step of a chapter counts the same; the step you are on adds the share of its PARTS already ✓ (so a step with no parts adds nothing until it is done); capped at 99% until the chapter is complete. Chapter 1 = Pelita's bond / LEVELS[LEGEND_LEVEL-1]. Pause grid: a tile after Resume, `UI.chapterTile()` "Chapter N: X%" ("Story: Complete" at the end; hidden for co-op guests), icon `ic_chap` (a flag, art17.js) → `UI.openChapter()`: openMenu "Chapter Progress", tabs *To do now* (`checklistRows`, whose first row now has the percent and a bar; last row "How to reach Chapter N+1") and *All chapters* (`chapterListRows`: done 100%, now X% with the step and how the next opens, later ones "???" Locked). `openMenu` rows take `bar` (0..1): a 120 px bar under the right-hand text (green when full). Journal > Chapters shows the same checklist rows. Tested on PC and phone sizes: Ch1 0% / 16% at Lv 10, Ch2 27%, Ch5 60%, Ch9 57%, all complete; no overlaps, no errors.

**v2.8.1 (the user: "on nenek dapur, by default the food receipt should be what spirit food request food should be shown on the top"):** `UI.openCook`: the Recipes tab is first (it was Craft), and both tabs are sorted (stable) by `rank`: 0 Pelita's craving today (stage 1+, not yet met), 1 a dish a met, not-yet-befriended folk spirit wishes for (Orang Bunian: kuih pandan, Nuno: nasi; on the Craft tab the Nuno's colok), 2 Pelita's favourites (LC.LOVES), 3 the rest. Those rows start with ✦ and say who wants it before the ingredients. A raw craving (pisang, mangga, kelapa) gets a note row at the top instead ("No cooking needed"). Nothing else used the tab order.

**v2.8 (the user: "i cant see any option button so that orang bunian stop following me. Fix the issues and the rest. Every time the player have companion there should be beneficial. There should be option to see player stats"):** the cause: a spirit travelling with you is not at its home spot, so its Visit menu (with "Ask it to go home") could only be reached from Pelita's spirit house; Badang's "Send him home" was in his own menu while he was away following you. `UICompanions.js`: `UI.openStats(tab)` = openMenu "You" with tabs My stats / Companions (`openMenu` takes `cfg.tab` now). Companions lists Pelita (info), then who is with you with Send home (spirit → `setCompanion`, Badang → `sendBuddyHome`, Nek Lampir → `nekLeave`, Sang Bualang → `bualLeave`, Si Tanggang → new `stopEscort`: he goes back to the junk, quest stays at 3 so "Guide him again" works), then Bring rows for the other spirit friends, a count of spirits still to befriend, and Badang / Call Nek / Call Bualang rows. Pause grid: "My stats" (ic_stats) and "Companions: N with you" (ic_comp), both new 12 px icons in art17.js. Travelling bonuses (`LC.SPIRITS[sid].perk` in folk.js, numbers in `LC.COMP`): Semangat Padi +1 per harvest, Orang Bunian +1 per forage plant (not boulders, clay, ore, crystal or glints) and fruit tree, Naga Kecil 1/3 chance of a second fish (counted in the fish log), Kenyalang +15% walking speed, Nuno sa Punso 20% chance of 5-15 kepeng per tilled tile; Si Tanggang +10% walking speed (riding is not changed). Hooks: World.harvest / shakeTree / forage / till, WorldLife.endFishing, and the movement `mult`. Joining toasts now say the bonus and "Pause menu > Companions to send it home". My stats: health, energy, strength, attack (best weapon in the bag + str/25 + tempered, as in WorldCombat), walking speed, kepeng and total earned, Pelita level and bond, bag and the kinds Pelita sorts, gembor, abilities, spirit friends and blessings, records. Tested on PC and phone sizes: every send-home and bonus works, no overlaps, no errors.

**v2.7.9 (the user: "inside the player bag, as the level progress the spirit able to sort the bag items according to its category. Works like filter feature."):** `bagsort.js`: `LC.BAG_SORTS` = Tools (tool, weapon, gear, vehicle, wear, trap, tent, chest, fixture, quest), Seeds (seed, fert, feed), Harvest (crop, flower, fruit, produce, forage, meat), Meals (dish, drink) at Lv 4; Fish, Offerings (offering, float) at Lv 8; Materials (material, craft, goods, junk, and any kind not listed), Treasure at Lv 11. Their level texts are appended to `LEVEL_REWARDS` (the level-up message and Journal > Levels). The bag (`UIHome.openInventory`) keeps a `view`: the 9 hotbar slots, then the backpack slots (all, or only the chosen kind, packed); `slotOf`, the arrows (`move`), the scroll and the wheel all work through it, and `cur` / `picked` stay real slot numbers, so pick-and-swap works across kinds (onto the hotbar too). A row of 44 x 36 buttons (All + 8 pictures) sits right of the "Backpack" label, between the hotbar (now y+70) and the backpack (now y+178); kinds not learned yet are dimmed and say their level when tapped; hovering shows the name in the label. F / R step through the learned kinds. The choice is kept in `UI.bagFilter` while the game runs; opening the bag with a kind chosen starts on its first thing. Hotbar things of other kinds are dimmed. Before Lv 4 the row says "Pelita learns to sort your bag at Lv 4." Tested at Lv 1, 4, 11 and 30 (72 slots, 40 treasures scrolling) on PC and phone sizes: no overlaps, no errors.

**v2.7.8 (the user: "in the menu setting, include option to change font. Either choose the default font or modern font"):** `LC.FONTS = { pixel, modern }` in data.js; modern is the system stack (system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial), so nothing is downloaded and it works offline. `LC.fontKey` comes from localStorage `littleCreature.font` (per device, like touch and volumes) and sets `LC.FONT` before any text is made. Pause grid tile "Font: Default / Modern" (icon `ic_font`, "Aa", in art17.js) calls `LC.setFont(k)` (UISettings.js): saves it, toggles the `font-modern` class on <html> (the lobby and the rotate-your-phone notice follow it in CSS), and walks every running scene's display list (into containers) calling `setFontFamily` on each Text in the old font, so the HUD, open menus and dialogs change at once. Every text is made with `LC.FONT` at the time (UI.txt, Title), so nothing caches the old one. Tested on PC and phone sizes: all 118 texts switch both ways, no overlaps in the pause menu, dialogs with buttons, shop, bag or journal, and the choice survives a restart.

**v2.7.7 (the user: "sometimes the text conversation is overlapping with another text. fix it. i prefer you put button on the conversation on the making decision, example when talking to badang. do the changes for the restoo. the 'x' button on the menu its hard to press too"):** `UI.say` rebuilt: the box (x 60, w 840, bottom 590) is as tall as its longest line needs (name, the wrapped words, and the buttons after the last line), measured up front so it never jumps, and drawn solid (it was 93% opaque, so world labels and toasts showed through). Choices were bare texts 200 px apart (long ones ran into each other; a 3-line speech ran into them); now `layChoices` makes 48 px buttons as wide as their words, wrapping to new rows, gold when chosen; mouse/tap, A/D/W/S, E, number keys 1-9, Esc = the last choice. The dialog modal keeps `c` and `top`, and toasts stack above the box while it is open. `UI.closeX(c, right, top, fn)`: a 48 px X (68 px to tap) in the top-right corner of `openMenu` (coins moved left), `openGrid`, both bags, the map and Sound & music; it sends Escape to that modal. Save / Load: "press again to confirm" became a dialog (Save over it / Load it / Cancel, which reopens the list). Mini-games still close with the small X at the top.

**v2.7.6 (the user: "mak dewi and kak mai seems covered or block by the house, which visible hard to see. fix it. check the rest of the character as well"):** a pixel check (each villager post, every helper spot and every spirit, in all 24 areas, with everything unlocked) counted how much of each character is covered by an opaque pixel of something drawn above it. Fixed: `LC.PLOT_POSTS` plotC/plotD y 13 → 17 (Dewi and Mai stood behind their roofs; the houses face south), Abang Zul (40,13) → (40,16) in front of the kedai, Pak Mat (26,24) → (27,24) clear of the torch at (26,25), Barunai brothers Pahit (19,7) → (20,7) and Sindayong (26,7) → (25,7) clear of the torches at (19,8) and (26,8). `scatterTrees` keeps 3 rows below each villager post, plot post and spirit clear (a jtree is 60 px tall and hid Pateh Mambang in the kampung and Pateh Tuba in the forest), and skips chest tiles. `posts.js`: a `load` wrapper (`State.clearPosts`) moves a chest on a villager spot to the nearest `chestSpotOk` tile and packs a khemah standing on one. Also fixed: v2.7.5 named the tent texture `khemah`, which replaced the brothers' camp (`art8.js`, 48 x 32) in Barunai; the tent is `khemah_tent` now. Mak Ani behind her warung counter is covered on purpose. Co-op protocol 25 (trees are solid, so their places must match).

**v2.7.5 (the user: "main fiele should start at 96, as the level progress, the field is getting bigger max 135 tiles"; then "in the shop, as the player level up. allow them to buy tent, so they can setup anywhere and sleep. and put it back inside their backpack. in the shop include quantity, so the player can adjust how many item he can buy"):** `field.js` (after state.js): `LC.FIELD_STAGES` (Lv 1 x 6-17 y 14-21 = 96; Lv 4 x 5 = 104; Lv 7 x 18 = 112; Lv 10 x 4 = 120; Lv 13 y 13 = 135), `S.fieldStage` (shared world state: in `snapshot`/`applySnapshot`; set in an `endDay` wrapper so a strip is ready the morning after the level, with a summary line), `LC.syncField` rewrites the fence ring, the gate (x 11-12) and the field in `LC.FIELD_MAX` (x 3-19, y 12-22) and sets `LC.LADANG.x0/x1` to the field's width (`syncLadang` calls it first and clears rows 23-25 of the max width); a `load` wrapper gives older saves the stage of their level, but never smaller than any tilled tile; `LC.inFieldArea` keeps grass tufts and chests off where the field and Ladang can grow; the level texts say when it grows. `WorldField.js`: `refreshField` (dawn, through `refreshLadang`) and the Journal > You row. `buildMap` draws the 96-tile field again. Shops: `openMenu` rows with `qty: { id, price, buy? }` open a "how many?" picker (−/+, ±10, Max, Buy, Back; keys A/D, W/S, E, Esc; wheel) and buy them all; `State.room(id)`; used by the warung, the villagers (not vehicles or one-each items), the padian, the jong and the Majapahit market. `khemah.js`: `LC.ITEMS.khemah` (kind `tent`, 450 k, `one`), `LC.SHOP_LEVEL` { khemah: 6 } (Mak Ani shows it greyed out with its level until then), `State.owns`. `WorldKhemah.js`: pitch with `toolAction15` (two tiles + an open doorway tile, `chestSpotOk`, never over the player; not as a co-op guest, in caves or under the sea), `S.tent = { area, x, y, day }` (personal), drawn by a `refreshChests` wrapper (`refreshTent`; packed back into the bag if something new stands there), `tentAction` (Sleep: `sleep(false, stay)` wakes you at the doorway, on the farm too; Pack it up). Art in `art18.js` (`khemah_tent` 32 x 28 since v2.7.6, `i_khemah`). Co-op protocol 24.

**v2.7.4 (the user: "on the map include mosque, if he went to mosque there should be reward. Muslim prays 5 times a day. remove car from the game, increase the space of the farming"):** `masjid.js`: `LC.SOLAT` (Subuh 6:00-7:15, Zohor 13:00-16:30, Asar 16:30-19:15, Maghrib 19:15-20:30, Isyak 20:30-24:00: a Malaysian day that fits the game's 6 AM start), `LC.solatNow/solatNext/solatQ` (`quests.solat`: today's `done`, `total`, `full`, `berkat`, personal), the masjid object `k_masjid` (type `masjid`, kampung x 2-7, y 21-23; a path down x = 1 and a stone courtyard on row 24 via a `build` wrapper; `clear` keeps trees off it; the banana tree moved). `art18.js`: the masjid (tiered Malay roof, menara, beduk) and `ic_masjid`. `WorldMasjid.js`: the beduk sfx, `solatTick` (a reminder once per prayer, once Kampung Tepian is open, not in Chapter 9's fog; `flags.noSolat`), `masjidAction`, `solatBerjemaah` (reward first: 40% energy, full health; Jumaat Zohor = Solat Jumaat + nasi lemak; time +15 / +40 min playing alone; camera fade + a few quiet lines; Pelita waits on the steps), and the `useEnergy` wrapper (the day after all five, every 4th energy point is free). `UIMasjid.js`: Journal > You row, the masjid on both maps, `LC.pauseExtraRow4` (Prayer times). Kept respectful: no prayer movements animated, no Arabic text, no synthesised azan. Farm: the fenced field is x 4-18, y 13-21 (135 tiles; the gate torches stand on the fence); `LC.LADANG` is x 4-18, y 22-25 and `syncLadang` turns the old south fence into field and runs the side fences down once Badang clears it (195 tiles in all); bananas, two Ch5 lamps and Pak Hamid's spot moved off it. Co-op protocol 23.

**v2.7.3 (the user: "instead of menu by row, make it grid"):** `UI.openGrid(cfg)` (in UI.js after openMenu): tiles 4 to a row (up to 5 rows; fewer tiles are taller and centred; more than 20 page with the side buttons), a picture, the name, and for a "Name: Value" label the value under it (On green, Off grey); a `right` badge (Update: Get); the chosen tile's label and description in a box under the grid; WASD / arrows move in 2D, E selects, wheel steps; modal `{ type: menu, grid: true, render, sel(k) }`. `openPause` uses it; its tiles get their own icons by name (`gridIcon`; new 12x12 icons in art17.js: ic_play, ic_book, ic_save, ic_load, ic_sound, ic_note, ic_phone, ic_fullscr, ic_update, ic_list, ic_pad, ic_door, ic_scare). The other menus are still lists.

**v2.7.2 (the user: a checklist "so the player knows what to do to proceed next chapter"; and in co-op, parts of Kampong Ayer in Barunai were visible to a friend but not to them):** `UIChecklist.js`: `LC.CHAPTER_LIST` (each chapter's key, end step, step titles, and what opens the next), `PARTS[n](step, quests)` (the parts of the current step, ✓ / ·, have / need), `LC.checklist()`; shown at the top of Journal > Chapters (`checklistRows`) and as a few lines under the goal (`drawChecklist`); Pause > Story helper (`flags.noGuide`) hides these lines and the guide arrow. Co-op: `worldview.js` sends each player's `LC.WORLD_KEYS` (ch2, kaStage, kaPlots, c6bridge, menara: they only grow) as `prog` messages; `LC.worldQuests()` / `LC.worldS()` merge them (larger numbers, joined objects); objects with `shared: true`, the walkway/bridge/path syncs, `refreshKPlots` and the craftspeople's `hideIf` use it; `WorldShared.js` sends progress every 2 s and redraws the place live when a friend's arrives; a plot only a friend opened can be looked at, not built. Story objects and quests stay personal (a transient story object such as the Majapahit flagship must never be `shared`). Co-op protocol 22.

### Chapter 3: Kampong Ayer, part 1 (v2.0)
Continues on the same save after Chapter 2 (`quests.ch2` 8). Sources: the history of Kampong Ayer (nibong and belian pilings, craft villages such as the blacksmiths' and brassmiths', the *padian* women's floating market) and the Brunei Bay legend of Raden Angsuka Dewa of Majapahit and the cockfight between his Asmara and Awang Senuai's Mutiara (Asmara flees and becomes Pulau Pilong-Pilongan; Mutiara, cursed, becomes Lumut Lunting, which is said never to sink). The ghost of Asmara is our own addition. The fight is shown without blood (feints, wing-beats, a crow). The wars (part 2, v2.1) are not built yet.

**Progress** (personal `quests.ch3`, `LC.ch3Step()`): 0 talk to Pateh Berbai; 1-3 build stage n (`quests.kaStage`, `LC.KA_STAGES` costs: nibong, belian, atap, rotan, kepeng); 4 the fleet (talk to Alak Betatar); 5 training (`ch3train` 0-3, `ch3trainDay`); 6 the cockfight; 7 Teluk Barunai (`buluMutiara`, the ghost needs `pinggan_emas` + `bulu_mutiara`, after 19:00); 8 part 1 done (`asmara`: +15 max energy in `recalc`, a 25% extra egg in `endDay`). `LC.ch3Goal()` feeds the goal line (via the `LC.ch2Goal` wrapper) and the Journal. Other flags: `tempered` (+1 weapon damage in `WorldCombat.attack`), `gembor` (+10 max water), `perahu` (free water taxi), `kaPlots` {plot id: house texture}, `kaHomes` (the 1000-kepeng thank-you).

**Barunai grows** through `LC.syncBarunai` (wrapped): the `KA_WALKS` of each built stage become jetty tiles. Workshops, pilings (`kplot`), the jong (ch3 4-6) and the Teluk perahu (ch3 7+) are `when` objects. A new stage or the fleet reloads Barunai around the player (`World.applyKampong` → `goArea` to the same place), so the new villagers appear. The craftspeople and Senuai/the king use `hideIf` (generalised for non-chapter2 villagers in kampong.js). The padian boats appear at stage 2+ from 06:00 to 14:00, with 4 items a day picked from `LC.PADIAN_POOL` by a day-seeded generator. The water taxi (`World.hopTo`) fades and moves the player within the place (20 kepeng, free with your own perahu).

**Teluk Barunai** (`LC.AREAS.teluk`, 44x32): Pulau Pilong-Pilongan (sand, rock and a cliff), its jetty, and the Lumut Lunting sandbank, joined by two little `hop` boats. The ghost rooster (`LC.GHOST_SPOT`) is placed by `updateKampong` at night while ch3 is 7. Co-op protocol 9.

### Chapter 3: Kampong Ayer, part 2 (v2.1)
The user asked for the wars to be included, and then for "part 2 and the rest", so all three are built: the jinn (from the epic: Awang Semaun, Awang Jerambak and Damang Sari fought Bilanapura for nine months, and Jerambak beat it with a magic fish skin taken from an ogre; here the ogre is gentle and trades it for a meal), "the Venice of the East" (Antonio Pigafetta's 1521 account: a city of some 25,000 households built in salt water on wooden posts, women selling food from boats, silk-draped elephants), and the 1578 Castilian War (a Manila fleet took the city; the people fought back; disease in the invaders' camp made them leave). Kept out: gore, religion, royal titles, and wars against neighbouring peoples. The soldiers are not killed: they fall into the river and swim back.

**Progress** continues in `quests.ch3`: 8 Semaun's news; 9 the ogre's trade (`LC.OGRE_TRADE`; the row comes back if the skin is lost); 10 the battle (`kulit_ikan` needed; heroes placed in Teluk by `createKampong2`); 11 1521 (`tourOn`, `tour` {stop: 1}); 12 1578; 13 complete. Flags: `jinn` (+20 max HP in `recalc`), `lantakaGot` (Berbai hands it over if the bag was full).

**Combat hooks** (WorldKampong2 wraps WorldCombat): an enemy group can have `when(W)`, checked by `groupOn`; `enemyDie` sends `bilanapura` and `askar` to their own scenes (no respawn: `respawn = 1e9`); `createEnemies` clears any fight left over from the last place (the scene object outlives reloads). The heroes strike the jinn for 2 every 2.2 s while you fight.

**Kampong Ayer** (`LC.AREAS.kayer`, 48x34, not in `AREA_ORDER`, like the deep-sea places): reached only through the `vision` lamp in Barunai (ch3 11-12), left through the `vision_back` lamp. Three walkways with 33 houses, a brassmiths' workshop and the great hall (tour stops), and `when` objects per year (elephants, the padian, Antonio's ship in 1521; the meriam in 1578). The 1578 run lives in `World.war` (`LC.kaWar` for the goal line) and restarts if you leave: wave 1 `ships` (the meriam game, `UI.openMeriam`), 2 `fires` on `LC.WAR.fires` houses (2 water each), 3 `families`, 4 six `askar`. Co-op protocol 10.

### Chapter 4: Layar Merah (v2.2)
The user asked for a chapter where Majapahit attacks the home of Chapter 1, and accepted the plan's rogue admiral (Laksamana Kebo Taruna, invented) as the villain, so that Chapter 3's fair King of Majapahit stays honourable: he arrives to stop it. No real historical figures as villains (no Gajah Mada or Hayam Wuruk), no gore, no religion.

**Progress** (`quests.ch4`): 0 waits for a day after Chapter 3 (`quests.ch3day`, set when 1578 is won), then the alarm plays on the farm; 1 Pak Mat; 2 preparations (`c4pagar`, `c4meriam`, `c4allies`, optional `c4badang`; the stockade and cannons are `when` objects in Kampung Tepian); 3 the attack (`c4wave` 1 kampung jetty, 2 farm fires `c4fires`, 3 raiders at the spirit house, 4 the admiral at the farm jetty), saved so a wave carries on after travelling or fainting; 4 complete (Keris Majapahit, or `c4kerisOwed` with the Penghulu; the `jong_dagang` object and shop on the farm).

**How the battle works:** enemy groups on `LC.AREAS.kampung` and `LC.AREAS.farm` with `when` (the farm had no enemies before); `soldierDown`/`admiralDown` replace `enemyDie` for `prajurit`/`laksamana`; the heroes (`C4.allies` by place and wave) strike the nearest foe every 2.4 s. Each wave starts before its dialogue, so closing a dialogue early can never stall it, and the reward is granted before the king's scene. A safety net releases any story cutscene that has had no dialogue on screen for 6 s. Co-op protocol 11.

### Chapter 5: Bayang Hitam (v2.3)
The user picked this continuation: the exiled admiral makes a pact with an original shadow spirit that wants to put out Pelita's light; shadows attack the farm and the kampungs at night; you sail to the Majapahit court for the lamp that made Pelita; the finale frees the admiral and gives Pelita a new form. Si Kelam is invented (no folklore or religious figure), and nobody is punished.

**Progress** (`quests.ch5`): 0 waits for a night after Chapter 4 (`quests.ch4day`, set when the admiral falls) on the farm; 1 four `kelam` shadows on the farm (one-shot); 2 Juragan Wira (`c5wira`, on the jong's menu) and the guard lamps (`c5lamps`, farm `when` objects with lights); sailing to Java sets 3 before the place is built (`c5arrive` shows the landing text); 3 the king (`c5king`, a figure, not a villager), Empu Lintang (`c5empu`), the Cahaya Bunian, the damar tree (`c5damarDay`), the forge; 4 Pulau Kelam (`c5obor` saves the lit torches); 5 complete (+20 max health in `recalc`, `ghost_5_*` through `LC.ghostTex`).

**While the shadow is loose** (steps 1-4, `LC.shadowLoose`): Pelita is drawn pale and its glow small (an `updateGhost` wrapper), farm and kampung torches stay dark (an `updateLighting` wrapper), `bayang` groups roam both places at night (not the farm once the guard lamps burn), and `State.endDay` dries up to two growing crops a night without the lamps. Si Kelam's shield resets its health until all four torches burn. The reward is granted before the finale's dialogue. Co-op protocol 12.

**v2.3.1: Mak Lampir.** The user asked for Mak Lampir, "the black magic witch influencing the attack". She is a character of the Indonesian radio play and TV series *Misteri Gunung Merapi* (not a documented folk legend), so the game uses only her name and the witch archetype: its own art, words and story, nothing else from the series, and no religion. She whispered in the admiral's ear since Barunai (a hint in Chapter 4's king scene; he says so in the finale), holds Si Kelam's leash, and is the second phase on Pulau Kelam (`quests.c5witch`, saved): she watches from the crag (`lampir5`), then fights as `maklampir` (blinks around `C5.witch.zone`, snuffs a lit torch every 13 s with a violet bolt; shielded while any torch is dark). Beaten, she turns into a bat and flies off; the rewards come first. Co-op protocol 13.

**v2.3.2: selling chickens and eggs.** The user asked that chickens and eggs can be sold in the shop. Eggs already sold at the warung (and to Pak Lah), so this adds: Mak Ani sells eggs (telur 20 k, telur itik 28 k), and farm animals can be sold at the warung's Sell tab or Pak Lah's (`animalSellRows`, the shared `animal_sell` op, `LC.animalSellPrice`: half the price, chicks 30% of the grown price, +2 k per love). Sold animals go "to a good home on another farm" (no slaughter, as agreed in v1.5). Selling asks twice. Co-op protocol 14.

**Also in v2.3:** Pixelify Sans drew the "fi" ligature like an "A" ("first" came out as "Arst"), so every Text object now renders with `textRendering = 'optimizeSpeed'` (no ligatures).

### Chapter 6: Puteri Gunung Ledang (v2.4)
The user asked how Puteri Gunung Ledang and Hang Tuah could fit, wanted the story tied to Nenek and Mak Lampir, asked for fights, and said "proceed" without choosing the witch's fate, so the recommended ending was used: the princess takes her magic away and she becomes an ordinary old woman (Nek Lampir, a herb seller on the mountain). The optional Hang Jebat spar was included. Nenek's lore stays consistent: she fell sick and left (Chapter 1's letter), her father travelled by sea (Chapter 2's letter), and Pelita's flame floated away from Empu Lintang's workshop (Chapter 5) and found her on Gunung Ledang. The Sultan of Melaka is unnamed and never a villain; the demand for blood is never named; Hang Jebat lives (they made peace).

**Progress** (`quests.ch6`): 0 waits for a day after Chapter 5 (`ch5day`) in the daytime on the farm; 1 Nenek is home (a figure at `C6.home`, `c6day`); 2 the curse that night, or the next morning if you slept (Nenek on the pangkin, `diari_nenek`); sailing to Gunung Ledang (a row added to the jong's menu through `LC.jongExtraRows`) sets 3 before the place is built (`c6arrive`); 3 Hang Tuah's duel; 4 the princess (`c6asked`), the tears (`c6tears`), the bridge (`c6bridge`, `LC.syncLedang` turns the stream tiles into planks, called from World.create), the areca nuts (`c6pinang` per palm per day); 5 the Bunga Ledang (`c6fight`, saved); 6 home with the flower (`c6bungaOwed` if the bag was full); 7 Nenek wakes (a villager from now on; +20 max energy in `recalc`).

**The duels** use enemy kinds `pendekar_hangtuah`/`pendekar_jebat` with 999 health: each drop is a touch (health restored), each drop in your own health is a touch on you, three wins or loses, your health is given back, and the villager is hidden while his duellist fights. **The last fight**: `lampir6` (80 health) blinks around the garden, casts a curse circle under you every 6.5 s (9 damage if you are still in it after 1.3 s), drinks the light every 16 s (a dark overlay), and Hang Tuah strikes every 2.4 s. Rewards always come before the dialogue. Co-op protocol 15.

### Nek Lampir, your grumpy helper (v2.4.1)
The user wanted Nek Lampir to fight beside them, and chose her skills: **Serbuk Lada** (pepper powder) and **Bulatan Hijau** (a green circle). They wanted her grumpy and loyal to the player alone ("doesn't want to work together with other spirits, Hang Tuah, etc."), only coming when called, and able to teleport with a cooldown. Their answers: she refuses when anyone else is helping (and leaves in a huff if they turn up); Pelita stays; she teleports in three ways (herself, in and away from enemies; you, out of danger; you, to a place, for a fee). Her black magic is gone, so her help is herbs and an old smoke-step trick.

**Unlock:** `quests.nekLampir`, set at the start of the peace scene (10 hearts with `lampir` after `ch6` 7: a Talk row, then `nekPeaceGo` sends you to the farm and `createNek` plays the scene). **Rivals** (`nekRival`): Badang along, Hang Tuah's Ch6 ally or a duel, Ch4 allies, the Ch3 jinn heroes or war, the Si Tanggang escort, any co-op player in the same place (`W.remote`), underwater. **Her AI**: follows a step behind (the side away from Pelita), blinks to the far side of you when an enemy comes within 22 px of her, throws pepper every 2.4 s at the foe nearest you (2 damage, 1 to bosses; the stagger sets `restT`), and goes home after 12 s without a fight (40 s if there never was one). **Green circle**: 8 s, 22 s cooldown; the `playerHurt` hook halves damage inside the ellipse. **Rescue**: in the same hook, a blow that would leave you under 30% is clamped to leave at least 1 health, and you are moved to the arrival spot of the place (its home, or any exit spawn leading here) farthest from enemies; 90 s cooldown. **Teleport**: any visited, open, dry place (`LC.nekPlaces`), 200 k or 500 k across the sea, 120 s cooldown. Cooldowns use the real clock (`LC.nekCallAt`, `nekCircleAt`, `nekRescueAt`, `nekTpAt`), like the stone curse. Simulated per device; no shared ops. Co-op protocol 16.

### iPhone: the Home Screen app (v2.4.2)
The user asked whether the game plays on an iPhone, then wanted it "to work just like apk". Apple only installs signed apps (App Store, TestFlight with a paid US$99/year account, or a free Apple ID re-signed every 7 days from a Mac or Sideloadly), so I offered those and the free web route; they chose the **Home Screen web app**. Hosting is GitHub Pages from `main` / root (the owner turns it on once; `.nojekyll` skips Jekyll).

**sw.js is now cache-first, like an installed app:** install saves every file with `{cache: 'reload'}` into one cache; fetches are served from it (`ignoreSearch`), with `dist/` (version.json, downloads) always from the network; activate deletes older `little-creature*` caches and claims. `tools/build-web.mjs` stamps `CACHE` (`little-creature-<code>-<build time>`) and `FILES` (every local `<script src>`, font and icon in index.html, plus the manifest icons; it throws if one is missing), so a new build always reaches phones, all at once, and no file is left out. **Updates:** the browser fetches the new sw.js at start, saves the whole new copy in the background and swaps it in for the next start. On a hosted page `LC.Update` reads `dist/version.json` from its own site (so the news matches what Pages serves), `verb()` is "update", and `download()` calls `LC.applyUpdate` (main.js): autosave, `reg.update()`, reload on `controllerchange` (or at once if the copy is already there; a 30 s fallback).

**iPhone glue (main.js):** `LC.IOS` (iPadOS reports a Mac with touch), `LC.STANDALONE`, `LC.installHint()` (the title screen's green "Add to Home Screen" box in Safari, replaced by the update box when one shows), a rotation-lock tip added to `#rotate` (web apps cannot force landscape), no pinch zoom (`gesturestart`), `navigator.storage.persist()`, a screen wake lock on phone browsers (the APK keeps the screen on itself), and sound that resumes on every tap end (Safari only unlocks audio on touchend and can leave the context `interrupted`; `LC.Audio.resume/init` now resume any state but running/closed). The Android app and the PC files are unchanged in behaviour.

### Give a friend (v2.4.3)
The user asked whether they can share items with friends (only through shared chests before) and then asked for a direct way. Bags stay on each device, so a gift is a message, not an `LC.Sim` op: the giver takes it out of their bag first (`World.giveItem`; `LC.FIXED_ITEMS` cannot be given), `LC.Net.give` sends `gift{gid,to,id,n}` to the host, which passes it on (or takes it itself) with the giver's name; the receiver keeps what fits (`World.bagRoom`) and answers `giftRes{took}`, routed back through the host; the giver gets the rest back. A friend who left answers 0, and no answer in 10 s gives everything back. Reach: friends in the same place within 64 px (`World.friendsNear`). UI: a green **Give a friend** button under Throw away in the bag (only with friends), key G, then "who" (up to 3 names) and "how many" choices. The icon flies between the two players. Co-op protocol 17.

### Chapter 14: Hantu Kak Senah? (v3.13)
The user asked for a chapter "just like" a Malaysian comedy-horror film; I explained we cannot copy the film (its characters, village and plot belong to its makers) and wrote an original story in the same spirit, which they approved. `senah.js` (data, area `senah` 32x24, objects, text, `seri_muka` and its recipe, the Penunggu's +15 energy in a `recalc` wrapper, the `laugh14`/`clang14`/`scream14` sounds in an `LC.Audio.sfx` wrapper), `art27.js` (`generate27`: the cast through `Art.drawVillager` with extras, the house, gate, clothesline, cage, kitchen, Penunggu, and the hiding places drawn over the existing `palm`/`reban`/`banana` pictures), `WorldSenah.js`, `UISenah.js` (goal via `LC.ch5Goal`, the checklist entry pushed onto `LC.CHAPTER_LIST`, news `v3.13-ch14`). `quests.ch14` 0-7 (`LC.C14`): 0 the villagers at the pondok (night = 7 PM) · 1 peek · 2 clues `c14sheet`/`c14tiong`/`c14amin` (Amin only at night) · 3 the rattle (from the update loop once all three are found) and the Penunggu · 4 `c14day`, then a later day after 10 PM in the area starts the scene (step 5 is saved first; `refreshWhen` runs while still at 4 so Amin leaves the kitchen, and again at the end to show the hiding places) · 5 `c14found` (palm, reban, bananas swap for pictures with someone in them) · 6 Kak Senah: rewards first, then the dialogue, then `refreshWhen` and one more laugh from the banana grove. The lane gate is a kampung object at (32, 2) with `when: C.ready` (keep: trees stay clear). Every scene advances from the update loop once dialogue closes (no `onDone`). Casting Mantera Suria at steps 5-6 makes Kak Senah scold you. **v3.14.1 fireworks** (the user asked for fireworks at the end): after the finale dialogue, `senahFireworks(14, done)` (rockets from the yard tween up to bursts in the middle of the camera view, one `px` emitter per colour at depth 9650 above the night's darkness (9000), a coloured `glow` flash, `whizz14`/`boom14`/`crackle14`, the folk cheer in turns, a 4-rocket grand finale), then the banana-grove laugh and the `gag` lines. After the chapter, Amin (`sn_amin2`) lights 9 more at night, once a day (`quests.c14fwDay`).

### Chapter 17: Penyamun Empat Puluh? (v3.17)
The owner asked for a story in the spirit of a Malaysian comedy film about Ali Baba and the thieves, with the player stuck in the cave; then asked that getting out needs the player to **encrypt** the password, and chose the cliff's voice password (`Niat enson matakaji semar ngiseng`). The cast, places and jokes are our own; only the old Ali Baba folktale is borrowed. Files `penyamun.js`, `art30.js` (`generate30`), `WorldPenyamun.js`, `UIPenyamun.js`. New areas: `kapur` (Bukit Kapur, through the gate `fr_kapur17` at Hutan Rimba 40,27) and `gua17` (the cave). Neither is in `AREA_ORDER`: both are reached through objects. `quests.ch17` 0-9 (`LC.C17`): 0 `c17wait`, the next day · 1 `k_tokp17` (kampung 16,21) · 2 Ali Baba `f_alibaba17` (farm 36,9) · 3 hide in `kp_semak17` (a cutscene; the camera pans to the cliff) · 4 the mantera at `kp_pintu17`: `openMantera17` (the microphone: an AnalyserNode loudness envelope; or tap the five words. v3.17.5: an Allow microphone step first; the APK asks Android through the `LCAndroid` bridge (`micState`, `askMic` answered by `LC.onMicAnswer`, `openSettings`) before `getUserMedia`; the meter runs on its own AudioContext and stays live between tries, the floor is the quietest 15% of the last 4 s, and it passes with three syllable rises and 0.8 s of voice over 0.9 s) · 5 the cave: Tok Batu `g17_pintu` takes `C17.code` (DODOL shifted by `C17.key` 4 = HSHSP) through `openBatu17`; tries `c17tries` (at 0 he naps: +1 hour, back to 3); Ali Baba shouts every 14 s until `c17stop` (the crack `g17_celah`); clues `c17clue` list, chalk, roda, diari (`openDiari17` decodes live with the wheel) · 6 warn `k_tokp17` · 7 twelve jars `k_jar17_*` (`C17.thief` 2, 7, 10), `c17tap`, `c17caught` · 8 the boss `garong17` (an `enemyDie` wrapper: he sits down; rewards first) · 9 done (`S.chests.gua17`, a fixed peti_ukir in the cave; the watchmen `k_peronda17_*`; Ali Baba's daily wood `c17wood`). Android: `RECORD_AUDIO`, and `MainActivity` grants the WebView's audio capture only to the app's own origin, after the player agrees.

### Chapter 16: Kampung Mamai? (v3.16)
The owner wrote the start (a majlis doa kesyukuran after the fire, hosting it, hiring kitchen hands, Nek Lampir volunteering, the kampung turning into zombies that won't die, and Nek Lampir having put something in the food) and asked me to improve it. Changes agreed: Nek Lampir died in Chapter 13, so her **spirit** comes from her lantern; the **doa itself stays peaceful and untouched** (the trouble is in the feast food); the villagers are **cured, not fought**; and it is an **honest mistake** (a ghost cannot smell: Serbuk Lena instead of kunyit), which keeps her redemption. Files `mamai.js`, `art29.js` (`generate29`), `WorldMamai.js`, `UIMamai.js`. `quests.ch16` 0-11 (`LC.C16`): 0 `c16wait`, the next day · 1 `k_tokp16` (kampung 16,21) · 2 invitations `c16inv` (objectAction intercepts `k_pondok`, `k_kedai`, `k_bengkel`, `k_masjid`, `sn_kak`, `sn_jusoh1`) · 3 `c16help` (Amin `sn_amin2`, Si Bara `f_sibara15`), then on the farm Nek Lampir arrives (`f_lampir16`, 10,8) · 4 three pots `f_periuk16_*` (11-13,7), `c16cook` · 5 the majlis after 6 PM (decor images in front of the gelanggang; `c16feast`) · 6 rest · 7 sleepwalker actors in the kampung (tinted, arms out; `getAction` wrapper: Shake / Give; `attack`, `castSuria`, `laguKey` wrappers; Pelita within 30 px holds them; a touch costs 2 energy every 2 s, never health) and clues `c16clue` (`k_amin16`, `f_balang16`, Si Bara) · 8 confession · 9 brew (`C16.jamu`, `c16jamu` = 7) · 10 wake seven (`c16woke`) · 11 rewards first, then the finale. Mat, Zul, Leong and Tok Penghulu (the seventh sleepwalker since v3.17.3: he ate the ayam too) are hidden through an `LC.villager` wrapper while they sleepwalk (and, from v3.17.2, a `jerebuAway` wrapper, so the step starting while you are in the kampung never shows two of anyone), and Kak Senah's yard hides Jusoh, Bahar and her through their `when`. The Senduk Lampir bonus is an `eat` wrapper.

### Chapter 15 — Jerebu dan Bunga Api (v3.15)

The [chapter plan](docs/chapter15-plan.md) follows the mystery laugh after Kak Senah’s fireworks. Tok Penghulu gives the player a mask, then the kampung puts out the fires, forms a bucket line and helps frightened neighbours. The trail leads to Si Bara in the banana grove. Pelita talks with him while the player douses four fuses. Monsoon rain clears the haze, and Si Bara becomes a friend at Nenek’s dapur.

`jerebu.js` registers the chapter data, item, speakers and objects. `WorldJerebu.js` saves the fire levels, partial dousing, soot, calmed villagers and fuses in personal quest state. `WorldFireworks.js` supplies the same celebration show for Chapter 14 and smaller arcing rockets for Chapter 15. `UIJerebu.js` adds the goals, fire counter and bucket-line timing game. The chapter ends with 1,000 kepeng, story XP and double cooking capacity. Both developer builds can jump to Chapter 15 and autoplay the entire route.

### Your level, aura and magic (v3.12)
The user asked for a player level and XP (Pelita had levels, the player did not), a strength limit that grows past 100 with the level, an attribute octagon in My stats "like the image" (a football-manager style chart), monster levels, magic learned at the School of Sorcery, and then an aura around the player's body on the stats page that depends on their attributes. `level.js`: XP in `S.quests.xp` (quests already travel in a co-op guest's bag, so no state.js change), `LC.PL` (max 50, `need(L) = 20L + 2L²`, `strCap(L) = 100 + 4(L-1)`, titles), `LC.plXp/plLevel/gainXP`; a save without XP starts at `PL.startXp` (kills x8, Pelita level gifts, chapter steps x30, fish x4, strength over 10 x3); `LC.STR_MAX` became a getter on the level, so `gainStr`, the training toasts and the stats rows follow it; a `State.recalc` wrapper adds +1 max hp/energy per level (keeping current hp/energy); `gainStr` gives 3 XP per point. Monster levels: `LC.ENEMY_LV` by kind (following the chapters), a formula from hp/dmg/boss otherwise; `LC.killXp` = (3 + 2·lv) ×4 for bosses, halved 5+ levels under you, quartered 10+. `WorldLevel.js` (loaded after every other `enemyDie` wrapper): XP once per life (`spawnEnemy` counts `e.life`), Pelita's `levelUp` gives 15·lv, a 1 s watcher pays new chapter steps and fish (`quests.xpSeen`), and the level-up celebration (toast, flash, full heal). **Mantera Suria** (`quests.suria`, from Suraya once `ch13` is complete, given before the dialogue): K or a 44 px sun at (284, 532) `bc`; real-clock cooldown 3 s (`LC.suriaAt`); 1 / 2 / 3 homing suns at Lv 1 / 15 / 30 that turn towards the nearest foes, damage `3 + floor(L/4)` (x2 on stone), the same hit rules as the Sumpit's dart. `UILevel.js`: Lv text and XP bar in the top-left panel; level tags above monsters (UI scene texts placed like `floatText`); `openMenu` tabs can now `draw(container, box)` a page (UI.js), used by the new first tab **Me** of `openStats` (the body at scale 7, an aura of tinted additive glows plus your own sprite as glowing tinted outlines, flames from tier 3, rising sparks from tier 2, orbiting orbs at tier 4; tier from the average rating and the level; colour from the top attribute, second colour from the next; the octagon with five bands; the eight values with bars). The test build starts at Lv 30; K passes through its test keys once Suria is learned. A new one-time What's new note (`LC.NEWS` v3.12-level, with the tap-to-use line for anyone who missed it).

### Tap to use (v3.9)
Younger players commented on the touch controls. The user chose "walk by joystick, but tap to use", on by default, with a note on players' screens. `WorldTap.js`: `tapUse(sx, sy)` (screen point to world) finds the target with `tapTarget` (Pelita within 16 px, an enemy near its middle, a villager's sprite bounds, `critterAt`, an `objAt` tile, a tall object picture above its footprint via `objImgs`/`trees`, else the tile). Pelita: pet, or feed the held food (56 px). Enemy: `attack()` with a weapon (64 px). Otherwise, within 2 tiles (Chebyshev), it turns you (`tapLook`) and sets `this.tapFace`, which the `facing()` wrapper returns, so `getAction()`/`doAction()` run exactly what USE would do there; beyond reach, "Walk closer" (throttled). Your own tile runs USE as is. `updateTapMarks` (every 0.25 s, touch on, Tap to use on, no enemies) puts up to 8 soft `glow` marks on tiles within reach whose `getAction` has a label. `UITap.js`: pointerdown/up on the UI scene, a tap is at most 320 ms and 16 px (a drag stays the joystick); ignored over buttons and the top-corner panels and while a modal is open. `LC.tapOn()`/`setTapOn` (localStorage `littleCreature.tapUse`, anything but `off` is on); the pause row `LC.pauseExtraRow5`. `LC.NEWS` (`id` v3.9-tap): a one-time three-line "What's new" note for existing players (`littleCreature.newsSeen`); new players are marked seen and get the intro instead.

### Chapter 11: Bulan dan Mutiara (v3.3 Part 1, v3.4 Part 2)
The user asked for the Sultan of Sulu, then added: Barunai and Sulu work together to fight the foreigner; a fight on a ship; a scene where you captain the ship on the open sea and find something with a compass; extra sea and wind animation. They chose option A for Part 2: 1578 (the Castilian War, when Spain fought Brunei, Sulu and Maguindanao), not an invented fleet in the present.
- Part 1 (built): `quests.ch11` 0-7. 0 the night after Ch10 (`c11wait`, from 8 PM): the eclipse cutscene on the farm (`c11Hook`: eclipse tint via a `skyColor` wrapper and a moon in the UI being covered, the serpent's humps and head in the river, the vinta sailing in from the west, `refreshWhen` puts the real vinta `f_vinta11` at the jetty, x 16-19). 1 talk to Mbo' Arani (object `arani11`) and sail. 2 the Sultan. 3 ready the vinta: `c11gong` (kulintang, `UI.openKulintang`, 3 phrases of 3/4/5 on 5 gongs), `c11dive`/`c11berani` (area `terumbu`, underwater, the sunken boat `karam11`), `c11pedoman`, `c11prov` (2 tiyula_itum). 4 sail (`c11leg` 0-3 by distance to `C11.legs`, then `shipAction` "Drop anchor"). 5 the Bakunawa on `bulan`. 6 pearls to the Sultan. 7 Part 1 done (`LC.CH11_END`; raise it for Part 2).
- Sailing (`A.sailing`, area `lautsulu` 120x80): `updatePlayer` is replaced by `updateShip` (ship turns towards the input vector at `C11.ship.turn`, speed by the wind angle, `h` shallows slower; hull points checked against water tiles and `objAt`; whirlpools pull and spin, eject at the eye; squalls shove). Camera zoom 2 at sea. Effects: wind streaks, whitecaps, wake particles, bow spray, sea birds (`camar`), drifting fog (drawn under the dark overlay), rain and lightning, sounds (`wave11`, `creak11`, `thunder11`, `bump11`). Zones `C11.fog/dark/storm` tint the sky. The UI draws the pedoman (`drawCompass11`, pinned top right) with the heading in Malay and the wind arrow.
- The Bakunawa (`bakunawa11`): its head is an enemy entry kept out of `this.enemies` while it swims (so it cannot be struck), pushed in when three agung ring together (`ringAgung`, `gongFor` 13 s); dazed for 8 s at the water's edge (path factor 0.74, so a blade reaches). Swimming, it lunges near the shore (red line, 0.75 s) and raises spouts. Ten segments follow the head like a rope (`moveSegs`). Defeat sets `c11won` and `ch11 = 6` first, then the dialogue (Pelita gives it a light: `c11.hideGhost` while a stand-in flies over).
- Part 2 (BUILT, v3.4; `quests.ch11` 7-13, `LC.CH11_END` = 13; files sulu2.js, art23.js, scenes/WorldSulu2.js, scenes/UISulu2.js). 7 the day after Part 1 (`c11p2wait`), Pelita glows. 8 the stone lamp (`b_pelita`'s `when` is extended; `seeFuture` wrapped). 9 Kampong Ayer 1578 (Panglima Lela `lela11`; Pak Damit's `hideIf` extended; helm `k_vinta11`), then the sea with `LC.c11Past` set (a runtime flag: the galleons and the fleet exist only in the past; it is cleared in any other place). Find the fleet: `c11p2leg`, the bells (`LC.Audio.loceng11(vol)`), within 8 tiles of the flagship. 10 dive (area `sauh11`): three ropes `tali11`, lantern pools that fill a "seen" meter (back to the start at full), `c11rope`, `c11cut`. 11 the galleons aground (objects swap on `c11cut`), `openKulintang(.., [6])` signal (`c11signal`), fleet surrounds, board. 12 area `kapal11` (deck tiles `j` in the sea; hull and rails drawn; camera roll): waves via group `when` on `W.c11.p2.deck.wave`; deck deaths go overboard (`overboard`); allies strike (`allyStrike`); the Capitán `kapten11` (charge boss) with broadsides and helpers at 50%; `kaptenYield` sets ch11 13 and the rewards first, then the eclipse (`deckEclipse`) and the pearls, and the vision ends in Barunai. The original design notes: the Castilian fleet that left Kampong Ayer turns towards Sulu; Sulu's envoy brings the Sultan's pearl as a token; Barunai's fleet sails with you as captain; scout the fleet in the fog with the pedoman; night dive with the Sama Dilaut to cut anchor ropes; kulintang signals to move both fleets as one; **board the flagship** and fight on its rocking deck (sailors swinging in on ropes, cannon fire telegraphed, the commander as the boss; no gore: overboard and swimming back); the eclipse and the Bakunawa (who remembers you) send the fleet home; the twin pearls are split, one for Sulu and one for Barunai ("two pearls, two kingdoms, one sea"). Reward: the **kalis**, Sulu's wavy sword (this is the late weapon from the weapons idea below).
- Files: sulu.js, sulu2.js, art22.js, art23.js, scenes/WorldSulu.js + WorldSulu2.js, scenes/UISulu.js + UISulu2.js (after UIBelalang.js). Test key / (Slash) steps through both parts. Codex's Developer Edition (separate work) will need a Chapter 11 entry in its chapter list.

### Chapter 10: Nujum Pak Belalang (v3.0)
The user asked for the folk tale of Nujum Pak Belalang (researched first: a lazy father, a clever son Belalang who finds lost things, the father "divines" them, the king's tests, overheard riddle answers; in one Sumatran telling he ends by saying his powers were used up), with their twist: "spirit suddenly disappear because he follows Belalang and he like belalang". They agreed the player's mission (bring Pelita home without breaking Belalang's heart, and help Pak Belalang stop lying), changed "3 days" to a week (a game day is about 6 real minutes) with a soft deadline, and accepted an invented Sultan (Sultan Muzaffar of Negeri Tanjung Bunga: kind, loves riddles, a little too quick to believe) rather than a real ruler. Only the folk tale is used, not the 1959 P. Ramlee film. They said "proceed" without picking a reward between Pelita's seeking light and the Sumpit; the Sumpit was built (it was already agreed in the weapons idea).

**Steps** (`quests.ch10`): 0 the day after Ch9 (`c10wait`; farm, 6 AM-8 PM: `c10Hook`) · 1 Pelita gone (`c10needs` = its needs, frozen), the glowing grasshopper hops on when you come near (`c10hop` 0-5, `LC.C10.hops`), the woven grasshopper `f_anyam10` on the jetty (`c10clue`) · 2 jong to `tanjung` (`c10arrive`), hide-and-seek (`c10seek` 0-3, `LC.C10.seek`) · 3 chores (`c10chores`; `c10air` 0-3: bucket at `perigi10` → `tempayan10`, the bucket rides above your head; `c10give` craftRow 3 kayu 2 kelapa), "All done!" → 4 the secret and the drum · 4 Sultan (`c10sultan`, `c10due` = day + 7; late: `c10late`, another week, no bonus), Belalang along (`c10with`: `followBelalang10`, a Companions row with Send home), `merbau` footprints (`tapak10` at depth 9001, ADD, alpha from Pelita's distance, `printR` 70), clues `jejak10` (flavour), camp trigger x < 17.5 tiles, gang `pencuri10` ×4 + `ketua10` (charge) with `when`, `gangDown` (no respawn, no "flees" toast), `c10Won` → chest `mb_peti` → 5 · 5 return (Sultan row, +3000) → 6 the ship `tj_kapal` + sampan `tj_sampan` · 6 sampan after 7 PM (`c10heard`, a choice "Lie still / Peek"), the contest (`openRiddles10`: say() with shuffled choice buttons; wrong → "think again", same riddle) → 7 · 7 Pak Belalang "The truth" (choices) → `c10Finale` (rewards first; `holdGhost` keeps your own Pelita hidden until the drawn one floats from Belalang to you) → 8.

**Pelita away** (`LC.pelitaAway()`, steps 1-7, never for a co-op guest): an `updateGhost` wrapper hides it, keeps `ghostNear` false and restores `c10needs` every frame; an `LC.State.endDay` wrapper runs the night with needs at 40 and the craving done (no prank, no bond, no craving loss) and swaps the "dozes off" line; the spirit house says it is empty. In Tanjung Bunga (and Hutan Merbau) Pelita is drawn beside Belalang (`c10.pel`).

**Sumpit** (item `sumpit`: kind weapon, `ranged`, dmg 3, range 168, speed 300, cd 0.62): an `attack` wrapper calls `shootDart` (dart `damak10` in the facing direction; `updateDarts` from an `updateEnemies` wrapper: hits the first enemy within its width + 6 px, the same damage formula as a swing (strength, tempering, stone x2), smaller knockback; stops at solid non-water tiles). `getAction` says "Shoot the Sumpit".

Areas `tanjung` (56x40: palace yard 'k', Pak Belalang's hut, the well, harbour; the jong `jong5`) and `merbau` (50x34, dim, a stream with two log bridges, 78 trees; its `clear` zones use whole tiles, because `scatterTrees` marks tile by tile and half-tile centres let a tree grow on the path). Villagers `belalang` (`sprite: true`, a 16x20 kid drawn in art20.js; hidden before step 3 and while he walks with you), `pak_belalang`, `sultan_muzaffar`; speakers `bentara`, `jambul`, `nakhoda`, `kerengga`. Files: belalang.js, art20.js, scenes/WorldBelalang.js, scenes/UIBelalang.js (loads after UICompanions.js, because it wraps `companionRows`/`companionCount`). Test key ' (Quote).

**v3.0.1, Nek Lampir's fortune** (the user asked for "a little bit of humour, like Nek Lampir seeking her future fortune with Pak Belalang"; they approved the proposed scene): object `tj_nek` (type `nek10`, her villager texture) beside Pak Belalang from step 5 on (also after the chapter) until `quests.c10nek`; `nekFortune10` asks three questions with whisper buttons (`CH10TEXT.nek.qs`; `good` answers count, 2+ gets the kinder verdict), the jamu payment, 3 Herba and +8 friendship (`addFriendship`), a one-time hint toast (`c10nekHint`); a helper Nek Lampir walking with you leaves first. The finale inserts `nek.callback` after the Sultan's "worth more than any riddle" line when `c10nek`. Her cat `ld_kucing10` (art `kucing10`) sits at (7,31) on Gunung Ledang; a "The crocodile" Talk row for `lampir`; a Journal line (optional / done).

### Chapter 9: Ulek Mayang (v2.7)
The user asked for the Terengganu legend of Ulek Mayang (a singing lady), as horror: "dark, a chase, small jump scares, spooky", a scene where the song is sung and the player must find where it comes from, the source being Pak Awang singing in the sea (their pick), and Lagu Mayang as the reward (they turned down Pelita's healing song). Legend researched first (fisherman possessed in a storm, a healer sings the Ulek Mayang on the beach, the princesses come one after another, the eldest settles it). The verses and the melody are the game's own; the one traditional line used is "Yang laut balik ke laut, yang darat balik ke darat". No gore, no religion, no worship (the rice is food for guests).

**Steps** (`quests.ch9`): 0 the night after Ch8 (`c9wait`, farm after 8 PM: `c9Hook`, the song and the empty boat `f_perahu9` in `LC.OBJECTS`) · 1 the jong (`LC.jongExtraRows`) to `kabus` (`c9arrive`), Mak Som · 2 `bakau`: find the song (`c9find` 0-3: boat, well, swing, Pak Awang; `findEvent9`, `c9Found`) · 3 Tok Pawang (`c9pawang`), the mayang (`pinang9` → `c9ChaseStart`, `c9chased`) and Nasi Kunyit (Mak Som's craftRow) · 4 the Ulek Mayang (`pawang9` → `c9Ritual`, `UI.openUlek` per verse, `c9AfterVerse`) · 5 `guatujuh` under the whirlpool (`dive9`): seven `kima9`, the right one is `c9right`, wrong ones in `c9open`; `c9Spirit` · 6 give the spirit to Pak Awang (`awang9` → `c9Finale`, `c9Dawn`) · 7 complete (`laguMayang`). Test key: ` (Backquote); the Chapter 3 test key moved from L to ; because L now sings.

**Horror** (`LC.horror9(area)`: the three places while ch9 is 1-6): `updateLighting` is forced to night with the cave tint and a small light (Pelita's daylight is off there), Pelita is frightened (`updateGhost`), extra fog, `UI.drawHorror9` (a vignette, and the light at the screen edge towards `W.c9.src`), `LC.Audio.horror` (the calm music is muted, a drone, whispers, creaks). Jump scares are `UI.scare9('face'|'flash')`; Pause > Jump scares: Gentle (`flags.noScare9`) never shows the face. **Sound** (`lagu.js`): `LC.Singer` is a formant-filtered voice with its own volume and stereo position, set every frame from the source (`LC.SING.her/him/pawang/me`); `quiet(sec)` cuts it dead (the chase's "freeze"). **Chase** (`updateChase9`, `LC.C9.chase`): she glides at 58 px/s (100 when far; you walk 74), quiet every 6-9 s for 2.4 s (moving then = caught), lamps (`LC.C9.lamps`, radius 46) hold her at the edge, caught = 10 damage and back to the last lamp. **Lagu Mayang** (`laguKey`, `LC.C9.lagu`): `tranceT` on enemies; the `updateEnemies` wrapper holds them in place and stops their attacks.

### Chapter 8: Air Pasang (v2.6)
The user designed it: a flood at Nenek's place that rises day by day; the player investigates and finds Nyi Roro Kidul (Kanjeng Ratu Kidul) and Poseidon at war, with soldiers and dragons fighting, both rulers with their egos, the cause being ocean pollution that Nek Lampir caused by mistake. They chose riding the Naga as the reward, a fight against two dragons, Nek Lampir helping to clean up (not punished), and more animation and effects in the war and fights. Then they added: you watch an epic one-against-one fight between Poseidon and Nyi Roro Kidul, you fight the Queen and then Poseidon to calm them down, and only after winning both do you explain what happened. (Kept respectful: the duel wears out their anger, nobody is harmed, and both stay dignified; the pride is theirs, the magic only made it bigger.)

**Steps** (`quests.ch8`): 0 a day after Ch7 (`c8wait`), the flood (`c8floodDay`; one row a day from the bank, 5 at most, `wadeMult` 0.62, drawn on the farm only) · 1 Tok Duyung · 2 both rulers (`c8ratu`, `c8pos`) · 3 the Selat Gelora (`gelora` area, the `arusgate8` in Kampung Karang): 3 shards (`c8sh`) · 4 Nek Lampir confesses (`c8confess`), Air Penawar (craftRow, 3 rumpai laut + a pearl) · 5 the current opens; entering the deep starts `c8boss`: `nagaibu8` + `ketos8` at once (`c8calmN`, `c8calmK`; `calmDragon` throws the cure, the other gets `rage`) · 6 the rulers' duel: `c8DuelShow` (you watch), then `c8duel` = `kidul` (`ratu8`), `pos` (`poseidon8`), `done` (`c8Truth`); the rulers are hidden at home during step 6 · 7 the Naga Mother fetches Nek Lampir (`c8Fetch`, `c8Finale`; rewards first: `nagaRide`, the Seruling Naga, or `c8fluteOwed`) · 8 six jars (`c8jar`, `LC.C8.jarSpots`) to Nek's pot at the farm jetty (`c8sealed`) · 9 complete (`c8silt`: `LC.Home.dusk` waters the field for 7 nights). Battlefield: ambient soldier pairs, the dragons beyond the current, ink murk, volleys of spears. Boss moves are shared (`dragonWave/Pool/Beam/Slam`, with the Ch7 `bossBolt`). Test key: = (Equal).

**Naga Kecil** (`WorldNaga.js`): the Seruling Naga is a vehicle item (`ride: 'naga'`, speed 2.1; `RIDE_ITEM.naga`); `canRide('naga')` = underwater or wherever a bike may go (never across water, so story bridges stay meaningful); `drawRider` draws `naga_ride_side/down/up_0/1` under the rider (co-op friends too); swings while riding fire `nagaJet`. Livelier fights (all chapters): `fightFx` after each swing, a ring on beaten foes and on blows you take, "!" on wind-ups. Dialogue portraits and menu icons now scale down to fit (big dragons). Co-op protocol 20.

### Chapter 7: Puteri Santubong (v2.5)
The user picked the Sarawak legend of Puteri Santubong and Puteri Sejinjang (researched first: the common core is two sky princesses, a weaver and a rice-pounder, who quarrelled over Putera Serapi and became Gunung Santubong and Bukit Sejinjang; Pasir Kuning/Pasir Putih and Sang Bualang come from one less-documented telling). They asked for Puteri Gunung Ledang to be part of it, for Sang Bualang to be the villain who becomes a friend, unlocks a new power and fights beside the player, for him to take time to arrive "because he is riding the wind", and for Pelita's "bright as day" power as the reward. Nenek is from Santubong (her name, Minah, and her father the trader who ordered the brass lamp are this game's own story).

**Steps** (`quests.ch7`): 0 a day after Ch6 (`c7wait`), the mist on the farm · 1 Ledang: `kabus_ledang` · 2 sail · 3 Mak Dayang (legend; places the princesses) · 4 night: `c7askS`/`c7askJ`, three dyes + `benang_emas` woven at the loom (`c7kain`), 3 padi pounded in the rhythm game (`c7beras`, `UI.openLesung`, `peek()` for tests), then "Carry her words" · 5 storm (`c7storm`, 8 kills of `ribut`/`camar`) · 6 Putera Serapi (`surat_serapi`) · 7 Pulau Satang (sampan `perahu7`), `c7boss` at the crag: `bualang7` with gusts (ring warning, push), whirlwinds (`c7.twisters`) and lightning circles until `calmStorm` at half health · 8 sit (`c7sat`), wau from Mak Dayang (`wau_bualang`) · 9 `c7aboard` from the Ledang Talk row · 10 finale at the meeting stone (`c7Finale`; rewards first). The princesses (glow villagers) only show from dusk to dawn until step 10 (an `updateFolk` wrap). Chapter treasures are in `LC.FIXED_ITEMS`. Speaker id `ledang` is Puteri Gunung Ledang. (v2.5.1: her villager id is `puteri_ledang`. In v2.4 to v2.5 she reused `puteri`, which replaced Chapter 2's Tuan Puteri in `LC.VILLAGERS` and showed "Tuan Puteri" in her lines; `State.load` moves or copies `folk.puteri` to `folk.puteri_ledang` once Ch6 reached step 4. Villager ids must be unique across chapter files: a later `Object.assign` silently replaces an earlier villager.) `UI.say` gained `onLine(i)`.

**Sang Bualang** (`bualang.js`, `WorldBualang`, `UIBualang`): `quests.bualang`. B starts a call (`LC.bualangDueAt`, 10 s or 20 s when `A.cave || A.dim`; refused underwater); he swoops in, follows, spins every 2.8 s (`blowAway`: damage, knockback, `restT` dizzy), leaves after 9 s without a fight (2.5 s if he missed it), rests 25 s; if you travel while he is with you, he catches up in 3 s. U = Angin Bualang (radius 92, cd 12 s; also clears `c6.dark`, fog, twisters). `nekRival` returns `bualang` while he is present. HUD: a second row at y 514 above Nek Lampir and the dash (x 56 and 116); PC toasts move up 66 px when it shows; an edge arrow while he is on his way. **Pelita's daylight** (`quests.pelitaSun`, Lv 30, `flags.sunOff`): `updateLighting` runs at noon minutes when Pelita is here (not in caves), with a moonlight tint at night; pause-menu row via `LC.pauseExtraRow`. Dapur: `LC.MAKES` rows can have `when(S)`. Test keys: 0 (Chapter 7), and Badang's replay moved from B to minus. Co-op protocol 18.

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
- **More weapons (agreed):** the first five (Tongkat Rotan 1, Parang 2, Keris Lok Tujuh 4, Keris Majapahit 5, Trisula Laut 5) differ only in damage, reach and speed. Two more, each a new way to fight: the **Sumpit** (blowpipe, the first ranged weapon) is BUILT (v3.0, Chapter 10's reward); and the **Kalis Sulu** is BUILT too (v3.4, Chapter 11 Part 2's reward: 6 damage, reach 18, the fastest swing). Seven weapons in all. Seven in all is enough; more would only be bigger numbers.
- Interiors, and upgrading your own house and farm buildings.
- A night market (pasar malam), wayang kulit nights, sepak takraw with the villagers.
- Saving a co-op guest's villager friendships and fish log with their bag.
- Gamepad support, and a Play Store release (that would need an AAB build).
- Co-op extras: shared (synced) enemies, gifting items between players, a "everyone ready to sleep" vote, chat emotes, and a self-hosted PeerJS server for reliability.
