# GitHub Publishing Guide

This guide explains how to publish this existing local project as a public GitHub repository. Do not publish until you have reviewed the files that will become public.

## 1. Pre-Publish Review

From the project root:

```bash
pwd
find . -maxdepth 3 -type f | sort
```

Check that local-only materials are ignored:

```bash
cat .gitignore
```

Before publishing, manually review:

- `README.md`
- `LICENSE`
- `NOTICE.md`
- `AGENTS.md`
- `index.html`
- `game.js`
- `styles.css`
- `assets/`
- `tests/`

Make sure private notes, raw prompts, local screenshots, API keys, environment files, personal paths, and temporary files are not being staged.
The `local-notes/` folder is intentionally local-only and should not appear on GitHub.

## 2. Run Local Verification

There is no dependency install step and no build step at the moment.

Run the available checks:

```bash
node --check game.js
node --check tests/smoke-test.mjs
node tests/smoke-test.mjs
```

For UI/layout changes, also run:

```bash
node --check tests/visual-layout-check.mjs
node tests/visual-layout-check.mjs
```

If Playwright is not installed inside this repository, provide an existing Playwright package path:

```bash
PLAYWRIGHT_MODULE_PATH=/path/to/node_modules/playwright node tests/visual-layout-check.mjs
```

For rule-flow or AI changes, also run:

```bash
node tests/stability-test.mjs
```

## 3. Initialize Git If Needed

Check whether the folder is already a Git repository:

```bash
git status
```

If you see an error such as `not a git repository`, initialize Git:

```bash
git init
git branch -M main
```

## 4. Stage And Commit

Inspect what Git sees:

```bash
git status --short
git diff --stat
```

Stage files:

```bash
git add .
```

Review staged files before committing:

```bash
git status --short
git diff --cached --stat
```

Commit:

```bash
git commit -m "Prepare public demo repository"
```

## 5. Option A: Create The GitHub Repository With GitHub CLI

Install and authenticate GitHub CLI first if needed:

```bash
gh auth login
```

Create a public GitHub repository without pushing code yet:

```bash
gh repo create singleplayer-sanguosha-web-demo --public
```

If you want a different repository name, replace `singleplayer-sanguosha-web-demo`.

After the repository exists and you are ready to upload code, connect this local folder to the GitHub repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/singleplayer-sanguosha-web-demo.git
git push -u origin main
```

## 6. Option B: Create The Repository Manually

Create an empty public repository on GitHub in the browser first. Do not initialize it with a README, license, or `.gitignore` because this local folder already contains those files.

Then, when you are ready to upload code, connect and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/singleplayer-sanguosha-web-demo.git
git push -u origin main
```

If a remote already exists, inspect it:

```bash
git remote -v
```

To replace an incorrect remote:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/singleplayer-sanguosha-web-demo.git
git push -u origin main
```

## 7. After Publishing

Open the GitHub repository page and check:

- The README renders clearly.
- `local-notes/` and `.DS_Store` files are not visible.
- The license and notice are visible.
- The repo description is clear and not overhyped.
- Any screenshot/GIF placeholder is replaced before sharing widely.
- The disclaimer is easy to find.

Suggested short GitHub description:

```text
A local browser-based strategy card game demo inspired by Sanguosha, built with vanilla HTML/CSS/JS.
```
