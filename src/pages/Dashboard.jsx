import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import ProgressBar from '../components/ProgressBar'
import StudySession from '../components/StudySession'
import { BACKEND_ROADMAP, OTHER_ROADMAPS, WEAK_AREAS, GOALS } from '../data/mockData'

function getHour() { return new Date().getHours() }
function getGreeting() {
  const h = getHour()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { profile, progress, activity } = useApp()
  const navigate = useNavigate()
  const [showSession, setShowSession] = useState(false)

  const goalId = progress.goalId || 'backend-developer'
  const roadmap = goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || [])
  const currentStageData = roadmap.find(s => s.id === progress.currentStage)
  const nextLockedStage = roadmap.find(s => !((progress.completedStages || []).includes(s.id)) && s.id !== progress.currentStage)
  const touched = [...(progress.completedStages || []), progress.currentStage]
  const weakAreas = WEAK_AREAS.filter(w => touched.includes(w.stageId))
  const trackLabel = (GOALS.find(g => g.id === goalId) || {}).subtitle || ''

  const weeklyPct = Math.round(((progress.weeklyHours || 0) / (progress.weeklyTarget || 8)) * 100)
  const goalLabel = goalId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  const completedCount = (progress.completedStages || []).length

  // Last completed stage
  const lastCompleted = roadmap.filter(s => (progress.completedStages || []).includes(s.id)).pop()

  return (
    <div className="grid gap-3 p-4 lg:p-6 lg:grid-cols-2 lg:items-start mx-auto max-w-[600px] lg:max-w-[1100px]">
      {showSession && <StudySession onClose={() => setShowSession(false)} />}
      {/* Left column: who I am + what to do now */}
      <div className="flex flex-col gap-3">

      {/* ── HERO CARD ── */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 14, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span className="mono" style={{ color: 'var(--primary)', fontSize: '0.6875rem', fontWeight: 600 }}>
                DEV_SESSION // {(profile.name || 'AYUSH').toUpperCase()}
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--tertiary)', display: 'inline-block' }} className="sp-pulse" />
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--on-surface)', margin: '0 0 3px' }}>
              {getGreeting()}, {profile.name || 'Ayush'}
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)' }}>
              {profile.degree} {profile.branch} (Sec {profile.section || '2-A'}) • {profile.semester || profile.year}
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--surface-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--primary)' }}>terminal</span>
          </div>
        </div>

        {/* Pipeline bar */}
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 8, padding: '8px 10px', marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>verified</span>
              <span className="mono" style={{ color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 600 }}>{goalLabel}</span>
            </div>
            <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>
              Stage {completedCount + (currentStageData ? 1 : 0)} / {roadmap.length}
            </span>
          </div>
          <ProgressBar value={progress.overallPercent || 0} max={100} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--on-surface-dim)' }}>{progress.overallPercent || 0}% Verified Competency</span>
            <span className="mono" style={{ color: 'var(--tertiary)' }}>Pipeline: Nominal</span>
          </div>
        </div>
      </div>

      {/* ── CURRENT STAGE / DIRECTIVE CARD ── */}
      {currentStageData && (
        <div style={{
          backgroundColor: 'var(--surface-low)', border: '1px solid var(--primary)',
          borderRadius: 10, padding: 14, position: 'relative', overflow: 'hidden',
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mono" style={{
                fontSize: '0.6875rem', fontWeight: 600,
                backgroundColor: 'var(--primary-bg)', color: 'var(--primary)',
                padding: '1px 6px', borderRadius: 2,
              }}>STAGE {String(currentStageData.stage).padStart(2, '0')}</span>
              <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>
                {currentStageData.subtitle}
              </span>
            </div>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 3,
              backgroundColor: 'var(--tertiary-bg)', color: 'var(--tertiary)',
              fontSize: '0.625rem', fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--tertiary)', display: 'inline-block' }} className="sp-pulse" />
              ACTIVE RUN
            </span>
          </div>

          {/* Content */}
          <div style={{ marginBottom: 8 }}>
            <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 3 }}>
              TODAY'S STUDY DIRECTIVE
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.3 }}>
              {currentStageData.todayFocus || currentStageData.topics?.[0] || currentStageData.title}
            </div>
            {currentStageData.todayDescription && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', marginTop: 4, lineHeight: 1.5 }}>
                {currentStageData.todayDescription}
              </div>
            )}
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--primary)' }}>schedule</span>
              Est. {currentStageData.estimatedMinutes || 45} min
            </div>
            <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--tertiary)' }}>task_alt</span>
              {currentStageData.topics?.length || 3} Topics
            </div>
            <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--secondary)' }}>code_blocks</span>
              {trackLabel}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="sp-btn-primary"
              onClick={() => setShowSession(true)}
              style={{ flex: 1, padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: '0.9rem' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
              Continue Session
            </button>
            <button
              className="sp-btn-secondary"
              onClick={() => setShowSession(true)}
              title="Start Pomodoro"
              style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', height: 44 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>timer</span>
              25m
            </button>
          </div>
        </div>
      )}

      {!currentStageData && (
        <div style={{ backgroundColor: 'var(--tertiary-bg)', border: '1px solid var(--tertiary)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, color: 'var(--tertiary)' }}>Roadmap complete 🎉</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', marginTop: 4 }}>All stages verified. Pick a new goal or revise weak areas with the AI Kernel.</div>
        </div>
      )}

      {/* ── WEEKLY + STREAK GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {/* Weekly target */}
        <div style={{
          backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
          borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>Weekly Target</span>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--primary)' }}>query_stats</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
              <span style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--on-surface)' }}>{progress.weeklyHours || 0}</span>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>/ {progress.weeklyTarget || 8}h</span>
            </div>
            <ProgressBar value={progress.weeklyHours || 0} max={progress.weeklyTarget || 8} color="tertiary" height={5} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>trending_up</span>
            {weeklyPct}% {weeklyPct >= 80 ? '(On Track)' : weeklyPct >= 50 ? '(Keep Going)' : '(Needs Push)'}
          </span>
        </div>

        {/* Streak */}
        <div style={{
          backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
          borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>Streak & Eval</span>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--error)' }}>local_fire_department</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
              <span style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--on-surface)' }}>{progress.streak || 0}</span>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>Days Active</span>
            </div>
            <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>
              Stage {String(completedCount + 1).padStart(2, '0')} Eval in 4d
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>event_repeat</span>
            Sat, 18:00 IST
          </span>
        </div>
      </div>

      </div>
      {/* Right column: diagnostics + history */}
      <div className="flex flex-col gap-3">
      {/* ── KNOWLEDGE GAPS ── */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'var(--error)' }}>bug_report</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--on-surface)' }}>Knowledge Gaps (Telemetry)</span>
          </div>
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
            backgroundColor: 'var(--error-bg)', color: 'var(--error)',
            padding: '2px 7px', borderRadius: 2,
          }}>
            {weakAreas.length} FLAGGED
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-dim)', marginBottom: 8 }}>
          Extracted from your completed stage assessments & practice runs.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {weakAreas.map(w => (
            <div key={w.id} style={{
              backgroundColor: 'var(--surface-mid)', borderRadius: 4, padding: '7px 10px',
              display: 'flex', alignItems: 'flex-start', gap: 7,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--on-surface-dim)', marginTop: 1, flexShrink: 0 }}>priority_high</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {w.topic}
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: '0.6875rem', color: 'var(--on-surface-dim)', marginTop: 1 }}>
                  <span style={{ color: w.severity === 'error' ? 'var(--error)' : 'var(--primary)' }}>{w.action}</span>
                  <span>•</span>
                  <span>{w.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="sp-btn-secondary"
          onClick={() => navigate('/assistant')}
          style={{ marginTop: 10, width: '100%', padding: '7px 0', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>quiz</span>
          Generate 5-Min Diagnostic Patch
        </button>
      </div>

      {/* ── PIPELINE MILESTONES ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--on-surface-dim)', textTransform: 'uppercase' }}>Pipeline Milestones</span>
          <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)' }}>Track: {trackLabel}</span>
        </div>

        {/* Last completed */}
        {lastCompleted && (
          <div style={{
            backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                backgroundColor: 'var(--tertiary-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'var(--tertiary)' }}>check_circle</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {String(lastCompleted.stage).padStart(2, '0')} {lastCompleted.title}
                </div>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--tertiary)' }}>
                  Verified{lastCompleted.score ? ` • Score: ${lastCompleted.score}%` : ''}
                </div>
              </div>
            </div>
            <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', flexShrink: 0, marginLeft: 8 }}>
              {lastCompleted.completedAt || 'Done'}
            </span>
          </div>
        )}

        {/* Next locked */}
        {nextLockedStage && (
          <div style={{
            backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 10px', opacity: 0.7,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                backgroundColor: 'var(--surface-mid)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: 'var(--on-surface-dim)' }}>lock</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--on-surface-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {String(nextLockedStage.stage).padStart(2, '0')} {nextLockedStage.title}
                </div>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>
                  Prerequisite: Stage {String(nextLockedStage.stage - 1).padStart(2, '0')} Verified
                </div>
              </div>
            </div>
            <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', flexShrink: 0, marginLeft: 8 }}>Queued</span>
          </div>
        )}
      </div>

      {/* ── ACTIVITY LOG ── */}
      <div style={{
        backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--primary)' }}>history</span>
            <span className="mono" style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Kernel Activity Log</span>
          </div>
          <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)' }}>Last synced: 2m ago</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activity.slice(0, 5).map((a, i) => (
            <div key={a.id || i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '5px 0',
              borderBottom: i < Math.min(activity.length, 5) - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span className="mono" style={{ color: `var(--${a.color || 'primary'})`, fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>&gt;</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</span>
              </div>
              <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)', flexShrink: 0, marginLeft: 8 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
