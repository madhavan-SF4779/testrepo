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

`Task` is `{ id: string, text: string, completed: boolean }`.

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
| `themeIcon` | `.theme-icon` | The icon inside the toggle |
| `template` | `#task-item-template` | The `<template>` used to clone a row |

## Functions

### Persistence

#### `loadTasks(): Task[]`

Reads and validates the persisted task list. Returns an empty array on missing, malformed, or unreadable storage. Malformed entries (wrong shape) are silently filtered out.

#### `saveTasks(): void`

Serializes `state.tasks` to JSON and writes it under `STORAGE_KEY`. Errors are logged and swallowed so the app stays usable in private-browsing mode.

#### `loadTheme(): "light" | "dark"`

Returns the persisted theme if present, otherwise falls back to the OS preference (`prefers-color-scheme: dark`), otherwise `"light"`.

#### `applyTheme(theme): void`

Sets `data-theme` on `<html>` and updates the toggle icon (`☀` or `☾`). Does not persist — call after `loadTheme()` or after a user toggle, then save explicitly.

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

#### `createTaskElement(task): DocumentFragment`

Clones the `<template>` content, fills in the text and the checkbox state, wires up the checkbox and delete button, and returns the fragment.

#### `getVisibleTasks(): Task[]`

Returns the subset of `state.tasks` matching `state.filter`.

#### `render(): void`

The single entry point that reconciles the DOM with `state`. Steps:

1. Empty the `<ul>`.
2. If the list would be empty, show the empty state.
3. Otherwise, append one fragment per visible task.
4. Update the counter text and `aria-live` politeness.
5. Show or hide the footer based on whether any tasks exist.
6. Update filter button `aria-pressed` and the active class.

### Events

#### `attachEvents(): void`

Wires up:

| Selector | Event | Handler |
| --- | --- | --- |
| `#task-form` | `submit` | read input, `addTask` |
| `#task-list` | `change` (delegated) | `toggleTask` for the checkbox |
| `#task-list` | `click` (delegated) | `deleteTask` for `.delete-btn` |
| `#clear-completed` | `click` | `clearCompleted` |
| `.filter-btn` | `click` | set `state.filter`, re-render |
| `#theme-toggle` | `click` | flip `state.theme`, `applyTheme`, persist |

Event delegation is used inside the task list so that handlers do not need to be re-attached after each render.

### IDs

#### `newId(): string`

Returns a UUIDv4 via `crypto.randomUUID()` when available, otherwise a `${Date.now()}-${Math.random()}` fallback.

### Entry point

#### `init(): void`

Called once on `DOMContentLoaded` (or immediately if the document is already interactive). It builds `els`, hydrates `state` from storage, calls `applyTheme`, calls `render`, and finally `attachEvents`.

## Error handling

The module prefers graceful degradation over crashes:

- `localStorage` failures are logged and treated as "no data".
- Malformed persisted data is discarded.
- Empty / whitespace input is rejected without an error.
- The app never throws into the global error handler during normal use.

The End