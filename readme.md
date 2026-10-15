# Task Tracker

A simple, fast, dependency-free task tracker that runs entirely in the browser.

## Documentation

Full documentation lives in the [`docs/`](./docs/) folder:

- [Overview](./docs/overview.md)
- [Architecture](./docs/architecture.md)
- [User Guide](./docs/user-guide.md)
- [Developer Guide](./docs/developer-guide.md)
- [API Reference](./docs/api-reference.md)
- [Accessibility](./docs/accessibility.md)
- [Changelog](./docs/changelog.md)

## Features

- **Add, complete, and delete tasks**
- **Filter** by All / Active / Completed
- **Clear completed** tasks in one click
- **Persistent storage** — your tasks are saved to `localStorage` and survive page reloads
- **Light / dark theme** with auto-detection of system preference
- **Keyboard friendly** — focus styles, skip link, ARIA labels, and `prefers-reduced-motion` support
- **Responsive layout** that works on phone, tablet, and desktop
- **No build step, no dependencies** — just three static files

## Project structure

```
.
├── index.html   # Markup, semantic HTML, ARIA roles
├── styles.css   # Modern responsive styling with CSS variables for theming
├── app.js       # Vanilla JS app logic + localStorage persistence
└── readme.md
```

## Running locally

Because this is a static site with no build step, you can open `index.html` directly in any modern browser, or serve it with any static file server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (with npx)
npx serve .

# Or just open the file
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows
```

Then visit the URL printed by the server (typically `http://localhost:8000`).

## Browser support

Works in all modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses:

- CSS custom properties
- `crypto.randomUUID()` with a fallback
- `localStorage`
- The `defer` attribute on `<script>`

No transpilation required.

## Data & privacy

All task data is stored in **your browser's local storage only**. Nothing is ever sent to a server, and there are no analytics, trackers, or third-party scripts.
