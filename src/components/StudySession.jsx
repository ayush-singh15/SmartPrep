import { useState, useEffect, useRef } from 'react'
import { useApp } from '../hooks/AppContext'
import { sound } from '../utils/sound'
import { triggerConfetti } from '../utils/confetti'

const PRESETS = [
  { label: '25 min', minutes: 25, runSeconds: 25 * 60 },
  { label: '45 min', minutes: 45, runSeconds: 45 * 60 },
  { label: '60 min', minutes: 60, runSeconds: 60 * 60 },
  { label: 'Demo 10s', minutes: 25, runSeconds: 10 },
]

const QUOTES = [
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger Dijkstra' },
  { text: 'Clean code always looks like it was written by someone who cares.', author: 'Robert C. Martin' },
  { text: 'The only way to learn a new programming language is by writing programs in it.', author: 'Dennis Ritchie' },
]

export default function StudySession({ onClose }) {
  const { addStudySession } = useApp()
  const [preset, setPreset] = useState(PRESETS[0])
  const selectedMinutes = preset.minutes
  const totalSeconds = preset.runSeconds
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [completed, setCompleted] = useState(false)
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setCompleted(true)
          sound.playFanfare()
          triggerConfetti()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  function startTimer() {
    sound.playPop()
    setSecondsLeft(totalSeconds)
    setRunning(true)
    setCompleted(false)
  }

  function pauseTimer() {
    sound.playPop()
    setRunning(false)
    clearInterval(intervalRef.current)
  }

  function resetTimer() {
    sound.playPop()
    setRunning(false)
    clearInterval(intervalRef.current)
    setSecondsLeft(totalSeconds)
    setCompleted(false)
  }

  function handleComplete() {
    sound.playSuccess()
    addStudySession(selectedMinutes)
    onClose && onClose()
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const progress = 1 - secondsLeft / totalSeconds
  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference * (1 - progress)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(5, 10, 18, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div className="sp-fadein" style={{
        background: 'linear-gradient(145deg, var(--surface-low) 0%, rgba(16, 24, 38, 0.98) 100%)',
        border: '1px solid var(--border-bright)',
        borderRadius: 16, padding: 26,
        width: '100%', maxWidth: 380, maxHeight: '90vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 18,
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px -5px var(--primary-glow)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--primary-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>timer</span>
            </div>
            <div>
              <div className="mono" style={{ color: 'var(--primary)', fontSize: '0.6875rem', fontWeight: 700 }}>SMARTPREP FOCUS</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)' }}>Deep Work Timer</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 6,
            background: 'var(--surface-mid)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--on-surface-dim)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        {/* Motivational Quote */}
        <div style={{
          padding: '8px 12px', borderRadius: 8,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', fontStyle: 'italic', lineHeight: 1.4 }}>
            "{QUOTES[quoteIdx].text}"
          </div>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', marginTop: 4 }}>
            — {QUOTES[quoteIdx].author}
          </div>
        </div>

        {/* Circular timer */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', margin: '4px 0' }}>
          <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={65} cy={65} r={54} fill="none" stroke="var(--surface-mid)" strokeWidth={6} />
            <circle
              cx={65} cy={65} r={54} fill="none"
              stroke={completed ? '#10b981' : 'var(--primary)'}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {completed ? (
              <span className="material-symbols-outlined" style={{ color: '#10b981', fontSize: 42 }}>check_circle</span>
            ) : (
              <>
                <span className="mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--on-surface)', lineHeight: 1 }}>{mm}:{ss}</span>
                <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--primary)', marginTop: 4, letterSpacing: '0.04em' }}>
                  {running ? 'FOCUSED RUN' : 'STANDBY'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Presets */}
        {!running && !completed && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => {
                  sound.playPop()
                  setPreset(p)
                  setSecondsLeft(p.runSeconds)
                }}
                style={{
                  padding: '7px 0', borderRadius: 6, cursor: 'pointer',
                  border: `1px solid ${preset.label === p.label ? 'var(--primary)' : 'var(--border)'}`,
                  background: preset.label === p.label ? 'var(--primary-bg)' : 'var(--surface-mid)',
                  color: preset.label === p.label ? 'var(--primary)' : 'var(--on-surface-dim)',
                  fontSize: '0.75rem', fontWeight: 600,
                  boxShadow: preset.label === p.label ? '0 0 10px var(--primary-glow)' : 'none',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        {completed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 700, fontSize: '0.9375rem' }}>
              Focus session completed! 🎉 +{selectedMinutes}m logged
            </div>
            <button className="sp-btn-primary" onClick={handleComplete}
              style={{ padding: '11px 0', width: '100%', fontSize: '0.9375rem' }}>
              Save Progress to Dashboard
            </button>
            <button className="sp-btn-secondary" onClick={resetTimer}
              style={{ padding: '8px 0', width: '100%', fontSize: '0.8125rem' }}>
              Start Another Sprint
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            {!running ? (
              <button className="sp-btn-primary" onClick={startTimer}
                style={{ flex: 1, padding: '11px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>play_arrow</span>
                Start Focus Timer
              </button>
            ) : (
              <button className="sp-btn-secondary" onClick={pauseTimer}
                style={{ flex: 1, padding: '11px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>pause</span>
                Pause
              </button>
            )}
            <button className="sp-btn-secondary" onClick={resetTimer}
              style={{ width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>restart_alt</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}