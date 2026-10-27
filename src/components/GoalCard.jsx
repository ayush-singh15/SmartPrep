import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'

const DIFF_COLOR = { Beginner: 'var(--tertiary)', Intermediate: 'var(--primary)', Advanced: 'var(--warning)' }

export default function GoalCard({ goal }) {
  const { progress, selectGoal } = useApp()
  const navigate = useNavigate()
  const isActive = progress.goalId === goal.id

  function handleSelect() {
    if (!goal.implemented) return
    if (!isActive) {
      if (window.confirm('Switch to this goal? Your current progress will be reset.')) {
        selectGoal(goal.id)
        navigate('/dashboard')
      }
    } else {
      navigate('/roadmap')
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--surface-low)',
      border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
      borderRadius: 8, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
      opacity: !goal.implemented && !isActive ? 0.65 : 1,
      transition: 'border-color 0.15s, transform 0.1s',
    }}>
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          backgroundColor: 'var(--primary)',
          color: '#fff', fontSize: '0.6rem', fontWeight: 700,
          padding: '2px 8px', borderBottomLeftRadius: 6,
          letterSpacing: '0.06em',
        }}>ACTIVE</div>
      )}

      {/* Icon + title */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 6, flexShrink: 0,
          backgroundColor: 'var(--primary-bg)',
          border: '1px solid var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)' }}>{goal.icon}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--on-surface)' }}>{goal.title}</div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>{goal.subtitle}</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', lineHeight: 1.5 }}>{goal.description}</div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 2,
          backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
          color: 'var(--on-surface-dim)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12, verticalAlign: 'middle', marginRight: 2 }}>schedule</span>
          {goal.duration}
        </span>
        <span style={{
          fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 2,
          backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
          color: 'var(--on-surface-dim)',
        }}>
          {goal.stages} stages
        </span>
        <span style={{
          fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 2,
          border: '1px solid var(--border)',
          color: DIFF_COLOR[goal.difficulty] || 'var(--on-surface-dim)',
          backgroundColor: 'var(--surface-mid)',
        }}>
          {goal.difficulty}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={handleSelect}
        className={goal.implemented ? 'sp-btn-primary' : 'sp-btn-secondary'}
        style={{ padding: '8px 0', width: '100%', fontSize: '0.8125rem' }}
      >
        {isActive ? 'View Roadmap' : 'Select Goal'}
      </button>
    </div>
  )
}
