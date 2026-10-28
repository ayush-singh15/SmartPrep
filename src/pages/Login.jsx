import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import { GOALS } from '../data/mockData'
import { DEMO_ACCOUNTS, DEMO_PASSWORD, isValidEmail, isValidUsername } from '../services/auth'
import ThemeToggle from '../components/ThemeToggle'
import { sound } from '../utils/sound'

const HANDSHAKE = [
  '[AUTH_KERNEL] Connecting to student pipeline…',
  '[AUTH_KERNEL] Authenticating username/email…',
  '[AUTH_KERNEL] Loading career track telemetry…',
]

const HIGHLIGHTS = [
  { icon: 'account_tree', text: 'Prerequisite-ordered roadmaps' },
  { icon: 'bar_chart', text: 'Progress, streaks & study hours' },
  { icon: 'memory', text: 'AI Kernel study guidance' },
]

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const levels = [
    { label: 'Too weak', color: 'var(--error)' },
    { label: 'Weak', color: 'var(--error)' },
    { label: 'Fair', color: 'var(--warning)' },
    { label: 'Good', color: 'var(--primary)' },
    { label: 'Strong', color: 'var(--tertiary)' },
    { label: 'Excellent', color: 'var(--tertiary)' },
  ]
  return { score, ...levels[score] }
}

export default function Login() {
  const { login, register, demoLogin, auth, isAuthenticated, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const [mode, setMode] = useState('signin') // 'signin' | 'register'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [handshake, setHandshake] = useState([])
  const [showPw, setShowPw] = useState(false)
  const timers = useRef([])

  const [signin, setSignin] = useState({ identifier: '', password: '', remember: true })
  const [reg, setReg] = useState({
    name: '', username: '', email: '',
    goalId: 'backend-developer', password: '', confirm: '',
  })
  const [touched, setTouched] = useState({})

  useEffect(() => {
    document.title = mode === 'signin' ? 'Sign In — SmartPrep' : 'Create Account — SmartPrep'
  }, [mode])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const strength = useMemo(() => passwordStrength(reg.password), [reg.password])

  const regErrors = useMemo(() => {
    const e = {}
    if (reg.name.trim().length < 2) e.name = 'Enter your full name'
    if (!isValidUsername(reg.username)) e.username = 'Username must be 3–30 letters, numbers, or . - _'
    if (!isValidEmail(reg.email)) e.email = 'Enter a valid email address'
    if (reg.password.length < 6) e.password = 'At least 6 characters'
    if (reg.confirm !== reg.password) e.confirm = 'Passwords do not match'
    return e
  }, [reg])

  function switchMode(next) {
    if (busy) return
    sound.playPop()
    setMode(next); setError(''); setInfo(''); setTouched({}); setShowPw(false)
  }

  // Runs the auth call alongside a short terminal handshake animation
  async function runAuth(task) {
    setBusy(true); setError(''); setInfo(''); setHandshake([])
    HANDSHAKE.forEach((line, i) => {
      timers.current.push(setTimeout(() => setHandshake(h => [...h, line]), i * 280))
    })
    const minDelay = new Promise(r => setTimeout(r, HANDSHAKE.length * 280 + 150))
    try {
      const [session] = await Promise.all([task(), minDelay])
      setHandshake(h => [...h, `[AUTH_KERNEL] Access granted — welcome, ${session.name.split(' ')[0]}.`])
      sound.playSuccess()
      timers.current.push(setTimeout(() => navigate(redirectTo, { replace: true }), 450))
    } catch (err) {
      timers.current.forEach(clearTimeout); timers.current = []
      setHandshake([])
      setError(err.message || 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  function handleSignin(e) {
    e.preventDefault()
    if (busy) return
    if (!signin.identifier.trim() || !signin.password) {
      setError('Enter your username or email and password.')
      return
    }
    runAuth(() => login(signin))
  }

  function handleRegister(e) {
    e.preventDefault()
    if (busy) return
    setTouched({ name: true, username: true, email: true, password: true, confirm: true })
    if (Object.keys(regErrors).length) {
      setError('Please fix the highlighted fields.')
      return
    }
    runAuth(() => register(reg))
  }

  function handleDemo(id) {
    if (busy) return
    sound.playPop()
    runAuth(() => demoLogin(id))
  }

  function handleForgot() {
    sound.playPop()
    setError('')
    setInfo(`Demo accounts use password: "${DEMO_PASSWORD}". For personal accounts, password reset tokens can be requested from your administrator.`)
  }

  const fieldErr = (k) => touched[k] && regErrors[k]

  return (
    <div className="sp-auth">
      <div className="sp-auth-orb sp-auth-orb-1" aria-hidden="true" />
      <div className="sp-auth-orb sp-auth-orb-2" aria-hidden="true" />
      <div className="sp-auth-grid" aria-hidden="true" />

      <div className="sp-auth-theme"><ThemeToggle /></div>

      <main className="sp-auth-shell">
        {/* ── Brand panel ── */}
        <section className="sp-auth-brand" aria-label="About SmartPrep">
          <div className="sp-auth-logo">
            <span className="material-symbols-outlined">terminal</span>
          </div>
          <div className="mono sp-auth-kicker">SMARTPREP // SECURITY_KERNEL_V1.0</div>
          <h1 className="sp-auth-title">
            Your career stack,<br /><span className="sp-auth-gradient-text">compiled in order.</span>
          </h1>
          <p className="sp-auth-sub">
            AI-powered personalised roadmaps for students & self-taught developers. Sign in with your username or email to resume your pipeline.
          </p>
          <ul className="sp-auth-highlights">
            {HIGHLIGHTS.map(h => (
              <li key={h.text}>
                <span className="material-symbols-outlined">{h.icon}</span>
                {h.text}
              </li>
            ))}
          </ul>

          <div className="sp-auth-terminal mono" aria-live="polite">
            <div className="sp-auth-terminal-bar">
              <span /><span /><span />
              <em>auth.log</em>
            </div>
            <div className="sp-auth-terminal-body">
              {handshake.length === 0 ? (
                <div className="sp-auth-dim">$ awaiting credentials<span className="sp-auth-caret">▋</span></div>
              ) : handshake.map((l, i) => (
                <div key={i} className={`sp-fadein ${l.includes('granted') ? 'sp-auth-ok' : ''}`}>{l}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form card ── */}
        <section className="sp-auth-card" aria-label={mode === 'signin' ? 'Sign in' : 'Create account'}>
          {isAuthenticated && !busy && (
            <div className="sp-auth-session sp-fadein">
              <span className="material-symbols-outlined">verified_user</span>
              <div>
                <div>Signed in as <strong>{auth.name}</strong> (@{auth.username || 'student'})</div>
                <div className="sp-auth-session-actions">
                  <button type="button" id="continue-session-btn" onClick={() => navigate('/dashboard')}>Continue</button>
                  <span>·</span>
                  <button type="button" id="switch-student-btn" onClick={() => { logout(); sound.playPop() }}>Switch account</button>
                </div>
              </div>
            </div>
          )}

          <div className="sp-auth-tabs" role="tablist">
            <button
              type="button" role="tab" id="tab-signin" aria-selected={mode === 'signin'}
              className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}
            >Sign In</button>
            <button
              type="button" role="tab" id="tab-register" aria-selected={mode === 'register'}
              className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}
            >Create Account</button>
            <span className="sp-auth-tab-indicator" style={{ transform: `translateX(${mode === 'signin' ? 0 : 100}%)` }} />
          </div>

          <h2 className="sp-auth-card-title">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="sp-auth-card-sub">
            {mode === 'signin'
              ? 'Sign in using your username or email address.'
              : 'Pick your career goal and get your personalized roadmap.'}
          </p>

          {error && (
            <div className="sp-auth-alert error sp-fadein" role="alert">
              <span className="material-symbols-outlined">error</span>{error}
            </div>
          )}
          {info && (
            <div className="sp-auth-alert info sp-fadein" role="status">
              <span className="material-symbols-outlined">info</span>{info}
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignin} className="sp-auth-form sp-fadein" noValidate>
              <Field label="Username or email" icon="account_circle" htmlFor="login-identifier">
                <input
                  id="login-identifier" autoComplete="username" autoFocus placeholder="ayush or you@example.com"
                  value={signin.identifier} disabled={busy}
                  onChange={e => setSignin(s => ({ ...s, identifier: e.target.value }))}
                />
              </Field>
              <Field label="Password" icon="lock" htmlFor="login-password"
                trailing={<PwToggle show={showPw} onClick={() => setShowPw(v => !v)} />}>
                <input
                  id="login-password" type={showPw ? 'text' : 'password'} autoComplete="current-password"
                  placeholder="••••••••" value={signin.password} disabled={busy}
                  onChange={e => setSignin(s => ({ ...s, password: e.target.value }))}
                />
              </Field>
              <div className="sp-auth-row">
                <label className="sp-auth-check">
                  <input
                    type="checkbox" id="remember-me" checked={signin.remember}
                    onChange={e => setSignin(s => ({ ...s, remember: e.target.checked }))}
                  />
                  <span />Keep me signed in
                </label>
                <button type="button" id="forgot-password-btn" className="sp-auth-link" onClick={handleForgot}>
                  Forgot password?
                </button>
              </div>
              <SubmitButton busy={busy} id="signin-submit-btn" icon="login" label="Sign In" />
            </form>
          ) : (
            <form onSubmit={handleRegister} className="sp-auth-form sp-fadein" noValidate>
              <Field label="Full name" icon="person" htmlFor="reg-name" error={fieldErr('name')}>
                <input id="reg-name" autoComplete="name" autoFocus placeholder="Ayush Kumar Singh"
                  value={reg.name} disabled={busy}
                  onBlur={() => setTouched(t => ({ ...t, name: true }))}
                  onChange={e => setReg(r => ({ ...r, name: e.target.value }))} />
              </Field>

              <div className="sp-auth-two">
                <Field label="Username" icon="alternate_email" htmlFor="reg-username" error={fieldErr('username')}>
                  <input id="reg-username" placeholder="ayush_dev" autoComplete="username"
                    value={reg.username} disabled={busy}
                    onBlur={() => setTouched(t => ({ ...t, username: true }))}
                    onChange={e => setReg(r => ({ ...r, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '') }))} />
                </Field>

                <Field label="Email address" icon="mail" htmlFor="reg-email" error={fieldErr('email')}>
                  <input id="reg-email" type="email" autoComplete="email" placeholder="you@example.com"
                    value={reg.email} disabled={busy}
                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                    onChange={e => setReg(r => ({ ...r, email: e.target.value }))} />
                </Field>
              </div>

              <Field label="Target career track" icon="adjust" htmlFor="reg-goal">
                <select id="reg-goal" value={reg.goalId} disabled={busy}
                  onChange={e => setReg(r => ({ ...r, goalId: e.target.value }))}>
                  {GOALS.map(g => <option key={g.id} value={g.id}>{g.title} ({g.subtitle})</option>)}
                </select>
              </Field>

              <Field label="Password" icon="lock" htmlFor="reg-password" error={fieldErr('password')}
                trailing={<PwToggle show={showPw} onClick={() => setShowPw(v => !v)} />}>
                <input id="reg-password" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="At least 6 characters" value={reg.password} disabled={busy}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  onChange={e => setReg(r => ({ ...r, password: e.target.value }))} />
              </Field>
              {reg.password && (
                <div className="sp-auth-strength" aria-label={`Password strength: ${strength.label}`}>
                  <div className="sp-auth-strength-bars">
                    {[0, 1, 2, 3, 4].map(i => (
                      <span key={i} style={{ background: i < strength.score ? strength.color : undefined }} />
                    ))}
                  </div>
                  <span className="mono" style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
              <Field label="Confirm password" icon="lock_reset" htmlFor="reg-confirm" error={fieldErr('confirm')}>
                <input id="reg-confirm" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="Re-enter password" value={reg.confirm} disabled={busy}
                  onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                  onChange={e => setReg(r => ({ ...r, confirm: e.target.value }))} />
              </Field>
              <SubmitButton busy={busy} id="register-submit-btn" icon="person_add" label="Create Account" />
            </form>
          )}

          {/* ── Quick demo access ── */}
          <div className="sp-auth-divider"><span className="mono">QUICK DEMO ACCOUNTS</span></div>
          <div className="sp-auth-demos">
            {DEMO_ACCOUNTS.map(d => (
              <button
                key={d.id} type="button" id={`demo-login-${d.id}`} className="sp-auth-demo"
                disabled={busy} onClick={() => handleDemo(d.id)} style={{ '--demo-accent': d.accent }}
              >
                <span className="sp-auth-demo-avatar">{d.name[0]}</span>
                <span className="sp-auth-demo-text">
                  <span className="flex items-center gap-2">
                    <strong>{d.name}</strong>
                    <span className="mono text-[11px] text-[var(--primary)] font-semibold">@{d.username}</span>
                  </span>
                  <small>{d.tagline}</small>
                </span>
                <span className="material-symbols-outlined sp-auth-demo-icon">{d.icon}</span>
              </button>
            ))}
          </div>

          <p className="sp-auth-foot">
            {mode === 'signin' ? 'New student or learner? ' : 'Already have an account? '}
            <button type="button" className="sp-auth-link" id="toggle-mode-btn"
              onClick={() => switchMode(mode === 'signin' ? 'register' : 'signin')}>
              {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
            </button>
          </p>
        </section>
      </main>
    </div>
  )
}

function Field({ label, icon, htmlFor, error, trailing, children }) {
  return (
    <div className={`sp-auth-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <div className="sp-auth-input">
        <span className="material-symbols-outlined">{icon}</span>
        {children}
        {trailing}
      </div>
      {error && <div className="sp-auth-field-error">{error}</div>}
    </div>
  )
}

function PwToggle({ show, onClick }) {
  return (
    <button type="button" className="sp-auth-eye" onClick={onClick}
      aria-label={show ? 'Hide password' : 'Show password'} title={show ? 'Hide password' : 'Show password'}>
      <span className="material-symbols-outlined">{show ? 'visibility_off' : 'visibility'}</span>
    </button>
  )
}

function SubmitButton({ busy, id, icon, label }) {
  return (
    <button type="submit" id={id} className="sp-btn-primary sp-auth-submit" disabled={busy}>
      {busy ? (
        <><span className="sp-auth-spinner" />Authenticating…</>
      ) : (
        <><span className="material-symbols-outlined">{icon}</span>{label}</>
      )}
    </button>
  )
}
