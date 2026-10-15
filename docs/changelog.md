# Changelog

All notable changes to Task Tracker are documented in this file. Dates use `YYYY-MM-DD`. The project does not yet follow SemVer; the first tagged release will.

## [Unreleased]

### Planned

- Drag-to-reorder tasks.
- Optional due dates with overdue highlighting.
- Import / export as JSON.
- Tag-based filtering in addition to All / Active / Completed.
- Per-task priority (low / medium / high).

## 1.0.0 — Initial release

### Added

- Add, complete, and delete tasks.
- Three filters: All, Active, Completed.
- One-click **Clear completed** for bulk cleanup.
- Persistence to `localStorage` under a versioned key.
- Light / dark theme toggle with system-preference auto-detection.
- Responsive layout that works on phone, tablet, and desktop.
- Accessibility: skip link, focus rings, ARIA labels, `aria-live` count, `prefers-reduced-motion` support.
- jsdom end-to-end test harness covering 24 user flows.

### Known limitations

- No undo for delete.
- No multi-device sync.
- No data export (the browser's site data is the only backup).

The End