# Overview

## What is Task Tracker?

Task Tracker is a single-page web application that helps users capture, organize, and complete personal to-do items. It is built as a fully client-side application: there is no backend, no build step, and no third-party dependencies.

## Goals

- **Zero-friction capture.** Adding a task takes one keystroke + Enter.
- **Reliable persistence.** Tasks must survive page reloads, tab restores, and crashes.
- **Predictable behavior.** The UI must always reflect the underlying state.
- **Accessible by default.** Works with a keyboard, a screen reader, and any modern browser.
- **Lightweight.** Total payload is under 20 KB unminified and loads in a single round trip.
- **Calm, modern aesthetic.** A glassmorphic interface with gradient accents and ambient motion that recedes into the background — never louder than the work.

## Non-goals

- Multi-user collaboration, sync, or accounts.
- Server-side persistence or analytics.
- Mobile app packaging.
- Reminders, notifications, or background sync.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Markup | HTML5 | Standard, no compile step |
| Styling | Hand-written CSS with custom properties | Theming without a framework |
| Behavior | Vanilla ES2018+ JavaScript | No runtime dependencies |
| Storage | `localStorage` | Simple, synchronous, broadly supported |
| Tests | `jsdom` end-to-end harness | Exercises the real DOM API |

## Project layout

```
.
├── index.html        # Application shell
├── styles.css        # All styling + theme variables
├── app.js            # Single IIFE module
├── readme.md         # Project landing page
└── docs/             # This documentation site
    ├── README.md
    ├── overview.md
    ├── architecture.md
    ├── user-guide.md
    ├── developer-guide.md
    ├── api-reference.md
    ├── accessibility.md
    └── changelog.md
```

## Status

Initial release. The app is feature-complete for the documented scope; see the [Changelog](./changelog.md) for what is included.

The End
