import { useState } from "react";
import { DEMO_USER } from "../data.js";
import { useStore } from "../store.jsx";

export default function Login() {
  const { state, dispatch } = useStore();
  const [email, setEmail] = useState(DEMO_USER.email);
  const [password, setPassword] = useState(DEMO_USER.password);

  function submit(e) {
    e.preventDefault();
    dispatch({ type: "login", email, password });
  }

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">Orbit workspace</p>
        <h1>Daily Work Tracker</h1>
        <p className="lede">
          Plan the day, log the work, and watch completion move in real time — the same calm density you get in a
          modern issue tracker.
        </p>
        <ul className="hero-points">
          <li>Task board with priority, search, and filters</li>
          <li>Weekly and monthly productivity charts</li>
          <li>Activity timeline and daily status logs</li>
        </ul>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <h2>Sign in</h2>
        <p className="muted">Use the demo account or your saved session data stays on this device.</p>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {state.authError && <p className="form-error">{state.authError}</p>}
        <button className="btn primary wide" type="submit">
          Continue
        </button>
        <p className="demo-hint">
          Demo: <code>{DEMO_USER.email}</code> / <code>{DEMO_USER.password}</code>
        </p>
      </form>
    </div>
  );
}
