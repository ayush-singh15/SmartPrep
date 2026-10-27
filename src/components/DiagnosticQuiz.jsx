import { useState } from 'react'
import { sound } from '../utils/sound'
import { triggerConfetti } from '../utils/confetti'

const QUESTIONS = [
  {
    id: 1,
    topic: 'Interface vs Abstract Class',
    question: 'When should you choose an Interface over an Abstract Class in modern Java architecture?',
    options: [
      { text: 'When you need to support multiple inheritance of type & contracts across unrelated classes', correct: true },
      { text: 'When you need to store non-static mutable state variables across subclasses', correct: false },
      { text: 'Only when every single method must have a private implementation', correct: false },
      { text: 'When you want to prevent any class from implementing polymorphism', correct: false },
    ],
    explanation: 'Interfaces define contracts that any class can implement regardless of hierarchy (multiple inheritance of type). Abstract classes are suited for shared code and state across closely related classes.',
  },
  {
    id: 2,
    topic: 'Recursion & Call Stack',
    question: 'What is the primary risk of an unoptimized recursive Tree DFS on deeply unbalanced trees?',
    options: [
      { text: 'StackOverflowError due to O(N) active call stack frames exceeding JVM stack memory', correct: true },
      { text: 'Heap OutOfMemoryError because local primitive variables are allocated on the garbage collector heap', correct: false },
      { text: 'Deadlock between concurrent reader threads on the root node', correct: false },
      { text: 'Compile-time type erasure failure in generic nodes', correct: false },
    ],
    explanation: 'Each recursive call adds a frame to the thread stack. If a tree degenerates into a linked list with N nodes, recursion depth is O(N), which risks exhausting the thread stack limit.',
  },
  {
    id: 3,
    topic: 'Binary Search Mechanics',
    question: 'To avoid potential 32-bit integer overflow when calculating mid, which calculation is recommended?',
    options: [
      { text: 'int mid = low + (high - low) / 2;', correct: true },
      { text: 'int mid = (low + high) / 2;', correct: false },
      { text: 'int mid = (low * high) / 2;', correct: false },
      { text: 'int mid = Math.sqrt(low + high);', correct: false },
    ],
    explanation: '(low + high) can exceed Integer.MAX_VALUE (2,147,483,647) and wrap into negative numbers. Using low + (high - low) / 2 prevents numerical overflow.',
  },
]

export default function DiagnosticQuiz({ onClose, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)

  const q = QUESTIONS[currentIdx]

  function handleSelect(opt) {
    if (answered) return
    setSelectedOpt(opt)
    setAnswered(true)

    if (opt.correct) {
      sound.playSuccess()
      setScore(s => s + 1)
    } else {
      sound.playPop()
    }
  }

  function handleNext() {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1)
      setSelectedOpt(null)
      setAnswered(false)
    } else {
      setShowResult(true)
      sound.playFanfare()
      triggerConfetti()
      if (onComplete) onComplete()
    }
  }

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
        borderRadius: 16, padding: 24,
        width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px -5px var(--primary-glow)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>quiz</span>
            </div>
            <div>
              <div className="mono" style={{ fontSize: '0.6875rem', color: '#f43f5e', fontWeight: 700, letterSpacing: '0.06em' }}>
                DIAGNOSTIC TELEMETRY PATCH
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--on-surface)' }}>
                Knowledge Gap Check
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 6,
              background: 'var(--surface-mid)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--on-surface-dim)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>

        {!showResult ? (
          <div>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i === currentIdx ? 'var(--primary)' : i < currentIdx ? 'var(--tertiary)' : 'var(--surface-high)',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            {/* Question pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="mono" style={{
                fontSize: '0.6875rem', fontWeight: 600,
                color: 'var(--primary)', background: 'var(--primary-bg)',
                padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-bright)'
              }}>
                QUESTION {currentIdx + 1} OF {QUESTIONS.length} // {q.topic}
              </span>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>
                Score: {score}
              </span>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.4, marginBottom: 16 }}>
              {q.question}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, i) => {
                let borderCol = 'var(--border)'
                let bgCol = 'var(--surface-mid)'
                let textCol = 'var(--on-surface)'

                if (answered) {
                  if (opt.correct) {
                    borderCol = '#10b981'
                    bgCol = 'rgba(16, 185, 129, 0.15)'
                    textCol = '#34d399'
                  } else if (selectedOpt === opt) {
                    borderCol = '#f43f5e'
                    bgCol = 'rgba(244, 63, 94, 0.15)'
                    textCol = '#fb7185'
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    disabled={answered}
                    style={{
                      padding: '12px 14px', borderRadius: 8, textAlign: 'left',
                      background: bgCol, border: `1px solid ${borderCol}`,
                      color: textCol, cursor: answered ? 'default' : 'pointer',
                      fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4,
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      transition: 'all 0.15s'
                    }}
                  >
                    <span className="mono" style={{
                      width: 22, height: 22, borderRadius: 4, flexShrink: 0,
                      background: 'rgba(255, 255, 255, 0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ flex: 1 }}>{opt.text}</span>
                    {answered && opt.correct && (
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#10b981' }}>check_circle</span>
                    )}
                    {answered && selectedOpt === opt && !opt.correct && (
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#f43f5e' }}>cancel</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Feedback & explanation */}
            {answered && (
              <div className="sp-fadein" style={{
                marginTop: 14, padding: '10px 14px', borderRadius: 8,
                background: selectedOpt?.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                border: `1px solid ${selectedOpt?.correct ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              }}>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 700,
                  color: selectedOpt?.correct ? '#34d399' : '#fb7185', marginBottom: 2
                }}>
                  {selectedOpt?.correct ? '✓ Verified Correct!' : '✗ Concept Flagged'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', lineHeight: 1.4 }}>
                  {q.explanation}
                </div>
              </div>
            )}

            {/* Next button */}
            {answered && (
              <button
                className="sp-btn-primary"
                onClick={handleNext}
                style={{
                  marginTop: 16, width: '100%', padding: '11px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <span>{currentIdx < QUESTIONS.length - 1 ? 'Next Question' : 'View Diagnostic Results'}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </button>
            )}
          </div>
        ) : (
          /* Result Screen */
          <div style={{ textAlign: 'center', padding: '10px 0' }} className="sp-fadein">
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)', marginBottom: 14
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#fff' }}>verified</span>
            </div>

            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--tertiary)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>
              PATCH APPLIED // SCORE: {score}/{QUESTIONS.length}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>
              {score >= 2 ? 'Knowledge Gap Resolved!' : 'Concepts Reviewed!'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-dim)', lineHeight: 1.5, marginBottom: 20 }}>
              {score >= 2
                ? 'Great work! You demonstrated solid architectural understanding of polymorphic interfaces and call-stack limits.'
                : 'Good attempt. Review the explanations above before tackling the Next Stage.'}
            </p>

            <button
              className="sp-btn-primary"
              onClick={onClose}
              style={{ width: '100%', padding: '11px 0', fontSize: '0.9375rem' }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
