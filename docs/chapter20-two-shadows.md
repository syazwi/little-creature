# Chapter 20, Part 2 — The Light That Came Back

## Claude Code handoff

Implement this encounter in **Janji Buaya Putih**, the Season 1 finale. Place it at the nest bank (`sarang20`) after the player rides Seri Putih through all six stolen lights. The player fights **Black Pelita** and **Bayang Diri** together. The first round ends in the player's death. **Pelita Putih** resurrects the player and becomes **Harimau Cahaya**, a white tiger with gold stripes, for a second round the player can win.

## Story and gameplay

### 1. The lantern on the bank

With the sixth light recovered, Seri Putih carries you to the bank. Sang Kancil sets a lantern on a dry ledge and listens to the lake.

> **Sang Kancil**  
> “Sit a moment. I’ll watch the water.”

Offer **Save Game** and **Begin Fight** at the lantern. Let the player use the usual save slots and show confirmation when the save succeeds. Loading a save made here restores the player to the lantern before combat and waits for **Begin Fight**. If the player saves and keeps playing, return them to the lantern prompt.

### 2. The first fight

Black Pelita rises out of the lake. Your reflection stands up in the shallows with your weapon in its hand. It’s Bayang Diri, the reflection from Pintu Cermin.

> **Black Pelita**  
> “You brought Seri Putih all this way to say goodbye. When will it be my turn?”
>
> **Bayang Diri**  
> “In Pintu Cermin, I watched you get up every time you fell. I know exactly how you fight.”

For players who have yet to meet Bayang Diri in Pintu Cermin, use this line instead.

> “Every time you leaned over the water, I was there. I know the way you hold that weapon.”

The objective is **Hold them off**. The player controls movement, dodges, attacks, and skills while both bosses fight. Give the player enough time to see a dark ring and a Pantul warning. Aim for roughly **20 seconds of active combat**, with an earlier transition if the player's health reaches zero. Both bosses survive this round.

Black Pelita closes a dark ring around the player. Bayang Diri lands the killing blow, and the lantern goes out. Run the resurrection scene here on the bank as the next story event.

### 3. Pelita Putih brings you back

In the dark, you hear the scrape of a bowl against wood. It’s the sound of the first bowl of nasi you set down for Pelita.

A white flame slips through a crack in Black Pelita’s heart. **Pelita Putih** settles on your chest. The flame dims as your heart starts beating again.

> **Pelita Putih**  
> “You stayed with me until I could stand. Take your time. I’m here.”

You get to your feet. Pelita’s light stretches across the wet sand into four paws. A white tiger with gold stripes steps between you and the shadows. This is the first appearance of **Harimau Cahaya**.

Restore the player's health, clear first-round hazards, and return control as the tiger takes its place beside the player.

### 4. The rematch

The objective becomes **Defeat Bayang Diri and Black Pelita**. Give both bosses visible health bars. Harimau Cahaya fights beside the player throughout this round.

- **Bayang Diri** casts **Mantera Pantul** in both rounds. Show the mirror shimmer before it can reflect the player's spell projectiles. In the rematch, a melee strike or a tiger pounce gives the player an opening while Pantul is active.
- **Black Pelita** sends dark rings across the bank. In the rematch, Harimau Cahaya tears a visible gap through the rings for the player to run through.
- Defeating both bosses triggers the ending. If the player loses the rematch, offer **Retry Rematch** to restart with Harimau Cahaya at their side.

### 5. The heart opens

When Bayang Diri falls, it watches you put down your weapon and reach toward Black Pelita.

> **Bayang Diri**  
> “You came back for it too?”

Bayang Diri steps into the lake and sinks back into your reflection. The tiger lowers its head beside Black Pelita. The crack in its heart opens wide enough for you to climb through. Inside, you hear Pelita crying.

You pick up the bowl of nasi and go in. Continue into the existing scene inside the Shadow, where the player finds and feeds Pelita.

## Implementation notes

- In `src/scenes/WorldBuaya2.js`, look at `buayaRideEnd`, the nest setup on Chapter 20 step 15, and `buayaHeartJump`. Integrate the encounter as part of step 15 so both arriving from the lake and loading the lantern save reach the correct scene. Hand off to step 16 and `dalam20` through the heart-entry flow.
- Reuse Bayang Diri's art and Pantul behavior in `src/scenes/WorldBunianMirror.js`. Use Chapter 20 state to track the two rounds, and scope the Pintu Cermin win and loss tally to its own trial.
- Reuse Black Pelita's lake sprite and the Harimau Cahaya art in `src/art34.js`. Use a fight-specific tiger summon here. Award the permanent Pelita Putih form and repeatable Harimau Cahaya skill through the existing Chapter 20 reward scene.
- Hook the pre-fight checkpoint into the existing save and resume flow. Store temporary fight state separately from the lantern save so a reload during either round returns to the ledge. Older step 14 saves finish the lake ride, step 15 saves without a completed rematch start at the lantern, and step 16 saves continue inside the Shadow. Make the scripted death and resurrection advance once, including when the player skips dialogue. Support keyboard, touch, and the Chapter 20 developer route.

## Verify before release

- Save at the lantern, leave the game, and load back to the same ledge before combat.
- Fight with player control in round one. Verify that both strong and weak characters reach the death and resurrection scene.
- Verify that Bayang Diri reflects spells with Pantul in both rounds and that melee and tiger attacks work during the rematch.
- Win the rematch, enter the heart, and reach the existing nasi scene. Verify the handoff on both a normal playthrough and the developer route.
