import { useLocation, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../data/navItems'



export default function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="lg:hidden" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: 'var(--surface-low)',
      borderTop: '1px solid var(--border)',
      backdropFilter: 'blur(16px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 64, padding: '0 4px' }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path ||
            (location.pathname === '/' && item.path === '/dashboard')
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 2, minWidth: 56, height: 44, border: 'none', background: 'transparent',
                cursor: 'pointer',
                color: active ? 'var(--primary)' : 'var(--on-surface-dim)',
                transition: 'color 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.04em' }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
