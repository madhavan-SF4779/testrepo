import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import type { User } from '../types'

interface LoginProps { onLogin: (user: User) => void }

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('alex@worktrack.io')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    onLogin({ name: email.split('@')[0].replace(/^./, (letter) => letter.toUpperCase()), email })
  }

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="brand light"><span className="brand-mark"><CheckCircle2 size={20} /></span><span>Daily</span></div>
        <div className="showcase-copy">
          <span className="eyebrow">WORK WITH CLARITY</span>
          <h1>Your workday,<br />beautifully organized.</h1>
          <p>Plan focused days, finish the work that matters, and build momentum with insights you can act on.</p>
          <div className="proof-row">
            <div className="avatar-stack"><span>AK</span><span>JM</span><span>SD</span></div>
            <span>Trusted by 2,000+ focused teams</span>
          </div>
        </div>
        <div className="showcase-card">
          <div><span>Today’s progress</span><strong>82%</strong></div>
          <div className="mini-progress"><i /></div>
          <small>8 of 10 tasks completed</small>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-box">
          <div className="mobile-brand brand"><span className="brand-mark"><CheckCircle2 size={20} /></span><span>Daily</span></div>
          <div className="login-icon"><LockKeyhole size={24} /></div>
          <h2>Welcome back</h2>
          <p>Sign in to continue to your workspace.</p>
          <form onSubmit={submit}>
            <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>Password<div className="password-wrap"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            <div className="form-options"><label className="checkbox"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="text-button">Forgot password?</button></div>
            <button className="primary-button login-submit" type="submit">Sign in <ArrowRight size={18} /></button>
          </form>
          <p className="login-note">Demo credentials are pre-filled for quick access.</p>
        </div>
      </section>
    </main>
  )
}
