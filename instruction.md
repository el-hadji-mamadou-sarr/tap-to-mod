Tap to Mod
A Tap-Only Reddit Moderation Game (Devvit Hackathon)
🎯 High Concept
Tap to Mod is a fast-paced, tap-only reflex game where the player assumes the role of a Reddit moderator.
Posts scroll down the screen automatically in a simulated Reddit feed. The player must tap to remove bad posts and ignore good ones.
Let too many bad posts slip through, or remove too many good ones, and the subreddit collapses.

Designed for:

Reddit-native interaction (embeds as an interactive Devvit app)

10–30 second sessions (bite-sized gameplay)

One-input gameplay (tap only)

Daily challenges and leaderboards

🔁 Core Gameplay Loop
Posts scroll downward continuously from the top of the feed

Player taps posts they identify as bad (spam, scams, low-effort)

Correct removals increase score and maintain subreddit health

Wrong removals (removing a good post) damage subreddit health

Missed bad posts also drain health over time

When health reaches zero → game over

Score is displayed, option to restart instantly

🕹️ Controls
Single input only: Tap / click on a post card to remove it

No other buttons, gestures, or menus during gameplay

Tap accuracy and speed are key

🖼️ Game Screen Layout (Reddit Post Style)
Top Bar
Subreddit name: r/TapToMod

Subreddit Health Bar (visual progression):

Green (100%–60%): Healthy

Yellow (59%–30%): Unstable

Red (29%–0%): Critical

Smooth color transition with fill animation

Main Feed Area
Vertical list of post cards (max 5–7 on screen)

Posts auto-scroll downward at a speed that increases over time

New posts spawn from the top at random intervals (0.8–1.5s)

Posts disappear off the bottom of the screen if not acted upon

Bottom Hint (only shown during first 3 seconds of gameplay)
👉 TAP ANY POST TO REMOVE

📄 Post Card Structure
Each post is a card with:

Title text (formatted with potential clues)

Username (may be suspicious or normal)

Karma value (can be fake / simulated, e.g., negative karma for bots)

Optional emojis or formatting clues (bold, spammy symbols)

Example Bad Post:

text
🚀 FREE CRYPTO NOW!!! 🔥🔥🔥
u/DefinitelyNotAScam
karma: -42
REMOVE
Example Good Post:

text
Just a normal discussion post
u/ActualHuman
karma: 120
✅❌ Post Types
Bad Posts (Should Be Removed)
All caps titles

Emoji spam (≥3 emojis)

Obvious scams or clickbait (“FREE”, “INSTANT”, “CLICK HERE”)

Reposts / low-effort content (“upvote if…”)

Suspicious usernames (e.g., “Bot_”, “Spammer”, “NotAScam”)

Negative karma values

Posts tagged with [REMOVE] in the mock data

Good Posts (Should NOT Be Removed)
Normal sentence-case titles

Neutral formatting (no emoji spam)

Reasonable usernames (e.g., “ActualHuman”, “FriendlyUser”)

Positive or neutral karma

Discussion-style content

Bait Posts (Advanced Difficulty)
Look suspicious but are valid (e.g., excited but legitimate post)

May have one bad trait but otherwise good

Introduced after level 3

📈 Scoring
+10 points for correctly removing a bad post

Combo multiplier: +1 multiplier for each consecutive correct removal (max ×5)

-5 points for incorrect removal (penalty)

Score displayed during gameplay in top-right (optional)

Final score displayed on game over screen with accuracy percentage

❤️ Subreddit Health System
Starts at 100%

Wrong removal: immediate −15% health

Missed bad post: delayed −10% health (triggers when post leaves screen)

Visual feedback:

Health bar decreases with animation

Screen flash red on health loss

Low health alarm sound at <30%

Game ends when health reaches 0%

🚀 Difficulty Progression (Level-Based)
Each level is stored in level.ts and loaded sequentially.

Level 1: Training
Slow scroll speed

Clear good/bad distinction

3 posts max on screen

Health loss minimal

Level 2: Novice Mod
Slightly faster scroll

4 posts on screen

Karma values more varied

First bait posts appear

Level 3: Active Sub
Medium scroll speed

5 posts on screen

More subtle spam (fewer emojis, clever scams)

Combo system introduced

Level 4: Hot Subreddit
Fast scroll speed

6 posts on screen

Mixed bait and spam

Health drains faster

Level 5: Chaos Mod
Very fast scroll

7 posts on screen

Hard-to-spot bad posts

Limited time to react

🧠 Level Data Structure (level.ts example)
typescript
interface Level {
  id: number;
  name: string;
  scrollSpeed: number;
  maxPostsOnScreen: number;
  spawnInterval: [number, number]; // min, max in seconds
  goodPostRatio: number; // 0–1
  baitPostRatio: number; // 0–1
  healthDrainMultiplier: number;
  posts: {
    title: string;
    username: string;
    karma: number;
    isBad: boolean;
    tags: string[];
  }[];
}

// Example level data
export const level1: Level = {
  id: 1,
  name: "Training",
  scrollSpeed: 1.0,
  maxPostsOnScreen: 3,
  spawnInterval: [1.2, 1.8],
  goodPostRatio: 0.5,
  baitPostRatio: 0,
  healthDrainMultiplier: 1.0,
  posts: [...]
};
🎨 Feedback & Juice
On correct removal:

Red “REMOVE” stamp animation (fade + scale)

Satisfying “pop” sound effect

Combo counter increments with visual bump

On wrong removal:

Error buzz sound

Health bar flashes red

Post shakes briefly

On missed bad post:

Post glows red as it leaves screen

Delayed health drop with sound cue

On low health:

Alarm sound loop

Screen shake or pulse effect

Health bar pulses red

⏱️ Session Length
Average run: 15–30 seconds

Instant restart with tap on game over screen

Designed for repeat plays and high-score chasing

📅 Daily Mode (Optional Extension)
One fixed moderation queue per day (pre-generated)

Same posts, same order for all players worldwide

One attempt per day

Players share scores in comments via Devvit’s comment API

Daily leaderboard with top moderators

🎭 Tone & Style
Light, satirical, and playful

No real moderation politics—exaggerated Reddit tropes only

Clean, minimal Reddit-like UI with custom game elements

Accessible and intuitive for casual players

🛠️ Hackathon Implementation Notes
Built as an interactive Devvit post using Canvas or UI components

Uses deterministic logic (no backend required for demo)

Fake data is acceptable for MVP

Focus on polish and feel over feature breadth

Level data stored in level1.ts, level2.ts, etc., loaded via loadLevel(id)

 Additional Instructions for Cursor/Development
Each level is stored in its own level{id}.ts file under /src/levels/

Levels can be loaded dynamically via import(./levels/level${id}.ts) or a central registry

Game state should be serializable for instant replay and daily challenge consistency
