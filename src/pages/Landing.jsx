import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'

const FEATURES = [
  { icon: 'adjust', title: 'Goal Selection', desc: 'Choose your career path and get a structured roadmap.' },
  { icon: 'account_tree', title: 'Prerequisite Roadmap', desc: 'Learn skills in the right order — no wasted effort.' },
  { icon: 'bar_chart', title: 'Progress Tracking', desc: 'Track completion, study hours, and streaks.' },
  { icon: 'memory', title: 'AI Guidance', desc: 'Get personalised study recommendations from the AI Kernel.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { profile, progress } = useApp()

  return (
    <div style={{ padding: '24px 16px 24px', maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Hero */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 24, textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 64, height: 64, borderRadius: 12,
          backgroundColor: 'var(--primary)', marginBottom: 16,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#fff' }}>terminal</span>
        </div>
        <div className="mono" style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>
          SMARTPREP // CAREER OS
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.2, marginBottom: 8 }}>
          Build Your Career Stack
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-dim)', lineHeight: 1.6, marginBottom: 20 }}>
          AI-powered personalised roadmaps for B.Tech CSE students. Learn in order, track progress, ship your career.
        </p>
        <button
          className="sp-btn-primary"
          onClick={() => navigate('/dashboard')}
          style={{ padding: '11px 32px', fontSize: '0.9375rem', borderRadius: 6, width: '100%' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
            Go to Dashboard — {profile.name}
          </span>
        </button>
        <button
          className="sp-btn-secondary"
          onClick={() => navigate('/goals')}
          style={{ padding: '9px 32px', fontSize: '0.875rem', borderRadius: 6, width: '100%', marginTop: 8 }}
        >
          Browse Goals
        </button>
      </div>

      {/* Current goal pill */}
      <div style={{
        backgroundColor: 'var(--primary-bg)', border: '1px solid var(--primary)',
        borderRadius: 8, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary)', flexShrink: 0 }}>verified</span>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600 }}>ACTIVE GOAL</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface)' }}>
            {(progress.goalId || 'backend-developer').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </div>
        </div>
        <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
          {progress.overallPercent || 0}%
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>
          CORE MODULES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 12,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--primary)', display: 'block', marginBottom: 6 }}>{f.icon}</span>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--on-surface)', marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)', lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to how-it-works */}
      <button
        className="sp-btn-secondary"
        onClick={() => navigate('/how-it-works')}
        style={{ padding: '9px 0', width: '100%', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>explore</span>
        How SmartPrep Works
      </button>
    </div>
  )
}
