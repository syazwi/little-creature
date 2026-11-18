# Little Creature

*A cozy spirit-keeping farm game from the kampung.* Plays on PC (Windows, macOS, Linux) and Android.

Nenek has left you her stilt house by the river and a tiny spirit named **Pelita** living in the spirit house beside the stairs.
You farm by day, cook at the clay stove, and leave offerings so Pelita's light grows from a weak flicker into the **Guardian of the Kampung**.
As Pelita levels up, its light opens the way to the wider land: a riverside village to rebuild, a rainforest with a hidden Bunian village, a pearl island, a village beneath the waves (and a sunken ship, a sea queen's palace and Atlantis below it), a misty mountain with a haunted gold mine, and red dunes. There you fish, raise chickens, ducks and goats, compete at the weekly Pesta, build houses with the villagers, ride a bicycle or drive a car, train your strength, fight the shadows of the mine, and befriend spirits from Southeast Asian folklore. The seasons turn every week, from the planting rains to the fruit season, the dry season and the monsoon.

## Play it

### On a computer: double-click and play
- **Easiest:** download [`dist/LittleCreature.html`](dist/LittleCreature.html). It is **one file** containing the whole game. Copy it anywhere (a USB stick, another PC) and double-click it to open it in any browser. No install and no internet needed.
- **Or:** download this whole repository (**Code → Download ZIP**), unzip it, and double-click **`index.html`**. (`index.html` needs the folders next to it, so to copy just one file, use `dist/LittleCreature.html`.)
- The game fills the whole browser window at any size. Press **F** (or use the pause menu) to go fullscreen.
- Saves are kept by the browser on that PC. A different PC or browser starts its own farm.
- **Testing build:** [`dist/LittleCreature_full.html`](dist/LittleCreature_full.html) starts with everything unlocked (Pelita Lv 20, every place, spirit, weapon and vehicle, 99,999 kepeng, max strength). It uses its own save, so your real farm is never touched. Test keys: **]** next day, **[** next season, **\** next Pesta, **H** full health.
- If double-clicking opens the file in something other than a browser, right-click it and choose **Open with → Microsoft Edge** (or Chrome or Firefox).

### On an Android phone
1. On your phone, open [`dist/LittleCreature.apk`](dist/LittleCreature.apk) on GitHub and tap **Download** (the ⋯ / download button).
2. Open the downloaded file. If Android asks, allow your browser or Files app to **install unknown apps**.
3. Tap **Install**, then open **Little Creature**. It plays fullscreen in landscape and fully offline. The game fills the whole screen, edge to edge (including beside the camera notch), and the HUD stays clear of the notch.

> Android may warn that the app isn't from the Play Store. That's normal for apps you install yourself.
> If you already have an older version installed, installing the new APK updates it and keeps your save.

### With friends (co-op, up to 4 players)
PC browsers and Android phones can all play together.

1. **One player hosts.** On the title screen choose **Play with Friends**, type your name, and press **Open my farm**. You can also pick **Invite friends** in the pause menu while you're playing. You get a **5-letter code**. It's also shown at the top of the screen and in the pause menu.
2. **Friends join.** Each friend chooses **Play with Friends**, types their name and **your code**, and presses **Join farm**.
3. Everyone walks around the same farm in a different-coloured outfit, with name tags.

| Shared by everyone | Your own (kept on your device) |
|---|---|
| Fields, crops, trees, forage spots, the clock and the day | Bag, hotbar and kepeng |
| Farm animals, eggs in the nest, storage chests and what is in them | Strength, health, the Bunian glasses, Pesta trophies |
| Pelita (feeding, petting, offerings, bond, levels, growth) | Energy and watering can |
| Houses built in the kampung, spirits befriended | Villager friendship and requests, your fish log, your bike and car |
| | Cooking, crafting, fishing, and buying or selling |

- Friends can explore different places at the same time. You see each other when you are in the same place.
- Pelita follows whoever fed or petted it last, even into another place. Your spirit companion is visible to friends too.
- **Only the host ends the day.** When the host sleeps, everyone sleeps (wherever they are, they wake up at the farm) and sees the day summary. A friend can use the house to tell the host they're sleepy.
- The host's farm is saved on the host's device. A friend's bag goes home with them, so they can bring it to the next session.
- Co-op needs internet. Friends connect directly to each other (WebRTC, via [PeerJS](https://peerjs.com)). Solo play stays fully offline.

## Controls

| Action | Keyboard | Touch (phone/tablet) |
|---|---|---|
| Move | WASD / Arrow keys | Drag anywhere on the left side (floating joystick) |
| Interact / use item | E / Space / Enter | **USE** button (glows gold when something can be done) |
| Select hotbar slot | 1 – 9, mouse wheel | Tap a slot |
| Eat the selected food | X | **EAT** button |
| Bag | Tab / I | **BAG** button |
| Pause menu | Esc | **II** button (top), or Android **Back** |
| Map (this place, and the whole land) | M | **MAP** button (top) |
| Music on/off | N | Pause menu |
| Fullscreen | F | Automatic (Android app, and phone browsers on the first tap) |
| Journal | J | Pause menu → Journal |
| Ride / get off (bicycle, car) | R | Select it in the hotbar and press **USE** |
| Put on / take off the Bunian glasses | G | Select them and press **USE** |
| Swing a weapon (in the haunted mine) | E | **USE** |

Touch controls switch on automatically on touch screens. You can toggle them, the music and the nature sounds in the pause menu.

## How to play

- **Farm.** Till the fenced field with the **Cangkul**, plant seeds, and water them with the **Gembor**. Refill it at the well or the river. Watered crops grow one stage per night. **Padi** grows only in the flooded sawah and needs no water.
- **Gather.** Banana trees, coconut palms and the mango tree regrow fruit every few days.
- **Cook.** Use **Nenek's Dapur** (the clay stove). Dishes fill Pelita far more than raw crops. Favourites are marked with a heart.
- **Offer.** Use the **spirit house**. Incense (*colok*), jasmine garlands (*phuang malai*) and flower trays (*canang*) raise Pelita's **Glow**.
- **Care.** Feed Pelita, pet it, and meet its **daily craving** (shown in its thought bubble).
- **Trade.** **Mak Ani's warung** on the east road (7 AM – 8 PM) sells seeds, colok and *air merah*, and buys your harvest.
- **Nights.** If all three of Pelita's needs are 50 or more when you sleep, it rests content. If any is under 20, expect a prank.
- **Ahad.** Every 7th day is **Hungry Ghost Night**. Pelita gets hungry twice as fast, but all bond counts double.
- **Levels.** Every act of care gives Pelita bond. Pelita has **20 levels**. It evolves at Lv 3, 6, 9 and 12 (Flicker → Little Spirit → Lantern Spirit → Garden Spirit → Guardian), and most other levels bring a gift. Each evolution brings a blessing. The **Journal (J)** lists every level and its reward.

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
| **Lombong Puaka**, the haunted gold mine | Lv 9 | The old mine shaft in Gunung Kabus | Darkness, shadows that attack, gold seams, cave crystals, a blind cave fish, the stone guardian |
| **Istana Laut Selatan**, the Palace of the Southern Sea | Lv 12 | The green arch at the south of Kampung Karang | Kanjeng Ratu Kidul, the Queen of the Southern Sea, and her lady-in-waiting |
| **Kota Atlantis**, the sunken city | Lv 15 | The deep trench at the west of Kampung Karang | Poseidon on his throne, a scholar, marble ruins, amphorae and crystals |
| **Bukit Pasir**, the red dunes | Lv 11 | Road east through the kampung | Dragon fruit, clay, buried old coins, an oasis, a Cham tower |

Locked paths are blocked by vines, rockfall or sand until Pelita is strong enough. From Lv 7, wayside shrines take you home, and the spirit house sends you to any place you've visited.

- **Fishing.** Pak Mat gives you a **Joran** (fishing rod) the first time you meet him at the kampung jetty. Hold it, face any water and press USE. Wait for the bite, strike, then stop the marker in the green. Rivers, forest pools, the sea, the mountain lake and the oasis each have their own fish. Some bite best at night. Cook fish into *ikan bakar*, *asam pedas* and more.
- **Villagers.** Tok Penghulu (village head), Pak Mat (fisherman) and Tukang Leong (carpenter) live in the kampung. Each one has a request every day: fulfil it for kepeng and friendship, and Pelita gains bond too. Chat once a day for friendship. At 3, 6 and 10 hearts they give you a gift. Several also run a shop and buy goods for more than the warung pays.
- **Building houses (gotong-royong).** Bring materials and kepeng to one of the four empty plots in the kampung: *kayu* (wood, forest), *atap* (thatch, island), *batu* (stone, mountain) and *tanah liat* (clay, dunes). Tukang Leong sells them too. Choose a Pondok Buluh, Rumah Kayu or Rumah Batu. The whole village raises it overnight, and a family moves home: Cik Siti the herbalist, Auntie Lai the tea planter, Mbak Dewi the batik artist and Kak Mai the fruit trader. Each brings new requests and a shop.
- **Spirits of the land.** Five folk spirits wait to be befriended, one in each region: the Semangat Padi (rice soul, in the farm's sawah), the Orang Bunian (hidden forest folk), a young Naga (island shallows), the Kenyalang (hornbill messenger, mountain) and the Nuno sa Punso (mound spirit, dunes; mind your manners and say *tabi-tabi po*!). Grant a spirit's wish and it blesses you: more rice, forest gifts every morning, better fishing, +30 energy, or soil that grows crops even unwatered. Play with each one once a day, and choose one to travel with you as your companion.
- **Getting around.** **Abang Zul**, the kampung mechanic, sells a **basikal** (bicycle, 250 kepeng, about 1.75× walking speed). He also sells his restored **kereta** (car, 1,200 kepeng, about 2.4× speed), but only to a friend (3 ♥). Press **R** to get on or off, or select it and press USE. The bicycle goes almost anywhere on land. The car keeps to the farm, the kampung and the dunes, and is parked automatically where it can't go. You hop off by yourself to farm, fish or gather. Friends in co-op see your bike or car, in your colour.
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
- **Farm animals.** Nenek's old **reban** (coop) and goat pen are behind the house. **Pak Lah**, the poultry farmer in the kampung, gives you your first hen and sells ducks, Serama chickens and goats. Feed them daily (dedak or padi) at the reban, or hold the feed and face an animal. Fed hens and ducks lay eggs every night, and goats give milk every other day. Pet them for love: well-loved animals sometimes give double. **Grow more chickens:** put an egg in the nest and a hen hatches it after three nights; the chick grows up in three days (with a Serama in the coop, some chicks are Serama). Eggs and milk go into new dishes: *telur dadar*, *nasi goreng*, *kuih bahulu*, *telur masin*, *teh tarik*. Chicken for *ayam goreng* comes from the market.
- **Storage chests.** Make a **Peti Kayu** (24 stacks) at the dapur's Craft tab from 10 kayu and 2 rotan, or buy one from Mak Ani. From Pelita Lv 10, the bigger carved **Peti Ukir** (48 stacks) too. Hold it, face open ground and press USE to place it. Everyone on the farm shares the chests.
- **Map (M).** "This place" shows a map of where you are: villagers, your chests, Pelita and the ways out. "The land" shows every place, which are open, and where you and Pelita are.
- **Mak Ani's new stall (Pelita Lv 10).** The warung grows into a *kedai runcit*: chests, compost (*baja*: a crop grows a day at once), *ais kacang*, offerings, and 10% more for everything you sell.
- **The Pesta (every Sabtu, 8 AM - 6 PM).** At the pavilion in Kampung Tepian, enter three contests, each once a week. Beat three rivals in a row to be champion:
  - **Wau Aduan** (kite fighting): tap to keep your string's tension in the green as the wind shifts, to cut your rival's string. Buy a *wau* from **Pak Wan**, the kite and top maker from Kelantan (the *wau bulan* is steadier).
  - **Gasing Uri** (top spinning): time the wind-up and the throw; the longest spin wins.
  - **Ratu Serama** (the Serama show): your bird's love and grooming (with a *sikat*) count for half, and its poses for the rest.
  - Prizes: kepeng for each round, and for the champion money, food or sometimes a rare treasure, plus a trophy the first time. Practise any day, for no prize.
- **Strength.** Lift the **batu angkat** (training stone) in the kampung once a day, train silat with Kesuma in the hidden village once a day, and eat home-cooked dishes (twice a day). Strength raises your health.
- **The Bunian's secret.** After you befriend the Orang Bunian in the forest, it asks for 3 *madu tualang* (wild honey from the bees' nests by the giant tualang trees), a *pengat durian* and 4 *melati*. Its gift is the **Bunian glasses**. Wear them by the oldest tualang in the west of the forest and a golden gate appears, leading to **Kampung Bunian**, a hidden village with more people: Tok Batin the elder, Dang Melur's rare goods (golden fruit, oil-less lamps, strength tonic) and Kesuma the silat master. In the middle of the village, a **keris** is stuck in a stone. With 60 strength you can draw it out.
- **Lombong Puaka, the haunted gold mine (Pelita Lv 9).** A cursed mine shaft in Gunung Kabus. It is dark (Pelita's glow helps), and shadows, ghost bats and giant centipedes attack you. A stone guardian waits in the deepest hall. Hold a weapon and press USE to swing: a rattan staff (make it from 4 rotan, or buy it from Pak Wan), a *parang* (Tukang Leong), the keris, or the sea king's trident. Mine gold seams and crystals and fish the underground pool. Your health shows in the top-left panel, and food heals you. If it runs out you faint, wake up at home and drop half of your gold.
- **Deeper under the sea.**
  - **Kapal Karam:** swim into the sunken junk to meet the ghost of **Si Tanggang**, the proud son of the Malay legend, who wants to say sorry to his mother. Help him find her lost *selendang* (ask Tok Duyung) and he finds peace.
  - **Istana Laut Selatan (Pelita Lv 12):** the jade Palace of the Southern Sea, home of **Kanjeng Ratu Kidul**, the Queen of the Southern Sea from the Javanese legend of Nyi Roro Kidul. Bring her a royal gift of jasmine, and every sea forage gives you one extra.
  - **Kota Atlantis (Pelita Lv 15):** the sunken city of the old Greek tales, where **Poseidon** still sits on his throne. Bring him pearls, cave crystals and an *ikan emas* and he gives you his trident and +20 health.
- **Krathong.** Craft a krathong (banana, marigold and colok) at the spirit house, or buy one from Mbak Dewi. Float it on any water after dark for a big boost to Pelita's glow and bond.

The game saves every night when you sleep, and whenever you leave the game (switch apps, close the tab).

## Sound

The soundtrack is a slow, chill, gamelan-inspired lo-fi piece: warm pads, soft metallophone bells, a distant gong and a hall reverb. It has a gentler, slower night version. Underneath it plays a nature layer: the river, koels and bulbuls by day, and crickets and frogs at night. Everything is synthesised live with the Web Audio API, so there are no audio files and nothing to license.

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
dist/                 ready-to-play builds: LittleCreature.html (single file) and LittleCreature.apk
src/                  game code: data, areas (maps of every place), folk (villagers and spirits), state, sim (shared-world rules),
                      net (co-op), lobby, procedural art (art.js ... art4.js) + audio, data2/areas2/undersea (v1.5 content),
                      scenes (World + WorldLife, WorldFarm, WorldCombat; UI + UIMenus, UIGames)
lib/                  Phaser 3.80.1 (MIT), PeerJS 1.5.4 (MIT) and the Pixelify Sans font (SIL OFL 1.1), vendored
icons/                app icons
android/              Android wrapper app (WebView). It packages the web game from the root at build time.
tools/                build-web.mjs (single-file HTML), make-icons.mjs, build.ps1
manifest.webmanifest  web-app metadata for hosted play
sw.js                 offline service worker for hosted play
plan.md               design document
```

**Optional: play in a browser from anywhere.** In this repo's GitHub settings, go to **Settings → Pages**, choose **Deploy from a branch → `main` / root**, and save. The game will then be playable, and installable as an app, at `https://<your-username>.github.io/little-creature/`.

## Credits and licences

- **Engine:** [Phaser 3](https://phaser.io), MIT licence.
- **Multiplayer:** [PeerJS](https://peerjs.com), MIT licence. It uses the free public PeerJS server for matchmaking.
- **Font:** [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) by Stefie Justprince, SIL Open Font License 1.1.
- **Art, music and sound:** original. Every sprite, note and sound is generated in code (`src/art.js`, `src/audio.js`, `tools/make-icons.mjs`).
- **Cultural inspirations:** Thai/Lao/Khmer spirit houses, Malay *rumah panggung* and *kampung* life, *gotong-royong* and the *kenduri*, Balinese *canang sari*, Thai *phuang malai*, Hungry Ghost Festival traditions, Loy Krathong / Yi Peng lanterns, Malay *wau* kites, Javanese batik and *jamu*, Kelantan's *wau bulan* and *gasing*, Malaysian Serama chickens, *silat*, the keris, *ais kacang* and the fruit season, the Malay legend of Si Tanggang, the Javanese legend of Nyi Roro Kidul (Kanjeng Ratu Kidul, Queen of the Southern Sea), the old Raub gold mines, the Greek tale of Atlantis and Poseidon, Sabah's seaweed salad, Langkawi *gamat*, the dugong (*duyung*) behind the mermaid legends, sunken trading junks of the old spice route, Malaysian highland tea, Vietnam's red dunes, dragon fruit and Cham towers, Sang Kancil the mouse deer, and folk spirits: the Malay *semangat padi* and *orang bunian*, the Mekong *naga*, the Iban *kenyalang* and the Filipino *nuno sa punso*. All are drawn with affection and respect.
