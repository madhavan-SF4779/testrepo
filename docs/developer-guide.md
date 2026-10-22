# Developer Guide

This guide covers how to run, test, debug, and extend the Task Tracker codebase.

## Prerequisites

- A modern browser (Chrome, Firefox, Safari, or Edge from the last two years).
- Optional: Node.js 18+ for running the test harness.
- Optional: A local static file server (recommended over opening the file directly so `localStorage` behaves normally).

## Running the app

The app is a static site — there is no build step.

```bash
# Option 1: Python 3
python3 -m http.server 8000

# Option 2: Node
npx serve .

# Option 3: Open the file directly
open index.html
```

Then visit the URL printed by the server (typically `http://localhost:8000`).

## Project structure

```
.
├── index.html        # Markup
├── styles.css        # All styles + theme variables
├── app.js            # Single IIFE, no exports
├── docs/             # Documentation site
└── readme.md         # Project landing page
```

## Coding conventions

- **No frameworks.** The app stays under ~700 lines on purpose.
- **No build step.** Whatever you write in `app.js` is what runs in the browser.
- **CSS variables** are the only theming mechanism. Do not hard-code colors.
- **HTML is semantic.** Use `<button>` for actions, `<input>` for entry. ARIA roles are only added when no native element fits.
- **JS uses an IIFE** wrapped in `"use strict"`. The module exposes nothing globally.
- **One `render()` call** per state change. The renderer is the single source of truth for the DOM.

## Adding a feature

A typical feature touches three files:

1. `index.html` — add the markup (often a new control or a new field in the `<template>`).
2. `styles.css` — add the rule(s). Prefer extending the existing variables.
3. `app.js` — extend `state`, add a handler, and (if needed) extend `render()`.

Worked example: add a **priority** field to each task.

```js
// 1. Extend the task shape
state.tasks.push({
  id: createId(),
  text: "Pay rent",
  completed: false,
  priority: "high", // new
});

// 2. Extend the renderer to render the new field
// 3. Extend loadTasks() validation to allow the new key
// 4. (Optional) Extend the template in index.html
```

## Testing

The repository ships a **jsdom-based end-to-end harness** (kept outside the repo, in `/tmp` during CI). It loads the real `index.html`, `styles.css`, and `app.js` into a simulated browser DOM and exercises every user flow.

To re-run the harness:

```bash
cd /tmp
npm install jsdom
node /path/to/harness.js
```

The harness currently covers 24 cases. The full list lives in the `tests` array inside the harness script.

### What the harness verifies

- Initial render: header, form, empty state.
- Add flow: 3 tasks added via form submit; counter updates; empty state hides.
- Persistence: `localStorage` contains a valid JSON array.
- Toggle: marking complete updates the DOM, counter, and footer visibility.
- Filter: each of All / Active / Completed shows the right subset.
- Delete: list shrinks, counter updates, storage updates.
- Clear completed: only completed items are removed.
- Validation: empty / whitespace input is rejected.
- Theme: toggle flips `data-theme` and persists.

## Debugging tips

- **State shape.** `console.log(JSON.parse(localStorage.getItem('task-tracker.tasks.v1')))` is the fastest way to see what is persisted.
- **Reset everything.** In DevTools: `localStorage.clear(); location.reload();`
- **Force a filter.** In the console: `document.querySelector('[data-filter="active"]').click()`
- **Trace rendering.** Add a `console.trace('render')` at the top of `render()` and look at the stack.

## Deployment

Because there is no build step, deployment is just "copy three files to a static host". Tested-friendly targets include GitHub Pages, Netlify drop, Cloudflare Pages, and S3 + CloudFront.

### GitHub Pages (example)

1. Push `index.html`, `styles.css`, and `app.js` to the `gh-pages` branch (or use the Pages settings UI).
2. Visit the published URL.

## Performance budget

- HTML: < 4 KB
- CSS: < 9 KB
- JS: < 7 KB
- Total over the wire (uncompressed): < 20 KB
- Time-to-interactive on a throttled "Fast 3G" run: < 1.5 s

The End