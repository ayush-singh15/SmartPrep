import { useState } from 'react'
import { useApp } from '../hooks/AppContext'

const STATUS_CONFIG = {
  completed: { border: 'var(--tertiary)',  bg: 'var(--tertiary-bg)', icon: 'check_circle',   iconColor: 'var(--tertiary)', label: 'VERIFIED',    labelColor: 'var(--tertiary)' },
  current:   { border: 'var(--primary)',   bg: 'var(--primary-bg)',  icon: 'radio_button_checked', iconColor: 'var(--primary)',  label: 'ACTIVE RUN', labelColor: 'var(--primary)'  },
  upcoming:  { border: 'var(--border)',    bg: 'transparent',        icon: 'radio_button_unchecked', iconColor: 'var(--secondary)', label: 'QUEUED',   labelColor: 'var(--secondary)'},
  locked:    { border: 'var(--border)',    bg: 'transparent',        icon: 'lock',            iconColor: 'var(--secondary)', label: 'LOCKED',      labelColor: 'var(--secondary)'},
}

export default function RoadmapStage({ stage, isLast }) {
  const { completeStage } = useApp()
  const [expanded, setExpanded] = useState(stage.status === 'current')
  const [marking, setMarking] = useState(false)
  const cfg = STATUS_CONFIG[stage.status] || STATUS_CONFIG.upcoming

  async function handleMark() {
    if (stage.status !== 'current') return
    setMarking(true)
    setTimeout(() => { completeStage(stage.id); setMarking(false) }, 600)
  }

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          backgroundColor: cfg.bg,
          border: `2px solid ${cfg.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: cfg.iconColor }}>
            {cfg.icon}
          </span>
        </div>
        {!isLast && (
          <div style={{
            width: 2, flex: 1, minHeight: 20, marginTop: 4,
            backgroundColor: stage.status === 'completed' ? 'var(--tertiary)' : 'var(--border)',
          }} />
        )}
      </div>

      {/* Card */}
      <div style={{
        flex: 1, marginBottom: isLast ? 0 : 12,
        backgroundColor: 'var(--surface-low)',
        border: `1px solid ${cfg.border}`,
        borderRadius: 8,
        overflow: 'hidden',
        opacity: stage.status === 'locked' ? 0.55 : 1,
        transition: 'border-color 0.15s',
      }}>
        {/* Card header */}
        <button
          onClick={() => stage.status !== 'locked' && setExpanded(e => !e)}
          style={{
            width: '100%', background: 'none', border: 'none', cursor: stage.status === 'locked' ? 'not-allowed' : 'pointer',
            padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span className="mono" style={{
              fontSize: '0.6875rem', fontWeight: 600,
              backgroundColor: 'var(--surface-mid)', padding: '1px 6px', borderRadius: 2,
              color: cfg.iconColor, flexShrink: 0,
            }}>
              {stage.code}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.875rem', fontWeight: 600,
                color: 'var(--on-surface)', textAlign: 'left',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                Stage {stage.stage} — {stage.title}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                <span style={{
                  fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.06em',
                  color: cfg.labelColor,
                }}>
                  {cfg.label}
                </span>
                {stage.status === 'completed' && stage.score && (
                  <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--tertiary)' }}>Score: {stage.score}%</span>
                )}
                {stage.status === 'locked' && (
                  <span style={{ fontSize: '0.6875rem', color: 'var(--secondary)' }}>
                    Prereq: Stage {stage.stage - 1} verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{
            fontSize: 18, color: 'var(--on-surface-dim)', flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
          }}>
            expand_more
          </span>
        </button>

        {/* Expanded content */}
        {expanded && stage.status !== 'locked' && (
          <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--border)' }} className="sp-fadein">
            {/* Today's focus for current */}
            {stage.status === 'current' && stage.todayFocus && (
              <div style={{
                marginTop: 10, padding: '8px 10px', borderRadius: 6,
                backgroundColor: 'var(--primary-bg)', border: '1px solid var(--primary)',
              }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600 }}>TODAY'S FOCUS</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface)', marginTop: 2 }}>{stage.todayFocus}</div>
                {stage.todayDescription && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', marginTop: 4 }}>{stage.todayDescription}</div>
                )}
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 6 }}>
                  Est. {stage.estimatedMinutes || 45} min
                </div>
              </div>
            )}

            {/* Topics */}
            <div style={{ marginTop: 10 }}>
              <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', fontWeight: 600, marginBottom: 6 }}>
                TOPICS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {stage.topics?.map(t => (
                  <span key={t} style={{
                    fontSize: '0.75rem', padding: '2px 8px', borderRadius: 2,
                    backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
                    color: 'var(--on-surface-dim)',
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Resources */}
            {stage.resources && (
              <div style={{ marginTop: 10 }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', fontWeight: 600, marginBottom: 6 }}>
                  RESOURCES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {stage.resources.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 8px', borderRadius: 4, backgroundColor: 'var(--surface-mid)',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--primary)', flexShrink: 0 }}>
                        {r.type === 'video' ? 'play_circle' : r.type === 'book' ? 'book' : r.type === 'practice' ? 'code' : 'article'}
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface)' }}>{r.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outcome */}
            {stage.outcome && (
              <div style={{ marginTop: 10 }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', fontWeight: 600, marginBottom: 4 }}>
                  EXPECTED OUTCOME
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface)', lineHeight: 1.5 }}>{stage.outcome}</div>
              </div>
            )}

            {/* Actions */}
            {stage.status === 'upcoming' && (
              <div className="mono" style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--secondary-hi)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock_clock</span>
                Unlocks after Stage {stage.stage - 1} is marked complete
              </div>
            )}
            {stage.status === 'current' && (
              <button
                onClick={handleMark}
                disabled={marking}
                className="sp-btn-primary"
                style={{
                  marginTop: 12, width: '100%', padding: '8px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  opacity: marking ? 0.6 : 1,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                {marking ? 'Marking...' : 'Mark Stage Complete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
