# Chapter 15 build plan: Jerebu dan Bunga Api (The Haze and the Fireworks)

For Codex. The owner approved this story; please build it as a game release (v3.15). Follow `AGENTS.md`. Ask the owner before changing the story beats below.

## 1. The story in one paragraph

The dry season brings a thick haze (jerebu) over Kampung Tepian. Tok Penghulu hands out face masks, and Kak Senah locks her leftover bunga api (fireworks from Chapter 14) in a crate at the wakaf. That night, rockets start streaking out of the haze by themselves and set roofs and haystacks alight. The kampung panics. The player puts out the fires with the gembor (watering can), helps the bucket line save Tok Penghulu's house, calms the panicking villagers, and follows a trail of glowing footprints to the banana grove by Kak Senah's house. There sits **Si Bara**, a little ember spirit whose forest home burned in the faraway fires that made the haze. He watched the Chapter 14 fireworks, thought the little fires in the sky were friends, and kept lighting rockets to make the kampung happy. (He was the mystery laugh in the banana grove at the end of Chapter 14.) The player douses the crate's fuses while Pelita talks to him. He cries puffs of steam: he never wanted anyone to lose a home. The first monsoon rain washes the haze away and puts out the last embers, and Si Bara moves into Nenek's dapur, where fire belongs.

**Tone rules (important):** nobody is hurt and nothing is destroyed for good: roofs are scorched and repaired. The panic is comic (Jusoh up the coconut tree, Cikgu Bahar lecturing from under a table). Keep a gentle fire-safety message: fireworks only with grown-ups, far from roofs, with water ready; wear a mask in haze. Treat the haze neutrally: "forests burning far away in the dry season". Do not blame any country or people. **Never set the masjid (`k_masjid`) or the spirit shrine (`k_shrine`) on fire.**

## 2. Ground rules for this repo

- Plain script tags with the `LC` namespace, and mixins that wrap prototype methods: `var f = W.fn; W.fn = function () { ... f.apply(this, arguments) ... }`. Follow Chapter 14 as the closest template: `src/senah.js`, `src/art27.js`, `src/scenes/WorldSenah.js` and `src/scenes/UISenah.js`.
- **Save each story step the moment it happens, before any dialogue.** A dialogue closed with `closeModal` skips its `onDone`. Advance scenes from the update loop once `!this.ui.isBlocking()`, as `WorldSenah.updateSenah` does. Never rely on `onDone` for progress.
- New objects use `when(S)`; call `this.refreshWhen()` after the state they depend on changes.
- Files in the working tree may be CRLF. `node --check` every file you touch.
- Release as usual: bump `versionCode`/`versionName`, run `tools/build.ps1`, verify the APK signature, commit the source and the build separately, fast-forward push, and check that Pages serves the new `dist/version.json`.

## 3. Files

| File | What goes in it |
|---|---|
| `src/jerebu.js` | `LC.C15` (config, step helpers), text `LC.JEREBU_TEXT`, speakers, items (`topeng_jerebu`), the haze strength helper, the new sounds (wrap `LC.Audio.sfx` like `senah.js` does), and the farm/kampung objects (crate, haystacks, Si Bara's home at the dapur). |
| `src/art28.js` | `Art.generate28(scene)`: flames, soot, smoke puff, crate, fuses, Si Bara, haystack, footprints if needed, the mask icon. Add `if (Art.generate28) Art.generate28(scene);` after `generate27` in `src/art.js`. |
| `src/scenes/WorldFireworks.js` | **Refactor first:** move the rocket and burst code out of `WorldSenah.senahFireworks` into shared helpers (section 5.2), then make `senahFireworks` call them. Chapter 14's ending must look and behave exactly as before. |
| `src/scenes/WorldJerebu.js` | Haze, fire, dousing, stray rockets, panicking villagers, the Si Bara encounter, the rain finale. |
| `src/scenes/UIJerebu.js` | The goal line (wrap `LC.ch5Goal`), the checklist entry (push onto `LC.CHAPTER_LIST`; update Chapter 14's `next`), the bucket-line rhythm game, the fire counter, and the news (`LC.NEWS`, chaining the previous note if unseen, like `UISenah.js`). |
| `index.html` | `art28.js` after `art27.js`; then `WorldFireworks.js` **before** `WorldSenah.js`; then `jerebu.js`, `WorldJerebu.js` and `UIJerebu.js` after `UISenah.js`. |
| `src/scenes/UI.js` | One small change: replace the dapur's inline `batch = (S.house || 0) >= 2 ? 5 : 1` (around line 1031) with `LC.cookBatch(S)`, defined in `jerebu.js` (section 9). |
| `README.md`, `plan.md` | A Chapter 15 section in each, in the style of Chapter 14's. |

## 4. Steps (`S.quests.ch15`, `LC.C15.end = 9`)

`ready(S)`: `LC.C14.step(S) >= LC.C14.end`.

| Step | Name | Trigger to advance | Notes |
|---|---|---|---|
| 0 | Rest at the farm | The first time `ready` is seen, store `q.c15wait = S.day`. When `S.day > q.c15wait`, the haze arrives: set step 1, toast "The sky has turned orange...". | Same pattern as the `c11wait`/`ch3day` delays. |
| 1 | The orange sky | Talk to Tok Penghulu (villager `penghulu`) in Kampung Tepian. Save step 2 first, then the dialogue. Give `topeng_jerebu`. The crate `k_peti15` appears by the wakaf. | Tok Penghulu: stay indoors, wear masks. Kak Senah locks the bunga api away "for the next Pesta". |
| 2 | Night of rockets | Area `kampung`, `S.minutes >= 20*60`, not blocked, more than 1.2 s after arriving: start the attack scene. Save step 3 **at the start**. | Rockets streak from the north (the lane gate `k_senah_lane` at 32,2), hit roofs and start fires, the crate shows as open, and everyone panics. |
| 3 | Put out the fires | Every small fire is out (start with 5 targets, section 5.4). Then step 4. | Stray rockets keep coming every 8–12 s while fires remain (fewer as they go out). Each rocket can relight an out target **at most once**. |
| 4 | The bucket line | Talk to Tok Penghulu by the big fire (his house) and play the bucket game (section 5.5). Win, then step 5. | Losing has no cost: try again. |
| 5 | Calm the panic | Five panicking villagers calmed (`q.c15calm` map). Then step 6. | USE or tap when near; Lagu Mayang (L) calms everyone within its radius. Calmed people walk to the gelanggang. |
| 6 | The trail of sparks | Glowing footprints from the wakaf to the lane gate. Entering area `senah` at night starts the encounter (step 7, saved first). | During the day: goal says "tonight". |
| 7 | Si Bara | Douse all 4 fuses on the crate in the banana grove (section 5.7). Save step 8, then the dialogue (his story). | No combat. |
| 8 | The first rain | Back in Kampung Tepian, talk to Tok Penghulu at the gelanggang. Save step 9 and the rewards, then the rain scene. | Rain, the haze clears, the last embers go out, kenduri, Si Bara goes to the farm dapur. |
| 9 | Done | | |

Keep the fire state in the save, so leaving and returning, sleeping at midnight, or reloading all resume correctly: `q.c15fires = { targetId: level }` (0 = out) and `q.c15big` for the big fire's level. Midnight (`LC.DAY_END`) passes you out as usual: on the next night the remaining fires are still there, and stray rockets start again after 8 PM.

## 5. Systems

### 5.1 The haze (steps 1–8, outdoor areas)

- Active when `1 <= step <= 8` and the area is not a cave or underwater (`!A.cave && !A.underwater`).
- **Sky tint:** wrap `skyColor` like the eclipse does in `src/scenes/WorldSulu.js` (around line 74). Blend the day colour about 45% towards `0xc8986a` (orange-grey); at night, a warm grey.
- **Drifting haze:** 10–14 large `fog` images tinted `0xd8b890`, alpha 0.35–0.55, depth 8997 (under the darkness layer at 9000), drifting slowly. Copy the fog bank in `WorldSulu.js` (around lines 264 and 404). Create them in a `createKampong` wrapper and keep them positioned around the camera's `worldView`.
- **Visibility around you:** each update, fade any haze image within about 70 px of the player or Pelita to 40% of its alpha. Cheap, and it reads as "you can see near you".
- **Topeng Jerebu** in the bag: haze alpha ×0.6.
- **Angin Bualang (U):** wrap `anginKey` (`src/scenes/WorldBualang.js`, around line 185). After the base call, haze images within 140 px tween to alpha 0 for 6 s, then back.
- Low effects: follow `LC.Display.effectCount` (fewer haze images).

### 5.2 Fireworks helpers (`WorldFireworks.js`)

Extract from `WorldSenah.senahFireworks`:

- `fwEmitters()`: per scene visit, one `px` emitter per colour (ADD, depth 9650, `tint: [main, light]`), with explode wrapped by `LC.Display.effectCount`. Reset it in a `createKampong` wrapper.
- `fwRocket(from, to, opts)`: a rocket image with a sparkle trail tweening from `from` to `to`. `opts.arc` (pixels) bends the path through a quadratic curve, giving low, sideways stray rockets. At the end it bursts: emitter explode, a `glow` flash, `boom14`, and a chance of `crackle14`. Options: `opts.grand`, `opts.small` (half size), and `opts.onBurst(x, y)`.
- `fwShow(n, opts, done)`: the celebration show (Chapter 14's ending and Amin's nightly show).

**Stray rockets (Chapter 15):** from just below the lane gate (32,2), `arc` 30–60 px, aimed at a target's roof point, `small: true`. `onBurst` lights or raises that target's fire, adds a small shake (`cameras.main.shake(120, 0.002)`), and shows an "!" `floatText` over the nearest villager.

### 5.3 Fire targets in Kampung Tepian

Check the ids and positions with a quick dump first; a recent Codex commit moved things in other places.

- Small fires (step 3):
  - `k_bengkel` (Tukang Leong's workshop, 21,4, 5×3)
  - `k_pondok` (Pak Mat's hut, 27,21, 4×3)
  - `k_kedai` (Abang Zul's bicycle shop, 39,14, 4×2)
  - two new chapter-only **haystacks** (`k_jerami15a`, `k_jerami15b`, `type: 'bldg'`, `keep: true`, `when: 1 <= step <= 8`) on free tiles near the plots. Check the tiles with a map dump; trees keep clear of `keep` objects.
- The big fire (step 4): `k_penghulu_house` (3,2, 5×6).
- Never `k_masjid`, `k_shrine` or the gelanggang `k_pesta`.

### 5.4 Fire on the houses: the animation

Per burning target (`this.fires[id] = { level, flames: [], glow, light, smokeT, growT }`):

- **Flames:** `api15_0`..`api15_3`, 12×18, animation `api15` at about 10 fps. Start each on a random frame with a random flipX.
  - Count by level: 1 → 2 flames, 2 → 4, 3 → 6.
  - Scale: 0.8 / 1.05 / 1.3, plus a small random jitter.
  - Position: along the roof. With `b = this.objImgs[id].getBounds()`, use x across `b.x + b.width*0.15 .. b.right - b.width*0.15` and y across `b.y + b.height*0.12 .. b.y + b.height*0.4`. Depth = the image's depth + 1, origin (0.5, 1).
  - Each flame: a tiny yoyo `scaleY` tween (±12%, 180–260 ms) so the flames lick upwards.
- **Glow:** a `glow` image, ADD, tint `0xff7a2a`, over the fire's centre. Scale 1.2 / 1.8 / 2.4 by level. Each frame, alpha = `0.35 + 0.15*sin(t/90) + random*0.08` (the flicker). At night, also `this.addLight(x, y, 0xff8040, 0.9, true)`, as enemies' lights do (see `spawnEnemy` in `src/scenes/WorldCombat.js`).
- **Smoke:** every 0.25 s, `this.fx.smoke.explode(1–2, x, roofTop)`, tinted dark grey for burning and white for steam.
- **Embers:** a small `px` emitter tinted `[0xffb040, 0xff5020]`, `gravityY: -30`, speed 10–30, lifespan 900, about 3 per 0.2 s per fire.
- **Soot:** `hangus15_0..2` dark patches drawn at the flame spots once a fire has burned more than 4 s. They stay until the rain finale, fade to 50% in the rain, and are cleared when the chapter ends ("the kampung repairs the roofs").
- **Growth:** every 25 s that a fire is not being doused (and the game is not blocked), its level goes up one, to a maximum of 3. A level-3 small fire **does not** spread to new buildings; it only relights a neighbouring haystack if that one is out. Cap: 6 burning things at once.
- **Douse feedback:**
  - Each splash: `fx.drop.explode(10, x, y)`, a white steam puff, a `sizzle15` sound, one flame fades out, `floatText('Sssss!')`.
  - When a fire is out: a big steam puff, a sparkle, the target's soot stays, and a toast such as "Pak Mat's hut is safe!".
- **Performance:** at most 6 fires × 6 flames, one emitter shared for embers, smoke capped. Use `LC.Display.effectCount` for particle counts and keep the phone frame rate smooth.

### 5.5 Putting fires out

- **Watering can:** wrap `toolAction` (`src/scenes/World.js`, around line 1136; the can's branch is around lines 1170–1172). When the faced tile belongs to a burning target, return `{ label: 'Douse the fire', fn }`. Each splash uses 1 `S.water`, and a fire has hit points `level × 2`.
  - Empty can: the hint "The gembor is empty. Refill it at the well or the river." (the existing text).
  - Refills work as now: the well `k_well` (19,15) and the river.
- **Tap to use:** `WorldTap.js` runs `getAction()` with `this.tapFace`, so the `toolAction` wrapper works with taps automatically. Make sure the glow markers (`updateTapMarks`) show on burning targets, with the label shown.
- **Naga Kecil's water jet:** wrap `nagaJet` (`src/scenes/WorldNaga.js`, around line 76). A jet that reaches a burning target's tiles counts as 2 splashes.
- **The bucket line (step 4):**
  - A UI modal built with `gameFrame`/`runGame` (`src/scenes/UIGames.js`, around lines 16–36). Copy the timing approach of the perahu race (`playPerahuRace` in `src/scenes/UIBarunaiActivities.js`).
  - The picture: five villagers in a row from the river to the house; a bucket travels along the row; your hands are the last pair.
  - Press E, Space or tap when the bucket reaches your hands (window ±0.12 s). 20 buckets, the tempo rising slightly. Each catch lowers the big fire.
  - Win with 14 catches. Jusoh fumbles one bucket as a gag (it doesn't count against you).
  - After winning, the big fire goes out in the world, with steam and cheers.

### 5.6 Panicking villagers (step 5)

- Five actor sprites (not `this.npcs`) using existing textures:
  - Jusoh, Cikgu Bahar and Amin (`npc14_*`, from `art27.js`)
  - Pak Mat and Abang Zul (their kampung textures; find the keys from `LC.VILLAGERS`)
- Each runs around in the haze at about 55 px/s, changing direction every 0.6–1.2 s and avoiding `this.solid`, with a "!" or "Tolong!" (Help!) `floatText` now and then.
- **Calm one:** wrap `getAction`. If an uncalmed actor is within about 18 px of the faced point (`this.facing()` returns `{ fx, fy }`), return `{ label: 'Calm ' + name, fn }`. This also works with tap-to-use.
- **Lagu Mayang:** wrap `laguKey` (`src/scenes/WorldMayang.js`, around line 589) so that, after the base call, it calms every actor within `LC.C9.lagu.r`.
- A calmed actor shows a short line, then walks to a spot on the gelanggang (14–18, 19–20) and stands there. Save `q.c15calm[who] = true` immediately.
- Gags: Jusoh's calm line is "I'm calm! I'm calm! Is the coconut tree on fire? No? Then I'm calm." Cikgu Bahar: "Fine particulate matter! PM2.5! Masks on, everyone!"

### 5.7 Si Bara in the banana grove (area `senah`, step 7)

- The crate `peti15` sits by the banana grove (around `C14.pisang`; check free tiles), with four fuse objects `sn_sumbu15_0..3` around it (`sumbu15_lit` / `sumbu15_out`, 2 frames each).
- Si Bara sits on the crate: `sibara15_0..3` (flicker), later `sibara15_sad_0..1`.
- Every 3 s he lights a rocket that flies towards where the player is standing. Show a red dashed line first (0.8 s), as the Bakunawa lunge does in `WorldSulu.js`, then the rocket flies along it. A hit costs no health: it knocks you back 24 px and spills 1 water ("Your gembor sloshes!"). Keep it friendly.
- Douse each lit fuse with the can (1 splash). The tempayan `sn_tempayan` refills the can while this step is on (add a 'Fill the gembor' action).
- After the 4th fuse: save step 8 first, then the dialogue. Pelita's light shows him the scorched roofs; he cries steam (a white puff loop); his story.
- Afterwards Si Bara floats beside Pelita (a small actor following the ghost) until the finale.

### 5.8 The rain finale (step 8 → 9)

- At the gelanggang, all the calmed villagers are there. Talk to Tok Penghulu: save step 9 and the rewards, then the scene.
- **Rain:** set `this.raining = true; this.refreshRainDrops(); LC.Audio.setRain(true)`, the same as the monsoon in `src/scenes/WorldFarm.js` (around lines 32–42). A thunder rumble (`thunder11` exists), and a camera flash with low alpha.
- The haze images tween out over 3 s; any fires still burning go out with steam; the soot fades to 50%.
- The kenduri dialogue: Kak Senah's new rule; Jusoh: "That was rain on my face"; Si Bara bows to everyone.
- When you leave the area, `refreshSeason` puts the real weather back. From the next morning there are no soot overlays at all.

## 6. Art (`art28.js`, `generate28`)

| Key | Size | Notes |
|---|---|---|
| `api15_0..3` | 12×18 | Flame frames: dark red base, orange body, yellow inner, white-yellow core; the tips move between frames. No outline, so it looks bright. Animation `api15`. |
| `hangus15_0..2` | 20×10 | Soot patches, irregular, `#2a2018` with a few ember dots. |
| `stim15` | 10×10 | A soft white steam puff (or reuse `smoke` tinted white). |
| `jerami15` | 24×20 | A haystack (straw dome, darker bands). Used for `k_jerami15a/b`. |
| `peti15` | 20×16 | A wooden crate with rocket sticks poking out; `peti15_open` with the lid off. |
| `sumbu15_lit_0/1`, `sumbu15_out` | 8×12 | A fuse with a spark (2 frames) / smoking out. |
| `sibara15_0..3` | 16×18 | Si Bara: a round ember body (deep orange, a yellow core glow), big glowing eyes, tiny stubby arms, flickering flame hair. |
| `sibara15_sad_0/1` | 16×18 | Droopy flame hair, a blue-white steam tear. |
| `i_topeng_jerebu` | 16×16 | A pale blue face mask with ear loops. |
| `tapak15` | 8×10 | A glowing footprint (orange). Reuse `drawTapak` from `src/art20.js` if it fits. |

Si Bara's dialogue portrait: `LC.SPEAKERS.sibara15 = { name: 'Si Bara', portrait: 'sibara15_0' }`.

## 7. Sounds (in the `LC.Audio.sfx` wrapper)

- `fire15`: a crackling loop. Play `noise` bursts every 0.3–0.5 s while any fire burns, quieter when far.
- `sizzle15`: highpass noise falling.
- `whoosh15`: a fire flaring.
- Reuse `whizz14`, `boom14` and `crackle14` for the rockets, and `thunder11` for the rain.

## 8. Text outline (write it in the house style: short lines, a little Malay, kind humour)

- **Step 1, Tok Penghulu:** the haze; stay in, masks on. Kak Senah locks the crate: "These are for the next Pesta. Nobody touches them!"
- **Step 2, the attack:** *whistle... BANG!* "The crate is open!" Jusoh: "THE GHOST IS BACK!" Tok Imam: "No. Fire. Fetch water, all of you!"
- **Step 4:** Tok Penghulu organises the bucket line: "Every hand from the river to the house!"
- **Step 5:** the panic lines (section 5.6); Tok Imam gathers people at the gelanggang.
- **Step 6:** Pelita notices the glowing footprints: "(Pelita points: the same banana grove...)"
- **Step 7, Si Bara's story:** "My forest burned... I followed the smoke... the little fires in the sky looked like friends... everyone cheered... I wanted you to cheer again." Then, seeing the roofs: "I didn't want anyone to lose their home too."
- **Step 8, the finale:** Kak Senah's rule: "Bunga api only with grown-ups, far from the roofs, and always with a bucket of water nearby!" Si Bara: "Can I stay somewhere fire is welcome?" Nenek's dapur, of course.

## 9. Rewards

- `q.siBara = 1`: Si Bara becomes a farm friend. Object `f_sibara15` on Nenek's dapur (find the farm dapur object, `type: 'dapur'`) with `when: ch15 done`, animated in an update wrapper; talking gives a random cheerful line.
- **Blessing:** `LC.cookBatch = function (S) { return ((S.house || 0) >= 2 ? 5 : 1) * (S.quests && S.quests.siBara ? 2 : 1); }`, used by the dapur (section 3).
- `topeng_jerebu` (given at step 1; it stays useful in any future haze), 1000 kepeng, and XP: chapter steps already give XP through `level.js`.
- Si Bara's blessing line belongs in Journal > You or the stats "Abilities" list.

## 10. UI

- **Goal lines per step** (wrap `LC.ch5Goal`, as `UISenah.js` does). Include counts: "Fires out: 2 / 5", "Calmed: 3 / 5".
- **Fire counter** during steps 3–4: a small pinned label under the goal ("Fires: 3 burning"; no emoji, since the pixel font may not draw it), pinned with `this.pin` and calling `layout()` if added late.
- **Checklist:** `{ n: 15, key: 'ch15', end: 9, name: 'Jerebu dan Bunga Api', steps: ['Rest at the farm', 'The orange sky', 'Night of rockets', 'Put out the fires', 'The bucket line', 'Calm the panic', 'The trail of sparks', 'Si Bara', 'The first rain'] }`.
- **News:** `LC.NEWS = { id: 'v3.15-ch15', ... }`. Two lines: what happened, and where to start ("after Chapter 14, rest at the farm").

## 11. Edge cases to cover

- Leaving Kampung Tepian with fires burning, then returning: rebuild the fires from `q.c15fires`.
- Passing out at midnight during step 3: fires persist; rockets resume the next night after 8 PM.
- Daytime during step 3: the fires still burn (the haze keeps it dim), but no new rockets come.
- Co-op guests: the chapter is personal (`quests` travels in the guest bag), and fire and haze visuals are local to each device.
- Low effects: fewer flames (2/3/4), fewer haze images, no embers.
- Phones (844×390): the fire counter and goal must not cover the joystick or the hotbar. Tap-to-use on fires and on panicking villagers.
- The Chapter 14 fireworks still work after the refactor: ending show, the gag and Amin's nightly show.

## 12. Test plan

Use a browser script like `ch14test.mjs`: start a new game, set chapters up to 14 complete, then drive each step through `W.objectAction(o).fn()` or `getAction()`. Check:

1. Step 0 → 1 the next day; haze on in the farm, the kampung and `senah`; none in caves.
2. The step-1 talk gives the mask; the crate appears.
3. The night attack starts after 8 PM; fires appear on the expected targets; `q.c15fires` is saved.
4. Douse with the can: water drops by 1 per splash, the fire's level goes down, and a fire goes out. An empty can shows the hint. The Naga jet works.
5. Fires grow after 25 s; the cap holds; the masjid never burns.
6. Leave and return: the fires are restored.
7. The bucket game: a loss allows a retry; a win puts the big fire out.
8. The panic: calm by USE, by tap and by Lagu Mayang; calmed people walk to the gelanggang.
9. Si Bara: the telegraphed rockets knock you back with no damage; four fuses; the tempayan refills.
10. The rain finale: rain, the haze clears, the soot fades; rewards and `LC.cookBatch` doubles cooking; Si Bara is at the farm dapur.
11. Chapter 14's fireworks still work.
12. Screenshots: haze by day and at night, a burning house at levels 1 and 3, a douse, the bucket game, Si Bara, the rain. Look at each one.
13. No page errors (listen with `window.addEventListener('error')`).
