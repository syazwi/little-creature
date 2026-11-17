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
| M | Toggle music |
| Esc | Close menu |

Mouse clicks also work on all menus.

---

## 7. Technical design

- **Engine:** [Phaser 3.80.1](https://phaser.io), MIT licence. It is vendored to `lib/phaser.min.js` so the game runs offline, with a CDN fallback.
- **No build step.** Plain `<script>` files share one global namespace `LC`. That makes double-clicking `index.html` (`file://`) work.
- **Resolution:** 960×640 canvas. The world uses 16 px tiles at camera zoom 3 with `pixelArt: true`. The UI is drawn at native resolution so text stays crisp.
- **Art:** every sprite is **generated at boot in code** (`src/art.js`), using pixel-string sprites and small drawing routines. There are no external image files, so there are no licence issues and the look is consistent and Southeast Asian throughout.
  - *Optional swap-in:* any CC0 16×16 pack (for example Kenney's "Tiny Town") can replace the generated textures by loading PNGs under the same texture keys.
- **Font:** "Pixelify Sans" (SIL OFL), bundled in `lib/fonts/`, so offline play has no network stall.
- **Audio:** Web Audio only. Gamelan-like pentatonic music, plus synthesised sound effects (till, water, harvest, coin, spirit chime).
- **Save:** `localStorage` saves automatically on every sleep. "Continue" appears on the title screen.

### File layout
```
index.html          canvas host, loads scripts
plan.md             this document
README.md           how to run, controls, credits
lib/phaser.min.js   vendored engine
src/
  data.js           items, crops, recipes, offerings, stages, map layout, dialogue
  art.js            procedural pixel-art texture generation
  audio.js          procedural music and sound effects
  state.js          game state model, save/load, day simulation
  scenes/Boot.js    generates textures, waits for the font
  scenes/Title.js   title screen (new game / continue)
  scenes/World.js   map, player, spirit, crops, critters, day/night, interactions
  scenes/UI.js      HUD (clock, kepeng, needs, hotbar), menus (shop, cook, craft, inventory), dialogue, toasts
  main.js           Phaser game config
```

### Scene architecture
- `Boot` → `Title` → `World` + `UI`. They run in parallel, and UI listens to World events.
- `LC.state` is the single source of truth (plain object, serialisable). World and UI read and write it, and an event bus (`game.events`) signals changes.

---

### Platforms (added in v1.0)
- **PC:** double-click `index.html`, or the single-file `dist/LittleCreature.html` built by `tools/build-web.mjs`. Everything is inlined in it.
- **Android:** `android/` holds a minimal Java WebView app. Gradle copies the web game into `assets/www`, and `WebViewAssetLoader` serves it from a virtual https origin so localStorage, fonts and audio behave like a browser, offline. The app is fullscreen, locked to landscape, maps the Back button to the pause menu, and autosaves on pause. The output is `dist/LittleCreature.apk`.
- **Touch controls:** a floating joystick on the left half, USE/EAT/BAG buttons, a pause button, and tappable menu scrolling. They turn on automatically on touch devices and can be toggled in the pause menu.
- **Autosave:** the game saves on `visibilitychange`/`pagehide`, as well as at bedtime.
- **Hosted web (optional):** GitHub Pages with `manifest.webmanifest` and `sw.js` (network-first) for an installable, offline-capable web app.

### Audio (chill mix)
Slow pads, sparse bells, a soft bass pulse and a distant gong through a generated convolution reverb, at 56 bpm by day and 46 bpm by night. A separate nature bus carries the river, koels and bulbuls by day, and crickets and frogs (*kodok*) at night. Music and nature sounds can be toggled independently.

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
- Interiors, more villagers and friendship.
- Seasons (wet and dry monsoon), fishing in the river, a krathong-making minigame.
- More spirits from regional folklore, each with their own tastes.
- Gamepad support, and a Play Store release (that would need an AAB build).
