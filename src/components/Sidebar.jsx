import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../data/navItems'
import { useApp } from '../hooks/AppContext'
import ProgressBar from './ProgressBar'
import { sound } from '../utils/sound'

// Desktop navigation sidebar (>= 1024px)
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { progress } = useApp()
  const items = [...NAV_ITEMS, { path: '/profile', icon: 'settings', label: 'Profile' }]

  return (
    <aside
      className="hidden lg:flex fixed top-16 bottom-0 left-0 w-60 z-40 flex-col justify-between bg-[var(--surface-low)] border-r border-[var(--border)] p-4 shadow-sm"
    >
      <div className="flex flex-col gap-1.5">
        <div className="mono text-[10px] text-[var(--secondary)] font-bold tracking-wider px-2.5 py-1 uppercase">
          Workspace Navigation
        </div>
        {items.map(item => {
          const active = location.pathname === item.path ||
            (location.pathname === '/' && item.path === '/dashboard')
          return (
            <button
              key={item.path}
              onClick={() => {
                sound.playPop()
                navigate(item.path)
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm font-medium transition-all ${
                active
                  ? 'border-l-2 border-[var(--primary)] bg-[var(--primary-bg)] text-[var(--primary)] font-semibold shadow-sm'
                  : 'text-[var(--on-surface-dim)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-mid)]'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="bg-[var(--surface-mid)] border border-[var(--border)] rounded-lg p-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--on-surface-dim)] mb-1.5">
          <span>PIPELINE PROGRESS</span>
          <span className="text-[var(--primary)] font-bold">{progress.overallPercent || 0}%</span>
        </div>
        <ProgressBar value={progress.overallPercent || 0} />
        <div className="text-[10px] text-[var(--secondary)] mt-2 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--tertiary)] animate-pulse" />
          <span>Status: Verified nominal</span>
        </div>
      </div>
    </aside>
  )
}
