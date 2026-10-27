import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../data/navItems'
import { useApp } from '../hooks/AppContext'
import ProgressBar from './ProgressBar'

// Desktop-only navigation (>=1024px). Mirrors the Stitch bottom nav items,
// with an active "2px left rail" in teal as described in DESIGN.md.
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { progress } = useApp()
  const items = [...NAV_ITEMS, { path: '/profile', icon: 'settings', label: 'Profile' }]

  return (
    <aside className="hidden lg:flex" style={{
      position: 'fixed', top: 64, bottom: 0, left: 0, width: 220, zIndex: 40,
      flexDirection: 'column', justifyContent: 'space-between',
      backgroundColor: 'var(--surface-low)', borderRight: '1px solid var(--border)', padding: '16px 10px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--secondary)', fontWeight: 600, letterSpacing: '0.08em', padding: '0 10px 8px' }}>
          WORKSPACE
        </div>
        {items.map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 4,
              border: 'none', cursor: 'pointer', textAlign: 'left',
              borderLeft: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
              backgroundColor: active ? 'var(--primary-bg)' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--on-surface-dim)',
              fontSize: '0.875rem', fontWeight: active ? 600 : 500,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </div>

      <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 10 }}>
        <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--on-surface-dim)', marginBottom: 6 }}>PIPELINE STATUS</div>
        <ProgressBar value={progress.overallPercent || 0} />
        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 6 }}>
          {progress.overallPercent || 0}% complete
        </div>
      </div>
    </aside>
  )
}
