import { useState } from "react";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Icon, ProgressBar } from "./components/ui.jsx";
import { StoreProvider, useStore } from "./store.jsx";
import { summarize } from "./metrics.js";
import Dashboard from "./views/Dashboard.jsx";
import Tasks from "./views/Tasks.jsx";
import DailyLog from "./views/DailyLog.jsx";
import Analytics from "./views/Analytics.jsx";
import Timeline from "./views/Timeline.jsx";

function Shell() {
  const { state, dispatch } = useStore();
  const [page, setPage] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const stats = summarize(state.tasks);

  if (!state.session) return <Login />;

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} open={navOpen} onNavigate={() => setNavOpen(false)} />
      {navOpen && <button className="scrim" aria-label="Close menu" onClick={() => setNavOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <Icon name="menu" />
          </button>
          <div className="top-progress">
            <span>Completion</span>
            <ProgressBar value={stats.percent} />
          </div>
          <div className="top-actions">
            <button className="btn ghost" onClick={() => dispatch({ type: "reset" })}>
              Reset sample data
            </button>
            <button
              className="icon-btn"
              aria-label="Toggle theme"
              onClick={() => dispatch({ type: "toggleTheme" })}
            >
              <Icon name={state.theme === "dark" ? "sun" : "moon"} />
            </button>
            <div className="user-chip">
              <span className="avatar">{state.session.name.slice(0, 1)}</span>
              <div>
                <strong>{state.session.name}</strong>
                <small>
                  {state.session.role} · {state.session.team}
                </small>
              </div>
            </div>
            <button className="btn ghost" onClick={() => dispatch({ type: "logout" })}>
              <Icon name="logout" size={16} /> Logout
            </button>
          </div>
        </header>
        {page === "dashboard" && (
          <Dashboard tasks={state.tasks} logs={state.logs} onOpenTasks={() => setPage("tasks")} />
        )}
        {page === "tasks" && <Tasks tasks={state.tasks} dispatch={dispatch} />}
        {page === "log" && <DailyLog logs={state.logs} dispatch={dispatch} />}
        {page === "analytics" && <Analytics tasks={state.tasks} />}
        {page === "timeline" && <Timeline activity={state.activity} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
