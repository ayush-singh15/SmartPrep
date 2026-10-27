import { useState } from 'react'
import { useApp } from '../hooks/AppContext'
import RoadmapStage from '../components/RoadmapStage'
import ProgressBar from '../components/ProgressBar'
import StudySession from '../components/StudySession'
import { GOALS } from '../data/mockData'

export default function Roadmap() {
  const { progress, getRoadmap } = useApp()
  const [showSession, setShowSession] = useState(false)
  const roadmap = getRoadmap()

  const goalId = progress.goalId || 'backend-developer'
  const goalData = GOALS.find(g => g.id === goalId)
  const goalLabel = goalId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  const completedCount = (progress.completedStages || []).length

  return (
    <div className="w-full flex flex-col gap-4">
      {showSession && <StudySession onClose={() => setShowSession(false)} />}

      {/* Header */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 2 }}>CAREER ROADMAP</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--on-surface)' }}>{goalLabel}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-dim)', marginTop: 2 }}>
              {goalData?.subtitle} • {roadmap.length} stages
            </div>
          </div>
          <button
            onClick={() => setShowSession(true)}
            className="sp-btn-primary"
            style={{ padding: '7px 12px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_arrow</span>
            Study
          </button>
        </div>
        <ProgressBar value={progress.overallPercent || 0} max={100} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--on-surface-dim)' }}>{completedCount} / {roadmap.length} stages complete</span>
          <span className="mono" style={{ color: 'var(--primary)' }}>{progress.overallPercent || 0}%</span>
        </div>
      </div>

      {/* Stages */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {roadmap.map((stage, i) => (
          <RoadmapStage key={stage.id} stage={stage} isLast={i === roadmap.length - 1} />
        ))}
      </div>
    </div>
  )
}
