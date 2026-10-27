const STEPS = [
  { icon: 'adjust',       code: 'STEP_01', label: 'Goal Selection',       desc: 'Choose your target career from curated B.Tech CSE paths — Backend Dev, Full Stack, AI/ML, and more.' },
  { icon: 'psychology',   code: 'STEP_02', label: 'Skill Analysis',        desc: 'SmartPrep analyses your current skill level and identifies what you need to learn.' },
  { icon: 'account_tree', code: 'STEP_03', label: 'Prerequisite Roadmap',  desc: 'A structured 7-stage roadmap is generated. Each stage unlocks only after the previous is verified.' },
  { icon: 'library_books',code: 'STEP_04', label: 'Learning Resources',    desc: 'Curated videos, books, and practice platforms are attached to each stage.' },
  { icon: 'code',         code: 'STEP_05', label: 'Practice',              desc: 'Topic-specific practice questions and LeetCode-style challenges keep you sharp.' },
  { icon: 'bar_chart',    code: 'STEP_06', label: 'Progress Tracking',     desc: 'Weekly study time, streak, stage completion, and weak areas are tracked in real time.' },
  { icon: 'memory',       code: 'STEP_07', label: 'AI Guidance',           desc: 'The AI Kernel analyses your state and gives personalised study recommendations and recovery plans.' },
]

export default function HowItWorks() {
  return (
    <div style={{ padding: '16px', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>
          SYSTEM DOCS // v1.0
        </div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>How SmartPrep Works</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-dim)', lineHeight: 1.6 }}>
          A structured, prerequisite-driven learning OS for B.Tech CSE students targeting industry careers.
        </p>
      </div>

      {/* Pipeline flow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map((step, i) => (
          <div key={step.code} style={{ display: 'flex', gap: 14 }}>
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: 'var(--primary-bg)', border: '2px solid var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>{step.icon}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 16, backgroundColor: 'var(--border)', margin: '4px 0' }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: i < STEPS.length - 1 ? 16 : 0 }}>
              <div style={{
                backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span className="mono" style={{
                    fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.06em',
                    backgroundColor: 'var(--surface-mid)', color: 'var(--primary)',
                    padding: '1px 5px', borderRadius: 2,
                  }}>{step.code}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--on-surface)' }}>{step.label}</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)', lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture note */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
        borderRadius: 8, padding: 14,
      }}>
        <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>
          ARCHITECTURE NOTES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            ['Frontend', 'React + Vite + Tailwind CSS'],
            ['Routing', 'React Router v6'],
            ['State', 'React Context + localStorage'],
            ['AI', 'Local mock engine (no API)'],
            ['Theme', 'Dark (default) + Light mode'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--on-surface-dim)' }}>{k}</span>
              <span className="mono" style={{ color: 'var(--primary)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
