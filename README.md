# Singleplayer Sanguosha

A solo browser card table with hidden roles, AI opponents, and just enough chaos to feel alive.

This is a playable, local web game inspired by Sanguosha-style identity play: pick a seat, read the table, survive the politics, and see if your reads are better than the AI's. 🎴

## Open The Game In 30 Seconds

No install. No account. No command line.

1. Click the green **Code** button on this GitHub page.
2. Click **Download ZIP**.
3. Unzip the downloaded folder.
4. Open the folder.
5. Double-click **`PLAY.html`**.
6. If that does not work, double-click **`index.html`** instead.

That is it. The game runs locally in your browser.

## What Makes It Fun

- **Hidden roles:** not everyone at the table wants the same thing.
- **AI opponents:** the other seats act on public information and visible behavior.
- **Readable table state:** cards, targets, damage, judgement, death, and identity reveals are shown on the table and in the battle log.
- **Manual reads:** mark who you think is loyal, rebel, or neutral as the game unfolds.
- **Two table sizes:** play a faster five-player identity game or the fuller eight-player mode.
- **Local career stats:** your browser keeps lightweight match history so each game does not feel like a one-off. ⚔️

## How To Play

1. Open **`PLAY.html`** or **`index.html`**.
2. Choose five-player or eight-player identity mode.
3. Pick a character, character pool, and AI style.
4. Start a new game.
5. Follow the prompt at the bottom of the table: play cards, choose targets, respond, discard, or end your turn.
6. Watch the center table and battle log to understand what just happened.
7. Use your own identity marks as your read on the table changes. 🕵️

## Current Status

Playable demo. The core loop is implemented: five-player and eight-player identity modes, local AI turns, card play, responses, judgement, damage, rescue, death, battle logs, hover tooltips, and local career tracking.

This is still a personal portfolio/demo project, not a complete official rules engine. Some rule details, AI heuristics, visual polish, and assets are still being refined.

## Preview

Screenshot/GIF placeholder: add a current gameplay screenshot before sharing this repository widely, for example:

```text
docs/assets/gameplay-screenshot.png
```

## For Developers

### Tech Stack

- Vanilla HTML, CSS, and JavaScript.
- Static browser app: no bundler and no runtime backend.
- Browser `localStorage` for save/career data.
- Node.js test scripts.
- Playwright/Chrome-based visual layout verification.

### Main Files

- `PLAY.html` is the friendly launch file for non-technical users.
- `index.html` is the real app entrypoint.
- `game.js` contains the game logic, AI, rendering hooks, and persistence.
- `styles.css` contains the visual styling and layout system.
- `assets/` contains images used by the game.

### Local Setup

There are currently no package dependencies and no install step.

```bash
# No install command is required.
```

Run directly from the project folder:

```bash
open index.html
```

Or serve the folder locally if browser file restrictions get in the way:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

### Build

There is currently no build step. The app is a static HTML/CSS/JS project.

```bash
# No build command is required.
```

### Tests

Use Node.js 20+.

Basic syntax and smoke checks:

```bash
node --check game.js
node --check tests/smoke-test.mjs
node tests/smoke-test.mjs
```

For UI, CSS, layout, or rendering changes:

```bash
node --check tests/visual-layout-check.mjs
node tests/visual-layout-check.mjs
```

For rule flow, pending-state, AI, or long-game stability changes:

```bash
node tests/stability-test.mjs
```

The visual test expects Playwright and a local Chrome installation. If Playwright is not installed in this repository, set `PLAYWRIGHT_MODULE_PATH` to an existing Playwright package path. Set `CHROME_PATH` if Chrome is installed somewhere other than the default path.

## Known Limitations

- This is a local-only single-player demo; there is no online multiplayer.
- The rule engine is broad but not guaranteed to be a complete official implementation.
- AI behavior is heuristic-based and still being improved.
- Some assets, names, and card/character concepts are third-party or game-inspired and need review before broader distribution.
- The repository currently has no package manager, bundler, deploy pipeline, or automated screenshot generation.

## Roadmap

- Add a polished screenshot/GIF and short demo video for the public repository.
- Continue improving player-facing clarity for card use, responses, judgement, rescue, death, and identity reveal events.
- Improve AI support behavior and identity inference while preserving fair hidden-information boundaries.
- Audit and replace uncleared third-party visual assets where needed.
- Split the large game script into maintainable modules if the project continues beyond demo scope.
- Add a lightweight hosted demo path if the game is shared more broadly.

## Attribution And Disclaimer

This is an unofficial, fan-made, non-commercial, educational portfolio demo inspired by Sanguosha-style strategy card play. It is not affiliated with, endorsed by, or sponsored by the owners or publishers of Sanguosha or any related trademarks, characters, artwork, card names, card text, or game systems.

Third-party names, characters, card concepts, card text, trademarks, and visual assets are not covered by this repository's source code license. See `NOTICE.md` for details.

## License

Original source code created for this project is licensed under the MIT License. The license applies to source code only and does not grant rights to third-party intellectual property or assets. See `LICENSE` and `NOTICE.md`.
