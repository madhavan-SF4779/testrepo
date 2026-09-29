import { formatWhen } from "../metrics.js";
import { Empty } from "../components/ui.jsx";

export default function Timeline({ activity }) {
  const items = [...activity].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">History</p>
          <h1>Activity timeline</h1>
        </div>
      </header>
      {items.length === 0 ? (
        <Empty title="No activity yet" hint="Completing tasks and saving logs will appear here." />
      ) : (
        <ol className="timeline">
          {items.map((item) => (
            <li key={item.id} className={`tl-${item.kind}`}>
              <span className="tl-dot" />
              <div>
                <strong>{item.text}</strong>
                <small>{formatWhen(item.at)}</small>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
