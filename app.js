/* ============================================================
   TaskFlow — vanilla JS application logic
   State persisted in localStorage.
   ============================================================ */

(() => {
  "use strict";

  const STORAGE_KEY = "taskflow.tasks.v1";
  const THEME_KEY = "taskflow.theme";

  const STATUS_LABELS = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };
  const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

  /* ---------- State ---------- */

  const state = {
    tasks: [],
    view: "dashboard",
    search: "",
    statusFilter: "all",
    priorityFilter: "all",
    dueTodayOnly: false,
    sort: "newest",
    editingId: null,
    pendingUndo: null,
    undoTimer: null,
    toastTimer: null,
  };

  /* ---------- Elements ---------- */

  const $ = (id) => document.getElementById(id);

  const els = {
    html: document.documentElement,
    sidebar: $("sidebar"),
    sidebarOverlay: $("sidebar-overlay"),
    menuToggle: $("menu-toggle"),
    sidebarClose: $("sidebar-close"),
    themeToggle: $("theme-toggle"),
    viewTitle: $("view-title"),
    viewSubtitle: $("view-subtitle"),
    viewDashboard: $("view-dashboard"),
    viewTasks: $("view-tasks"),
    searchInput: $("search-input"),
    newTaskBtn: $("new-task-btn"),
    emptyNewTask: $("empty-new-task"),
    board: $("board"),
    taskGrid: $("task-grid"),
    emptyState: $("empty-state"),
    resultsCount: $("results-count"),
    taskModal: $("task-modal"),
    taskForm: $("task-form"),
    modalTitle: $("modal-title"),
    modalSubmit: $("modal-submit"),
    modalClose: $("modal-close"),
    modalCancel: $("modal-cancel"),
    titleInput: $("f-title"),
    titleError: $("title-error"),
    descInput: $("f-desc"),
    statusInput: $("f-status"),
    priorityInput: $("f-priority"),
    dueInput: $("f-due"),
    priorityFilter: $("priority-filter"),
    sortSelect: $("sort-select"),
    dueChip: $("due-chip"),
    dueChipLabel: $("due-chip-label"),
    toast: $("toast"),
    toastMessage: $("toast-message"),
    toastAction: $("toast-action"),
    // stats
    statTotal: $("stat-total"),
    statTodo: $("stat-todo"),
    statProgress: $("stat-progress"),
    statDone: $("stat-done"),
    countTodo: $("count-todo"),
    countProgress: $("count-in-progress"),
    countDone: $("count-done"),
    progressPct: $("progress-pct"),
    progressFill: $("progress-fill"),
    progressHint: $("progress-hint"),
    sidebarProgressPct: $("sidebar-progress-pct"),
    sidebarProgressFill: $("sidebar-progress-fill"),
    badgeAll: $("badge-all"),
    badgeToday: $("badge-today"),
    badgeDone: $("badge-done"),
  };

  /* ---------- Persistence ---------- */

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return seedTasks();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return seedTasks();
      return parsed.filter((t) => t && typeof t.id === "string" && typeof t.title === "string");
    } catch {
      return seedTasks();
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch {
      /* storage full or unavailable — keep working in memory */
    }
  }

  function seedTasks() {
    const today = new Date();
    const iso = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };
    return [
      {
        id: uid(),
        title: "Define project goals and success metrics",
        description: "Align with stakeholders on scope, budget, and timeline.",
        status: "done",
        priority: "high",
        due: iso(-2),
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        id: uid(),
        title: "Design the dashboard wireframes",
        description: "Draft low-fidelity layouts for the three main columns.",
        status: "in-progress",
        priority: "high",
        due: iso(0),
        createdAt: Date.now() - 86400000 * 3,
      },
      {
        id: uid(),
        title: "Implement search and filter logic",
        description: "Combine search text, status, priority, and due-date filters.",
        status: "in-progress",
        priority: "medium",
        due: iso(1),
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: uid(),
        title: "Write user documentation",
        description: "Cover onboarding, keyboard shortcuts, and theming.",
        status: "todo",
        priority: "low",
        due: iso(4),
        createdAt: Date.now() - 86400000,
      },
      {
        id: uid(),
        title: "Plan next sprint backlog",
        description: "Groom incoming issues and estimate story points.",
        status: "todo",
        priority: "medium",
        due: "",
        createdAt: Date.now() - 3600000,
      },
    ];
  }

  function uid() {
    return "t_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* ---------- Theme ---------- */

  function initTheme() {
    let theme = null;
    try {
      theme = localStorage.getItem(THEME_KEY);
    } catch { /* ignore */ }
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(theme);
  }

  function applyTheme(theme) {
    els.html.setAttribute("data-theme", theme);
    els.themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch { /* ignore */ }
  }

  function toggleTheme() {
    const current = els.html.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  /* ---------- Helpers ---------- */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function isDueToday(task) {
    return Boolean(task.due) && task.due === todayIso();
  }

  function isOverdue(task) {
    return Boolean(task.due) && task.due < todayIso() && task.status !== "done";
  }

  function formatDue(task) {
    if (!task.due) return "";
    const due = new Date(task.due + "T00:00:00");
    const today = new Date(todayIso() + "T00:00:00");
    const diffDays = Math.round((due - today) / 86400000);
    let label;
    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Tomorrow";
    else if (diffDays === -1) label = "Yesterday";
    else
      label = due.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: due.getFullYear() === today.getFullYear() ? undefined : "numeric",
      });
    if (isOverdue(task)) label += " · Overdue";
    return label;
  }

  function matchesSearch(task, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      task.title.toLowerCase().includes(q) ||
      (task.description || "").toLowerCase().includes(q)
    );
  }

  /* ---------- Filtering ---------- */

  function visibleTasks() {
    let list = state.tasks.filter((task) => {
      if (!matchesSearch(task, state.search)) return false;
      if (state.statusFilter !== "all" && task.status !== state.statusFilter) return false;
      if (state.priorityFilter !== "all" && task.priority !== state.priorityFilter) return false;
      if (state.dueTodayOnly && !isDueToday(task)) return false;
      return true;
    });

    const sorters = {
      newest: (a, b) => b.createdAt - a.createdAt,
      oldest: (a, b) => a.createdAt - b.createdAt,
      priority: (a, b) =>
        PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
        b.createdAt - a.createdAt,
      due: (a, b) => {
        if (!a.due && !b.due) return b.createdAt - a.createdAt;
        if (!a.due) return 1;
        if (!b.due) return -1;
        return a.due.localeCompare(b.due);
      },
    };
    return list.sort(sorters[state.sort] || sorters.newest);
  }

  /* ---------- Rendering ---------- */

  function taskCardHtml(task, opts = {}) {
    const showStatus = opts.showStatus !== false;
    const label = formatDue(task);
    return `
      <article class="task-card" data-id="${task.id}" data-status="${task.status}" data-priority="${task.priority}">
        <div class="task-top">
          <input class="task-check" type="checkbox" ${task.status === "done" ? "checked" : ""}
            data-action="toggle" aria-label="Mark “${escapeHtml(task.title)}” as ${task.status === "done" ? "not done" : "done"}" />
          <div style="flex:1;min-width:0">
            <h3 class="task-title">${escapeHtml(task.title)}</h3>
            ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ""}
          </div>
          <div class="task-actions">
            <button class="task-action" type="button" data-action="edit" aria-label="Edit task">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="task-action delete" type="button" data-action="delete" aria-label="Delete task">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/></svg>
            </button>
          </div>
        </div>
        <div class="task-meta">
          ${showStatus ? `<span class="tag tag-status-${task.status}">${STATUS_LABELS[task.status]}</span>` : ""}
          <span class="tag tag-priority-${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
          ${label ? `<span class="tag tag-due ${isOverdue(task) ? "overdue" : ""}">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>
            ${escapeHtml(label)}
          </span>` : ""}
        </div>
      </article>`;
  }

  function renderBoard() {
    const counts = { todo: 0, "in-progress": 0, done: 0 };
    const columns = { todo: [], "in-progress": [], done: [] };

    for (const task of state.tasks) {
      if (!matchesSearch(task, state.search)) continue;
      counts[task.status] = (counts[task.status] || 0) + 1;
      columns[task.status].push(task);
    }

    const sortForBoard = (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt - a.createdAt;

    for (const status of Object.keys(columns)) {
      const body = document.getElementById("column-" + status);
      const list = columns[status].sort(sortForBoard);
      body.innerHTML = list.length
        ? list.map((t) => taskCardHtml(t)).join("")
        : `<div class="column-empty">Nothing here yet</div>`;
    }

    els.countTodo.textContent = counts.todo;
    els.countProgress.textContent = counts["in-progress"];
    els.countDone.textContent = counts.done;
  }

  function renderTaskList() {
    const list = visibleTasks();
    els.taskGrid.innerHTML = list.map((t) => taskCardHtml(t)).join("");
    els.emptyState.hidden = list.length > 0;
    els.taskGrid.hidden = list.length === 0;

    const total = state.tasks.length;
    if (total === 0) {
      els.resultsCount.textContent = "No tasks yet — create your first one.";
    } else if (list.length === total) {
      els.resultsCount.textContent = `Showing all ${total} task${total === 1 ? "" : "s"}`;
    } else {
      els.resultsCount.textContent = `Showing ${list.length} of ${total} task${total === 1 ? "" : "s"}`;
    }
  }

  function renderStats() {
    const total = state.tasks.length;
    const done = state.tasks.filter((t) => t.status === "done").length;
    const inProgress = state.tasks.filter((t) => t.status === "in-progress").length;
    const todo = state.tasks.filter((t) => t.status === "todo").length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    els.statTotal.textContent = total;
    els.statTodo.textContent = todo;
    els.statProgress.textContent = inProgress;
    els.statDone.textContent = done;

    els.progressPct.textContent = pct + "%";
    els.progressFill.style.width = pct + "%";
    els.sidebarProgressPct.textContent = pct + "%";
    els.sidebarProgressFill.style.width = pct + "%";

    els.progressHint.textContent =
      total === 0
        ? "Add your first task to get started."
        : pct === 100
        ? "All tasks completed — great work!"
        : `${done} of ${total} tasks completed.`;

    els.badgeAll.textContent = total;
    els.badgeDone.textContent = done;
    els.badgeToday.textContent = state.tasks.filter(isDueToday).length;
  }

  function render() {
    renderStats();
    if (state.view === "dashboard") renderBoard();
    else renderTaskList();
  }

  /* ---------- View switching ---------- */

  const VIEW_META = {
    dashboard: { title: "Dashboard", subtitle: "Overview of your tasks" },
    tasks: { title: "All Tasks", subtitle: "Search, filter, and manage your tasks" },
  };

  function setView(view, preset) {
    state.view = view;

    if (view === "tasks" && preset) {
      state.dueTodayOnly = preset === "today";
      state.statusFilter = preset === "completed" ? "done" : "all";
      els.dueChip.hidden = preset !== "today";
      VIEW_META.tasks = {
        title: preset === "today" ? "Due Today" : preset === "completed" ? "Completed" : "All Tasks",
        subtitle:
          preset === "today"
            ? "Tasks due today"
            : preset === "completed"
            ? "Tasks you've finished"
            : "Search, filter, and manage your tasks",
      };
      syncControls();
    }

    els.viewDashboard.hidden = view !== "dashboard";
    els.viewTasks.hidden = view !== "tasks";
    els.viewTitle.textContent = VIEW_META[view].title;
    els.viewSubtitle.textContent = VIEW_META[view].subtitle;

    document.querySelectorAll(".nav-item").forEach((btn) => {
      const isActive =
        btn.dataset.view === view &&
        (view === "dashboard" || (btn.dataset.preset || "all") === currentPreset());
      btn.classList.toggle("active", isActive);
    });

    closeSidebar();
    render();
  }

  function currentPreset() {
    if (state.dueTodayOnly) return "today";
    if (state.statusFilter === "done") return "completed";
    return "all";
  }

  function syncControls() {
    document.querySelectorAll("[data-status-filter]").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.statusFilter === state.statusFilter);
    });
    els.priorityFilter.value = state.priorityFilter;
    els.sortSelect.value = state.sort;
  }

  /* ---------- Sidebar (mobile) ---------- */

  function openSidebar() {
    els.sidebar.classList.add("open");
    els.sidebarOverlay.hidden = false;
    els.menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    els.sidebar.classList.remove("open");
    els.sidebarOverlay.hidden = true;
    els.menuToggle.setAttribute("aria-expanded", "false");
  }

  /* ---------- Modal ---------- */

  let lastFocused = null;

  function openModal(task) {
    lastFocused = document.activeElement;
    state.editingId = task ? task.id : null;
    els.modalTitle.textContent = task ? "Edit Task" : "New Task";
    els.modalSubmit.textContent = task ? "Save Changes" : "Create Task";
    els.titleInput.value = task ? task.title : "";
    els.descInput.value = task ? task.description || "" : "";
    els.statusInput.value = task ? task.status : "todo";
    els.priorityInput.value = task ? task.priority : "medium";
    els.dueInput.value = task && task.due ? task.due : "";
    clearTitleError();
    els.taskModal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => els.titleInput.focus(), 50);
  }

  function closeModal() {
    els.taskModal.hidden = true;
    document.body.style.overflow = "";
    state.editingId = null;
    els.taskForm.reset();
    clearTitleError();
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function clearTitleError() {
    els.titleError.hidden = true;
    els.titleInput.classList.remove("invalid");
    els.titleInput.removeAttribute("aria-invalid");
  }

  function showTitleError() {
    els.titleError.hidden = false;
    els.titleInput.classList.add("invalid");
    els.titleInput.setAttribute("aria-invalid", "true");
    els.titleInput.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const title = els.titleInput.value.trim();
    if (!title) {
      showTitleError();
      return;
    }
    clearTitleError();

    const data = {
      title,
      description: els.descInput.value.trim(),
      status: els.statusInput.value,
      priority: els.priorityInput.value,
      due: els.dueInput.value || "",
    };

    if (state.editingId) {
      const task = state.tasks.find((t) => t.id === state.editingId);
      if (task) Object.assign(task, data, { updatedAt: Date.now() });
      showToast("Task updated");
    } else {
      state.tasks.push({ id: uid(), createdAt: Date.now(), ...data });
      showToast("Task created");
    }

    saveTasks();
    closeModal();
    render();
  }

  /* ---------- Toast ---------- */

  function showToast(message, undoFn) {
    clearTimeout(state.toastTimer);
    els.toastMessage.textContent = message;
    els.toastAction.hidden = !undoFn;
    els.toast.hidden = false;
    state.pendingUndo = undoFn || null;

    state.toastTimer = setTimeout(() => {
      els.toast.hidden = true;
      state.pendingUndo = null;
    }, undoFn ? 6000 : 2500);
  }

  function undoLast() {
    if (typeof state.pendingUndo === "function") {
      const fn = state.pendingUndo;
      state.pendingUndo = null;
      els.toast.hidden = true;
      clearTimeout(state.toastTimer);
      fn();
    }
  }

  /* ---------- Task operations ---------- */

  function toggleStatus(id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    task.status = task.status === "done" ? "todo" : "done";
    task.updatedAt = Date.now();
    saveTasks();
    render();
    showToast(task.status === "done" ? "Task completed" : "Task reopened");
  }

  function deleteTask(id) {
    const index = state.tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const [removed] = state.tasks.splice(index, 1);
    saveTasks();
    render();
    showToast("Task deleted", () => {
      state.tasks.splice(index, 0, removed);
      saveTasks();
      render();
      showToast("Task restored");
    });
  }

  /* ---------- Event wiring ---------- */

  function onCardAction(e) {
    const card = e.target.closest(".task-card");
    if (!card) return;
    const id = card.dataset.id;
    const actionEl = e.target.closest("[data-action]");

    if (e.target.matches('.task-check[data-action="toggle"]')) {
      toggleStatus(id);
      return;
    }
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    if (action === "toggle") toggleStatus(id);
    else if (action === "edit") {
      const task = state.tasks.find((t) => t.id === id);
      if (task) openModal(task);
    } else if (action === "delete") {
      deleteTask(id);
    }
  }

  function init() {
    initTheme();
    state.tasks = loadTasks();

    // Theme
    els.themeToggle.addEventListener("click", toggleTheme);

    // Sidebar (mobile)
    els.menuToggle.addEventListener("click", openSidebar);
    els.sidebarClose.addEventListener("click", closeSidebar);
    els.sidebarOverlay.addEventListener("click", closeSidebar);

    // Navigation
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => setView(btn.dataset.view, btn.dataset.preset));
    });

    // Search
    els.searchInput.addEventListener("input", () => {
      state.search = els.searchInput.value.trim();
      render();
    });

    // New task
    els.newTaskBtn.addEventListener("click", () => openModal(null));
    els.emptyNewTask.addEventListener("click", () => openModal(null));

    // Modal
    els.taskForm.addEventListener("submit", handleSubmit);
    els.modalClose.addEventListener("click", closeModal);
    els.modalCancel.addEventListener("click", closeModal);
    els.titleInput.addEventListener("input", clearTitleError);
    els.taskModal.addEventListener("mousedown", (e) => {
      if (e.target === els.taskModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!els.taskModal.hidden) closeModal();
        else closeSidebar();
      }
      // Quick-add: "n" when not typing
      if (
        (e.key === "n" || e.key === "N") &&
        els.taskModal.hidden &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)
      ) {
        e.preventDefault();
        openModal(null);
      }
    });

    // Filters (tasks view)
    document.querySelectorAll("[data-status-filter]").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.statusFilter = chip.dataset.statusFilter;
        if (state.statusFilter !== "done") state.dueTodayOnly = false;
        els.dueChip.hidden = !state.dueTodayOnly;
        VIEW_META.tasks.title = state.dueTodayOnly ? "Due Today" : "All Tasks";
        els.viewTitle.textContent = VIEW_META.tasks.title;
        syncControls();
        render();
      });
    });

    els.priorityFilter.addEventListener("change", () => {
      state.priorityFilter = els.priorityFilter.value;
      render();
    });

    els.sortSelect.addEventListener("change", () => {
      state.sort = els.sortSelect.value;
      render();
    });

    els.dueChip.addEventListener("click", () => {
      state.dueTodayOnly = false;
      els.dueChip.hidden = true;
      VIEW_META.tasks.title = "All Tasks";
      els.viewTitle.textContent = VIEW_META.tasks.title;
      document.querySelectorAll(".nav-item").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.view === "tasks" && btn.dataset.preset === "all");
      });
      render();
    });

    // Card actions (event delegation on both views)
    els.board.addEventListener("click", onCardAction);
    els.taskGrid.addEventListener("click", onCardAction);

    // Toast undo
    els.toastAction.addEventListener("click", undoLast);

    // Cross-tab sync
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        state.tasks = loadTasks();
        render();
      }
    });

    syncControls();
    setView("dashboard");
  }

  document.addEventListener("DOMContentLoaded", init);
})();