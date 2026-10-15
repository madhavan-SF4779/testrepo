# Architecture

## High-level shape

The app is a single-page, client-only application. It loads three files in order: `index.html` (markup and structure), `styles.css` (presentation and theme), and `app.js` (behavior). There is no router and no SPA framework.

```
┌──────────────────────────────────────────────────────────┐
│ Browser                                                  │
│                                                          │
│  ┌──────────┐    ┌────────────┐    ┌──────────────────┐  │
│  │ index    │ -> │ styles.css │ +  │     app.js       │  │
│  │  .html   │    │ (theme +   │    │ (IIFE module)    │  │
│  │ (shell)  │    │  layout)   │    │                  │  │
│  └──────────┘    └────────────┘    └──────────────────┘  │
│                                          │               │
│                                          v               │
│                                ┌──────────────────┐      │
│                                │  localStorage    │      │
│                                │  (persistence)   │      │
│                                └──────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

## Module boundaries

`app.js` is a single IIFE that defines a private state object and a small set of pure-ish functions. It does not export anything to the global scope. The boundary between the module and the DOM is the `els` object — a single map of cached element references gathered at startup.

| Concern | Owner |
| --- | --- |
| DOM queries | `els` object (one-time lookup) |
| State | `state` object (in-memory) |
| Persistence | `loadTasks()` / `saveTasks()` / `loadTheme()` |
| Rendering | `render()` and `createTaskElement()` |
| Events | `attachEvents()` and per-element listeners |

## Data model

A task is a plain object with three string-typed fields:

```js
{
  id:        "string",  // UUIDv4 (or fallback timestamp + random)
  text:      "string",  // 1..200 characters, trimmed
  completed: "boolean"  // true once the user marks it done
}
```

The collection is stored in `state.tasks: Task[]` and persisted to `localStorage` under the key `task-tracker.tasks.v1`. The version suffix is reserved for future schema migrations.

## State machine

The app has a single state machine for the **filter** dimension:

```
       ┌──────────┐
       │   all    │ <── default
       └────┬─────┘
            │ click
   ┌────────┴────────┐
   v                 v
┌────────┐       ┌───────────┐
│ active │       │ completed │
└────────┘       └───────────┘
```

The filter is not persisted: it resets to `all` on every load.

## Event flow

```
user input
   │
   v
DOM event (submit, click, change, keydown)
   │
   v
handler (in app.js)
   │
   ├── mutate state.tasks (add / update / delete)
   ├── persist via saveTasks()
   └── render() -> reconcile DOM
```

The app uses a **full re-render** strategy on every state change. With the expected task list size (dozens, not thousands), the cost is negligible and the code stays simple. If the dataset ever grows, the rendering loop in `render()` is the single place that would need to change.

## Theming

Theming is implemented with CSS custom properties on `:root` and an override selector `[data-theme="dark"]` on the document element. The JS layer only sets `data-theme` and an emoji icon; the CSS layer does all the visual work.

## Storage keys

| Key | Type | Owner | Purpose |
| --- | --- | --- | --- |
| `task-tracker.tasks.v1` | JSON array of tasks | app.js | Task list |
| `task-tracker.theme` | `"light"` or `"dark"` | app.js | User theme override |

The version suffix lets us evolve the schema without colliding with old data.

The End