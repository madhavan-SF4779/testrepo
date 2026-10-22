# Task Tracker

> A beautifully simple, fast, dependency-free task tracker that runs entirely in your browser.

Three static files. No build, no backend, no dependencies. Your tasks live in your browser's `localStorage` and never leave your device.

---

## ✨ Features

- **Add, complete, and delete tasks** — one keystroke + Enter to capture, one click to finish.
- **Live filters** — All / Active / Completed, each with a live count badge.
- **Live stats** — see your total, active, and completed task counts at a glance.
- **Clear completed** — bulk-clean finished tasks in a single click.
- **Persistent storage** — tasks are saved to `localStorage` and survive reloads, tab restores, and crashes.
- **Light / dark theme** — toggle on demand, or auto-detect from your OS via `prefers-color-scheme`.
- **Glassmorphic UI** — soft translucent cards, animated ambient background orbs, and gradient brand accents.
- **Keyboard friendly** — skip link, visible focus rings, ARIA labels, `aria-live` count, `prefers-reduced-motion` support.
- **Responsive** — designed for phone, tablet, and desktop from the ground up.
- **Zero build, zero dependencies** — just three files you can drop on any static host.

---

## 🚀 Quick start

Pick any of these from the repo root — there's no install step:

```bash
# Option 1 — Python (built-in)
python3 -m http.server 8000

# Option 2 — Node
npx serve .

# Option 3 — Open the file directly
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows
```

Then visit the URL the server prints (typically `http://localhost:8000`).

> Tip: serving over `http://` (instead of opening the file directly) keeps `localStorage` behavior consistent across browsers.

---

## ⌨️ Keyboard shortcuts

| Key | Action |
| --- | --- |
| **Tab** / **Shift+Tab** | Move focus through controls |
| **Enter** (in the input) | Submit and add a task |
| **Enter** or **Space** (on a focused checkbox) | Toggle that task |
| **Space** (on a focused button) | Activate it |
| **Esc** (on a focused task) | Blur the element |

---

## 📁 Project structure

```
.
├── index.html   # Markup, semantic HTML, ARIA roles, inline SVG icons   ( 7.6 KB)
├── styles.css   # Design tokens, glass/gradient theme, responsive CSS   (19.2 KB)
├── app.js       # Vanilla JS app logic + localStorage persistence       ( 7.1 KB)
├── readme.md    # You are here
└── docs/        # Full documentation site
    ├── README.md
    ├── overview.md
    ├── architecture.md
    ├── user-guide.md
    ├── developer-guide.md
    ├── api-reference.md
    ├── accessibility.md
    └── changelog.md
```

Total payload over the wire: **~34 KB uncompressed**, three requests, no third-party calls.

---

## 📚 Documentation

Full docs live in [`docs/`](./docs/):

| Document | What's in it |
| --- | --- |
| [Overview](./docs/overview.md) | Goals, non-goals, tech stack |
| [Architecture](./docs/architecture.md) | File layout, data model, render model |
| [User Guide](./docs/user-guide.md) | Every feature, step by step |
| [Developer Guide](./docs/developer-guide.md) | Run, debug, extend, test |
| [API Reference](./docs/api-reference.md) | Internal `app.js` module reference |
| [Accessibility](./docs/accessibility.md) | Keyboard map, ARIA contract, focus order |
| [Changelog](./docs/changelog.md) | Release history |

---

## 🌗 Browser support

Works in all modern evergreen browsers (Chrome, Firefox, Safari, Edge — last two years). Uses:

- CSS custom properties and `backdrop-filter`
- `crypto.randomUUID()` with a non-UUID fallback
- `localStorage`
- The `defer` attribute on `<script>`
- Inline SVG icons (no icon font, no sprite sheet)

No transpilation, no polyfills required.

---

## 🔒 Data & privacy

All task data is stored in **your browser's local storage only**. Nothing is ever sent to a server, and there are no analytics, trackers, or third-party scripts.

- Tasks in a different browser? You won't see them — storage is per-browser, per-profile, per-origin.
- Private/incognito windows have their own isolated storage.
- Clearing your browser's site data erases your tasks.
- Backup strategy: use your browser's normal site-data export workflow.

---

## 🧪 Testing

The project ships with a **jsdom-based end-to-end harness** (kept outside the repo, in `/tmp` during CI) that loads the real `index.html`, `styles.css`, and `app.js` into a simulated DOM and exercises **24 user flows** — initial render, add / toggle / delete, filters, persistence, validation, theme. See [Developer Guide → Testing](./docs/developer-guide.md#testing) for how to run it locally.

---

## 🤝 Contributing

This is a tiny, dependency-free codebase on purpose. Before opening a PR:

1. Read [`docs/developer-guide.md`](./docs/developer-guide.md) for the coding conventions and the "how to add a feature" walkthrough.
2. Keep it dependency-free. The whole point of the project is that it's three static files.
3. Run the harness and make sure all 24 flows still pass.
4. If your change is user-facing, update the relevant doc in `docs/` and add a note to [`docs/changelog.md`](./docs/changelog.md).

---

## 🗺️ Roadmap

Planned for upcoming releases — see [`docs/changelog.md`](./docs/changelog.md) for the full list:

- Drag-to-reorder tasks
- Optional due dates with overdue highlighting
- Import / export as JSON
- Tag-based filtering
- Per-task priority (low / medium / high)

---

## 📜 License

No license file is currently included. Treat this as **all rights reserved** until a `LICENSE` file is added at the repo root. If you'd like to use, fork, or redistribute this code, please open an issue first.

---

<sub>Current version: see [`docs/changelog.md`](./docs/changelog.md) · Built with HTML, CSS, and vanilla JavaScript.</sub>