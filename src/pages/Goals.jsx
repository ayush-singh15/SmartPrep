import { useState } from 'react'
import GoalCard from '../components/GoalCard'
import { GOALS } from '../data/mockData'

const FILTERS = ['All paths', 'Beginner friendly', 'Software roles', 'Data & AI']

export default function Goals() {
  const [showCustom, setShowCustom] = useState(false)
  const [filter, setFilter] = useState('All paths')
  const visibleGoals = GOALS.filter(goal => {
    if (filter === 'Beginner friendly') return goal.difficulty === 'Beginner'
    if (filter === 'Software roles') return ['backend-developer', 'full-stack', 'android-developer', 'placement-prep'].includes(goal.id)
    if (filter === 'Data & AI') return ['ai-ml', 'data-engineer'].includes(goal.id)
    return true
  })

  return (
    <div className="sp-goals-page">
      <header className="sp-goals-header">
        <div><span className="sp-eyebrow">Choose your direction</span><h1>One goal at a time.<br /><span>A plan you can trust.</span></h1><p>Pick the career path that feels closest to where you want to go. SmartPrep will organise the skills, practice, and milestones for you.</p></div>
        <div className="sp-goals-callout"><span className="material-symbols-outlined">route</span><div><strong>Not sure yet?</strong><p>Start with Placement Preparation. It gives you a broad foundation while you explore.</p></div></div>
      </header>
      <div className="sp-goals-filters" role="tablist" aria-label="Career path filters">{FILTERS.map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="sp-goals-grid">{visibleGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}</div>
      {visibleGoals.length === 0 && <div className="sp-empty-state">No paths match this filter yet.</div>}
      <section className="sp-custom-goal"><div><span className="material-symbols-outlined">add_circle</span><div><h2>Have a different target?</h2><p>Custom roadmap generation is coming soon. Tell us the role you are aiming for and we will help shape the next path.</p></div></div><button className="sp-btn-secondary" onClick={() => setShowCustom(value => !value)}>{showCustom ? 'Hide details' : 'Tell me more'}</button>{showCustom && <div className="sp-custom-note"><span className="material-symbols-outlined">construction</span> Custom career paths are in development — your current goals are fully available now.</div>}</section>
    </div>
  )
}
