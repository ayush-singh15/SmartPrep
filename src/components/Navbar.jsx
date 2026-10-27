import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { profile, progress } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const goalLabel = (progress.goalId || 'backend-developer')
    .split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ').replace('Developer', 'Dev')

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ height: 64, padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {/* Brand */}
        <div
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            backgroundColor: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fff' }}>terminal</span>
          </div>
          <div>
            <div className="mono" style={{ color: 'var(--primary)', fontWeight: 700, lineHeight: 1.1, fontSize: '0.875rem' }}>SmartPrep</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', lineHeight: 1 }}>
              {location.pathname === '/' ? 'Home' :
               location.pathname === '/dashboard' ? 'Dashboard' :
               location.pathname === '/roadmap' ? 'Roadmap' :
               location.pathname === '/goals' ? 'Goals' :
               location.pathname === '/assistant' ? 'AI Kernel' :
               location.pathname === '/how-it-works' ? 'Docs' :
               location.pathname === '/profile' ? 'Profile' : 'SmartPrep'}
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Goal + progress pill — hidden on very small screens */}
          <div
            className="hidden sm:flex"
            style={{
              alignItems: 'center', gap: 6,
              padding: '3px 10px', borderRadius: 9999,
              backgroundColor: 'var(--surface-mid)',
              border: '1px solid var(--border)',
              fontSize: '0.6875rem',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'inline-block' }} className="sp-pulse" />
            <span className="mono" style={{ color: 'var(--on-surface)' }}>{goalLabel} · {progress.overallPercent || 0}%</span>
          </div>

          <ThemeToggle />

          {/* Profile avatar */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
              color: '#fff', fontWeight: 700, fontSize: '0.8rem',
            }}
          >
            {(profile.name || 'A')[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
