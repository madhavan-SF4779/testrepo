# TaskFlow — Task Management App

A modern, responsive task management dashboard built with plain HTML, CSS, and JavaScript — no build step, no dependencies.

## Features

- **Dashboard layout** with sidebar navigation and stat cards (Total, To Do, In Progress, Done)
- **Kanban-style status board** — To Do / In Progress / Done columns
- **Task creation form** (modal) with title, description, status, priority, and due date
- **Search** across titles and descriptions, plus **filters** for status, priority, and due-today
- **Sorting** — newest, oldest, priority, or due date
- **Dark / light theme switcher** (persists, and auto-detects system preference on first visit)
- **localStorage persistence** — tasks survive reloads; cross-tab sync included
- **Undo toast** — deleted tasks can be restored
- **Responsive** — sidebar collapses into a drawer on small screens
- **Keyboard friendly** — skip link, ARIA labels, `Esc` closes modals, press `N` to add a task

## Project structure

```
.
├── index.html   # Semantic markup, sidebar, dashboard, tasks view, modal
├── styles.css   # Theming via CSS custom properties, responsive layout
├── app.js       # App logic, filtering, localStorage persistence
└── readme.md
```

## Running locally

Serve the folder with any static file server, for example:

```bash
python3 /tmp/serve.py   # any static server works
```

## Browser support

All modern evergreen browsers (Chrome, Firefox, Safari, Edge).