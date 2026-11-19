# Little Creature

*A cozy spirit-keeping farm game from the kampung.* Plays on PC (Windows, macOS, Linux) and Android.

Nenek has left you her stilt house by the river and a tiny spirit named **Pelita** living in the spirit house beside the stairs.
You farm by day, cook at the clay stove, and leave offerings so Pelita's light grows from a weak flicker into the **Guardian of the Kampung**.
As Pelita levels up, its light opens the way to the wider land: a riverside village to rebuild, a rainforest with a hidden Bunian village, a pearl island, a village beneath the waves (and a sunken ship, a sea queen's palace and Atlantis below it), a misty mountain with a haunted gold mine, and red dunes. There you fish, raise chickens, ducks and goats, compete at the weekly Pesta, build houses with the villagers, ride a bicycle or drive a car, train your strength, fight the shadows of the mine, and befriend spirits from Southeast Asian folklore. The seasons turn every week, from the planting rains to the fruit season, the dry season and the monsoon. Once Pelita becomes a Legend, the story carries on: Chapter 2 brings fourteen brothers together to found Barunai, and Chapter 3 builds Kampong Ayer, the water village, where two roosters become legends, a jinn is beaten, and Pelita shows you the city in 1521 and 1578.

## Play it

### On a computer: double-click and play
- **Easiest:** download [`dist/LittleCreature.html`](dist/LittleCreature.html). It is **one file** containing the whole game. Copy it anywhere (a USB stick, another PC) and double-click it to open it in any browser. No install and no internet needed.
- **Or:** download this whole repository (**Code → Download ZIP**), unzip it, and double-click **`index.html`**. (`index.html` needs the folders next to it, so to copy just one file, use `dist/LittleCreature.html`.)
- The game fills the whole browser window at any size. Press **F** (or use the pause menu) to go fullscreen.
- Saves are kept by the browser on that PC. A different PC or browser starts its own farm. There are **three save slots**: see [Saving and loading](#saving-and-loading).
- **Testing build:** [`dist/LittleCreature_full.html`](dist/LittleCreature_full.html) starts with everything unlocked (Pelita Lv 30 with a 72-slot bag, Nenek's house fully grown, every place, spirit, weapon and vehicle, 99,999 kepeng, max strength, Sumpahan Batu and Restu Ibu, Badang already strong, 3 bubu). It uses its own saves, so your real farm is never touched. Test keys: **]** next day, **[** next season, **\** next Pesta, **H** full health (and abilities ready), **T** replay Si Tanggang's story (switch between "before the reunion" and "reunited"), **B** replay Badang's story (switch between "skinny, on the night watch" and "the strongest man in the land"), **K** jump to the next step of Chapter 2, **L** jump to the next step of Chapter 3, parts 1 and 2 (it finishes Chapter 2 first).
- If double-clicking opens the file in something other than a browser, right-click it and choose **Open with → Microsoft Edge** (or Chrome or Firefox).

### On an Android phone
1. On your phone, open [`dist/LittleCreature.apk`](dist/LittleCreature.apk) on GitHub and tap **Download** (the ⋯ / download button).
2. Open the downloaded file. If Android asks, allow your browser or Files app to **install unknown apps**.
3. Tap **Install**, then open **Little Creature**. It plays fullscreen in landscape and fully offline. The game fills the whole screen, edge to edge (including beside the camera notch), and the HUD stays clear of the notch.

> Android may warn that the app isn't from the Play Store. That's normal for apps you install yourself.
> If you already have an older version installed, installing the new APK updates it and keeps your save.

### Updates
From v1.7.1 the game checks GitHub for a newer version whenever it starts with internet. The title screen shows your version and the date and time it was made (bottom-left).
- **When a newer version is out,** the title screen shows **"New version … is ready! (updated …)"** with that version's date and time, you get one reminder in the game, and **Pause → Updates** offers the download. Pause → Updates can also check again at any time.
- **On Android,** tapping it downloads the new APK in your browser. Open it and tap **Install**: it installs over the old app and keeps your farm. (Android always asks you to confirm an install, so updates can't happen completely by themselves.)
- **On a computer,** it opens the new HTML file's GitHub page. Download it and put it in place of the old file (same name, same folder) so your saves carry over.
- Without internet, nothing changes: the game just plays as usual.
- For whoever publishes: `tools/build.ps1` writes the version (from `android/app/build.gradle`) and the build time into `src/version.js` and `dist/version.json`. Bump `versionCode`, build, and push: players see the update once `dist/version.json` is on GitHub.

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
| Houses built in the kampung, spirits befriended, the land Badang clears, Nenek's house, the helpers and the pantry | Villager friendship and requests, your fish log, your bubu, your bike and car, Badang at your side |
| | Cooking, crafting, fishing, and buying or selling |

- Friends can explore different places at the same time. You see each other when you are in the same place.
- Pelita follows whoever fed or petted it last, even into another place. Your spirit companion is visible to friends too.
- **Only the host ends the day.** When the host sleeps, everyone sleeps (wherever they are, they wake up at the farm) and sees the day summary. A friend can use the house to tell the host they're sleepy.
- The host's farm is saved on the host's device, in the slot it was opened from. A friend's bag (with kepeng, strength and quests) goes home with them, so they can bring it to the next session and carry on.
- **Saving and loading together.** When the host saves (pause menu → **Save game**), every friend's bag is saved too. When the host loads a farm (pause menu → **Load game**), everyone is taken to the loaded farm and keeps their own bag. Friends can also save their bag any time (pause menu → **Save my bag**).
- Co-op needs internet. Friends connect directly to each other (WebRTC, via [PeerJS](https://peerjs.com)). Solo play stays fully offline.

## Controls

| Action | Keyboard | Touch (phone/tablet) |
|---|---|---|
| Move | WASD / Arrow keys | Drag anywhere on the left side (floating joystick) |
| Interact / use item | E / Space / Enter | **USE** button (glows gold when something can be done) |
| Select hotbar slot | 1 – 9, mouse wheel | Tap a slot |
| Eat the selected food | X | **EAT** button |
| Bag (and **Throw away**) | Tab / I (T or Delete throws the selected item away) | **BAG** button |
| Pause menu | Esc | **II** button (top), or Android **Back** |
| Map (this place, and the whole land) | M | **MAP** button (top) |
| Music on/off | N | Pause menu |
| Volume of the music, battle music, sound effects and nature | Pause menu → **Sound & music** | Same |
| Save / load (3 slots) | Pause menu → **Save game** / **Load game** | Same |
| Fullscreen | F | Automatic (Android app, and phone browsers on the first tap) |
| Journal | J | Pause menu → Journal |
| Ride / get off (bicycle, car) | R | Select it in the hotbar and press **USE** |
| Put on / take off the Bunian glasses | G | Select them and press **USE** |
| Swing a weapon (wherever enemies roam) | E | **USE** |
| Stone curse (Sumpahan Batu, once you have it) | V | Tap the stone beside the hotbar |
| Giant stride (Langkah Semaun, Chapter 2) | Shift | Tap the footprints beside the hotbar |

Touch controls switch on automatically on touch screens. You can toggle them in the pause menu, where **Sound & music** also sets the volume of the music, the battle music, the sound effects and the nature sounds.

## How to play

- **Farm.** Till the fenced field with the **Cangkul**, plant seeds, and water them with the **Gembor**. Refill it at the well or the river. Watered crops grow one stage per night. **Padi** grows only in the flooded sawah and needs no water.
- **Gather.** Banana trees, coconut palms and the mango tree regrow fruit every few days.
- **Cook.** Use **Nenek's Dapur** (the clay stove). Dishes fill Pelita far more than raw crops. Favourites are marked with a heart.
- **Offer.** Use the **spirit house**. Incense (*colok*), jasmine garlands (*phuang malai*) and flower trays (*canang*) raise Pelita's **Glow**.
- **Care.** Feed Pelita, pet it, and meet its **daily craving** (shown in its thought bubble).
- **Trade.** **Mak Ani's warung** on the east road (7 AM – 8 PM) sells seeds, colok and *air merah*, and buys your harvest.
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
| **Lombong Puaka**, the haunted gold mine | Lv 9 | The old mine shaft in Gunung Kabus | Darkness, shadows that attack, gold seams, cave crystals, a blind cave fish, the stone guardian |
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
- **The Pesta (every Sabtu, 8 AM - 6 PM).** At the pavilion in Kampung Tepian, enter the contests, each once a week. Beat three rivals in a row to be champion:
  - **Wau Aduan** (kite fighting): tap to keep your string's tension in the green as the wind shifts, to cut your rival's string. Buy a *wau* from **Pak Wan**, the kite and top maker from Kelantan (the *wau bulan* is steadier).
  - **Gasing Uri** (top spinning): time the wind-up and the throw; the longest spin wins.
  - **Ratu Serama** (the Serama show): your bird's love and grooming (with a *sikat*) count for half, and its poses for the rest.
  - **Lempar Batu** (stone throwing, once Badang is strong): Badang throws, you cheer. Tap in time as he lifts, spins and throws; the longest throw wins. His friendship adds a little distance. The last rival is Benderang, a strongman from across the strait.
  - Prizes: kepeng for each round, and for the champion money, food or sometimes a rare treasure, plus a trophy the first time. Practise any day, for no prize.
- **Strength.** Lift the **batu angkat** (training stone) in the kampung once a day, train silat with Kesuma in the hidden village once a day, and eat home-cooked dishes (twice a day). Strength raises your health.
- **The Bunian's secret.** After you befriend the Orang Bunian in the forest, it asks for 3 *madu tualang* (wild honey from the bees' nests by the giant tualang trees), a *pengat durian* and 4 *melati*. Its gift is the **Bunian glasses**. Wear them by the oldest tualang in the west of the forest and a golden gate appears, leading to **Kampung Bunian**, a hidden village with more people: Tok Batin the elder, Dang Melur's rare goods (golden fruit, oil-less lamps, strength tonic) and Kesuma the silat master. In the middle of the village, a **keris** is stuck in a stone. With 60 strength you can draw it out.
- **Lombong Puaka, the haunted gold mine (Pelita Lv 9).** A cursed mine shaft in Gunung Kabus. It is dark (Pelita's glow helps), and shadows, ghost bats and giant centipedes attack you. A stone guardian waits in the deepest hall. Hold a weapon and press USE to swing: a rattan staff (make it from 4 rotan, or buy it from Pak Wan), a *parang* (Tukang Leong), the keris, or the sea king's trident. Mine gold seams and crystals and fish the underground pool. Your health shows in the top-left panel, and food heals you. If it runs out you faint, wake up at home and drop half of your gold.
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
  - **Ladang Badang.** Huge stumps and boulders cover the land just south of Nenek's fenced field. For a feast (3 Nasi Lemak and 300 kepeng) Badang clears it in one night, and you wake up to a **new field** to till and plant.
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
  - **Rumah Dapur** (15,000 kepeng, 40 kayu, 20 batu, 10 tanah liat, 2 tempayan from Mak Thuy): a grand kitchen wing and carved golden gables, a bigger pantry (48 stacks), +20 more max energy. Room for 3 helpers.
- **Hire helpers.** Their wages come out of your kepeng every morning (a helper you can't pay takes the night off). Everything they make goes into the pantry:
  - **Mak Som**, the cook (80 a day): cooks up to 5 dishes a night from the ingredients you leave in the pantry, the best ones she can.
  - **Pak Hamid**, the farmhand (70 a day): waters the whole field every night, harvests what is ripe, and replants it with seeds you leave in the pantry.
  - **Kak Nur**, the gatherer (50 a day): picks the ripe fruit on the farm and collects the eggs and milk from the reban.
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

### Chapter 3: Kampong Ayer, part 1 (v2.0)
**Chapter 3** begins once Chapter 2 is complete. It follows the history of **Kampong Ayer**, the water village of Brunei, and the Brunei Bay legend of the two roosters.
- **Why build on the water?** Pateh Berbai explains: the river is a road, fish swim under the floors, trading boats come right to the steps, and the floods cannot take what is already on the water.
- **Build the village, in three stages**, with Pateh Berbai. New materials: **nibong poles** (cut from the nibong palms on the hills of Barunai) and **belian ironwood** (it never rots in water: on the eastern hill of Barunai and in the oldest part of Hutan Rimba).
  1. **The craft quarter**: a double walkway with five workshops, and five new neighbours. **Wak Juru** the blacksmith tempers your blades (+1 damage with every weapon), **Dang Kemala** the brassmith lines your gembor with brass (+10 water) and sells brass jugs, **Mak Dayang** the weaver sells *kain tenunan*, **Pak Lajak** the boat builder runs a **water taxi** around the village (and builds you your own perahu, so it is free), and **Awang Kilau** the goldsmith makes a **golden plate** and pays well for gold.
  2. **The floating market**: every morning from 6 AM to 2 PM, two **padian** women paddle up to the landing by the west jetty with whatever is fresh that day.
  3. **New homes over the river**: five sets of empty pilings. Build a house on each, in one of three styles, and a family from the hills moves in (and you can restyle it later).
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
                      net (co-op), lobby, procedural art (art.js ... art10.js) + audio, data2/areas2/undersea (v1.5 content),
                      battle.js (v1.6: wild enemies, abilities, Mak Deruma), badang.js (v1.7: Badang, the hantu, bubu,
                      Ladang Badang, Lempar Batu), barunai.js (v1.9: Chapter 2), kampong.js + kampong2.js (v2.0-2.1: Chapter 3), home.js (v1.8: house stages, helpers, bigger bag,
                      Lv 30, Mak Thuy and Pak Tam), version.js + update.js (update check), cheats.js (test build only),
                      scenes (World + WorldLife, WorldFarm, WorldCombat, WorldTanggang, WorldBadang, WorldHome, WorldBarunai,
                      WorldKampong, WorldKampong2; UI + UIMenus, UIGames, UISettings, UIBadang, UIHome, UIBarunai,
                      UIKampong, UIKampong2)
lib/                  Phaser 3.80.1 (MIT), PeerJS 1.5.4 (MIT) and the Pixelify Sans font (SIL OFL 1.1), vendored
icons/                app icons
android/              Android wrapper app (WebView). It packages the web game from the root at build time.
tools/                build-web.mjs (single-file HTML, and the version stamp), make-icons.mjs, build.ps1
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
- **Cultural inspirations:** Thai/Lao/Khmer spirit houses, Malay *rumah panggung* and *kampung* life, *gotong-royong* and the *kenduri*, Balinese *canang sari*, Thai *phuang malai*, Hungry Ghost Festival traditions, Loy Krathong / Yi Peng lanterns, Malay *wau* kites, Javanese batik and *jamu*, Kelantan's *wau bulan* and *gasing*, Malaysian Serama chickens, *silat*, the keris, *ais kacang* and the fruit season, the Malay legend of Si Tanggang, the tale of Badang the strongman and his stone from the *Sejarah Melayu* (Malay Annals), the Bruneian epic *Syair Awang Semaun* (the fourteen brothers and the founding of Brunei, "Baru nah!") and Kampong Ayer, the water village on stilts (its nibong and belian pilings, craft villages and *padian* floating market), the Brunei Bay legend of the roosters Mutiara and Asmara (Pulau Pilong-Pilongan and Lumut Lunting), Awang Semaun and Awang Jerambak's fight with the jinn Bilanapura, Antonio Pigafetta's 1521 account of the city built in salt water, the 1578 defence of Kampong Ayer (the Castilian War), Brunei's brass *lantaka* cannons, bamboo *bubu* fish traps, the Javanese legend of Nyi Roro Kidul (Kanjeng Ratu Kidul, Queen of the Southern Sea), the old Raub gold mines, the Greek tale of Atlantis and Poseidon, Sabah's seaweed salad, Langkawi *gamat*, the dugong (*duyung*) behind the mermaid legends, sunken trading junks of the old spice route, Malaysian highland tea, Vietnam's red dunes, dragon fruit and Cham towers, Sang Kancil the mouse deer, and folk spirits: the Malay *semangat padi* and *orang bunian*, the Mekong *naga*, the Iban *kenyalang* and the Filipino *nuno sa punso*. All are drawn with affection and respect.
