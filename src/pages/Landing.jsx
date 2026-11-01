import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'

const PILLARS = [
  { icon: 'route', title: 'Know what to learn', desc: 'A clear path from your current level to the role you want.' },
  { icon: 'calendar_month', title: 'Make progress weekly', desc: 'Turn a big career goal into focused, manageable study sessions.' },
  { icon: 'insights', title: 'See your momentum', desc: 'Track skills, streaks and milestones without another spreadsheet.' },
]

const OUTCOMES = ['Choose a career direction', 'Get a prerequisite-first roadmap', 'Build a steady study habit', 'Know your next best step']

export default function Landing() {
  const navigate = useNavigate()
  const { profile, progress } = useApp()
  const firstName = profile.name?.split(' ')[0] || 'student'

  return (
    <div className="sp-home">
      <section className="sp-home-hero">
        <div className="sp-home-hero-copy">
          <div className="sp-eyebrow"><span className="sp-eyebrow-dot" /> Built for students who want a direction</div>
          <h1>Stop guessing.<br /><span>Start preparing.</span></h1>
          <p className="sp-home-lede">SmartPrep helps you turn a career target into a practical plan — what to learn, what to practise, and what to do next.</p>
          <div className="sp-home-actions">
            <button className="sp-btn-primary sp-home-primary" onClick={() => navigate('/dashboard')}>Open my workspace <span className="material-symbols-outlined">arrow_forward</span></button>
            <button className="sp-btn-secondary sp-home-secondary" onClick={() => navigate('/how-it-works')}>See how it works</button>
          </div>
          <div className="sp-home-note"><span className="material-symbols-outlined">check_circle</span> Your workspace is ready, {firstName} · {progress.overallPercent || 0}% complete</div>
        </div>

        <div className="sp-home-preview" aria-label="SmartPrep workspace preview">
          <div className="sp-preview-top"><span className="sp-preview-brand"><span className="sp-preview-mark">S</span> SmartPrep</span><span className="sp-preview-status"><i /> on track</span></div>
          <div className="sp-preview-label">THIS WEEK</div>
          <div className="sp-preview-heading">Build your backend foundation</div>
          <div className="sp-preview-progress"><div><span>Weekly progress</span><strong>62%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: '62%' }} /></div></div>
          <div className="sp-preview-list"><div><span className="material-symbols-outlined done">check_circle</span><span>HTTP & REST fundamentals</span><b>Done</b></div><div><span className="material-symbols-outlined current">play_circle</span><span>Build an Express API</span><b className="now">Today</b></div><div><span className="material-symbols-outlined next">radio_button_unchecked</span><span>Persist data with a database</span><b>Next</b></div></div>
          <div className="sp-preview-footer"><span className="material-symbols-outlined">lightbulb</span><span><strong>Smart next step</strong><br />Finish the API exercise before moving on.</span></div>
        </div>
      </section>

      <section className="sp-home-section"><div className="sp-section-intro"><span className="sp-eyebrow">A calmer way to prepare</span><h2>Everything you need to move forward.</h2><p>No noise, no random playlists, no wondering what comes next.</p></div><div className="sp-pillar-grid">{PILLARS.map(p => <article className="sp-pillar" key={p.title}><span className="material-symbols-outlined">{p.icon}</span><h3>{p.title}</h3><p>{p.desc}</p></article>)}</div></section>

      <section className="sp-home-split"><div><span className="sp-eyebrow">From ambition to action</span><h2>Your goal deserves more than a bookmark.</h2><p>Whether you are targeting placements, backend development, full-stack work, or AI/ML, SmartPrep keeps your preparation in one place and gives every session a purpose.</p><button className="sp-text-link" onClick={() => navigate('/goals')}>Explore career goals <span className="material-symbols-outlined">arrow_forward</span></button></div><div className="sp-outcome-card">{OUTCOMES.map((item, i) => <div key={item}><span>0{i + 1}</span><p>{item}</p><span className="material-symbols-outlined">check</span></div>)}</div></section>
    </div>
  )
}
