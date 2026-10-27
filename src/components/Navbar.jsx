import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import ThemeToggle from './ThemeToggle'
import { sound } from '../utils/sound'

export default function Navbar() {
  const { profile, progress } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

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

          {/* Profile Avatar */}
          <button
            onClick={() => {
              sound.playPop()
              navigate('/profile')
            }}
            title="Open Profile"
            className="w-8 h-8 rounded-full bg-[var(--primary-gradient)] flex items-center justify-center text-white font-bold text-xs shadow-sm hover:ring-2 hover:ring-[var(--primary)]/40 transition-all"
          >
            {(profile.name || 'A')[0].toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  )
}
