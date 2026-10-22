(function () {
  "use strict";

  const STORAGE_KEY = "task-tracker.tasks.v1";
  const THEME_KEY = "task-tracker.theme";
  const VALID_FILTERS = ["all", "active", "completed"];

  const els = {
    form: document.getElementById("task-form"),
    input: document.getElementById("task-input"),
    list: document.getElementById("task-list"),
    emptyState: document.getElementById("empty-state"),
    taskCount: document.getElementById("task-count"),
    clearCompleted: document.getElementById("clear-completed"),
    tasksFooter: document.getElementById("tasks-footer"),
    filterButtons: document.querySelectorAll(".filter-btn"),
    themeToggle: document.getElementById("theme-toggle"),
    themeIcon: document.querySelector(".theme-icon"),
    template: document.getElementById("task-item-template"),
  };

  const state = {
    tasks: loadTasks(),
    filter: "all",
    theme: loadTheme(),
  };

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (t) =>
          t &&
          typeof t.id === "string" &&
          typeof t.text === "string" &&
          typeof t.completed === "boolean"
      );
    } catch (err) {
      console.warn("Failed to load tasks from storage:", err);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (err) {
      console.warn("Failed to save tasks:", err);
    }
  }

  function loadTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (els.themeIcon) {
      els.themeIcon.innerHTML = theme === "dark" ? "&#9790;" : "&#9728;";
    }
    if (els.themeToggle) {
      els.themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, state.theme);
    applyTheme(state.theme);
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    state.tasks.unshift({
      id: createId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    render();
  }

  function deleteTask(id) {
    state.tasks = state.tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }

  function clearCompleted() {
    const hadCompleted = state.tasks.some((t) => t.completed);
    if (!hadCompleted) return;
    state.tasks = state.tasks.filter((t) => !t.completed);
    saveTasks();
    render();
  }

  function getFilteredTasks() {
    if (state.filter === "active") return state.tasks.filter((t) => !t.completed);
    if (state.filter === "completed") return state.tasks.filter((t) => t.completed);
    return state.tasks;
  }

  function render() {
    const filtered = getFilteredTasks();

    els.list.innerHTML = "";

    const frag = document.createDocumentFragment();
    filtered.forEach((task) => {
      const node = els.template.content.firstElementChild.cloneNode(true);
      const toggle = node.querySelector(".task-toggle");
      const text = node.querySelector(".task-text");
      const del = node.querySelector(".task-delete");

      node.dataset.id = task.id;
      if (task.completed) {
        node.classList.add("completed");
        toggle.checked = true;
        toggle.setAttribute("aria-label", "Mark task as active");
      } else {
        toggle.setAttribute("aria-label", "Mark task as completed");
      }
      text.textContent = task.text;

      toggle.addEventListener("change", () => toggleTask(task.id));
      del.addEventListener("click", () => deleteTask(task.id));

      frag.appendChild(node);
    });
    els.list.appendChild(frag);

    const total = state.tasks.length;
    const remaining = state.tasks.filter((t) => !t.completed).length;
    const itemLabel = total === 1 ? "item" : "items";
    els.taskCount.textContent = `${remaining} ${itemLabel} left`;

    const hasCompleted = state.tasks.some((t) => t.completed);
    els.tasksFooter.hidden = !hasCompleted;
    els.clearCompleted.disabled = !hasCompleted;

    els.emptyState.hidden = filtered.length > 0;
  }

  function setFilter(filter) {
    if (!VALID_FILTERS.includes(filter)) return;
    state.filter = filter;
    els.filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    render();
  }

  function init() {
    applyTheme(state.theme);

    els.form.addEventListener("submit", (e) => {
      e.preventDefault();
      addTask(els.input.value);
      els.input.value = "";
      els.input.focus();
    });

    els.clearCompleted.addEventListener("click", clearCompleted);

    els.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => setFilter(btn.dataset.filter));
    });

    if (els.themeToggle) {
      els.themeToggle.addEventListener("click", toggleTheme);
    }

    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored !== "light" && stored !== "dark") {
          state.theme = e.matches ? "dark" : "light";
          applyTheme(state.theme);
        }
      };
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", handleChange);
      } else if (typeof mq.addListener === "function") {
        mq.addListener(handleChange);
      }
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
