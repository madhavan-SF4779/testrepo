import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { DEMO_USER, STORAGE_KEY, seedState } from "./data.js";

const StoreContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.tasks)) return seedState();
    return { ...seedState(), ...parsed };
  } catch {
    return seedState();
  }
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "login": {
      const { email, password } = action;
      const ok =
        email.trim().toLowerCase() === DEMO_USER.email && password === DEMO_USER.password;
      if (!ok) return { ...state, authError: "Invalid email or password." };
      return {
        ...state,
        authError: null,
        session: { email: DEMO_USER.email, name: DEMO_USER.name, role: DEMO_USER.role, team: DEMO_USER.team },
      };
    }
    case "logout":
      return { ...state, session: null, authError: null };
    case "toggleTheme":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    case "addTask": {
      const now = new Date().toISOString();
      const task = {
        id: uid("t"),
        title: action.task.title.trim(),
        description: action.task.description.trim(),
        priority: action.task.priority,
        status: action.task.status || "todo",
        due: action.task.due,
        tags: action.task.tags || [],
        createdAt: now,
        updatedAt: now,
        completedAt: action.task.status === "done" ? now : null,
      };
      return {
        ...state,
        tasks: [task, ...state.tasks],
        activity: [{ id: uid("a"), at: now, text: `Created “${task.title}”`, kind: "create" }, ...state.activity],
      };
    }
    case "updateTask": {
      const now = new Date().toISOString();
      let title = "";
      const tasks = state.tasks.map((t) => {
        if (t.id !== action.id) return t;
        title = action.patch.title ?? t.title;
        const status = action.patch.status ?? t.status;
        return {
          ...t,
          ...action.patch,
          title,
          updatedAt: now,
          completedAt: status === "done" ? t.completedAt || now : null,
        };
      });
      return {
        ...state,
        tasks,
        activity: [{ id: uid("a"), at: now, text: `Updated “${title}”`, kind: "edit" }, ...state.activity],
      };
    }
    case "deleteTask": {
      const task = state.tasks.find((t) => t.id === action.id);
      const now = new Date().toISOString();
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
        activity: task
          ? [{ id: uid("a"), at: now, text: `Deleted “${task.title}”`, kind: "delete" }, ...state.activity]
          : state.activity,
      };
    }
    case "toggleDone": {
      const now = new Date().toISOString();
      let text = "";
      const tasks = state.tasks.map((t) => {
        if (t.id !== action.id) return t;
        const done = t.status !== "done";
        text = done ? `Completed “${t.title}”` : `Reopened “${t.title}”`;
        return {
          ...t,
          status: done ? "done" : "todo",
          completedAt: done ? now : null,
          updatedAt: now,
        };
      });
      return {
        ...state,
        tasks,
        activity: text ? [{ id: uid("a"), at: now, text, kind: "done" }, ...state.activity] : state.activity,
      };
    }
    case "addLog": {
      const now = new Date().toISOString();
      const existing = state.logs.find((l) => l.date === action.log.date);
      const entry = {
        id: existing?.id || uid("l"),
        date: action.log.date,
        mood: action.log.mood,
        hours: Number(action.log.hours) || 0,
        note: action.log.note.trim(),
      };
      const logs = existing
        ? state.logs.map((l) => (l.date === entry.date ? entry : l))
        : [entry, ...state.logs];
      return {
        ...state,
        logs,
        activity: [
          { id: uid("a"), at: now, text: `Logged ${entry.hours}h on ${entry.date}`, kind: "log" },
          ...state.activity,
        ],
      };
    }
    case "reset":
      return { ...seedState(), theme: state.theme };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, load);

  useEffect(() => {
    const { authError, ...persist } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    document.documentElement.dataset.theme = state.theme;
  }, [state]);

  const api = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
