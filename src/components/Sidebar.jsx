import { Icon } from "./ui.jsx";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "board" },
  { id: "tasks", label: "Tasks", icon: "check" },
  { id: "log", label: "Daily log", icon: "calendar" },
  { id: "analytics", label: "Analytics", icon: "chart" },
  { id: "timeline", label: "Timeline", icon: "clock" },
];

export default function Sidebar({ page, setPage, open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <span className="brand-mark">DW</span>
        <div>
          <strong>Daily Work</strong>
          <small>Tracker</small>
        </div>
      </div>
      <nav>
        {NAV.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => {
              setPage(item.id);
              onNavigate?.();
            }}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>
      <p className="sidebar-note">Data stays in this browser. Reset anytime from the header.</p>
    </aside>
  );
}
