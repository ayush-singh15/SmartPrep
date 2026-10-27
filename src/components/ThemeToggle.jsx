import { useApp } from '../hooks/AppContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp()

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 36, height: 36, borderRadius: 4,
        backgroundColor: 'var(--surface-mid)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--on-surface-dim)',
        transition: 'background-color 0.15s, color 0.15s',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
