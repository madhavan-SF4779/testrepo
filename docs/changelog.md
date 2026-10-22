# Changelog

All notable changes to Task Tracker are documented in this file. Dates use `YYYY-MM-DD`. The project does not yet follow SemVer; the first tagged release will.

## [Unreleased]

### Planned

- Drag-to-reorder tasks.
- Optional due dates with overdue highlighting.
- Import / export as JSON.
- Tag-based filtering in addition to All / Active / Completed.
- Per-task priority (low / medium / high).

## 1.1.0 — UI redesign

### Changed

- Complete visual overhaul: glassmorphic cards, gradient brand accents, and animated ambient background orbs.
- Header redesigned with a branded mark and a single icon button (sun/moon swap is now CSS-driven instead of swapped in JS).
- Hero block added above the input.
- Stats row added showing Total / Active / Completed counts.
- Filter tabs redesigned as a pill group with per-filter live-count badges.
- Empty state replaced with a custom inline-SVG illustration and a clearer two-line message.
- Footer restructured: the **items left** counter and **Clear completed** button now sit together in a single row, separated from the list by a divider.
- All icons moved from HTML entities / unicode to inline SVG for crisper rendering at any size.
- Form input now has a leading plus icon that picks up the brand color on focus.
- Reduced-motion handling now also disables the ambient orb animations.

### Preserved

- All task features (add / complete / delete / clear-completed).
- Filter behavior, persistence (`task-tracker.tasks.v1`), theme storage (`task-tracker.theme`), and live `prefers-color-scheme` sync.
- Accessibility contract: skip link, focus styles, ARIA labels, `aria-live` count, filter `role="tablist"`.
- API surface for state, render, storage, and events is unchanged — see [`api-reference.md`](./api-reference.md).

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