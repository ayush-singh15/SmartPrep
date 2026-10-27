import { useApp } from '../hooks/AppContext'
import AIChat from '../components/AIChat'
import { BACKEND_ROADMAP, OTHER_ROADMAPS } from '../data/mockData'

export default function Assistant() {
  const { progress } = useApp()
  const goalId = progress.goalId || 'backend-developer'
  const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || [])
  const currentStage = roadmap.find(s => s.id === progress.currentStage)
  const completedCount = (progress.completedStages || []).length

  return (
    <div style={{
      padding: '16px', maxWidth: 760, margin: '0 auto',
      display: 'flex', flexDirection: 'column', gap: 12,
      height: 'calc(100dvh - 136px)', minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px solid var(--primary)',
        borderRadius: 10, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fff' }}>memory</span>
        </div>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600 }}>AI KERNEL // SMARTPREP v1</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface)' }}>
            {currentStage ? currentStage.title : 'Ready'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>
            {completedCount}/{roadmap.length} stages
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--tertiary)', display: 'inline-block' }} className="sp-pulse" />
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--tertiary)' }}>ONLINE</span>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AIChat />
      </div>
    </div>
  )
}
