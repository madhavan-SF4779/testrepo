(function () {
  "use strict";

  const KEY = "taskboard.tasks.v1";
  const THEME_KEY = "taskboard.theme";
  const STATUSES = ["todo", "inprogress", "done"];
  const LABELS = { todo: "To Do", inprogress: "In Progress", done: "Done" };
  const PRIO = { high: 3, medium: 2, low: 1 };
  const $ = (id) => document.getElementById(id);

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }

  function load() {
    try {
      const data = JSON.parse(safeGet(KEY) || "[]");
      return Array.isArray(data)
        ? data.filter((t) => t && typeof t.id === "string" && typeof t.title === "string" && STATUSES.includes(t.status))
        : [];
    } catch (e) { return []; }
  }

  const state = { tasks: load(), view: "all", editing: null };

  function save() { safeSet(KEY, JSON.stringify(state.tasks)); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  // ---- Theme ----
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    $("theme-toggle").textContent = t === "dark" ? "\u2600 Light mode" : "\u263E Dark mode";
  }
  const storedTheme = safeGet(THEME_KEY);
  applyTheme(storedTheme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    safeSet(THEME_KEY, next);
  });

  // ---- Rendering ----
  function visibleTasks() {
    const q = $("search").value.trim().toLowerCase();
    const p = $("filter-priority").value;
    const sort = $("sort").value;
    const list = state.tasks.filter((t) =>
      (!q || t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)) &&
      (!p || t.priority === p));
    list.sort((a, b) => {
      if (sort === "due") return (a.due || "9999").localeCompare(b.due || "9999");
      if (sort === "priority") return PRIO[b.priority] - PRIO[a.priority];
      return b.created - a.created;
    });
    return list;
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function actionBtn(label, fn, cls) {
    const b = el("button", cls, label);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  }

  function cardFor(t) {
    const c = el("article", `card ${t.priority} ${t.status}`);
    c.appendChild(el("h3", "", t.title));
    if (t.description) c.appendChild(el("p", "", t.description));
    const meta = el("div", "meta");
    meta.appendChild(el("span", "tag", t.priority[0].toUpperCase() + t.priority.slice(1)));
    if (t.due) {
      const overdue = t.status !== "done" && t.due < new Date().toISOString().slice(0, 10);
      meta.appendChild(el("span", "tag" + (overdue ? " overdue" : ""), (overdue ? "Overdue: " : "Due: ") + t.due));
    }
    c.appendChild(meta);
    const acts = el("div", "card-actions");
    STATUSES.filter((s) => s !== t.status).forEach((s) =>
      acts.appendChild(actionBtn("\u2192 " + LABELS[s], () => { t.status = s; save(); render(); })));
    acts.appendChild(actionBtn("Edit", () => openDialog(t)));
    acts.appendChild(actionBtn("Delete", () => {
      if (confirm("Delete this task?")) { state.tasks = state.tasks.filter((x) => x.id !== t.id); save(); render(); }
    }, "del"));
    c.appendChild(acts);
    return c;
  }

  function render() {
    const shown = visibleTasks();
    STATUSES.forEach((s) => {
      const box = $("cards-" + s);
      box.replaceChildren();
      const items = shown.filter((t) => t.status === s);
      items.forEach((t) => box.appendChild(cardFor(t)));
      if (!items.length) box.appendChild(el("div", "empty", "No tasks"));
      $("count-" + s).textContent = items.length;
      $("badge-" + s).textContent = state.tasks.filter((t) => t.status === s).length;
      document.querySelector(`.column[data-status="${s}"]`).hidden = state.view !== "all" && state.view !== s;
    });
    $("board").classList.toggle("single", state.view !== "all");
    $("badge-all").textContent = state.tasks.length;
    const total = state.tasks.length;
    const done = state.tasks.filter((t) => t.status === "done").length;
    $("stat-total").textContent = total;
    $("stat-progress").textContent = total - done;
    $("stat-rate").textContent = (total ? Math.round((done / total) * 100) : 0) + "%";
    $("view-title").textContent = state.view === "all" ? "Dashboard" : LABELS[state.view];
  }

  // ---- Dialog / form ----
  const dialog = $("task-dialog");
  function openDialog(task) {
    state.editing = task || null;
    $("dialog-title").textContent = task ? "Edit Task" : "New Task";
    $("f-title").value = task ? task.title : "";
    $("f-desc").value = task ? task.description || "" : "";
    $("f-status").value = task ? task.status : state.view === "all" ? "todo" : state.view;
    $("f-priority").value = task ? task.priority : "medium";
    $("f-due").value = task ? task.due || "" : "";
    dialog.showModal();
    $("f-title").focus();
  }
  $("new-btn").addEventListener("click", () => openDialog(null));
  $("cancel-btn").addEventListener("click", () => dialog.close());
  $("task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = $("f-title").value.trim();
    if (!title) return;
    const data = {
      title,
      description: $("f-desc").value.trim(),
      status: $("f-status").value,
      priority: $("f-priority").value,
      due: $("f-due").value,
    };
    if (state.editing) Object.assign(state.editing, data);
    else state.tasks.push({ id: uid(), created: Date.now(), ...data });
    save();
    render();
    dialog.close();
  });

  // ---- Sidebar / filters ----
  const sidebar = $("sidebar"), scrim = $("scrim");
  function toggleMenu(open) { sidebar.classList.toggle("open", open); scrim.classList.toggle("show", open); }
  $("menu-btn").addEventListener("click", () => toggleMenu(true));
  scrim.addEventListener("click", () => toggleMenu(false));
  document.querySelectorAll(".nav-item").forEach((b) =>
    b.addEventListener("click", () => {
      state.view = b.dataset.view;
      document.querySelectorAll(".nav-item").forEach((x) => x.classList.toggle("active", x === b));
      toggleMenu(false);
      render();
    }));
  ["search", "filter-priority", "sort"].forEach((id) => $(id).addEventListener("input", render));

  if (!state.tasks.length && safeGet(KEY) === null) {
    const now = Date.now();
    state.tasks = [
      { id: uid(), created: now, title: "Welcome to TaskBoard", description: "Create tasks with + New Task.", status: "todo", priority: "medium", due: "" },
      { id: uid(), created: now - 1, title: "Try moving a task", description: "Use the arrow buttons on a card.", status: "inprogress", priority: "high", due: "" },
      { id: uid(), created: now - 2, title: "Toggle dark mode", description: "Button at the bottom of the sidebar.", status: "done", priority: "low", due: "" },
    ];
    save();
  }
  render();
})();
