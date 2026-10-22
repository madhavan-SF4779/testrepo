# API Reference — Internal Module

`app.js` defines a single IIFE. It does not export to the global scope. The functions and constants below are documented for maintainers; they are not part of any public contract.

## Constants

| Name | Value | Purpose |
| --- | --- | --- |
| `STORAGE_KEY` | `"task-tracker.tasks.v1"` | `localStorage` key for the task list |
| `THEME_KEY` | `"task-tracker.theme"` | `localStorage` key for the theme |
| `VALID_FILTERS` | `["all", "active", "completed"]` | Allowed values for `state.filter` |

## State

```ts
state = {
  tasks: Task[],        // current list
  filter: "all" | "active" | "completed",
  theme: "light" | "dark"
}
```

`Task` is `{ id: string, text: string, completed: boolean, createdAt: number }`. `createdAt` is set when the task is added but is not used by the UI; it is preserved on round-trip through `localStorage` for forward compatibility.

## DOM cache: `els`

`els` is a frozen-by-convention object that holds every element reference the module needs. It is built once at startup so each handler does not re-query the DOM.

| Key | Element | Used for |
| --- | --- | --- |
| `form` | `#task-form` | Submitting new tasks |
| `input` | `#task-input` | Reading the new task text |
| `list` | `#task-list` | The `<ul>` that renders tasks |
| `emptyState` | `#empty-state` | Shown when there are no tasks |
| `taskCount` | `#task-count` | The "N items left" line |
| `clearCompleted` | `#clear-completed` | Footer button |
| `tasksFooter` | `#tasks-footer` | Container that appears when there are tasks |
| `filterButtons` | NodeList of `.filter-btn` | The three filter buttons |
| `themeToggle` | `#theme-toggle` | The sun/moon button |
| `template` | `#task-item-template` | The `<template>` used to clone a row |
| `statTotal` | `#stat-total` | Stats card — total task count |
| `statActive` | `#stat-active` | Stats card — active task count |
| `statCompleted` | `#stat-completed` | Stats card — completed task count |
| `badgeAll` | `#badge-all` | Live count badge on the **All** filter |
| `badgeActive` | `#badge-active` | Live count badge on the **Active** filter |
| `badgeCompleted` | `#badge-completed` | Live count badge on the **Completed** filter |

## Functions

### Persistence

#### `loadTasks(): Task[]`

Reads and validates the persisted task list. Returns an empty array on missing, malformed, or unreadable storage. Malformed entries (wrong shape) are silently filtered out.

#### `saveTasks(): void`

Serializes `state.tasks` to JSON and writes it under `STORAGE_KEY`. Errors are logged and swallowed so the app stays usable in private-browsing mode.

#### `loadTheme(): "light" | "dark"`

Returns the persisted theme if present, otherwise falls back to the OS preference (`prefers-color-scheme: dark`), otherwise `"light"`.

#### `applyTheme(theme): void`

Sets `data-theme` on `<html>` and updates the toggle's `aria-label`. The visible sun/moon icon swap is driven by CSS (`[data-theme="dark"]` selectors) — JS no longer touches the DOM inside the button. Does not persist — call after `loadTheme()` or after a user toggle, then save explicitly.

### State mutations

#### `addTask(text): void`

Trims `text`. If the result is empty, returns. Otherwise pushes a new task onto `state.tasks`, saves, and re-renders.

#### `toggleTask(id): void`

Flips `state.tasks[i].completed` for the task whose `id` matches, then saves and re-renders.

#### `deleteTask(id): void`

Removes the task with the matching `id` from `state.tasks`, then saves and re-renders.

#### `clearCompleted(): void`

Removes every task where `completed === true`, then saves and re-renders.

### Rendering

#### `getFilteredTasks(): Task[]`

Returns the subset of `state.tasks` matching `state.filter`. (`all` returns every task; `active` returns non-completed; `completed` returns completed.)

#### `render(): void`

The single entry point that reconciles the DOM with `state`. Steps:

1. Empty the `<ul>`.
2. If the list would be empty, show the empty state.
3. Otherwise, append one cloned template per visible task, wiring the toggle and delete handlers.
4. Update the three stat cards (`stat-total`, `stat-active`, `stat-completed`).
5. Update the three filter badges (`badge-all`, `badge-active`, `badge-completed`).
6. Update the "N items left" counter (`task-count`).
7. Show or hide the footer (`tasks-footer`) based on whether any completed tasks exist, and disable the **Clear completed** button when none exist.
8. Update filter button `aria-selected` and the active class (handled by `setFilter`, not `render`).

### Events

#### `init(): void`

Wires up:

| Selector | Event | Handler |
| --- | --- | --- |
| `#task-form` | `submit` | read input, `addTask`, clear + refocus the input |
| `.task-toggle` (per row) | `change` | `toggleTask(id)` |
| `.task-delete` (per row) | `click` | `deleteTask(id)` |
| `#clear-completed` | `click` | `clearCompleted` |
| `.filter-btn` | `click` | `setFilter(filter)` |
| `#theme-toggle` | `click` | `toggleTheme()` |
| `matchMedia('(prefers-color-scheme: dark)')` | `change` | sync theme **only if** the user has not manually chosen one |

Handlers are attached directly on each cloned row inside `render()`. The list is rebuilt on every state change, so each row's listeners are short-lived — no event delegation is needed.

### IDs

#### `createId(): string`

Returns a UUIDv4 via `crypto.randomUUID()` when available, otherwise a `${Date.now()}-${Math.random()}` fallback.

### Entry point

#### `init(): void`

Called once on `DOMContentLoaded` (or immediately if the document is already interactive). It builds `els`, hydrates `state` from storage, calls `applyTheme`, attaches every event handler, and finally calls `render`.

## Error handling

The module prefers graceful degradation over crashes:

- `localStorage` failures are logged and treated as "no data".
- Malformed persisted data is discarded.
- Empty / whitespace input is rejected without an error.
- The app never throws into the global error handler during normal use.

The End