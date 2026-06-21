# Singleplayer Sanguosha Web Demo

A local browser-based strategy card game demo inspired by Sanguosha, focused on readable solo identity-mode play against AI opponents.

## Preview

Screenshot/GIF placeholder: add a current gameplay screenshot before sharing this repository publicly, for example:

```text
docs/assets/gameplay-screenshot.png
```

## What This Is

This project is a single-player web game demo that runs locally in the browser. It recreates the feel of a tabletop identity-mode card game: selecting a mode, managing a hand, choosing targets, responding to events, tracking equipment/judgement states, and reading the table through player seats, center-table feedback, and a structured battle log.

The project was built as an AI-assisted coding exercise and is being prepared as a public portfolio/demo repository. It is not an official client, a commercial game, a multiplayer service, or a complete rules authority.

## Current Status

Playable demo. The core loop is implemented, including five-player and eight-player identity modes, local AI turns, card play, event resolution, battle logs, tooltips, and local career tracking. Some rules, AI heuristics, visual assets, and UX details are still being refined.

## Core Features

- Five-player and eight-player identity-game modes.
- Local AI opponents with public-information identity inference.
- Character and card pools inspired by classic Sanguosha-style identity play.
- Interactive hand area with playable, selected, response, and discard states.
- Equipment, judgement, chained/flipped, health, role, and hand-count state on player seats.
- Center-table event visualization for card use, judgement, damage, rescue, death, and identity reveal.
- Structured battle log for turn sections and key events.
- Hover tooltips for cards, skills, equipment, and public player state.
- Manual identity marking for the human player's own reads.
- Local save/career tracking through browser storage.
- Smoke, stability, and visual layout checks.

## Tech Stack

- Vanilla HTML, CSS, and JavaScript.
- Static browser app: no bundler and no runtime backend.
- Browser `localStorage` for save/career data.
- Node.js test scripts.
- Playwright/Chrome-based visual layout verification.

## Local Setup

There are currently no package dependencies and no install step.

```bash
# No install command is required.
```

Run directly:

```bash
open index.html
```

Or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Build

There is currently no build step. The app is a static HTML/CSS/JS project.

```bash
# No build command is required.
```

## Tests

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

## How To Play

1. Open the start screen.
2. Choose five-player or eight-player identity mode.
3. Choose a character pool, AI style, and player character.
4. Start a new game.
5. Use the hand area and action prompt to play cards, select targets, respond, discard, or end your turn.
6. Read the center event area and player seats to understand the current table state.
7. Use the battle log as supporting detail when you want to review what happened.
8. At the end of a game, review the result screen and career stats, then start another game.

## Known Limitations

- This is a local-only single-player demo; there is no online multiplayer.
- The rule engine is broad but not guaranteed to be a complete official implementation.
- AI behavior is heuristic-based and still being improved.
- Some assets, names, and card/character concepts are third-party or game-inspired and need review before broader distribution.
- The repository currently has no package manager, bundler, deploy pipeline, or automated screenshot generation.

## Roadmap

- Continue improving player-facing clarity for card use, responses, judgement, rescue, death, and identity reveal events.
- Improve AI support behavior and identity inference while preserving fair hidden-information boundaries.
- Audit and replace uncleared third-party visual assets where needed.
- Add a polished screenshot/GIF and short demo video for the public repository.
- Split the large game script into maintainable modules if the project continues beyond demo scope.
- Add a lightweight automated publish/deploy path if the game is hosted publicly.

## Attribution And Disclaimer

This is an unofficial, fan-made, non-commercial, educational portfolio demo inspired by Sanguosha-style strategy card play. It is not affiliated with, endorsed by, or sponsored by the owners or publishers of Sanguosha or any related trademarks, characters, artwork, card names, card text, or game systems.

Third-party names, characters, card concepts, card text, trademarks, and visual assets are not covered by this repository's source code license. See `NOTICE.md` for details.

## License

Original source code created for this project is licensed under the MIT License. The license applies to source code only and does not grant rights to third-party intellectual property or assets. See `LICENSE` and `NOTICE.md`.
