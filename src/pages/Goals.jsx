import { useState } from 'react'
import { useApp } from '../hooks/AppContext'
import GoalCard from '../components/GoalCard'
import { GOALS } from '../data/mockData'

export default function Goals() {
  const { selectGoal } = useApp()
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div style={{ padding: '16px', maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div>
        <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 3 }}>GOAL SELECTION</div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: 4 }}>Choose Your Career Path</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', lineHeight: 1.5 }}>
          Select a goal to get a structured prerequisite roadmap tailored for B.Tech CSE students.
        </p>
      </div>

      {/* Goal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {GOALS.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Custom goal */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px dashed var(--border)',
        borderRadius: 8, padding: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--on-surface-dim)' }}>add_circle</span>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--on-surface)' }}>Create Custom Goal</div>
            <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>AI_GENERATED_ROADMAP</div>
          </div>
        </div>
        {!showCustom ? (
          <button
            className="sp-btn-secondary"
            onClick={() => setShowCustom(true)}
            style={{ width: '100%', padding: '8px 0', fontSize: '0.875rem' }}
          >
            Configure Custom Goal
          </button>
        ) : (
          <div style={{
            backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
            borderRadius: 6, padding: 14, textAlign: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--primary)', display: 'block', marginBottom: 8 }}>construction</span>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface)', marginBottom: 4 }}>
              Custom Roadmap Generation
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', lineHeight: 1.5, marginBottom: 10 }}>
              AI-powered custom goal roadmaps are coming soon. You'll be able to describe your target role and get a personalised learning path.
            </div>
            <div className="mono" style={{
              fontSize: '0.6875rem', color: 'var(--primary)',
              backgroundColor: 'var(--primary-bg)', padding: '4px 10px', borderRadius: 2,
              display: 'inline-block',
            }}>
              STATUS: IN_DEVELOPMENT
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
