import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import { sound } from '../utils/sound'

const TRACK_COLORS = {
  'backend-developer': { gradient: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)', text: '#2dd4bf' },
  'full-stack': { gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', text: '#60a5fa' },
  'ai-ml': { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', text: '#c084fc' },
  'data-engineer': { gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', text: '#fbbf24' },
  'android-developer': { gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: '#34d399' },
  'placement-prep': { gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', text: '#f472b6' },
}

const DIFF_COLOR = {
  Beginner: '#10b981',
  Intermediate: '#14b8a6',
  Advanced: '#f59e0b',
}

export default function GoalCard({ goal }) {
  const { progress, selectGoal } = useApp()
  const navigate = useNavigate()
  const isActive = progress.goalId === goal.id
  const trackTheme = TRACK_COLORS[goal.id] || TRACK_COLORS['backend-developer']

  function handleSelect() {
    sound.playPop()
    if (!isActive) {
      if (window.confirm(`Switch your goal to ${goal.title}? Your learning roadmap will update accordingly.`)) {
        sound.playSuccess()
        selectGoal(goal.id)
        navigate('/dashboard')
      }
    } else {
      navigate('/roadmap')
    }
  }

  return (
    <div className="sp-card" style={{
      padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', overflow: 'hidden',
      borderColor: isActive ? 'var(--primary)' : 'var(--border)',
      boxShadow: isActive ? '0 0 20px var(--primary-glow)' : 'none',
    }}>
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          background: 'var(--primary-gradient)',
          color: '#fff', fontSize: '0.625rem', fontWeight: 800,
          padding: '3px 10px', borderBottomLeftRadius: 8,
          letterSpacing: '0.06em',
        }}>ACTIVE TARGET</div>
      )}

      {/* Header icon + title */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: trackTheme.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${trackTheme.text}40`,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#ffffff' }}>{goal.icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)' }}>{goal.title}</div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: trackTheme.text, fontWeight: 600 }}>{goal.subtitle}</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', lineHeight: 1.5 }}>
        {goal.description}
      </div>

      {/* Meta tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4,
          backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
          color: 'var(--on-surface-dim)', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'var(--primary)' }}>schedule</span>
          {goal.duration}
        </span>
        <span style={{
          fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4,
          backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
          color: 'var(--on-surface-dim)',
        }}>
          {goal.stages} stages
        </span>
        <span style={{
          fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 4,
          backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
          color: DIFF_COLOR[goal.difficulty] || 'var(--on-surface-dim)', fontWeight: 600,
        }}>
          {goal.difficulty}
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleSelect}
        className={isActive ? 'sp-btn-primary' : 'sp-btn-secondary'}
        style={{ padding: '9px 0', width: '100%', fontSize: '0.875rem' }}
      >
        {isActive ? 'View Active Roadmap' : 'Select This Goal'}
      </button>
    </div>
  )
}