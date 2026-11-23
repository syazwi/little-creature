# Little Creature

*A cozy spirit-keeping farm game from the kampung.* Plays on PC (Windows, macOS, Linux) and Android.

Nenek has left you her stilt house by the river and a tiny spirit named **Pelita** living in the spirit house beside the stairs.
You farm by day, cook at the clay stove, and leave offerings so Pelita's light grows from a weak flicker into the **Guardian of the Kampung**.
As Pelita levels up, its light opens the way to the wider land: a riverside village to rebuild, a rainforest with a hidden Bunian village, a pearl island, a village beneath the waves (and a sunken ship, a sea queen's palace and Atlantis below it), a misty mountain with a haunted gold mine, and red dunes. There you fish, raise chickens, ducks and goats, compete at the weekly Pesta, build houses with the villagers, ride a bicycle, pray at the kampung masjid, train your strength, fight the shadows of the mine, and befriend spirits from Southeast Asian folklore. The seasons turn every week, from the planting rains to the fruit season, the dry season and the monsoon. Once Pelita becomes a Legend, the story carries on: Chapter 2 brings fourteen brothers together to found Barunai, and Chapter 3 builds Kampong Ayer, the water village, where two roosters become legends, a jinn is beaten, and Pelita shows you the city in 1521 and 1578. In Chapter 4, red sails come for Pelita, and the whole kampung stands together. In Chapter 5, the witch Mak Lampir and her shadow come for Pelita, and you sail to Java to save it. In Chapter 6, Nenek comes home at last, and you climb Gunung Ledang with Hang Tuah to break the witch's last spell.

## Play it

### On a computer: double-click and play
- **Easiest:** download [`dist/LittleCreature.html`](dist/LittleCreature.html). It is **one file** containing the whole game. Copy it anywhere (a USB stick, another PC) and double-click it to open it in any browser. No install and no internet needed.
- **Or:** download this whole repository (**Code → Download ZIP**), unzip it, and double-click **`index.html`**. (`index.html` needs the folders next to it, so to copy just one file, use `dist/LittleCreature.html`.)
- The game fills the whole browser window at any size. Press **F** (or use the pause menu) to go fullscreen.
- Saves are kept by the browser on that PC. A different PC or browser starts its own farm. There are **three save slots**: see [Saving and loading](#saving-and-loading).
- **Testing build:** [`dist/LittleCreature_full.html`](dist/LittleCreature_full.html) starts with everything unlocked (you at Lv 30 with strength 216, Pelita Lv 30 with a 72-slot bag, Nenek's house fully grown, every place, spirit, weapon and vehicle, 99,999 kepeng, max strength, Sumpahan Batu and Restu Ibu, Badang already strong, 3 bubu). It uses its own saves, so your real farm is never touched. Test keys: **]** next day, **[** next season, **\** next Pesta, **H** full health (and abilities ready), **T** replay Si Tanggang's story (switch between "before the reunion" and "reunited"), **-** (minus) replay Badang's story (switch between "skinny, on the night watch" and "the strongest man in the land"; this was **B** before v2.5), **K** jump to the next step of Chapter 2, **;** (semicolon) jump to the next step of Chapter 3, parts 1 and 2 (it finishes Chapter 2 first; this was **L** before v2.7), **O** jump to the next step (or battle wave) of Chapter 4 (it finishes Chapters 2 and 3 first), **P** jump to the next step of Chapter 5 (it finishes Chapters 2, 3 and 4 first), **Y** jump to the next step of Chapter 6 (it finishes Chapters 2 to 5 first), **Z** Nek Lampir the helper (switch between "unlocked, press C" and "10 hearts, ready to make peace with Nenek"; it finishes Chapter 6 first), **0** (zero) jump to the next step of Chapter 7 (it finishes Chapter 6 first; at the end, Sang Bualang and Angin Bualang are yours), **=** jump to the next step of Chapter 8 (it finishes Chapter 7 first; at the end, Naga Kecil can carry you), **`** (backquote, left of 1) jump to the next step of Chapter 9 (it finishes Chapter 8 first; at the end, Lagu Mayang is yours), **'** (apostrophe) jump to the next step of Chapter 10 (it finishes Chapter 9 first; at the end, Pelita comes home and the Sumpit is yours), **/** (slash) jump to the next step of Chapter 11 (it finishes Chapters 2 to 10 first; parts 1 and 2). The test build also starts with the Sumpit.
- If double-clicking opens the file in something other than a browser, right-click it and choose **Open with → Microsoft Edge** (or Chrome or Firefox).

Both standalone testing files include **Developer Tools**. Use **Jump to chapter** to test any of Chapters 1–13 with the earlier rewards in Slot 4. **Start autoplay** plays from the selected chapter through the ending. The player moves, sails, talks, fights, and plays story minigames at 1×, 2×, or 4× movement speed. Developer supplies and faster early bonding shorten preparation for quests. **Stop and play** hands over control at the current position and quest step. [LittleCreature_developer.html](dist/LittleCreature_developer.html) offers unlimited kepeng and keeps saves separate from the full testing edition.

### On an Android phone
1. On your phone, open [`dist/LittleCreature.apk`](dist/LittleCreature.apk) on GitHub and tap **Download** (the ⋯ / download button).
2. Open the downloaded file. If Android asks, allow your browser or Files app to **install unknown apps**.
3. Tap **Install**, then open **Little Creature**. It plays fullscreen in landscape and fully offline. The game fills the whole screen, edge to edge (including beside the camera notch), and the HUD stays clear of the notch.

> Android may warn that the app isn't from the Play Store. That's normal for apps you install yourself.
> If you already have an older version installed, installing the new APK updates it and keeps your save.

### On an iPhone or iPad (v2.4.2)
Apple does not let iPhones install an app file the way Android installs an APK, so on an iPhone the game is a **Home Screen web app**. It plays like the Android app: its own icon, fullscreen, landscape, offline, and the screen stays on.

**Once, for whoever owns this repo:** in GitHub, open the repo's **Settings → Pages**, under "Build and deployment" choose **Deploy from a branch**, pick **`main`** and **`/ (root)`**, and **Save**. After a minute or two the game is online at `https://<your-username>.github.io/little-creature/` (for this repo, https://syazwi.github.io/little-creature/).

**On the iPhone:**
1. Open that link in **Safari**, with internet. The title screen shows a green box with these steps.
2. Tap **Share** (on newer iPhones it is under the **⋯** button first), then **Add to Home Screen**, then **Add**.
3. Open **Little Creature** from the Home Screen. Wait for the title screen once with internet: after that it starts straight away and plays offline.

> - The farm in the Home Screen app is its own save, separate from Safari's (always play from the icon). Deleting the icon deletes its save, just as uninstalling the Android app does.
> - If it stays upright, turn off **Portrait Orientation Lock** in Control Center (swipe down from the top-right corner). A web app cannot turn itself sideways while the lock is on.
> - No sound? Check the ring/silent switch (or Action button): iPhones mute game sound in silent mode.
> - Co-op works between iPhones, Android phones and computers, as long as everyone has the same version.

### Updates
From v1.7.1 the game checks GitHub for a newer version whenever it starts with internet. The title screen shows your version and the date and time it was made (bottom-left).
- **When a newer version is out,** the title screen shows **"New version … is ready! (updated …)"** with that version's date and time, you get one reminder in the game, and **Pause → Updates** offers the download. Pause → Updates can also check again at any time.
- **On Android,** tapping it downloads the new APK in your browser. Open it and tap **Install**: it installs over the old app and keeps your farm. (Android always asks you to confirm an install, so updates can't happen completely by themselves.)
- **On an iPhone** (the Home Screen app), the new version downloads by itself in the background and is used from the next start. If the title screen says one is ready, tap it: the game restarts on the new version, and your farm is kept.
- **On a computer,** it opens the new HTML file's GitHub page. Download it and put it in place of the old file (same name, same folder) so your saves carry over.
- Without internet, nothing changes: the game just plays as usual.
- For whoever publishes: `tools/build.ps1` writes the version (from `android/app/build.gradle`) and the build time into `src/version.js` and `dist/version.json`, and stamps `sw.js` with the build and the list of files. Bump `versionCode`, build, and push: players see the update once `dist/version.json` is on GitHub (iPhones: once GitHub Pages has published it, a minute or two later).

### With friends (co-op, up to 4 players)
PC browsers and Android phones can all play together.

1. **One player hosts.** On the title screen choose **Play with Friends**, type your name, **pick which of your saved farms to open** (slot 1, 2 or 3, or a new farm), and press **Open my farm**. You can also pick **Invite friends** in the pause menu while you're playing. You get a **5-letter code**. It's also shown at the top of the screen and in the pause menu.
2. **Friends join.** Each friend chooses **Play with Friends**, types their name and **your code**, and presses **Join farm**.
3. Everyone walks around the same farm in a different-coloured outfit, with name tags.

| Shared by everyone | Your own (kept on your device) |
|---|---|
| Fields, crops, trees, forage spots, the clock and the day | Bag, hotbar and kepeng |
| Farm animals, eggs in the nest, storage chests and what is in them | Strength, health, the Bunian glasses, Pesta trophies, Si Tanggang's and Badang's stories, and your abilities |
| Pelita (feeding, petting, offerings, bond, levels, growth) | Energy and watering can |
| Houses built in the kampung, spirits befriended, the land Badang clears, Nenek's house, the helpers and the pantry | Villager friendship and requests, your fish log, your bubu, your bike, your prayers at the masjid, Badang at your side |
| | Cooking, crafting, fishing, and buying or selling |

- **Give a friend something (v2.4.3).** Stand next to a friend, open your **Bag**, pick the item and press **Give a friend** (or **G**). Choose who (when several friends are close) and how many: 1 or the whole stack. It flies over to their bag. If their bag is full, it comes back to you. Tools you need (cangkul, gembor, joran and the like) stay with you. Storage chests are shared too, for friends who are far away.
- Friends can explore different places at the same time. You see each other when you are in the same place.
- **Places you have built look the same for everyone (v2.7.2).** Each player's story is their own, but what a story builds shows for everyone playing together: the water village of Barunai and its walkways, the Kampong Ayer workshops, new homes and craftspeople, the golden bridge on Gunung Ledang, and the brick path to the old tower. If any player here has built it, everyone sees it (and nobody walks on water any more). A house plot only a friend has opened is theirs: you can look, but not build.
- Pelita follows whoever fed or petted it last, even into another place. Your spirit companion is visible to friends too.
- **Only the host ends the day.** When the host sleeps, everyone sleeps (wherever they are, they wake up at the farm) and sees the day summary. A friend can use the house to tell the host they're sleepy.
- The host's farm is saved on the host's device, in the slot it was opened from. A friend's bag (with kepeng, strength and quests) goes home with them, so they can bring it to the next session and carry on.
- **Saving and loading together.** When the host saves (pause menu → **Save game**), every friend's bag is saved too. When the host loads a farm (pause menu → **Load game**), everyone is taken to the loaded farm and keeps their own bag. Friends can also save their bag any time (pause menu → **Save my bag**).
- Co-op needs internet. Friends connect directly to each other (WebRTC, via [PeerJS](https://peerjs.com)). Solo play stays fully offline.

## Controls

| Action | Keyboard | Touch (phone/tablet) |
|---|---|---|
| Move | WASD / Arrow keys | Drag anywhere on the left side (floating joystick) |
| Interact / use item | E / Space / Enter | **USE** button (glows gold when something can be done), or **tap the thing itself** (v3.9) |
| Select hotbar slot | 1 – 9, mouse wheel | Tap a slot |
| Eat the selected food | X | **EAT** button |
| Bag (and **Throw away**) | Tab / I (T or Delete throws the selected item away) | **BAG** button |
| Sort the bag by kind (from Pelita Lv 4) | In the bag: F (next kind), R (back), or click a picture above the backpack | Tap a picture above the backpack |
| Pause menu | Esc | **II** button (top), or Android **Back** |
| Answer in a conversation (when there's a choice) | Click a button, or A / D then E, or the number keys 1, 2, 3... | Tap a button |
| Close a menu, the bag or the map | Esc, or click the **X** in its top-right corner | Tap the big **X** in its top-right corner |
| Map (this place, and the whole land) | M | **MAP** button (top) |
| Music on/off | N | Pause menu |
| Volume of the music, battle music, sound effects and nature | Pause menu → **Sound & music** | Same |
| Save / load (3 slots) | Pause menu → **Save game** / **Load game** | Same |
| Font: the pixel font or a modern one | Pause menu → **Font** | Same |
| Fullscreen | F | Automatic (Android app, and phone browsers on the first tap) |
| Journal | J | Pause menu → Journal |
| How far along your chapter is, what to do now, how to reach the next chapter | Pause menu → **Chapter N: X%** | Same |
| Your stats, and your companions (send them home) | Pause menu → **My stats** / **Companions** | Same |
| Ride / get off (bicycle) | R | Select it in the hotbar and press **USE** |
| Ride Naga Kecil (after Chapter 8): under the sea, and anywhere a bicycle can go | R (under the sea, or holding the Seruling Naga) | Select the Seruling Naga and press **USE** |
| Put on / take off the Bunian glasses | G | Select them and press **USE** |
| Swing a weapon (wherever enemies roam); with the Sumpit (after Chapter 10), shoot a dart the way you face | E | **USE** |
| Steer the vinta at sea (Chapter 11): it turns towards where you point | WASD / Arrow keys | Drag on the left side |
| Stone curse (Sumpahan Batu, once you have it) | V | Tap the stone beside the hotbar |
| Magic: Mantera Suria (after Chapter 13, from Suraya) | K | Tap the sun above the hotbar |
| Giant stride (Langkah Semaun, Chapter 2) | Shift | Tap the footprints beside the hotbar |
| Call Nek Lampir (after Chapter 6); with her beside you in a fight, her green circle | C | Tap her face beside the hotbar |
| Call Sang Bualang (after Chapter 7); with him beside you in a fight, a spin at once | B | Tap the wau (kite) above the hotbar buttons |
| Angin Bualang, your gust (after Chapter 7) | U | Tap the gust button beside the wau |
| Lagu Mayang, the song that calms (after Chapter 9) | L | Tap the mayang button above the wau |
| Sing back the Ulek Mayang (Chapter 9) | 1 2 3 4 5 | Tap the lamps |

**Tap to use (v3.9).** On a phone or tablet, walk with the joystick, then just tap a person, Pelita, an animal, a crop or anything else within two steps of you: you turn to it and use it, exactly as if you faced it and pressed USE. Things you can tap glow softly at their feet. Tap something farther away and "Walk closer" appears. Tap an enemy to swing at it, and tap Pelita to pet it (or to feed it the food you hold). A press that drags still works the joystick, so walking is unchanged. It is on by default; Pause > **Tap to use** turns it off (the USE button always works). After the update, players see a one-time "What's new" note explaining it.

Touch controls switch on automatically on touch screens. You can toggle them in the pause menu, where **Sound & music** also sets the volume of the music, the battle music, the sound effects and the nature sounds.

## How to play

- **The masjid (v2.7.4).** Kampung Tepian has a masjid at its west end, by the river (a path runs down to it from the road; it is marked on both maps). At each of the five prayer times the **beduk** sounds and a reminder appears: **Subuh** 6:00 to 7:15 AM, **Zohor** 1:00 to 4:30 PM, **Asar** 4:30 to 7:15 PM, **Maghrib** 7:15 to 8:30 PM and **Isyak** 8:30 PM to midnight. Go to the masjid then and pray with the jemaah: **40% of your energy and all your health** come back. Pray **all five in one day** and the next day work tires you less (a quarter less energy). On **Jumaat**, Zohor is **Solat Jumaat**, and the kampung shares nasi lemak afterwards. Journal > You shows today's prayers; Pause > **Prayer times** turns the reminders off.
- **The pause menu is a grid (v2.7.3).** Esc (or II on a phone) opens tiles, four to a row, each with its own picture: Resume, Journal, Map, friends, Save, Load, sound, music, touch controls, fullscreen, updates, story settings, Controls and Quit. A switch shows its setting on the tile (On / Off); the chosen tile is explained in the box below. Choose with WASD or the arrow keys, or tap a tile.
- **What to do next (v2.7.2).** The goal line at the top-left always shows your current story task, with a short checklist under it of the parts still to do (have / need). The full checklist, with what opens the next chapter, is at the top of **Journal > Chapters**. In Chapter 2 a yellow arrow also points the way. Switch the arrow and the short checklist off in the pause menu (**Story helper**).
- **Farm.** Till the fenced field with the **Cangkul**, plant seeds, and water them with the **Gembor**. Refill it at the well or the river. Watered crops grow one stage per night. **Padi** grows only in the flooded sawah and needs no water.
- **The field grows with Pelita (v2.7.5).** It starts at 12 × 8 = **96 tiles**. At Pelita **Lv 4, 7, 10 and 13** it gains a strip (104, 112, 120, then **135 tiles**, 15 × 9); the new strip is ready the next morning. Journal > You shows its size and when it grows next.
- **Gather.** Banana trees, coconut palms and the mango tree regrow fruit every few days.
- **Cook.** Use **Nenek's Dapur** (the clay stove). Dishes fill Pelita far more than raw crops. Favourites are marked with a heart.
- **Offer.** Use the **spirit house**. Incense (*colok*), jasmine garlands (*phuang malai*) and flower trays (*canang*) raise Pelita's **Glow**.
- **Care.** Feed Pelita, pet it, and meet its **daily craving** (shown in its thought bubble).
- **Trade.** **Mak Ani's warung** on the east road (7 AM – 8 PM) sells seeds, colok and *air merah*, and buys your harvest.
- **How many? (v2.7.5).** Buying in any shop asks how many first: **−** and **+** (A / D), **±10** (W / S), **Max** (as many as your kepeng and bag allow, up to 99), then **Buy**.
- **The khemah (tent, v2.7.5).** From Pelita **Lv 6**, Mak Ani sells a **Khemah** (450 kepeng, one each). Hold it, face open ground two tiles wide and press USE to pitch it anywhere outdoors (not in the field, caves or under the sea). Use it to **sleep** and you wake up right there the next morning, or to **pack it up** back into your bag. Journal > You says where it is. On a friend's farm only the host ends the day, so guests can't pitch it there.
- **Everyone in plain sight (v2.7.6).** Mbak Dewi and Kak Mai now stand in front of their houses (not behind the roofs), Abang Zul in front of his bicycle shop, and Pak Mat and two of the brothers in Barunai beside the torches, not behind them. Trees no longer grow just in front of a villager. A chest that was on one of their new spots moves one step aside.
- **The deep of Lombong Puaka (v2.9).** The mine is twice as big: past the stone guardian, the old lift shaft leads down to the **lower workings**: a crystal grotto, a black pool, the miners' old camp, the gold hollow, a scorpion nest and a deep gallery, with richer gold seams, a second strongbox and more shadows. At the very end of the mine is an empty chamber with a cold draught... Put on the **Bunian glasses** there and a carved **hidden door** appears in the wall. Behind it, in **Bilik Rahsia** (the hidden vault), waits the secret boss, the **Puaka Emas**: it lunges, drops ore from the roof (step out of the shadow on the ground), calls the shadows of the mine at 70% and 40% of its health, and grows wild below 35%. Beat it (once a day) and the vault's chest opens: the first time **5,000 kepeng, the Mahkota Emas (a golden crown), 8 gold nuggets, 3 Batu Delima (rubies), 2 pearls and 3 crystals**; after that, 800–1,400 kepeng, gold, often a ruby and a rare treasure. Whatever does not fit in your bag stays in the chest. Dang Melur and Berbai buy the new treasures.
- **Laluan Gema.** At the old miners' camp in Lombong Puaka, take the stone arch into a side passage that shifts each season. Daylight fades into night as it does outdoors. Sleep in the tent beside the Echo Forge to wake up at the camp. A travelling merchant changes stalls and stock each season along the crystal route. Brave the gold workings for ore and **Batu Gema** (Echo Stone). The **Bunian glasses** reveal a seam with 2 gold nuggets and a Batu Delima. Both routes lead to **Sang Kelembai**. Hide behind the pillars when she speaks, then move in when she falls quiet. Your first win grants **+5 max health**, and each season's win earns another Batu Gema. Spend 2, then 3, then 4 stones at the **Echo Forge** by the entrance for up to **+3 damage to every weapon**. Co-op players explore the host's layout and earn their own rewards.
- **A blessing for each prayer (v2.8.3).** Besides energy and health, each prayer with the jemaah at the masjid brings its own blessing: **Subuh**, *Rezeki pagi*: +15% kepeng on everything you earn that day; **Zohor**, *Rehat*: all your energy back; **Asar**, *Sihat*: your health slowly comes back until midnight; **Maghrib**, *Dilindungi*: enemies and night creatures do half damage until you wake; **Isyak**, *Berkat malam*: your crops may grow an extra day overnight. All five in a day still makes the next day's work lighter. Journal → You lists the blessings and which ones are with you now.
- **Chapter progress (v2.8.2).** The pause menu shows how far along your chapter you are, e.g. **Chapter 3: 42%**. Choose it for **Chapter Progress**: *To do now* (with a progress bar) lists the parts of your current step with ✓ and what you still need, and how to reach the next chapter; *All chapters* shows every chapter with its percentage (chapters not reached yet stay a secret). Each step counts the same, and the step you are on counts for the share of its parts already done; Chapter 1 is Pelita's bond on the way to Lv 20.
- **Spirit requests first at the dapur (v2.8.1).** Nenek's dapur opens on the cooking tab, and what the spirits are asking for is at the top, marked ✦: Pelita's craving today (or a note when the craving needs no cooking), then dishes a spirit you have met wishes for, then Pelita's favourites (♥).
- **Companions and your stats (v2.8).** Pause menu → **Companions** lists everyone travelling with you and what each one does for you, with a **Send home** button (spirit friends, Badang, Nek Lampir, Sang Bualang; Si Tanggang can wait in the sunken junk). You can bring a spirit friend along, or call Nek Lampir and Sang Bualang, from there too. Every spirit now helps while it travels with you: **Semangat Padi** +1 from every crop you harvest, **Orang Bunian** +1 from every forage plant and fruit tree, **Naga Kecil** a 1 in 3 chance of a second fish, **Kenyalang** you walk 15% faster, **Nuno sa Punso** tilling sometimes turns up kepeng; Si Tanggang quickens your step by 10%. Pause menu → **My stats** shows your health, energy, strength, attack, walking speed, kepeng, Pelita's level, bag, gembor, abilities, spirit friends and records.
- **Pelita sorts your bag (v2.7.9).** As Pelita levels up it learns to sort your bag: at **Lv 4** Tools, Seeds, Harvest and Meals, at **Lv 8** Fish and Offerings, at **Lv 11** Materials and Treasure. In the bag, tap a picture above the backpack (or press **F**) to see only that kind of thing; **All** shows everything again. Things of other kinds on the hotbar are dimmed, and you can still pick something up and swap it onto the hotbar.
- **Two fonts (v2.7.8).** Pause menu → **Font**: the pixel font that matches the art (the default), or a clean **Modern** font (your device's own). It switches at once and is remembered on this device.
- **Conversations with choices (v2.7.7).** When someone asks you something (Badang asking you to keep watch, sleeping in the guest house, saving over a slot...), the answers are **buttons** under the words: tap or click one, or press its number. The box grows to fit long speeches, so words never run into the buttons, and messages that pop up meanwhile appear above it. Menus, the bag and the map have a big **X** in the top-right corner to close them.
- **Nights.** If all three of Pelita's needs are 50 or more when you sleep, it rests content. If any is under 20, expect a prank.
- **Ahad.** Every 7th day is **Hungry Ghost Night**. Pelita gets hungry twice as fast, but all bond counts double.
- **Levels.** Every act of care gives Pelita bond. Pelita has **30 levels**. It evolves at Lv 3, 6, 9 and 12 (Flicker → Little Spirit → Lantern Spirit → Garden Spirit → Guardian), and most other levels bring a gift. Each evolution brings a blessing. The **Journal (J)** lists every level and its reward.

### The wider land (opens as Pelita levels up)
| Place | Pelita level | How to get there | What's there |
|---|---|---|---|
| **Kampung Tepian**, the village | Lv 2 | Road east from the farm | Villagers, house plots, Pak Mat's jetty |
| **Hutan Rimba**, the rainforest | Lv 3 | Trail north of the farm | Wood, rattan, mushrooms, herbs, durian, kancil, a forest pool |
| **Pulau Mutiara**, pearl island | Lv 5 | Row Nenek's sampan from the farm jetty | Nipa thatch, seashells (and pearls), coconuts, sea fishing, turtles |
| **Kampung Karang**, the village beneath the waves | Lv 5 + the Naga's friendship | Dive at the bubbles off the island's north-east shore | Sea folk, seaweed, sea cucumbers, giant clams, a shipwreck, a turtle to rescue, rubbish to clean up |
| **Kapal Karam**, inside the sunken junk | Lv 5 + the Naga's friendship | Swim into the shipwreck in Kampung Karang | The ghost of Si Tanggang, cargo, a captain's strongbox |
| **Kampung Bunian**, the hidden village | Lv 3 + the Bunian glasses | Wear the glasses by the giant tualang in the west of the rainforest | The Orang Bunian, a rare-goods stall, silat training, the keris in the stone |
| **Gunung Kabus**, the misty mountain | Lv 8 | Trail north through the rainforest | Tea terraces, strawberries, stone, a lake with golden carp |
| **Lombong Puaka**, the haunted gold mine | Lv 9 | The old mine shaft in Gunung Kabus | Darkness, shadows that attack, gold seams, cave crystals, a blind cave fish, the stone guardian; (v2.9) the lower workings, and a hidden door only the Bunian glasses show |
| **Istana Laut Selatan**, the Palace of the Southern Sea | Lv 12 | The green arch at the south of Kampung Karang | Kanjeng Ratu Kidul, the Queen of the Southern Sea, and her lady-in-waiting |
| **Kota Atlantis**, the sunken city | Lv 15 | The deep trench at the west of Kampung Karang | Poseidon on his throne, a scholar, marble ruins, amphorae and crystals |
| **Barunai**, Chapter 2 | Lv 20 | Nenek's perahu at the farm jetty | Awang Alak Betatar, Awang Semaun and their brothers, a camp, the tembadau, and later a water village on stilts |
| **Teluk Barunai**, the bay of the two roosters, Chapter 3 | Lv 20 + Chapter 3 | A perahu at Barunai's west jetty, after the great cockfight | Pulau Pilong-Pilongan (a rocky island with a ghost at night), Lumut Lunting (a sandbank with a stone rooster), shells, crabs |
| **Kampong Ayer** in 1521 and 1578, Chapter 3 part 2 | Chapter 3 | Pelita's stone lamp by the Balai in Barunai (only during those two steps) | The water city at its greatest: dozens of houses on stilts, Antonio's ship, elephants, the 1578 defence |
| **Bukit Pasir**, the red dunes | Lv 11 | Road east through the kampung | Dragon fruit, clay, buried old coins, an oasis, a Cham tower, Mak Thuy the potter, Pak Tam the dragon-fruit farmer |

Locked paths are blocked by vines, rockfall or sand until Pelita is strong enough. From Lv 7, wayside shrines take you home, and the spirit house sends you to any place you've visited.

- **Fishing.** Pak Mat gives you a **Joran** (fishing rod) the first time you meet him at the kampung jetty. Hold it, face any water and press USE. Wait for the bite, strike, then stop the marker in the green. Rivers, forest pools, the sea, the mountain lake and the oasis each have their own fish. Some bite best at night. Cook fish into *ikan bakar*, *asam pedas* and more. Later, Badang gives you **bubu** (bamboo fish traps): hold one, face the water and press USE to set it, and check it each morning for the fish that swam in overnight (you can tend 3).
- **Villagers.** Tok Penghulu (village head), Pak Mat (fisherman) and Tukang Leong (carpenter) live in the kampung. Each one has a request every day: fulfil it for kepeng and friendship, and Pelita gains bond too. Chat once a day for friendship. At 3, 6 and 10 hearts they give you a gift. Several also run a shop and buy goods for more than the warung pays.
- **Building houses (gotong-royong).** Bring materials and kepeng to one of the four empty plots in the kampung: *kayu* (wood, forest), *atap* (thatch, island), *batu* (stone, mountain) and *tanah liat* (clay, dunes). Tukang Leong sells them too. Choose a Pondok Buluh, Rumah Kayu or Rumah Batu. The whole village raises it overnight (or at once, once Badang is strong), and a family moves home: Cik Siti the herbalist, Auntie Lai the tea planter, Mbak Dewi the batik artist and Kak Mai the fruit trader. Each brings new requests and a shop.
- **Spirits of the land.** Five folk spirits wait to be befriended, one in each region: the Semangat Padi (rice soul, in the farm's sawah), the Orang Bunian (hidden forest folk), a young Naga (island shallows), the Kenyalang (hornbill messenger, mountain) and the Nuno sa Punso (mound spirit, dunes; mind your manners and say *tabi-tabi po*!). Grant a spirit's wish and it blesses you: more rice, forest gifts every morning, better fishing, +30 energy, or soil that grows crops even unwatered. Play with each one once a day, and choose one to travel with you as your companion.
- **Getting around.** **Abang Zul**, the kampung mechanic, sells a **basikal** (bicycle, 250 kepeng, about 1.75× walking speed). Press **R** to get on or off, or select it and press USE. The bicycle goes almost anywhere on land. You hop off by yourself to farm, fish or gather. Friends in co-op see your bike. (v2.7.4: the car was taken out of the game. If you had one, Abang Zul buys it back for 1,200 kepeng.)
- **Kampung Karang (under the sea).** Once you have befriended the young Naga on Pulau Mutiara, its blessing lets you breathe underwater. Dive at the ring of bubbles off the island. Down there:
  - **Tok Duyung**, the dugong elder, asks you to clean the reef. Collect rubbish and ghost nets, and he pays for every piece, with gifts at 10, 25 and 50.
  - **Nila**, the pearl diver, buys pearls, porcelain and old coins for more than anyone on land.
  - **Pak Ketam**, the crab merchant, runs the sea shop.
  - Gather seaweed, sea cucumbers (*gamat*) and giant clams (pearls!). Open the chest in the old trading-junk shipwreck for coins and antique porcelain. Free the sea turtle tangled in a net.
  - Cook *kerabu rumpai* (seaweed salad) and *agar-agar* (Pelita's new favourite).
  - Swim back up through the column of light.
- **Seasons.** Every 7 days the season turns (a 28-day year), shown in the top-left panel:
  - **Musim Menanam** (planting): seeds are 20% cheaper; *jagung* and *kangkung* grow.
  - **Musim Buah-buahan** (fruit season): the farm orchard's rambutan, manggis, duku and cempedak bear fruit, every fruit tree gives one extra, and *nanas* grows.
  - **Musim Kemarau** (dry season): kite weather, with double prizes for the kite fight. *Tembikai* (watermelon) and *jagung* grow.
  - **Musim Tengkujuh** (monsoon): it rains every day and the rain waters the whole field for you. River fish bite faster.
  - Seasonal seeds are sold at the warung in their season. Planted out of season, a crop simply rests until its season comes back.
- **Farm animals.** Nenek's old **reban** (coop) and goat pen are behind the house. **Pak Lah**, the poultry farmer in the kampung, gives you your first hen and sells ducks, Serama chickens and goats. Feed them daily (dedak or padi) at the reban, or hold the feed and face an animal. Fed hens and ducks lay eggs every night, and goats give milk every other day. Pet them for love: well-loved animals sometimes give double. **Grow more chickens:** put an egg in the nest and a hen hatches it after three nights; the chick grows up in three days (with a Serama in the coop, some chicks are Serama). Eggs and milk go into new dishes: *telur dadar*, *nasi goreng*, *kuih bahulu*, *telur masin*, *teh tarik*. Chicken for *ayam goreng* comes from the market. **Selling:** eggs and milk sell at Mak Ani's warung (Pak Lah pays more), and Mak Ani also sells hen and duck eggs. You can sell your farm animals too, at the warung or to Pak Lah, for half their price plus a bonus for love; they go to a good home on another farm (choose twice to confirm).
- **Storage chests.** Make a **Peti Kayu** (24 stacks) at the dapur's Craft tab from 10 kayu and 2 rotan, or buy one from Mak Ani. From Pelita Lv 10, the bigger carved **Peti Ukir** (48 stacks) too. Hold it, face open ground and press USE to place it. Everyone on the farm shares the chests.
- **Map (M).** "This place" shows a map of where you are: villagers, your chests, Pelita and the ways out. "The land" shows every place, which are open, and where you and Pelita are.
- **Mak Ani's new stall (Pelita Lv 10).** The warung grows into a *kedai runcit*: chests, compost (*baja*: a crop grows a day at once), *ais kacang*, offerings, and 10% more for everything you sell.
- **The Pesta (every Sabtu, 8 AM - 6 PM).** At the pavilion in Kampung Tepian, enter the contests, each once a week. Beat three rivals in a row to be champion:
  - **Wau Aduan** (kite fighting): tap to keep your string's tension in the green as the wind shifts, to cut your rival's string. Buy a *wau* from **Pak Wan**, the kite and top maker from Kelantan (the *wau bulan* is steadier).
  - **Gasing Uri** (top spinning): time the wind-up and the throw; the longest spin wins.
  - **Ratu Serama** (the Serama show): your bird's love and grooming (with a *sikat*) count for half, and its poses for the rest.
  - **Lempar Batu** (stone throwing, once Badang is strong): Badang throws, you cheer. Tap in time as he lifts, spins and throws; the longest throw wins. His friendship adds a little distance. The last rival is Benderang, a strongman from across the strait.
  - Prizes: kepeng for each round, and for the champion money, food or sometimes a rare treasure, plus a trophy the first time. Practise any day, for no prize.
- **Strength.** Lift the **batu angkat** (training stone) in the kampung once a day, train silat with Kesuma in the hidden village once a day, and eat home-cooked dishes (twice a day). Strength raises your health.
- **The Bunian's secret.** After you befriend the Orang Bunian in the forest, it asks for 3 *madu tualang* (wild honey from the bees' nests by the giant tualang trees), a *pengat durian* and 4 *melati*. Its gift is the **Bunian glasses**. Wear them by the oldest tualang in the west of the forest and a golden gate appears, leading to **Kampung Bunian**, a hidden village with more people: Tok Batin the elder, Dang Melur's rare goods (golden fruit, oil-less lamps, strength tonic) and Kesuma the silat master. In the middle of the village, a **keris** is stuck in a stone. With 60 strength you can draw it out.
- **Lombong Puaka, the haunted gold mine (Pelita Lv 9).** A cursed mine shaft in Gunung Kabus. It is dark (Pelita's glow helps), and shadows, ghost bats and giant centipedes attack you. A stone guardian waits in the guardian's hall, and past it the lower workings go twice as deep (v2.9). Hold a weapon and press USE to swing: a rattan staff (make it from 4 rotan, or buy it from Pak Wan), a *parang* (Tukang Leong), the keris, or the sea king's trident. Mine gold seams and crystals and fish the underground pool. Your health shows in the top-left panel, and food heals you. If it runs out you faint, wake up at home and drop half of your gold.
- **Battles in the wild.** Fighting is not just in the mine any more. **Wild boars** (*babi hutan*) roam the east of Hutan Rimba, **giant rock crabs** scuttle on Pulau Mutiara's beaches, **giant scorpions** hunt in the red dunes, **fire jellyfish** drift at the reef's edge in Kampung Karang, the drowned crew's **shadows** haunt the sunken junk, and a giant centipede lurks on the mountain. After dark, **shadows** come out in the forest and on the island, and **ghost bats** over the mountain; they melt away at dawn. The farm, the kampungs and the sea palaces are always safe.
  - Enemies **shiver and flash before they attack** (boars lower their heads and charge), so you can step aside or strike first.
  - Your weapon sweeps through the air, sparks fly, damage numbers pop up, and the screen flashes red when you are hit. **Battle music** (drums, gongs and a saron tune) rises when something hunts you and fades when the fight is over. Turn it down, or off, in **Sound & music**.
  - No weapon yet? The **cangkul** works as a weak one when something comes close.
- **Si Tanggang's last wish.** Once Si Tanggang is your friend (give him his mother's *selendang*, or reach 3 ♥), he gives you **Sumpahan Batu**, the stone curse: press **V** (or tap the stone beside your hotbar) and every enemy near you turns to stone for 4 seconds (bosses less). Stone cracks easily: your blows do **double damage**. It recharges in 15 seconds.
  - Then he tells you his last wish: to see his mother, whose ghost, **Mak Deruma**, still waits on the beach of Pulau Mutiara, watching the sea for his ship. Agree to guide him and he follows you out of the junk. Shadows of the old curse rise in Kampung Karang to drag him back: protect him, and swim up to the island. If you faint, or the night ends, he is pulled back to his ship and you can try again.
  - When mother and son meet, the curse breaks. Both of them **live again** and move to Kampung Tepian, by the river. Mak Deruma gives you **Restu Ibu**, a mother's blessing: **once a day, when your health runs out, you are healed fully and every enemy around you turns to stone.** Sumpahan Batu gets stronger too (6 seconds, wider, every 10 seconds).
- **Badang, the strongest man in the land** (from the old Malay tale in the *Sejarah Melayu*). You stay as you are: Badang is your friend, and he helps you.
  - **His empty bubu.** By the forest pool in Hutan Rimba you meet **Badang**, a poor, skinny farmhand. Every morning his fish traps are empty, except for fish bones and long, wet, green hairs. Agree to keep watch with him, and come back after dark (7 PM).
  - **The night watch.** A cheeky river **hantu** sits by the pool, giggling and eating his fish. Face it and press USE to grab its slippery beard: tap when the marker is in the green, three good grabs before it slips away twice. If it gets away it pops up somewhere else around the pool. Sumpahan Batu holds it perfectly still, so you catch it at once.
  - **The wish.** The hantu begs to be let go and offers a wish. Badang asks for strength, and has to swallow what the hantu coughs up (yes, really, just like in the legend). He becomes the **strongest man in the land**, moves to Kampung Tepian by the batu angkat, and gives you two of his old **bubu**.
  - **Once a day he comes along** (Talk → **Come with me today!**). He follows you everywhere on land and punches anything that threatens you, with big knockback. He can't swim deep, so he waits on the shore while you are under the sea. If you faint, he carries you home.
  - **Ladang Badang.** Huge stumps and boulders cover the land just south of Nenek's fenced field. For a feast (3 Nasi Lemak and 300 kepeng) Badang clears it in one night, and you wake up to a **new field** to till and plant. (It is always as wide as Nenek's field, and the fence between them comes down: one big field, up to 195 tiles.)
  - **Gotong-royong with a giant.** With Badang carrying the posts, new houses in the kampung are finished **at once** instead of overnight.
  - **Lempar Batu at the Pesta.** Cheer him on in the new stone-throwing contest. The first time he becomes champion, his last stone lands in the river, and it stays there: **Batu Badang**.
- **Deeper under the sea.**
  - **Kapal Karam:** swim into the sunken junk to meet the ghost of **Si Tanggang**, the proud son of the Malay legend, who wants to say sorry to his mother. Help him find her lost *selendang* (ask Tok Duyung) and he finds peace (then see above).
  - **Istana Laut Selatan (Pelita Lv 12):** the jade Palace of the Southern Sea, home of **Kanjeng Ratu Kidul**, the Queen of the Southern Sea from the Javanese legend of Nyi Roro Kidul. Bring her a royal gift of jasmine, and every sea forage gives you one extra.
  - **Kota Atlantis (Pelita Lv 15):** the sunken city of the old Greek tales, where **Poseidon** still sits on his throne. Bring him pearls, cave crystals and an *ikan emas* and he gives you his trident and +20 health.
- **Krathong.** Craft a krathong (banana, marigold and colok) at the spirit house, or buy one from Mbak Dewi. Float it on any water after dark for a big boost to Pelita's glow and bond.

### Nenek's house, helpers and a bigger bag (v1.8)
- **Nenek's house** now opens a menu (USE on the house): **Sleep**, the **pantry**, **helpers** and **Expand the house**.
- **Expand it in three stages.** Tukang Leong and the kampung build each one overnight (or at once, if Badang is strong):
  - **Serambi** (2,000 kepeng, 20 kayu, 10 atap): a verandah and the **Almari Dapur** pantry. Room for 1 helper.
  - **Rumah Tengah** (6,000 kepeng, 30 kayu, 15 batu, 15 atap): a middle room. The dapur cooks **up to 5 dishes at once**, +20 max energy. Room for 2 helpers.
  - **Rumah Dapur** (15,000 kepeng, 40 kayu, 20 batu, 10 tanah liat, 2 tempayan from Mak Thuy): a grand kitchen wing and carved golden gables, a bigger pantry (48 stacks), +20 more max energy. Room for all 5 helpers.
- **Hire helpers.** Hired helpers move around the farm during the day. Overnight work uses the pantry and appears in the morning report. A helper you can't pay takes the night off.
  - **Mak Som**, the cook (80 a day): cooks up to 5 dishes a night from the ingredients you leave in the pantry, the best ones she can.
  - **Pak Hamid**, the farmhand (70 a day): waters the whole field every night, harvests what is ripe, and replants it with seeds you leave in the pantry.
  - **Kak Nur**, the gatherer (50 a day): picks the ripe fruit on the farm and collects the eggs and milk from the reban.
  - **Kak Aini**, Pelita's caretaker (65 a day): makes or serves one meal from pantry supplies when Pelita is hungry, with its current craving first.
  - **Pak Idris**, the storekeeper (60 a day): sells surplus goods after the others finish. Use **Nenek's House → Pantry Sales** to choose each item and how much stock to keep.
- **A bigger bag.** It grows by a row of 9 slots at Pelita Lv 5, 10, 15, 20, 25 and 30 (from 18 up to 72). It scrolls with the big **more** buttons, the mouse wheel or the arrow keys.
- **Throw things away.** In the bag, select an item and press **Throw away** (or T / Delete). It asks first, and lets you throw away 1 or the whole stack. Your cangkul, gembor, fishing rod and special items can't be thrown away.
- **Pelita can reach Lv 30.** Levels 21-30 bring kepeng, max energy, gold, Bunian lamps, golden fruit, crystals and two more bag rows. At Lv 30 Pelita becomes the Spirit of the Land.
- **Menus on phones:** the **more** buttons beside every long list are now big and easy to tap, and each tap turns a whole page.
- **Bukit Pasir has people now.** **Mak Thuy**, a Cham potter by the old tower, shapes pots by hand from your clay (*periuk tanah*, clay lamps for Pelita, and the big *tempayan* water jars Nenek's kitchen wing needs). Help her restore the **brick path to the old tower** (8 tanah liat, 4 kayu and 3 of the old coins you dig up, for the elders' little shelf of old things by the door). **Pak Tam**, a dragon-fruit farmer, sells **dragon-fruit cuttings** to grow on your farm (in the hot and planting seasons), sells *jus buah naga*, and pays well for dragon fruit.

### Chapter 2: Barunai (v1.9)
Everything above is **Chapter 1**, and it stays exactly as it was. **Chapter 2** continues the same story on the same farm, once Pelita becomes a **Legend of the Kampung (Lv 20)**. It is based on the Bruneian epic *Syair Awang Semaun*, told with respect.
- **Nenek's second letter.** Pelita's light finds an old tin box in the roof. When Nenek was a girl she sailed to **Barunai** and met fourteen brothers who were searching for one another. She has left a **perahu** at the farm jetty for you.
- **The brothers' camp.** In Barunai, **Awang Alak Betatar** and the youngest, **Awang Semaun**, tell their story: their father, I-Pai Samaring, followed a *tembadau* (a wild ox) through thirteen villages, and in each one a son was born.
- **Gather the brothers.** Twelve brothers wait across the land: in Barunai, Kampung Tepian, Hutan Rimba, Pulau Mutiara, Gunung Kabus, Bukit Pasir and even on your farm. Each asks for a little something from home (wood, honey, herbs, shells, tea...), then sets off for Barunai. Awang Alak Betatar's Talk menu shows who is still missing, and where.
- **The tembadau trail.** Follow its hoofprints across the hills, then approach it gently. It leads you to a bend in the river.
- **"Baru nah!"** ("Now we have found it!"). All fourteen brothers gather on the riverbank and name the place: Barunai. Houses rise on stilts over the water, joined by long wooden walkways, with a great Balai on the hill. (+1000 kepeng) Now the brothers have shops and requests: Hapu Awang sells *ambuyat* and *kelupis*, and Pateh Berbai buys treasures.
- **Awang Semaun's voyage.** He sails to Johor to ask for a princess's hand for his brother, and is back the next day with **Tuan Puteri**. But her ship sank at the river mouth: follow **Si Pinggai**'s feathers along the walkways to find her bird, and dive where the bubbles rise to save her dowry chest.
- **The wedding kenduri.** Bring 5 cooked dishes for the feast. Semaun gives you **Langkah Semaun**, his giant stride: press **Shift** (or tap the footprints beside your hotbar) to leap a few steps forward, even past enemies (every 4 seconds).
- **A secret of the river.** On some quiet nights, a magic *tempayan* floats in the river of Barunai, with a treasure inside.
- The **Journal** has a new **Chapters** page that shows your progress, and the goal line at the top-left shows the current task.
- Left out on purpose, out of respect: the old wars of conquest, religion, and any present-day royal titles.
- **New in v2.7.1:** the brothers' **guest house** on the hill west of the camp: sleep there and you wake up in Barunai, not at home (handy while Awang Semaun is away in Johor). A yellow **guide arrow** points to the next thing to do (the next brother, the next hoofprint, the feathers, the chest, the guest house, Nenek's dapur for the kenduri...), and the goal line says which brother to find next and where to get what he asks for. The chapter's task now always shows in the goal line, even if you skipped the kampung's optional tasks (Pak Mat's fishing, Pak Lah's hen, building a house). Switch the arrow off in the pause menu.

### Chapter 3: Kampong Ayer, part 1 (v2.0)
**Chapter 3** begins once Chapter 2 is complete. It follows the history of **Kampong Ayer**, the water village of Brunei, and the Brunei Bay legend of the two roosters.
- **Why build on the water?** Pateh Berbai explains: the river is a road, fish swim under the floors, trading boats come right to the steps, and the floods cannot take what is already on the water.
- **Build the village, in three stages**, with Pateh Berbai. New materials: **nibong poles** (cut from the nibong palms on the hills of Barunai) and **belian ironwood** (it never rots in water: on the eastern hill of Barunai and in the oldest part of Hutan Rimba).
  1. **The craft quarter**: a double walkway with five workshops, and five new neighbours. **Wak Juru** the blacksmith tempers your blades (+1 damage with every weapon), **Dang Kemala** the brassmith lines your gembor with brass (+10 water) and sells brass jugs, **Mak Dayang** the weaver sells *kain tenunan*, **Pak Lajak** the boat builder runs a **water taxi** around the village (and builds you your own perahu, so it is free), and **Awang Kilau** the goldsmith makes a **golden plate** and pays well for gold.
  2. **The floating market**: every morning from 6 AM to 2 PM, two **padian** women paddle up to the landing by the west jetty with whatever is fresh that day.
  3. **New homes over the river**: five sets of empty pilings. Build a house on each, in one of three styles, and a family from the hills moves in (and you can restyle it later).
- **Kampong Pandai Besi.** Enter Wak Juru's smithy at the west end of the craft quarter. Compare weapon damage, reach and cooldown, then forge a Keris Pandai Besi, Pedang Barunai, Tombak Belian, Parang or Tongkat Rotan.
- **Kampong Ayer boat race.** Invite five rowers by talking to villagers in Barunai, then enter at the dock beside the floating market. The captains challenge each other at the lineup, during the run and at the finish. Time your strokes against Nyi Roro Kidul, Poseidon, Nek Lampir and Naga Ibu in five lanes with animated captains, paddles and wakes. A podium finish pays a prize once per day.
- **The fleet of Majapahit.** Forty ships with red and white sails. The King of Majapahit proposes a contest: his rooster **Asmara** against Barunai's best. If Asmara loses, Barunai pays no more tribute.
- **Train Mutiara** with **Awang Senuai**, Awang Alak Betatar's nephew: clap on the beat so the rooster jumps (once a day, three days).
- **The great cockfight.** Three bouts: tap when the marker is in the gold to help Mutiara feint, leap and crow (win two). There is no blood: Asmara loses his nerve and flies out over the sea, and where he falls, **Pulau Pilong-Pilongan** rises. In anger, the king curses Mutiara, who turns to stone on a little sandbank at the river mouth, **Lumut Lunting**. The king keeps his word: Barunai is free. (+3000 kepeng, 3 gold, 2 kain tenunan)
- **Teluk Barunai**, the bay of the two roosters: row out from the west jetty. Touch the stone rooster on Lumut Lunting and a stone feather comes loose. At night, a **ghost rooster** crows sadly on Pulau Pilong-Pilongan. Bring it a **golden plate** and **Mutiara's feather** to lay it to rest. **Asmara's blessing:** +15 max energy, and your hens sometimes lay an extra egg.

### Chapter 3: Kampong Ayer, part 2 (v2.1)
Part 2 follows straight on from part 1.
- **Bilanapura.** Awang Semaun brings bad news: a jinn has risen in the bay, raising storms and pulling boats under. He, his companion **Awang Jerambak** and **Damang Sari** have fought it for nine months, but their blades pass through it like smoke.
- **The old ogre.** **Tok Gergasi**, a huge but gentle ogre, lives by the cliffs on the west side of Gunung Kabus. He trades his **magic fish skin** for a good meal (3 Ikan Bakar, 4 Kelapa, 2 Ambuyat).
- **The battle.** Join the three heroes on Pulau Pilong-Pilongan and fight Bilanapura, a towering spirit of sea foam and storm cloud, while they strike beside you. Beat it and Jerambak gives you his father's armband: **+20 max health** (and 2000 kepeng).
- **Pelita's stone lamp.** An old stone lamp by the Balai lights up. Touch it and Pelita's light carries you into the future:
  - **1521, the Venice of the East.** Barunai has become a great city on the water. **Antonio**, a writer on the first voyage around the world, has just arrived. Show him the floating market, the brassmiths and the great hall on the hill (with silk-draped elephants outside), and he writes that the city is "like Venice". (+1500 kepeng and a page of his journal)
  - **1578, the defence of Kampong Ayer.** A fleet from Manila under Castilian flags attacks the city. With Pak Damit the cannon master: fire the brass **meriam** at the three warships (a timing game, two hits each), **put out the fires** on the roofs (fill your gembor from the river), **row three families to safety**, and **hold the walkways** (soldiers tumble into the river and swim back to their ships). Then a fever spreads in the invaders' camp and their fleet sails away. The city is rebuilt, house by house. (+5000 kepeng and a Lantaka, a little brass cannon)
- **Chapter 3 is complete.** No gore anywhere: the jinn dissolves into sea foam, and nobody is killed.

### Chapter 4: Layar Merah, "Red Sails" (v2.2)
Chapter 4 brings the story home, to Nenek's farm and Kampung Tepian. **Laksamana Kebo Taruna**, an admiral of Majapahit, never forgave the cockfight of Barunai: he believes Pelita's light cheated for Mutiara. Without his king's leave, he sails to take Pelita and make the kampung bow.
- **Red sails at dawn.** The day after Chapter 3, Asmara's crow turns into an alarm. Pak Mat at the kampung jetty has seen a fleet, and an envoy has read out the admiral's demand. Even Lumut Lunting is nearly under water.
- **Getting ready.** Tukang Leong builds a bamboo stockade by the kampung jetty (20 kayu, 10 batu, 6 rotan). Dang Kemala in Barunai casts two brass cannons (6 batu, 2500 kepeng). Awang Semaun promises that the brothers will come, and Badang offers to fight too. The Orang Bunian hide the children and elders, and the Naga circles the bay.
- **The night attack**, after 7 PM in Kampung Tepian, in four waves:
  1. Hold the kampung jetty, with Awang Semaun and Badang (or Awang Jerambak) fighting beside you.
  2. Burning arrows hit Nenek's farm: put out the fires on the house, the reban, the kandang, the dapur and the warung (fill your gembor at the well).
  3. Raiders creep up on the spirit house to take Pelita: drive them off. Then the Naga rises and spins the warships back out to sea.
  4. The admiral lands at Nenek's jetty: a boss fight. Sumpahan Batu holds him still for a moment.
- **The king.** The King of Majapahit sails in to stop his admiral. He apologises, thanks you for laying Asmara's ghost to rest, and orders the sailors to rebuild every burnt roof. He gives you the **Keris Majapahit** (the strongest blade in the game) and 6000 kepeng.
- **Peace and trade.** A **Majapahit trading jong** is now moored at Nenek's jetty. It sells batik, terracotta *celengan* piggy banks and jamu, and pays well for Bornean goods (kain tenunan, brass, belian, honey, nibong).
- No gore: soldiers drop their spears and run back to their boats, and the admiral ends up in the water. Majapahit itself stays honourable: one admiral goes rogue, and his king puts it right.

### Chapter 6: Puteri Gunung Ledang (v2.4)
Seventy years ago, a little girl from Borneo chased a lost light up **Gunung Ledang** while Mak Lampir was hunting it. The princess of the mountain sent the witch away, Hang Tuah carried the girl down on his back, and the light went home with her: that girl was Nenek, and the light was Pelita.
- **Nenek comes home.** A day after Chapter 5 she arrives by sampan, strong enough at last to visit. That night, Mak Lampir (still a bat) spends her last spell: Nenek falls into a sleep she cannot wake from. Her old diary tells the story of the mountain.
- **Gunung Ledang**, a misty mountain reached on the Majapahit jong: pines, a waterfall, the princess's pavilion over her stream, and bats and shadows on the path.
- **Hang Tuah**, the guardian of the mountain (legend says he never died), tests you in a friendly **silat duel**: land three touches before he lands three on you. Nobody gets hurt, and you can try again. He tells how he once carried the Sultan of Melaka's proposal to the princess, and her impossible answer. **Hang Jebat**, his old friend (in this telling they made peace instead of fighting to the death), offers an optional spar for +5 strength.
- **Puteri Gunung Ledang** asks for her old demands again, but paid by love instead of a king's gold: a **jar of happy tears** from the people who love Nenek (the Penghulu, Pak Mat, Pak Lah and Tukang Leong), a **bridge of gold and silver** over her stream (Leong builds it from 2 gold, 6 belian and 10 kayu for 3000 kepeng, and the whole kampung carries it up), and **3 young areca nuts** from the palms on the mountain. ("Seven trays of mosquito hearts? No, no.")
- **The Bunga Ledang.** When you reach for the flower, Mak Lampir attacks with the magic she has scraped together: violet curse circles under your feet (step out!), bats, and a spell that drinks the light. Hang Tuah fights beside you. Beaten, she has her black magic taken away by the princess, and becomes an ordinary old woman, **Nek Lampir**, who grows herbs on the lower slopes (and sells them, grumpily).
- **Nenek wakes**, and decides to stay on the farm for good: she is now a neighbour you can talk to every day. +15,000 kepeng in all and +20 max energy.
- No gore and no religion: the princess's cruellest old demand is never named, and the Sultan is only a proud king who learns to accept no.
- **Fixed in v2.5.1:** from v2.4 to v2.5, the princess of the mountain was called "Tuan Puteri" in her lines, and she had taken the place of Chapter 2's Tuan Puteri, who was missing from Barunai. Each princess has her own name and place again. Hearts you earned with the mountain princess stay with her (and Tuan Puteri keeps hers).

### Nek Lampir, your grumpy helper (v2.4.1)
After Chapter 6, the old witch grows herbs on the lower slopes of Gunung Ledang. Become her best friend (10 hearts: bring her kuih pandan and chat every day), then choose **Make peace with Nenek** in her Talk menu. She grumbles, teleports you both to the farm, and says sorry to Nenek (who laughs at her hair). After that, press **C** anywhere to call her.
- **Only you.** She will not come while another helper is with you (Badang, Hang Tuah, the brothers, Si Tanggang), while a co-op friend is in the same place, or under the sea ("I am NOT getting my hair wet"). If one turns up while she is there, she leaves in a huff. Pelita stays: she pretends not to see it.
- **She teleports.** She pops in beside you in a puff of smoke, and blinks away whenever an enemy gets close to her.
- **Serbuk Lada (pepper powder).** In a fight she throws pouches of pepper at anything that bites you: a little damage, and it sneezes and staggers back.
- **Bulatan Hijau (the green circle).** Press **C** again in a fight: a circle of crushed herbs appears at your feet for 8 seconds, and every blow hurts you half as much while you stand in it (ready again after 22 seconds).
- **Out of danger.** When your health falls below 30%, she grabs you by the collar and teleports you to the safest spot in the place (then rests 90 seconds).
- **A paid teleport.** With no fight around, calling her opens her service: she sends you to any place you have already been, for 200 kepeng (500 across the sea), then rests 2 minutes.
- She goes home by herself when there is nothing left to fight (or when you send her home), and needs 20 seconds before she will come again.

### The Four Trials of Kampung Bunian (v3.7)

The in-game clock pauses in Kampung Bunian and its trial rooms. Ask the gatekeeper in the southern courtyard about the Sea Creatures, Warrior Creatures, Magic Creatures, and Supernatural Creatures doors. Clear each room's minions and boss to earn items and kepeng every time, plus permanent max health or max energy on the first win. A defeat or retreat brings you back to the gatekeeper with your health and provisions restored. The gatekeeper holds prizes when your bag is full.

### Your level, your aura and magic (v3.12)

- **You have a level now (Lv 1 to 50), not only Pelita.** Earn XP by beating monsters (stronger ones give more; ones far below your level give less), finishing chapter steps, catching fish, training your strength and every level Pelita gains. A save from before v3.12 starts with the XP its adventures already earned.
- **Every level** raises your **strength limit by 4** (100 at Lv 1, 296 at Lv 50; it was always 100 before), and adds 1 max health and 1 max energy. A level-up also heals you. The top-left panel shows **Lv N** and a thin XP bar.
- **Monster levels** show above their heads, coloured by how they compare with you: grey (far weaker), green (weaker), white (a fair fight), orange (stronger) and red (far stronger). Bosses have a ★.
- **Pause > My stats** opens on a new **Me** page: your body wrapped in an **aura** (its colour comes from your strongest attribute, and it grows from a thin glow into flames as you get stronger), Pelita beside you, an octagon chart of eight attributes (Attack, Strength, Health, Energy, Speed, Spirit, Wisdom and Magic; red at the centre, green at the edge), and your level, title and XP. The old list is on the **My stats** tab.
- **Magic: Mantera Suria.** Once Chapter 13 is complete, speak to Suraya at Sekolah Mantera (the enchanted letter by the farmhouse takes you there) to learn it. Press **K** or tap the sun above the hotbar: a sun of light seeks the nearest foe (every 3 seconds). Its damage grows with your level; you cast two suns from Lv 15 and three from Lv 30.

### Chapter 13 — Jack Separaw and the School of Sorcery (v3.6)

After Storm Reef, read Jack’s enchanted letter at Nenek’s farm to visit Kampung Mantera. Train with Nek Lampir, defend the school against Suraya’s stone soldiers and illusions, and retrieve Batu Ikrar from the Collector’s sealed vault. Press **P** or tap the mirror to cast **Mantera Pantul**. Time it just before a bolt reaches you. The spell remains available after the chapter.

### Chapter 12 — Jack Separaw and the Kraken of Storm Reef (v3.5)

- After Chapter 11, talk to Jack Separaw on the east side of Nenek’s jetty. Take the vinta out to rescue three stranded fishing crews. Follow the Pedoman, steer clear of the waterspouts, and use **E** or **USE** when you close with the rival ship. Then board and win the fight on its deck.
- The enormous Kraken rises over the deck. Dodge its marked arm slams and strike its eye while Pelita illuminates it. Take the helm, bring the three crews aboard, and return to Jack at the farm jetty.
- The captured ship and upgraded **Pedoman** unlock free sailing from the jetty. Each compass signal leads to rare wreck salvage or a sea boss. **Treasure Hunter’s Luck** gives one bonus loot roll on a boss defeat. **Pause → Companions** lets you bring or dismiss Jack, who attacks nearby enemies.

### Chapter 11: Bulan dan Mutiara, "The Moon and the Pearls" (v3.3 - v3.4)
The user asked for the Sultan of Sulu, for Barunai and Sulu standing together against a foreign fleet, for a scene where you captain a ship on the open sea and find your way with a compass, and for a fight on a ship's deck. Part 1 (v3.3) is the sea and the serpent; Part 2 (v3.4) is 1578, the year of the Castilian War, when a fleet from Manila under Castilian flags fought Brunei, Sulu and Maguindanao. Sources: the Sultanate of Sulu (Lupah Sug), its pearls and its old ties to Brunei; the Sama Dilaut (Bajau) sea people and their navigators; the kulintang gongs; and the **Bakunawa**, the sea serpent of Philippine legend that swallows the moon in an eclipse until people bang gongs to make it spit the moon out. The Sultan is invented and lived long ago (no real sultan and no present-day claims), there is no religion, no group is shown as villains, and nobody is hurt for good.
- **The dark moon.** The night after Chapter 10, from 8 PM, the moon goes dark over the farm. The Bakunawa rises from the river and lunges at Pelita, who shines like a full moon, until a vinta (a boat with striped sails) races upriver with everyone aboard beating gongs. Old **Mbo' Arani**, a Sama Dilaut navigator, and his granddaughter **Dinda** take you to Sulu.
- **Lupah Sug.** The Astana on the hill (carved with okir), the gong hall, the market, and a village of houses on stilts over the lagoon. The **Sultan of Sulu** explains: the Bakunawa swallowed his heirloom pearls, the **Mutiara Kembar**, that shine like two little moons.
- **Ready the vinta.** Learn the **kulintang** with **Mak Jaliha** (she plays a phrase on five gongs, you play it back: keys 1-5 or tap), dive with Dinda to an old sunken boat on the reef for the **batu berani** (a lodestone) so Mbo' Arani can make a **pedoman** (a compass), and bring **2 Tiyula Itum** for the crew (Mak Salma at the market sells it; or cook it: chicken meat, kelapa and herba). The reef also has pearl oysters.
- **Captain of the vinta.** Take the helm at the jetty and sail the open Sulu Sea yourself: the vinta turns towards where you point (WASD, or drag on a phone) and runs fastest with the wind behind it. The **pedoman** (top right) shows your heading in Malay (Utara, Timur Laut, Timur, Tenggara, Selatan, Barat Daya, Barat, Barat Laut) and the wind. The old chart: from the harbour **Timur Laut** to Batu Kembar, **Timur** through a fog bank where only the pedoman knows the way, then **Selatan** through the black water to **Pulau Bulan**, the island with no shadow. Reefs bump the hull, whirlpools spin you round and fling you out, and a squall brings rain, lightning and gusts. Wind streaks, whitecaps, wake and spray, sea birds riding the wind.
- **The Bakunawa.** On Pulau Bulan it circles under the water, lunges at you near the shore (a red line warns you) and raises water spouts (step out of the circles). Strike all three **agung** gongs while they still ring and it rears up, dazed: only then can it be struck. Beaten, it spits out the pearls. It is lonely: once the sky had seven moons, and everything it swallows goes dark. Pelita gives it a little light of its own, and it swims home with it.
- **Part 1 rewards:** the vinta is yours (sail the Sulu Sea any time from the jetty of Lupah Sug; the Bakunawa still circles Pulau Bulan, friendly now), 12,000 kepeng, 3 pearls, five new friends (the Sultan, Mbo' Arani, Dinda, Mak Jaliha and Mak Salma, who sells Tiyula Itum and Panyalam), and two new recipes. The jong at the farm jetty sails to Lupah Sug.
- **Part 2: two kingdoms, one sea (1578).** The day after Part 1, Pelita glows like old brass, and **Pelita's stone lamp** in Barunai opens on Kampong Ayer just after the defence of Chapter 3. **Panglima Lela**, an envoy from Sulu, brings one of the Mutiara Kembar as a token: the fleet that left Kampong Ayer has turned towards Sulu. **Pak Damit**: Barunai stands with Sulu.
- **Captain of two fleets.** Take the helm of the lead vinta: the perahu of Barunai (yellow sails) and the vintas of Sulu (striped sails) follow you in a V. North-east to Batu Kembar, then into the fog, where you find the galleons by their ships' bells (louder the closer you are). Let Pelita's light fade at the harbour to go home at any time.
- **The anchor ropes.** Dive beside the flagship and cut its three anchor ropes in the dark, while lantern light from the decks sweeps the water: stay in the light too long and a sailor spots you (you swim back to the start; nobody is hurt). In the night the current carries the galleons onto the reef.
- **Gongs across the water.** Play Mak Jaliha's signal on the kulintang and both fleets close in and surround the galleons. Then **board the flagship**: you and your allies swing across on ropes. The deck rolls, two waves of sailors come at you (they tumble overboard and swim for their boats: no gore), sailors swing over from the other galleons, and Pak Damit, Panglima Lela and their fighters strike beside you. Then the **Capitán** comes down from the stern castle while the other galleons fire at the deck (a shadow shows where each shot will land).
- **The moon goes dark.** As the Capitán yields, the moon is eclipsed and the **Bakunawa** rises beside the ship, Pelita's little light still in its eye: it remembers. Every gong in both fleets rings, the sailors take to their boats, and the fleet sails home. Panglima Lela splits the twin pearls: one for Sulu, one for Barunai. Two pearls, two kingdoms, one sea.
- **Part 2 rewards:** the **Kalis Sulu** (a wavy-bladed sword, the strongest and fastest blade: 6 damage), 15,000 kepeng and 2 pearls. (If your bag is full, Nenek keeps the kalis for you.)

### Chapter 10: Nujum Pak Belalang, "The Fortune Teller" (v3.0)
Based on the Malay folk tale of Pak Belalang: a lazy father and his clever son Belalang, who finds the lost things while his father "divines" them like a nujum (a fortune teller), until the Sultan sets harder tests. The game keeps only the folk tale (not the 1959 film), with its own kingdom, Sultan and words. The user's twist: **Pelita suddenly disappears**, because it followed Belalang home and loves him.
- **Pelita is gone.** The day after Chapter 9, Pelita vanishes. A grasshopper glowing with Pelita's gold sits on the spirit house: walk up to it and it hops on, across the farm, to the jetty, where a grasshopper woven from coconut leaf is lying. Nenek knows where those are made: the jong can now sail to **Negeri Tanjung Bunga**. (While Pelita is away its needs wait for it: no hunger, no pranks, no cravings. The spirit house is empty, and the Companions tab says where Pelita is.)
- **Hide-and-seek.** Pelita and a skinny barefoot boy are playing hide-and-seek with you around the town. Find them three times. Belalang can see spirits, and Pelita does not want to leave him.
- **Belalang's chores.** Three buckets from the town well into the tempayan by his father's hut, and 3 kayu and 2 kelapa. Then his secret: he finds the lost things, and his father, **Pak Belalang**, takes the credit. Then the palace drum: the Sultan's heirloom chest has been stolen.
- **The stolen chest.** **Sultan Muzaffar** gives Pak Belalang until Ahad (seven days; if you are late he grumbles and gives another week, but the early reward is lost). Take Belalang along: in **Hutan Merbau** the thieves' footprints glow only in Pelita's light. At their camp, beat the **Kerengga gang** (four thieves and Si Kerengga, who charges). No gore: they drop their sticks and give up.
- **The riddle contest.** A ship from Negeri Antah Berantah challenges with riddles. After dark, hide in the sampan under it and overhear the answers, then answer with the buttons (a wrong answer just means "think again"). The riddles are old Malay teka-teki.
- **Nek Lampir's fortune (optional, v3.0.1).** Once the whole coast calls Pak Belalang a great nujum, Nek Lampir turns up under his coconut tree demanding a reading. He cannot really tell fortunes, so you whisper to him with buttons: will she get her magic back, will Hang Tuah ever say sorry, will she find true love (a tall, handsome... crocodile). She pays him in her famously bitter jamu, gives you 3 Herba and two hearts, and a stray cat follows her home to Gunung Ledang. It works after the chapter too, and if you saw it before the finale, she has something to shout from the crowd.
- **The truth.** Help Pak Belalang tell the Sultan the truth. The Sultan laughs, and rewards honesty: Belalang goes to the palace school, and his father becomes keeper of the royal orchards (real work, every morning). At the jetty, Belalang tells Pelita to go home, and Pelita floats back to your shoulder.
- **Rewards:** **Belalang's Sumpit**, a blowpipe: the first weapon that hits from far away (3 damage, plus your strength; hold it and press USE to shoot a dart the way you face; darts fly over water and stop at walls). Also 15,000 kepeng (+5,000 if the chest came back before Ahad), 3,000 from the Sultan for the chest, 2 Batu Delima, and three new friends (Belalang, Pak Belalang and Sultan Muzaffar, with tasks and gifts).

### Chapter 9: Ulek Mayang, "The Song from the Sea" (v2.7)
A horror chapter, the user asked: dark, a chase, small jump scares, spooky. It is based on the Terengganu legend of Ulek Mayang: a fisherman, a sea princess who fell in love with him in a storm, and a healer who sings on the beach to call the seven princesses. (The verses and the melody here are the game's own, not the traditional song. No gore, nobody is hurt for good, no religion, no worship: the rice is a meal for guests, as the old manners say.)
- **The song.** The night after Chapter 8, a woman's voice sings somewhere over the river, and an empty Terengganu fishing boat drifts in to the farm jetty. The jong can now sail to **Kampung Pantai Kabus**, where the sun has not come up for days: fishermen stand on the beach with their eyes shut, humming. Pak Awang went out in a storm, came home without saying a word, and now walks into the sea every night and sings in a woman's voice.
- **Find where it comes from.** In **Pantai Bakau**, the mangrove, you follow the song by ear: it is louder as you get closer, and comes from the left or the right (headphones help), and a faint light at the edge of the screen points the way. An empty boat, a well, a swing... and Pak Awang, waist-deep in the black sea.
- **The chase.** Tok Pawang needs a mayang from the old pinang palm at the end of the boardwalk. Take it, and Puteri Bongsu comes for you. **When her singing stops, do not move.** The old lamps along the boardwalk keep you safe; if she catches you, you are thrown back to the last lamp. Mak Som cooks **Nasi Kunyit** for seven guests (7 nasi, 1 kelapa).
- **Ulek Mayang.** On the beach, Tok Pawang sings a line on five lamps and you sing it back (keys **1-5**, or tap the lamps; a wrong note just starts the verse again). Five princesses rise from the sea, and you serve them the rice; then Puteri Bongsu, who flees with Awang's spirit; then the eldest, Puteri Sulung.
- **Gua Puteri Tujuh.** Under the whirlpool (you need the Naga's blessing to breathe): seven giant clams, and the wrong ones do not like being opened. Listen for the one where Awang's spirit hums. "Yang laut balik ke laut, yang darat balik ke darat": what belongs to the sea goes back to the sea.
- **Rewards:** **Lagu Mayang** (L, or tap the mayang button): sing, and every enemy around you falls into a trance and sways for 5 seconds (1.5 for the strongest; every 20 seconds). Also 12,000 kepeng, 3 pearls, the sun over Pantai Kabus, and four new friends (Mak Som, Tok Pawang, Pak Awang, and Puteri Bongsu on the beach at night).
- **Too scary?** Pause > **Jump scares: Gentle** keeps the frights but never shows the face in the dark.

### Chapter 8: Air Pasang, "The Rising Tide" (v2.6)
A day after Chapter 7, the river at the farm starts to rise: one row higher every day, salty, and threaded with black ink. (You wade through it slowly; the crops are safe behind the field fence.)
- **The war under the sea.** Tok Duyung in Kampung Karang explains: Kanjeng Ratu Kidul and Poseidon are at war, and every wave of their anger pushes the sea onto the land. Each ruler blames the other for poisoning the sea, and neither will go first. A black current at the east of Kampung Karang leads to the **Selat Gelora**, where the two seas meet: soldiers of both sides clash everywhere, spears fly (a red line warns you first), ink drifts from a huge broken jar, and beyond a wall of current two dragons fight: the **Naga Mother** (woken from under her pillar) and Poseidon's sea serpent **Ketos**.
- **The truth.** The pieces of the jar carry Mak Lampir's mark. On Gunung Ledang, **Nek Lampir** confesses: cleaning out her old hut, she threw seventy years of bottled tempers into the stream, and every stream goes to the sea. The old magic only makes anger bigger; the pride was the rulers' own. She brews **Air Penawar** (3 rumpai laut, a pearl).
- **Two dragons at once.** Waves across the arena and whirlpools (the Naga Mother), a water jet and a tail slam (Ketos). Wear one out and the cure calms it; then the other is furious.
- **Queen against King.** The rulers come to the strait themselves and fight each other, one against one, while you watch. Then you step in: calm Kanjeng Ratu Kidul (her waves, her green selendang, her whirlpools), then Poseidon (his trident, lightning circles, earthquake). It is a duel to wear out their anger: nobody is hurt, and both stay dignified. Only then will they listen to what really happened.
- **Peace under the arch.** The Naga Mother brings Nek Lampir down in a bubble; she says sorry to both rulers, and they say sorry to each other. Then help her clean up: 6 black jars (Kampung Karang, the Selat Gelora, the Queen's palace, Atlantis) for her pot by the farm jetty.
- **Rewards:** **Naga Kecil grows and carries you** (the Seruling Naga: hold it and press USE, or R; under the sea it is always R). It swims under the sea and goes anywhere a basikal can. Swing a weapon while you ride and it sends a jet of water ahead. Also: river silt waters your field for 7 nights, the Naga Mother and Ketos as friends, and 19,000 kepeng.
- **Livelier fights everywhere (v2.6):** streaks fly from every blow, foes squash when they are struck, a "!" warns of every wind-up, beaten foes leave a ring and a little rising light, and a red ring marks a blow you take (bubbles under the sea, dust on land).

### Chapter 7: Puteri Santubong (v2.5)
A day after Chapter 6, a mist rolls over the farm: Puteri Gunung Ledang's message. Far away in Borneo, the princesses of Santubong and Sejinjang are fighting again, and their thunder is reaching the sea lanes. And Nenek goes pale: Santubong is where she was born.
- **The story** (from the Sarawak legend of two sky princesses, Santubong the weaver and Sejinjang the rice-pounder, who quarrelled over Putera Serapi and were turned into mountains). Sail to Gunung Ledang for the **Kabus Ledang** (mist that carries words truly), then on the jong to **Kampung Santubong**. Old **Mak Dayang** the weaver tells the legend (and still has Nenek's hair ribbon).
- **After dusk** the princesses walk at the feet of their mountains. Help **Puteri Santubong** finish her last weaving (tarum and kunyit from the village, kesumba from **Pulau Satang**, golden thread from Mak Dayang), and pound the wedding rice with **Puteri Sejinjang** (a rhythm game: pound as each beat reaches the lesung). Then carry their words to each other in the mist jar, and the truth comes out: someone has been twisting them for six hundred years.
- **Sang Bualang**, the wind Sejinjang once turned down, sends a storm over the village: drive it off. **Putera Serapi** (on the river path in the west) tells what really happened. Row the sampan to Pulau Satang and face Bualang at the crag: stay out of his gusts and whirlwinds and out of the lightning circles; halfway through, the mist of Gunung Ledang calms the storm.
- **Villain, then friend.** Beaten, he sulks on the rocks. Sit with him, and give him a **wau** (Mak Dayang helps you make it). Then bring Puteri Gunung Ledang across the sea, and everyone meets at the stone between the mountains. (Linking her and Nenek to Santubong is this game's own story; versions of the legend differ, and there is no gore and no religion: Raja Kayangan is a sky king of the old tales.)
- **Rewards:** **Sang Bualang** the helper and **Angin Bualang** (below), **Pelita's daylight**, weaving **Kain Tenun** and pounding **Tepung Beras** at the dapur's Craft tab, **Kuih Lapis** to cook, fishing off Pulau Satang, Nenek's childhood house repaired, four new friends, and 16,000 kepeng.

### Sang Bualang, the wind (v2.5)
- **B** (or tap the wau): fly a kite to call him. He rides the wind, so he takes about **10 seconds** to arrive (**20** in forests and caves, where the wind has to find its way in; he cannot reach you under the sea). An arrow at the edge of the screen shows where he is coming from. If the fight ends before he lands, he shrugs and goes: "Missed it? Hah, next time."
- In a fight he spins into enemies (**Puting Beliung**): a little damage, and they are flung back, dizzy. Press **B** again to send him spinning at once. With nothing to fight he blows away home, and rests 25 seconds.
- **U** (or tap the gust button): **Angin Bualang**, your own gust. Every enemy around you is blown back and left dizzy (every 12 seconds). It also blows away darkness (Mak Lampir's stolen light), fog and whirlwinds.
- Nek Lampir will not come while he is with you ("That windbag?"), and leaves in a huff if he turns up.
- **Pelita's daylight:** once Pelita is at Lv 30, the nights are as bright as day wherever Pelita is with you. Switch it off in the pause menu if you like the dark.

### Chapter 5: Bayang Hitam, "Black Shadow" (v2.3)
Ever since the cockfight of Barunai, **Mak Lampir**, a black-magic witch, has been whispering in Laksamana Kebo Taruna's ear: it was her voice that fed the anger behind the attack of Chapter 4. Now the king has sent him to guard **Pulau Kelam**, a lonely black rock far out at sea, and she has bound **Si Kelam**, a shadow that drinks light (a creature made up for this game), to his anger. She wants Pelita's light, a light that never goes out, to stay young for a thousand years.
- **The lamps go out.** A night after Chapter 4, every light on Nenek's farm gutters out and shadows slide across the yard. Drive them off. They leave a cold shard behind, and Pelita turns pale and small.
- **While the shadow is loose,** the torches of the farm and the kampung will not stay lit, shadows prowl both at night (they drop shadow shards), and they drink the water from up to two crops a night. **Tukang Leong's guard lamps** (10 kayu, 2 Kendi Tembaga, 1500 kepeng) keep them off the farm.
- **Juragan Wira**, master of the Majapahit trading jong at Nenek's jetty, knows the shard. With the Naga swimming alongside, his jong now sails to **Java**: the harbour and court of Majapahit, with red-brick split gates, the king's pendopo, a great brick-lined pool and a market (batik, celengan, jamu, damar; it pays well for Bornean goods).
- **Empu Lintang**, the old lamp-maker of the court, made Pelita's first lamp seventy years ago, before its flame floated away to find a home. He will make a **Pelita Purnama** (a full-moon lamp) from 3 Kendi Tembaga (Barunai's brassmiths), a **Cahaya Bunian** (Tok Batin washes 3 shadow shards clean) and 2 lumps of **damar** resin (the old damar tree in Hutan Rimba, once a day).
- **Pulau Kelam** is always dark. Mak Lampir cackles from the crag while Si Kelam fights for her: it cannot be hurt until you light the four old stone torches with the Pelita Purnama, while smaller shadows keep coming.
- **Mak Lampir.** When her shadow falls, the witch leaps down herself. She vanishes and reappears around the island, and her black magic snuffs the torches out; she can only be hurt while all four burn, so keep relighting them.
- **Pelita Purnama.** Pelita darts into the lamp and becomes the **Full Moon Spirit**, with a halo and a little flame of its own. Mak Lampir's magic unravels and she flaps away over the sea as a small, bad-tempered bat, Kebo Taruna is freed, and you get 8000 kepeng and +20 max health. Kebo Taruna now works at the harbour in Java, and the jong will sail you back there whenever you like.
- No gore, no religion: Si Kelam is an original creature, the witch is chased off rather than hurt, and the admiral is freed, not punished. Mak Lampir is the famous witch of Indonesian radio and television (*Misteri Gunung Merapi*); this game's version of her, her look, words and story, is its own.

### Saving and loading
- There are **three save slots**. On the title screen, **Continue** opens the farm you played last, **Load Game** lets you pick a slot, and **New Game** asks which slot to start in (a slot that already has a farm asks twice before it is overwritten).
- While playing, pause (Esc or **II**) and choose **Save game** to save into any slot, or **Load game** to go back to a saved farm.
- The game also saves by itself every night when you sleep, and whenever you leave the game (switch apps, close the tab), into the slot you are playing.
- Playing with friends: the host picks which farm to open, and friends keep their own bags (see [With friends](#with-friends-co-op-up-to-4-players)).

## Sound

The soundtrack is a slow, chill, gamelan-inspired lo-fi piece: warm pads, soft metallophone bells, a distant gong and a hall reverb. It has a gentler, slower night version. Underneath it plays a nature layer: the river, koels and bulbuls by day, and crickets and frogs at night. Everything is synthesised live with the Web Audio API, so there are no audio files and nothing to license.

In a fight, a **battle song** crossfades in: a kendang drum groove, a gong every two bars, a low ostinato and a pelog-flavoured saron tune. It is made of tuned tones rather than noise, so it never turns into hiss, and it fades back to the calm music a few seconds after the fight. **Pause → Sound & music** has a volume slider for each part (music, battle music, sound effects, nature and rain); the battle-music row plays a preview while you adjust it. Setting battle music to 0% keeps the calm music playing during fights.

## Building it yourself

Everything that ships comes from the same web code at the repository root.

```powershell
.\tools\build.ps1            # rebuilds dist/LittleCreature.html AND dist/LittleCreature.apk
.\tools\build.ps1 -SkipApk   # only the single-file HTML
```

Requirements:
- **HTML:** [Node.js](https://nodejs.org).
- **APK:** JDK 17+ and the Android SDK (the easiest way to get both is to install Android Studio). The Gradle wrapper downloads everything else.

You can also build straight from the `android/` folder: `gradlew assembleRelease`. Android Studio can open the `android/` folder as a project.

**Signing key:** release APKs are signed with `android/keystore/littlecreature.jks`, and its passwords are in `android/keystore.properties`. Both are deliberately **not** in git. **Back them up.** Future versions must be signed with the same key to install over the old app and keep your save. If you build without them, Gradle falls back to the debug key.

Icons are generated by `node tools/make-icons.mjs`.

## Project layout

```
index.html            the game (open this to play from the folder)
dist/                 ready-to-play builds: LittleCreature.html (single file) and LittleCreature.apk, and version.json (what the update check reads)
src/                  game code: data, areas (maps of every place), folk (villagers and spirits), state, sim (shared-world rules),
                      net (co-op), lobby, procedural art (art.js ... art17.js) + audio (and lagu.js, v2.7: the singing voices and the horror drone), data2/areas2/undersea (v1.5 content),
                      battle.js (v1.6: wild enemies, abilities, Mak Deruma), badang.js (v1.7: Badang, the hantu, bubu,
                      Ladang Badang, Lempar Batu), barunai.js (v1.9: Chapter 2), kampong.js + kampong2.js (v2.0-2.1: Chapter 3), majapahit.js (v2.2: Chapter 4), bayang.js (v2.3: Chapter 5), ledang.js (v2.4: Chapter 6), neklampir.js (v2.4.1: Nek Lampir the helper), santubong.js (v2.5: Chapter 7), bualang.js (v2.5: Sang Bualang and Pelita's daylight), gelora.js (v2.6: Chapter 8), sulu.js + sulu2.js (v3.3-3.4: Chapter 11), mayang.js (v2.7: Chapter 9), belalang.js (v3.0: Chapter 10), home.js (v1.8: house stages, helpers, bigger bag,
                      Lv 30, Mak Thuy and Pak Tam), version.js + update.js (update check), cheats.js (test build only),
                      scenes (World + WorldLife, WorldFarm, WorldCombat, WorldTanggang, WorldBadang, WorldHome, WorldBarunai,
                      WorldKampong, WorldKampong2, WorldMajapahit, WorldBayang, WorldLedang, WorldNek, WorldSantubong, WorldBualang, WorldGelora, WorldNaga, WorldMayang, WorldBelalang, WorldSulu, WorldSulu2; UI + UIMenus, UIGames,
                      UISettings, UIBadang, UIHome, UIBarunai, UIKampong, UIKampong2, UIMajapahit, UIBayang, UILedang, UINek, UISantubong, UIBualang, UIGelora, UIMayang, UIBelalang, UISulu, UISulu2)
lib/                  Phaser 3.80.1 (MIT), PeerJS 1.5.4 (MIT) and the Pixelify Sans font (SIL OFL 1.1), vendored
icons/                app icons
android/              Android wrapper app (WebView). It packages the web game from the root at build time.
tools/                build-web.mjs (single-file HTML, and the version stamp), make-icons.mjs, build.ps1
manifest.webmanifest  web-app metadata for hosted play
sw.js                 offline copy for hosted play (the iPhone Home Screen app); its file list is stamped by build-web.mjs
.nojekyll             tells GitHub Pages to serve the files as they are
plan.md               design document
```

**Play in a browser from anywhere (and on iPhones).** In this repo's GitHub settings, go to **Settings → Pages**, choose **Deploy from a branch → `main` / root**, and save. The game will then be playable, and installable as an app, at `https://<your-username>.github.io/little-creature/`. See "On an iPhone or iPad" above.

## Credits and licences

- **Engine:** [Phaser 3](https://phaser.io), MIT licence.
- **Multiplayer:** [PeerJS](https://peerjs.com), MIT licence. It uses the free public PeerJS server for matchmaking.
- **Font:** [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) by Stefie Justprince, SIL Open Font License 1.1.
- **Art, music and sound:** original. Every sprite, note and sound is generated in code (`src/art.js`, `src/audio.js`, `tools/make-icons.mjs`).
- **Cultural inspirations:** Thai/Lao/Khmer spirit houses, Malay *rumah panggung* and *kampung* life, *gotong-royong* and the *kenduri*, Balinese *canang sari*, Thai *phuang malai*, Hungry Ghost Festival traditions, Loy Krathong / Yi Peng lanterns, Malay *wau* kites, Javanese batik and *jamu*, Kelantan's *wau bulan* and *gasing*, Malaysian Serama chickens, *silat*, the keris, *ais kacang* and the fruit season, the Malay legend of Si Tanggang, the tale of Badang the strongman and his stone from the *Sejarah Melayu* (Malay Annals), the Bruneian epic *Syair Awang Semaun* (the fourteen brothers and the founding of Brunei, "Baru nah!") and Kampong Ayer, the water village on stilts (its nibong and belian pilings, craft villages and *padian* floating market), the Brunei Bay legend of the roosters Mutiara and Asmara (Pulau Pilong-Pilongan and Lumut Lunting), Awang Semaun and Awang Jerambak's fight with the jinn Bilanapura, Antonio Pigafetta's 1521 account of the city built in salt water, the 1578 defence of Kampong Ayer (the Castilian War), Brunei's brass *lantaka* cannons, Majapahit's trading jong, terracotta *celengan* and Javanese batik, Mak Lampir the witch, the legend of Puteri Gunung Ledang and her impossible demands, Hang Tuah and Hang Jebat, the young areca palm (*pinang*), the bamboo *pangkin*, *silat*, Majapahit's red-brick split gates (*candi bentar*), *pendopo* pavilions and great brick pool, the *empu* master craftsmen of Java, *damar* resin torches, bamboo *bubu* fish traps, the Javanese legend of Nyi Roro Kidul (Kanjeng Ratu Kidul, Queen of the Southern Sea), the old Raub gold mines, the Greek tale of Atlantis and Poseidon, Sabah's seaweed salad, Langkawi *gamat*, the dugong (*duyung*) behind the mermaid legends, sunken trading junks of the old spice route, Malaysian highland tea, Vietnam's red dunes, dragon fruit and Cham towers, Sang Kancil the mouse deer, and folk spirits: the Malay *semangat padi* and *orang bunian*, the Mekong *naga*, the Iban *kenyalang* and the Filipino *nuno sa punso*. All are drawn with affection and respect.
