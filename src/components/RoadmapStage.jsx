import { useState } from 'react'
import { useApp } from '../hooks/AppContext'
import { sound } from '../utils/sound'
import { triggerConfetti } from '../utils/confetti'

const STATUS_CONFIG = {
  completed: {
    border: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.08)',
    icon: 'check_circle',
    iconColor: '#10b981',
    label: 'VERIFIED',
    labelColor: '#10b981',
    badgeClass: 'badge-verified'
  },
  current: {
    border: 'rgba(20, 184, 166, 0.6)',
    bg: 'rgba(20, 184, 166, 0.08)',
    icon: 'radio_button_checked',
    iconColor: '#14b8a6',
    label: 'ACTIVE RUN',
    labelColor: '#14b8a6',
    badgeClass: 'badge-active'
  },
  upcoming: {
    border: 'var(--border)',
    bg: 'transparent',
    icon: 'radio_button_unchecked',
    iconColor: 'var(--secondary)',
    label: 'QUEUED',
    labelColor: 'var(--secondary)',
    badgeClass: ''
  },
  locked: {
    border: 'var(--border)',
    bg: 'transparent',
    icon: 'lock',
    iconColor: 'var(--secondary)',
    label: 'LOCKED',
    labelColor: 'var(--secondary)',
    badgeClass: ''
  },
}

export default function RoadmapStage({ stage, isLast }) {
  const { completeStage } = useApp()
  const [expanded, setExpanded] = useState(stage.status === 'current')
  const [marking, setMarking] = useState(false)
  const [masteredTopics, setMasteredTopics] = useState(() => {
    // Default completed stages to all checked
    return stage.status === 'completed' ? (stage.topics || []) : []
  })

  const cfg = STATUS_CONFIG[stage.status] || STATUS_CONFIG.upcoming

  function toggleTopic(topic) {
    sound.playPop()
    setMasteredTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  async function handleMark() {
    if (stage.status !== 'current') return
    setMarking(true)
    sound.playFanfare()
    triggerConfetti()

    setTimeout(() => {
      completeStage(stage.id)
      setMarking(false)
    }, 500)
  }

  const topicCount = stage.topics?.length || 1
  const completedTopicCount = masteredTopics.length
  const topicPct = Math.round((completedTopicCount / topicCount) * 100)

  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {/* Timeline stem */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 28 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          backgroundColor: cfg.bg,
          border: `2px solid ${cfg.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: stage.status === 'current' ? '0 0 12px var(--primary-glow)' : 'none',
          transition: 'all 0.2s',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: cfg.iconColor }}>
            {cfg.icon}
          </span>
        </div>
        {!isLast && (
          <div style={{
            width: 2, flex: 1, minHeight: 24, marginTop: 4,
            background: stage.status === 'completed'
              ? 'linear-gradient(180deg, #10b981 0%, var(--border) 100%)'
              : 'var(--border)',
          }} />
        )}
      </div>

      {/* Stage Card */}
      <div className="sp-card" style={{
        flex: 1, marginBottom: isLast ? 0 : 14,
        borderColor: cfg.border,
        opacity: stage.status === 'locked' ? 0.6 : 1,
        overflow: 'hidden',
      }}>
        {/* Header Bar */}
        <button
          onClick={() => {
            if (stage.status !== 'locked') {
              sound.playPop()
              setExpanded(e => !e)
            }
          }}
          style={{
            width: '100%', background: 'none', border: 'none',
            cursor: stage.status === 'locked' ? 'not-allowed' : 'pointer',
            padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span className="mono" style={{
              fontSize: '0.6875rem', fontWeight: 700,
              backgroundColor: 'var(--surface-mid)', padding: '2px 8px', borderRadius: 4,
              color: cfg.iconColor, flexShrink: 0, border: '1px solid var(--border)'
            }}>
              {stage.code}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.9375rem', fontWeight: 600,
                color: 'var(--on-surface)', textAlign: 'left',
                wordBreak: 'break-word', lineHeight: 1.3,
              }}>
                Stage {stage.stage} — {stage.title}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                <span className={`mono ${cfg.badgeClass}`} style={{
                  fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.06em',
                  padding: '1px 6px', borderRadius: 4,
                }}>
                  {cfg.label}
                </span>

                {stage.status === 'completed' && stage.score && (
                  <span className="mono" style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600 }}>
                    ★ Score: {stage.score}%
                  </span>
                )}

                {stage.status === 'current' && (
                  <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {completedTopicCount}/{topicCount} topics checked
                  </span>
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
            fontSize: 20, color: 'var(--on-surface-dim)', flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s',
          }}>
            expand_more
          </span>
        </button>

        {/* Expanded View */}
        {expanded && stage.status !== 'locked' && (
          <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }} className="sp-fadein">
            {/* Today focus card */}
            {stage.status === 'current' && stage.todayFocus && (
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
                border: '1px solid rgba(20, 184, 166, 0.4)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>flag</span>
                  <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 700 }}>TODAY'S TARGET</span>
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--on-surface)' }}>{stage.todayFocus}</div>
                {stage.todayDescription && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', marginTop: 4, lineHeight: 1.4 }}>
                    {stage.todayDescription}
                  </div>
                )}
                <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>timer</span>
                  Est. {stage.estimatedMinutes || 45} min
                </div>
              </div>
            )}

            {/* Interactive Topics Checklist */}
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  CORE TOPICS // CLICK TO MARK MASTERED
                </div>
                <span className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)' }}>
                  {topicPct}% done
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {stage.topics?.map(t => {
                  const isChecked = masteredTopics.includes(t)
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTopic(t)}
                      style={{
                        padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                        fontSize: '0.75rem', fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-mid)',
                        border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.4)' : 'var(--border)'}`,
                        color: isChecked ? '#34d399' : 'var(--on-surface-dim)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: isChecked ? '#10b981' : 'var(--secondary)' }}>
                        {isChecked ? 'check_circle' : 'circle'}
                      </span>
                      <span>{t}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Resources with sleek badges */}
            {stage.resources && (
              <div style={{ marginTop: 14 }}>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', fontWeight: 700, marginBottom: 6 }}>
                  CURATED STUDY RESOURCES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stage.resources.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px', borderRadius: 6, backgroundColor: 'var(--surface-mid)',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="material-symbols-outlined" style={{
                          fontSize: 18,
                          color: r.type === 'video' ? '#f43f5e' : r.type === 'book' ? '#38bdf8' : '#10b981'
                        }}>
                          {r.type === 'video' ? 'play_circle' : r.type === 'book' ? 'menu_book' : r.type === 'practice' ? 'code' : 'article'}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface)', fontWeight: 500 }}>{r.title}</span>
                      </div>
                      <span className="mono" style={{
                        fontSize: '0.625rem', padding: '2px 6px', borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.05)', color: 'var(--secondary)',
                        textTransform: 'uppercase'
                      }}>
                        {r.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Outcome */}
            {stage.outcome && (
              <div style={{ marginTop: 12, padding: '8px 10px', borderRadius: 6, background: 'var(--surface-mid)' }}>
                <div className="mono" style={{ fontSize: '0.625rem', color: 'var(--secondary-hi)', fontWeight: 700, marginBottom: 2 }}>
                  TARGET COMPETENCY
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface)', lineHeight: 1.4 }}>
                  {stage.outcome}
                </div>
              </div>
            )}

            {/* Stage Action Button */}
            {stage.status === 'upcoming' && (
              <div className="mono" style={{
                marginTop: 14, fontSize: '0.75rem', color: 'var(--secondary-hi)',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 10px', borderRadius: 6, background: 'var(--surface-mid)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--warning)' }}>lock_clock</span>
                Prerequisite: Stage {stage.stage - 1} must be marked complete first.
              </div>
            )}

            {stage.status === 'current' && (
              <button
                onClick={handleMark}
                disabled={marking}
                className="sp-btn-primary"
                style={{
                  marginTop: 14, width: '100%', padding: '10px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  opacity: marking ? 0.7 : 1,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
                {marking ? 'Verifying Stage Completion...' : 'Mark Stage Complete & Unlock Next'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}