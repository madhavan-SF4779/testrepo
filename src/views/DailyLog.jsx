import { useState } from "react";
import { todayKey } from "../metrics.js";

const MOODS = ["focused", "steady", "energized", "blocked"];

export default function DailyLog({ logs, dispatch }) {
  const [date, setDate] = useState(todayKey());
  const existing = logs.find((l) => l.date === date);
  const [mood, setMood] = useState(existing?.mood || "focused");
  const [hours, setHours] = useState(existing?.hours ?? 6);
  const [note, setNote] = useState(existing?.note || "");
  const [saved, setSaved] = useState(false);

  function loadDate(next) {
    setDate(next);
    const found = logs.find((l) => l.date === next);
    setMood(found?.mood || "focused");
    setHours(found?.hours ?? 6);
    setNote(found?.note || "");
    setSaved(false);
  }

  function submit(e) {
    e.preventDefault();
    dispatch({ type: "addLog", log: { date, mood, hours, note } });
    setSaved(true);
  }

  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Status</p>
          <h1>Daily work log</h1>
        </div>
      </header>
      <div className="split">
        <form className="panel form" onSubmit={submit}>
          <h2>Log the day</h2>
          <label>
            Date
            <input type="date" value={date} onChange={(e) => loadDate(e.target.value)} required />
          </label>
          <label>
            Mood
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            Hours
            <input
              type="number"
              min="0"
              max="16"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </label>
          <label>
            Note
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} maxLength={400} />
          </label>
          <button className="btn primary" type="submit">
            {existing ? "Update log" : "Save log"}
          </button>
          {saved && <p className="ok">Saved locally.</p>}
        </form>
        <div className="panel">
          <h2>Recent entries</h2>
          <ul className="log-list">
            {sorted.map((log) => (
              <li key={log.id}>
                <div>
                  <strong>{log.date}</strong>
                  <span className={`pill pill-${log.mood}`}>{log.mood}</span>
                </div>
                <p>{log.note}</p>
                <small>{log.hours} hours</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
