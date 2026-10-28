import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import ThemeToggle from './ThemeToggle'
import { sound } from '../utils/sound'

export default function Navbar() {
  const { profile, progress, auth, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [menuOpen])

  function handleSignOut() {
    sound.playPop()
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const goalLabel = (progress.goalId || 'backend-developer')
    .split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ').replace('Developer', 'Dev')

  const pageTitle =
    location.pathname === '/' ? 'Terminal' :
    location.pathname === '/dashboard' ? 'Console' :
    location.pathname === '/roadmap' ? 'My Roadmap' :
    location.pathname === '/goals' ? 'Career Targets' :
    location.pathname === '/assistant' ? 'AI Kernel' :
    location.pathname === '/how-it-works' ? 'Documentation' :
    location.pathname === '/profile' ? 'Profile & Settings' : 'SmartPrep'

  return (
    <header className="fixed top-0 inset-x-0 h-16 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => {
            sound.playPop()
            navigate('/dashboard')
          }}
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[19px]">terminal</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="mono text-sm font-bold text-[var(--primary)] leading-tight tracking-tight">
              SmartPrep
            </div>
            <div className="text-[11px] text-[var(--on-surface-dim)] leading-none truncate font-medium">
              {pageTitle}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Active Goal Pill (hidden on very small mobile) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-mid)] border border-[var(--border)] text-xs shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="mono text-[var(--on-surface)] font-medium truncate max-w-[140px]">
              {goalLabel}
            </span>
            <span className="text-[var(--primary)] font-bold font-mono">
              {progress.overallPercent || 0}%
            </span>
          </div>

          <ThemeToggle />

          {/* Profile Avatar + account menu */}
          <div className="relative" ref={menuRef}>
            <button
              id="account-menu-btn"
              onClick={() => {
                sound.playPop()
                setMenuOpen(o => !o)
              }}
              title="Account"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="w-8 h-8 rounded-full bg-[var(--primary-gradient)] flex items-center justify-center text-white font-bold text-xs shadow-sm hover:ring-2 hover:ring-[var(--primary)]/40 transition-all"
            >
              {(profile.name || 'A')[0].toUpperCase()}
            </button>
            {menuOpen && (
              <div role="menu" className="sp-fadein absolute right-0 mt-2 w-60 rounded-xl border border-[var(--border)] bg-[var(--surface-low)] shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <div className="text-sm font-semibold text-[var(--on-surface)] truncate">{profile.name}</div>
                  <div className="mono text-[11px] text-[var(--primary)] truncate font-semibold">
                    {auth?.username ? `@${auth.username}` : (auth?.email || 'Student')}
                  </div>
                </div>
                <MenuItem id="menu-profile" icon="person" label="Profile & Settings" onClick={() => { setMenuOpen(false); navigate('/profile') }} />
                <MenuItem id="menu-switch" icon="switch_account" label="Switch account" onClick={handleSignOut} />
                <MenuItem id="menu-signout" icon="logout" label="Sign out" danger onClick={handleSignOut} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuItem({ id, icon, label, onClick, danger }) {
  return (
    <button
      id={id}
      role="menuitem"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[var(--surface-mid)] ${
        danger ? 'text-[var(--error)]' : 'text-[var(--on-surface)]'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </button>
  )
}
