# Little Creature

*A cozy spirit-keeping farm game from the kampung.* Plays on PC (Windows, macOS, Linux) and Android.

Nenek has left you her stilt house by the river and a tiny spirit named **Pelita** living in the spirit house beside the stairs.
You farm by day, cook at the clay stove, and leave offerings so Pelita's light grows from a weak flicker into the **Guardian of the Kampung**.

## Play it

### On a computer: double-click and play
- **Easiest:** download [`dist/LittleCreature.html`](dist/LittleCreature.html). It is **one file** containing the whole game. Copy it anywhere (a USB stick, another PC) and double-click it to open it in any browser. No install and no internet needed.
- **Or:** download this whole repository (**Code → Download ZIP**), unzip it, and double-click **`index.html`**.

### On an Android phone
1. On your phone, open [`dist/LittleCreature.apk`](dist/LittleCreature.apk) on GitHub and tap **Download** (the ⋯ / download button).
2. Open the downloaded file. If Android asks, allow your browser or Files app to **install unknown apps**.
3. Tap **Install**, then open **Little Creature**. It plays fullscreen in landscape and fully offline.

> Android may warn that the app isn't from the Play Store. That's normal for apps you install yourself.
> If you already have an older version installed, installing the new APK updates it and keeps your save.

### With friends (co-op, up to 4 players)
PC browsers and Android phones can all play together.

1. **One player hosts.** On the title screen choose **Play with Friends**, type your name, and press **Open my farm**. You can also pick **Invite friends** in the pause menu while you're playing. You get a **5-letter code**. It's also shown at the top of the screen and in the pause menu.
2. **Friends join.** Each friend chooses **Play with Friends**, types their name and **your code**, and presses **Join farm**.
3. Everyone walks around the same farm in a different-coloured outfit, with name tags.

| Shared by everyone | Your own (kept on your device) |
|---|---|
| Fields, crops, trees, the clock and the day | Bag, hotbar and kepeng |
| Pelita (feeding, petting, offerings, bond, growth) | Energy and watering can |
| | Cooking, crafting, and buying or selling at the warung |

- Pelita follows whoever fed or petted it last.
- **Only the host ends the day.** When the host sleeps, everyone sleeps and sees the day summary. A friend can use the house to tell the host they're sleepy.
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
| Music on/off | M | Pause menu |

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
- **Growth.** Pelita grows through 5 stages: Flicker → Little Spirit → Lantern Spirit → Garden Spirit → Guardian. Each stage brings a blessing.

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
src/                  game code: data, state, sim (shared-farm rules), net (co-op), lobby, procedural art + audio, scenes
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
- **Cultural inspirations:** Thai/Lao/Khmer spirit houses, Malay *rumah panggung* and *kampung* life, Balinese *canang sari*, Thai *phuang malai*, Hungry Ghost Festival traditions, and Loy Krathong / Yi Peng lanterns. All are drawn with affection.
