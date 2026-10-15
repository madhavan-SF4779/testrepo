# Accessibility

Task Tracker is designed to be usable by everyone, including people who rely on keyboards, screen readers, or alternative input devices. This page documents the commitments and the techniques used to honor them.

## Commitments

- **WCAG 2.1 AA** color contrast in both light and dark themes.
- **Full keyboard operability** for every interactive control.
- **Screen-reader friendly** landmarks, labels, and live regions.
- **Respects motion preferences** via `prefers-reduced-motion`.
- **No content relies on color alone** to convey state.

## Landmark structure

The page exposes a standard landmark layout:

| Landmark | Element | Notes |
| --- | --- | --- |
| Skip link | `<a class="skip-link" href="#main">` | First focusable element; jumps to `<main>` |
| Banner | `<header class="app-header">` | Site title and theme toggle |
| Main | `<main id="main">` | All task content |
| Complementary | `<aside id="empty-state">` | Shown when the list is empty |
| Contentinfo | (footer) | Footer counter, filters, and clear button live inside the main section because they describe its content |

## ARIA contract

| Control | Role / attribute | Why |
| --- | --- | --- |
| `#task-input` | `<input type="text" required aria-required="true">` | Native form semantics plus explicit required hint |
| `#task-count` | `aria-live="polite"` | Announces the count after add / toggle / delete |
| `.filter-btn` | `aria-pressed` | Toggle state for screen readers (we treat filters as toggles) |
| `#empty-state` | `role="status"` | Polite live region announcing the empty list |
| Task checkbox | Native `<input type="checkbox">` | Built-in checked-state semantics |
| Delete button | `<button aria-label="Delete task">` | Icon-only button needs an explicit label |

## Keyboard map

| Key | Where | Effect |
| --- | --- | --- |
| **Tab / Shift+Tab** | Anywhere | Move through the focusable controls in DOM order |
| **Enter** | Input field | Submit and add the task |
| **Space** | Checkbox or button | Toggle / activate |
| **Enter** | Focused checkbox | Toggle (native `<input>` behavior) |
| **Esc** | Focused task element | Blur back to the list (browser default) |

The focus order is: skip link → input → Add button → filter buttons → theme toggle → (per task) checkbox → delete button.

## Focus styling

All interactive elements have a visible `:focus-visible` ring using a 2 px outline offset from the element. The ring uses `--primary`, which is tuned to meet 3:1 contrast against both surface and background colors in either theme.

## Color and contrast

- Text on surface: **≥ 7:1** (AAA) in both themes.
- Muted text on surface: **≥ 4.5:1** (AA).
- Focus ring on background: **≥ 3:1** (AA non-text).
- Error / delete color: paired with an icon (`×`) so it is not color-only.

## Motion

- All transitions use a short duration (≤ 150 ms) and an `ease` curve.
- A `@media (prefers-reduced-motion: reduce)` block disables non-essential transitions and animations.
- No auto-playing motion exists in the app.

## Live regions

Two polite live regions are used:

1. `#task-count` — updated on every render. Screen readers will announce the new count after a brief debounce.
2. `#empty-state` — its visibility is announced when it appears or disappears.

## Tested with

- NVDA + Firefox (Windows)
- VoiceOver + Safari (macOS, iOS)
- Chrome + Android TalkBack

If you find an accessibility issue, please open an issue describing the assistive technology, browser, and reproduction steps.

The End