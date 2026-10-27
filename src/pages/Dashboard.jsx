import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import ProgressBar from '../components/ProgressBar'
import StudySession from '../components/StudySession'
import DiagnosticQuiz from '../components/DiagnosticQuiz'
import { BACKEND_ROADMAP, OTHER_ROADMAPS, WEAK_AREAS, GOALS } from '../data/mockData'
import { sound } from '../utils/sound'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { profile, progress, activity } = useApp()
  const navigate = useNavigate()
  const [showSession, setShowSession] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  const goalId = progress.goalId || 'backend-developer'
  const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || [])
  const currentStageData = roadmap.find(s => s.id === progress.currentStage)
  const nextLockedStage = roadmap.find(s => !((progress.completedStages || []).includes(s.id)) && s.id !== progress.currentStage)
  const touched = [...(progress.completedStages || []), progress.currentStage]
  const weakAreas = WEAK_AREAS.filter(w => touched.includes(w.stageId))
  const trackLabel = (GOALS.find(g => g.id === goalId) || {}).subtitle || 'Engineering Stack'

  const weeklyPct = Math.round(((progress.weeklyHours || 0) / (progress.weeklyTarget || 8)) * 100)
  const goalLabel = goalId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  const completedCount = (progress.completedStages || []).length
  const lastCompleted = roadmap.filter(s => (progress.completedStages || []).includes(s.id)).pop()

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Modals placed cleanly outside the document flow */}
      {showSession && <StudySession onClose={() => setShowSession(false)} />}
      {showQuiz && <DiagnosticQuiz onClose={() => setShowQuiz(false)} />}

      {/* ── 1. GREETING & PIPELINE HERO CARD ── */}
      <div className="sp-card p-5 sm:p-6 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="mono text-xs text-[var(--primary)] font-bold tracking-wider">
                DEV_SESSION // {(profile.name || 'AYUSH').toUpperCase()}
              </span>
              <span className="w-2 h-2 rounded-full bg-[var(--tertiary)] animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--on-surface)] tracking-tight">
              {getGreeting()}, {profile.name || 'Ayush'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--on-surface-dim)] mt-1">
              {profile.degree} {profile.branch} • {profile.semester || profile.year}
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-[var(--surface-mid)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[24px]">terminal</span>
          </div>
        </div>

        {/* Pipeline Bar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3.5 sm:p-4 mt-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[var(--primary)] text-[18px] shrink-0">verified</span>
              <span className="mono text-xs sm:text-sm font-semibold text-[var(--primary)] truncate">
                {goalLabel}
              </span>
            </div>
            <span className="mono text-xs text-[var(--secondary)] shrink-0">
              Stage {completedCount + (currentStageData ? 1 : 0)} / {roadmap.length}
            </span>
          </div>

          <ProgressBar value={progress.overallPercent || 0} max={100} height={7} />

          <div className="flex items-center justify-between text-xs text-[var(--on-surface-dim)] mt-2 flex-wrap gap-1 font-mono">
            <span>{progress.overallPercent || 0}% Verified Competency</span>
            <span className="text-[var(--tertiary)] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--tertiary)]" />
              Pipeline: Nominal
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. CURRENT STAGE / DIRECTIVE CARD ── */}
      {currentStageData ? (
        <div className="sp-card p-5 sm:p-6 border-[var(--primary)]/50 shadow-md">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="mono text-xs font-bold bg-[var(--primary-bg)] text-[var(--primary)] px-2.5 py-1 rounded border border-[var(--primary)]/30">
                STAGE {String(currentStageData.stage).padStart(2, '0')}
              </span>
              <span className="mono text-xs text-[var(--on-surface-dim)]">
                {currentStageData.subtitle}
              </span>
            </div>
            <span className="badge-active mono text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              ACTIVE RUN
            </span>
          </div>

          {/* Directive details */}
          <div className="mb-4">
            <div className="mono text-[11px] text-[var(--secondary)] font-bold tracking-wider uppercase mb-1">
              Today's Study Directive
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--on-surface)] leading-snug">
              {currentStageData.todayFocus || currentStageData.topics?.[0] || currentStageData.title}
            </h2>
            {currentStageData.todayDescription && (
              <p className="text-xs sm:text-sm text-[var(--on-surface-dim)] mt-1.5 leading-relaxed">
                {currentStageData.todayDescription}
              </p>
            )}
          </div>

          {/* Meta specs */}
          <div className="flex items-center gap-4 py-2 border-y border-[var(--border)] font-mono text-xs text-[var(--on-surface-dim)] flex-wrap">
            <div className="flex items-center gap-1.5 text-[var(--primary)] font-semibold">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Est. {currentStageData.estimatedMinutes || 45} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--tertiary)]">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>{currentStageData.topics?.length || 3} Checkpoints</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--secondary-hi)]">
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span>{trackLabel}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => {
                sound.playPop()
                setShowSession(true)
              }}
              className="sp-btn-primary flex-1 h-11 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
              <span>Continue Session</span>
            </button>
            <button
              onClick={() => {
                sound.playPop()
                setShowSession(true)
              }}
              className="sp-btn-secondary h-11 px-4 flex items-center gap-1.5 font-mono text-xs sm:text-sm text-[var(--primary)] font-bold"
              title="Quick Pomodoro Sprint"
            >
              <span className="material-symbols-outlined text-[18px]">timer</span>
              <span>25m</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="sp-card p-5 bg-[var(--tertiary-bg)] border-[var(--tertiary)] text-center">
          <div className="text-base font-bold text-[var(--tertiary)]">
            All Roadmap Stages Verified! 🎉
          </div>
          <p className="text-xs text-[var(--on-surface-dim)] mt-1">
            You've completed all stages. Review weak areas or pick another career goal.
          </p>
        </div>
      )}

      {/* ── 3. TELEMETRY BENTO GRID (RESPONSIVE: 1 col on small, 2 cols on medium+) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weekly Target Card */}
        <div className="sp-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--on-surface-dim)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Weekly Target</span>
            <span className="material-symbols-outlined text-[18px] text-[var(--primary)]">query_stats</span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[var(--on-surface)] leading-none">
                {progress.weeklyHours || 0}
              </span>
              <span className="mono text-xs text-[var(--on-surface-dim)]">
                / {progress.weeklyTarget || 8}.0h logged
              </span>
            </div>
            <div className="mt-2.5">
              <ProgressBar value={progress.weeklyHours || 0} max={progress.weeklyTarget || 8} color="tertiary" height={6} />
            </div>
          </div>

          <div className="text-xs font-medium text-[var(--tertiary)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
            <span>{weeklyPct}% {weeklyPct >= 80 ? '(On Track)' : '(Active Sprint)'}</span>
          </div>
        </div>

        {/* Streak & Eval Card */}
        <div className="sp-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--on-surface-dim)]">
            <span className="text-xs font-semibold uppercase tracking-wider">Streak & Eval</span>
            <span className="material-symbols-outlined text-[18px] text-[var(--error)]">local_fire_department</span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[var(--on-surface)] leading-none">
                {progress.streak || 0}
              </span>
              <span className="mono text-xs text-[var(--on-surface-dim)]">Days Active Run</span>
            </div>
            <div className="mono text-xs text-[var(--on-surface-dim)] mt-2">
              Stage {String(completedCount + 1).padStart(2, '0')} Telemetry Eval in 4d
            </div>
          </div>

          <div className="text-xs font-medium text-[var(--secondary-hi)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">event_repeat</span>
            <span>Saturday, 18:00 IST</span>
          </div>
        </div>
      </div>

      {/* ── 4. DIAGNOSTIC WEAK AREAS CARD ── */}
      <div className="sp-card p-5">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--error)] text-[20px]">bug_report</span>
            <h3 className="text-sm sm:text-base font-bold text-[var(--on-surface)]">
              Knowledge Gaps (Telemetry)
            </h3>
          </div>
          <span className="badge-alert mono text-[10px] font-bold px-2 py-0.5 rounded">
            {weakAreas.length} FLAGGED
          </span>
        </div>

        <p className="text-xs text-[var(--on-surface-dim)] mb-3 leading-relaxed">
          Extracted from your completed stage assessments & algorithmic trace runs.
        </p>

        <div className="flex flex-col gap-2.5">
          {weakAreas.map(w => (
            <div
              key={w.id}
              className="p-3 bg-[var(--surface-mid)] border border-[var(--border)] rounded-lg flex items-start gap-3 transition-colors hover:border-[var(--primary)]/40"
            >
              <span className="material-symbols-outlined text-[17px] text-[var(--secondary-hi)] shrink-0 mt-0.5">
                priority_high
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-semibold text-[var(--on-surface)] truncate">
                  {w.topic}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--on-surface-dim)] mt-0.5 flex-wrap">
                  <span className={w.severity === 'error' ? 'text-[var(--error)] font-bold' : 'text-[var(--primary)] font-bold'}>
                    {w.action}
                  </span>
                  <span>•</span>
                  <span>{w.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playPop()
            setShowQuiz(true)
          }}
          className="sp-btn-secondary w-full py-2.5 px-4 mt-3.5 text-xs font-mono font-bold flex items-center justify-center gap-2 text-[var(--primary)]"
        >
          <span className="material-symbols-outlined text-[17px]">quiz</span>
          <span>Generate 5-Min Diagnostic Patch</span>
        </button>
      </div>

      {/* ── 5. PIPELINE MILESTONES ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs px-1 text-[var(--on-surface-dim)] font-mono font-semibold tracking-wider uppercase">
          <span>Pipeline Milestones</span>
          <span className="text-[var(--primary)]">Track: {trackLabel}</span>
        </div>

        {/* Completed Milestone */}
        {lastCompleted && (
          <div className="p-3.5 bg-[var(--surface-low)] border border-[var(--border)] rounded-xl flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--tertiary-bg)] border border-[var(--tertiary)]/30 text-[var(--tertiary)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[var(--on-surface)] truncate">
                  {String(lastCompleted.stage).padStart(2, '0')} {lastCompleted.title}
                </span>
                <span className="mono text-[11px] text-[var(--tertiary)] font-semibold">
                  Verified{lastCompleted.score ? ` • Score: ${lastCompleted.score}%` : ''}
                </span>
              </div>
            </div>
            <span className="mono text-xs text-[var(--on-surface-dim)] shrink-0">
              {lastCompleted.completedAt || 'Done'}
            </span>
          </div>
        )}

        {/* Next Locked Stage */}
        {nextLockedStage && (
          <div className="p-3.5 bg-[var(--surface-low)]/60 border border-[var(--border)] rounded-xl flex items-center justify-between gap-3 opacity-70">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-mid)] border border-[var(--border)] text-[var(--on-surface-dim)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-[var(--secondary-hi)] truncate">
                  {String(nextLockedStage.stage).padStart(2, '0')} {nextLockedStage.title}
                </span>
                <span className="mono text-[11px] text-[var(--on-surface-dim)]">
                  Prerequisite: Stage {String(nextLockedStage.stage - 1).padStart(2, '0')} Verified
                </span>
              </div>
            </div>
            <span className="mono text-xs text-[var(--on-surface-dim)] shrink-0">Queued</span>
          </div>
        )}
      </div>

      {/* ── 6. KERNEL ACTIVITY LOG ── */}
      <div className="sp-card p-4 sm:p-5">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--primary)] text-[16px]">history</span>
            <span className="mono text-xs font-bold text-[var(--on-surface)] uppercase tracking-wider">
              Kernel Activity Log
            </span>
          </div>
          <span className="mono text-[10px] text-[var(--on-surface-dim)]">Real-time sync</span>
        </div>

        <div className="flex flex-col gap-2 font-mono text-xs">
          {activity.slice(0, 5).map((a, i) => (
            <div
              key={a.id || i}
              className="flex items-center justify-between py-1.5 text-[var(--on-surface-dim)] gap-3 border-b border-[var(--border)]/40 last:border-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[var(--primary)] font-bold shrink-0">&gt;</span>
                <span className="text-[var(--on-surface)] truncate font-sans text-xs">
                  {a.text}
                </span>
              </div>
              <span className="text-[11px] text-[var(--secondary)] shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
