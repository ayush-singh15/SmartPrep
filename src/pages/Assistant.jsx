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
    <div className="w-full flex flex-col gap-3.5 h-[calc(100dvh-9.5rem)] lg:h-[calc(100dvh-7rem)]">
      {/* Header telemetry pill */}
      <div className="sp-card p-3.5 sm:p-4 flex items-center justify-between gap-3 shrink-0 shadow-sm border-[var(--primary)]/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-gradient)] flex items-center justify-center text-white shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">memory</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="mono text-[10px] text-[var(--primary)] font-bold tracking-wider">
              AI KERNEL // SMARTPREP v1.0
            </div>
            <div className="text-xs sm:text-sm font-bold text-[var(--on-surface)] truncate">
              {currentStage ? currentStage.title : 'Ready'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block text-right">
            <div className="mono text-[11px] text-[var(--on-surface-dim)]">
              {completedCount}/{roadmap.length} stages
            </div>
          </div>
          <div className="badge-verified mono text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--tertiary)] animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>
      </div>

      {/* Chat conversation area */}
      <div className="sp-card p-3 sm:p-4 flex-1 min-h-0 flex flex-col overflow-hidden shadow-inner">
        <AIChat />
      </div>
    </div>
  )
}
