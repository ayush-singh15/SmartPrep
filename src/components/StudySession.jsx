import { useState, useEffect, useRef } from 'react'
import { useApp } from '../hooks/AppContext'

// runSeconds = how long the timer actually runs; minutes = what gets credited.
// The "Demo" preset runs 10 s but credits 25 min, so it can be shown live in a viva.
const PRESETS = [
  { label: '25 min', minutes: 25, runSeconds: 25 * 60 },
  { label: '45 min', minutes: 45, runSeconds: 45 * 60 },
  { label: '60 min', minutes: 60, runSeconds: 60 * 60 },
  { label: 'Demo 10s', minutes: 25, runSeconds: 10 },
]

export default function StudySession({ onClose }) {
  const { addStudySession } = useApp()
  const [preset, setPreset] = useState(PRESETS[0])
  const selectedMinutes = preset.minutes
  const totalSeconds = preset.runSeconds
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          setCompleted(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  function startTimer() {
    setSecondsLeft(totalSeconds)
    setRunning(true)
    setCompleted(false)
  }

  function pauseTimer() {
    setRunning(false)
    clearInterval(intervalRef.current)
  }

  function resetTimer() {
    setRunning(false)
    clearInterval(intervalRef.current)
    setSecondsLeft(totalSeconds)
    setCompleted(false)
  }

  function handleComplete() {
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
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div className="sp-fadein" style={{
        backgroundColor: 'var(--surface-low)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 28,
        width: '100%', maxWidth: 360,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>STUDY SESSION</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)' }}>Focus Timer</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-dim)', fontSize: 20 }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Circular timer */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={60} cy={60} r={54} fill="none" stroke="var(--surface-mid)" strokeWidth={6} />
            <circle
              cx={60} cy={60} r={54} fill="none"
              stroke={completed ? 'var(--tertiary)' : 'var(--primary)'}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {completed ? (
              <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: 36 }}>check_circle</span>
            ) : (
              <>
                <span className="mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1 }}>{mm}:{ss}</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--on-surface-dim)', marginTop: 2 }}>remaining</span>
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
                onClick={() => { setPreset(p); setSecondsLeft(p.runSeconds) }}
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 4, cursor: 'pointer',
                  border: `1px solid ${preset.label === p.label ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: preset.label === p.label ? 'var(--primary-bg)' : 'var(--surface-mid)',
                  color: preset.label === p.label ? 'var(--primary)' : 'var(--on-surface-dim)',
                  fontSize: '0.8125rem', fontWeight: 600,
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
            <div style={{ textAlign: 'center', color: 'var(--tertiary)', fontWeight: 600 }}>
              Session complete! 🎉 +{selectedMinutes} min will be logged
            </div>
            <button className="sp-btn-primary" onClick={handleComplete}
              style={{ padding: '10px 0', width: '100%', fontSize: '0.9rem' }}>
              Save Progress &amp; Close
            </button>
            <button className="sp-btn-secondary" onClick={resetTimer}
              style={{ padding: '8px 0', width: '100%', fontSize: '0.875rem' }}>
              Start Another
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            {!running ? (
              <button className="sp-btn-primary" onClick={startTimer}
                style={{ flex: 1, padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
                Start
              </button>
            ) : (
              <button className="sp-btn-secondary" onClick={pauseTimer}
                style={{ flex: 1, padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>pause</span>
                Pause
              </button>
            )}
            <button className="sp-btn-secondary" onClick={resetTimer}
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>restart_alt</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
