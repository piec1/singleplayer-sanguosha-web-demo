# AGENTS.md

## Project Summary

This is a local, browser-based, single-player card/strategy game inspired by Sanguosha. It started as a personal Codex-built project and is now being cleaned up as a public portfolio/demo repository.

The product goal is not to expose a rule-engine debugger. Future work should make the game feel like a polished tabletop card game: clear turns, clear prompts, readable player seats, understandable AI actions, and a UI that helps a normal player keep playing.

This is an unofficial, non-commercial fan/educational demo. Do not imply affiliation with, endorsement by, or ownership of the original game IP.

## Repository Structure

- `PLAY.html` - friendly launch file for non-technical users; it redirects to the real app entrypoint.
- `index.html` - static app shell and primary DOM structure.
- `game.js` - game rules, state, AI, rendering hooks, localStorage persistence, and test APIs.
- `styles.css` - full UI/theme/layout system. This file has many cascade guard sections; inspect before overriding.
- `assets/cards/` - local card images and manifest.
- `assets/portraits/` - local character portraits and manifest.
- `tests/smoke-test.mjs` - VM-based contract and rules/UI smoke checks.
- `tests/visual-layout-check.mjs` - browser visual/layout checks across desktop and mobile viewports.
- `tests/stability-test.mjs` - longer random-game stability matrix.
- `local-notes/` - ignored local-only working material, mockups, private notes, and prompt history.

## Install And Run

There is currently no `package.json` and no build step. Do not invent npm scripts unless a package manifest is intentionally added.

To run the app:

```bash
open index.html
```

Optional static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Test Commands

Use Node.js 20+ for the test files.

```bash
node --check game.js
node --check tests/smoke-test.mjs
node tests/smoke-test.mjs
```

If changing layout, CSS, rendering, or player-facing UI, also run:

```bash
node --check tests/visual-layout-check.mjs
node tests/visual-layout-check.mjs
```

The visual test requires Playwright and a local Chrome install. If Playwright is not installed in the repo, set `PLAYWRIGHT_MODULE_PATH`; set `CHROME_PATH` if needed.

For changes that affect turn flow, waits, AI actions, or rule resolution, also run:

```bash
node tests/stability-test.mjs
```

## Coding And UI Conventions

- Keep the app framework-free unless there is a deliberate migration plan.
- Preserve the existing single-page static deployment model.
- Prefer small, verifiable changes over broad rewrites.
- Do not expose internal diagnostics, AI hidden information, raw state dumps, or debug-only controls in the default player UI.
- Keep public-facing repository docs in English.
- It is acceptable for in-game card names and UI strings to use Chinese when that is part of the game experience.
- When changing CSS, check the later cascade sections before adding overrides. If a cache key in `index.html` changes, update tests that assert it.
- Player-facing UI should prioritize readability: no clipped text, no overlapped prompts, no off-screen buttons, and no reliance on battle log text alone for important events.
- AI behavior must remain fair in normal modes: do not let AI read hidden identities or hidden hand contents unless a clearly labeled debug/challenge mode does so.

## Files To Handle Carefully

- `game.js` contains rules, AI, rendering, and persistence in one large file. Read the surrounding functions before editing.
- `styles.css` is large and layered. Avoid adding one-off visual patches without checking existing sections and visual tests.
- `assets/` may contain third-party or generated visual material. Do not replace, relicense, or remove assets casually.
- `local-notes/` is intentionally ignored. Keep raw prompts, personal notes, generated mockups, and private planning material there.
- `README.md`, `NOTICE.md`, and `LICENSE` are public-facing. Keep them clean, English, and suitable for GitHub.

## Definition Of Done

Before reporting completion:

- Run the relevant syntax checks.
- Run `node tests/smoke-test.mjs` for any meaningful code/UI change.
- Run `node tests/visual-layout-check.mjs` for UI/CSS/layout changes and inspect key screenshots if the change is visual.
- Run `node tests/stability-test.mjs` for turn-flow, pending-state, AI, or rule-resolution changes.
- Confirm no private notes, raw prompts, local paths, API keys, or temporary artifacts were added to public-facing files.
- Summarize what changed, what was verified, and any remaining risk.
