// SmartPrep mock AI engine.
// NO API call — it reads the current app state and builds a reply from rules.
// Flow:  user message -> detectIntent() -> matching reply builder(ctx) -> text

import { getRoadmapForGoal, GOALS, WEAK_AREAS } from '../data/mockData'

// Build a "context" object with everything the assistant needs to know.
export function buildContext(progress, profile) {
  const goalId = progress.goalId || 'backend-developer'
  const roadmap = getRoadmapForGoal(goalId)
  const completed = progress.completedStages || []
  const current = roadmap.find(s => s.id === progress.currentStage && !completed.includes(s.id)) || null
  const currentIdx = current ? roadmap.indexOf(current) : roadmap.length
  const next = roadmap[currentIdx + 1] || null
  const goal = GOALS.find(g => g.id === goalId)
  // weak areas only from stages the student has touched
  const touched = [...completed, current?.id].filter(Boolean)
  const weak = WEAK_AREAS.filter(w => touched.includes(w.stageId))
  const dailyMin = Math.round((Number(profile.dailyStudyHours) || 2) * 60)
  return { goal, roadmap, completed, current, next, weak, dailyMin, progress, profile }
}

const INTENTS = [
  ['today',    ['today', 'study now', 'what should i study', 'plan for today']],
  ['missed',   ['missed', 'adjust', 'behind', 'skipped', 'lazy']],
  ['next',     ['after', 'next', 'comes after', 'upcoming']],
  ['practice', ['practice', 'question', 'quiz', 'problem']],
  ['weak',     ['weak', 'gap', 'improve', 'struggl']],
  ['progress', ['progress', 'status', 'how am i', 'report']],
]

export function detectIntent(msg) {
  const m = msg.toLowerCase()
  for (const [intent, words] of INTENTS) if (words.some(w => m.includes(w))) return intent
  return 'help'
}

const finished = c => `You have completed all ${c.roadmap.length} stages of **${c.goal.title}**. Revise weak areas and start building portfolio projects.`

const replies = {
  today(c) {
    if (!c.current) return finished(c)
    const session = Math.min(c.current.estimatedMinutes || 45, c.dailyMin)
    const rest = c.dailyMin - session
    let r = `Your current stage is **${c.current.title}** (Stage ${c.current.stage}/${c.roadmap.length}).\n\n`
    r += `Today I recommend: **${c.current.todayFocus}** for about **${session} minutes**.\n`
    if (c.current.todayDescription) r += `${c.current.todayDescription}\n`
    if (c.weak.length && rest >= 15) r += `\nWith your remaining ${rest} min, patch a weak area: *${c.weak[0].topic}*.`
    else r += `\nAfter that, continue with the next incomplete topic in this stage.`
    return r
  },
  missed(c) {
    if (!c.current) return finished(c)
    const left = Math.max(0, (c.progress.weeklyTarget || 8) - (c.progress.weeklyHours || 0))
    return `No problem — let's recover without burning out.\n\n` +
      `You're at **${c.progress.overallPercent}%** on ${c.goal.title}, current stage **${c.current.title}**.\n\n` +
      `Adjusted 3-day plan:\n` +
      `→ **Day 1:** Quick revision of ${c.current.topics[0]} — 30 min\n` +
      `→ **Day 2:** ${c.current.todayFocus} — ${Math.min(c.dailyMin, 60)} min\n` +
      `→ **Day 3:** Practice problems + 1 weak area — ${Math.min(c.dailyMin, 60)} min\n\n` +
      `You need **${left.toFixed(1)}h** more to hit this week's ${c.progress.weeklyTarget}h target.\n*Consistency beats intensity.*`
  },
  next(c) {
    if (!c.current) return finished(c)
    if (!c.next) return `**${c.current.title}** is your final stage. Finish it to complete the ${c.goal.title} roadmap!`
    return `After **${c.current.title}** comes:\n\n` +
      `**Stage ${c.next.stage} → ${c.next.title}**\n` +
      `Topics: ${c.next.topics.join(', ')}\n` +
      (c.next.estimatedHours ? `Estimated: ~${c.next.estimatedHours} hours\n` : '') +
      `\n🔒 It unlocks once you mark Stage ${c.current.stage} complete on the Roadmap page.`
  },
  practice(c) {
    if (!c.current) return finished(c)
    const t = c.current.topics
    return `Practice set for **${c.current.title}**:\n\n` +
      t.slice(0, 5).map((topic, i) =>
        `**${i + 1}.** ${topic}: ${['explain it in your own words and write one example.',
          'solve one easy problem.', 'solve one medium problem.', 'find a common mistake and fix it.',
          'teach it to a friend in 2 minutes.'][i]}`).join('\n') +
      `\n\n*Start with ${t[0]} — it is the foundation for the rest.*`
  },
  weak(c) {
    if (!c.weak.length) return `No weak areas flagged yet. Keep completing sessions and I'll flag topics where you struggle.`
    return `You have **${c.weak.length} flagged knowledge gap${c.weak.length > 1 ? 's' : ''}**:\n\n` +
      c.weak.map(w => `⚠️ **${w.topic}** — ${w.action} (${w.time})`).join('\n') +
      `\n\nFix these before moving on — later stages build on them.`
  },
  progress(c) {
    const lines = c.roadmap.map(s =>
      c.completed.includes(s.id) ? `✅ Stage ${s.stage} — ${s.title}` :
      s === c.current ? `🔄 Stage ${s.stage} — ${s.title} (in progress)` :
      `🔒 Stage ${s.stage} — ${s.title}`).join('\n')
    const pct = Math.round(((c.progress.weeklyHours || 0) / (c.progress.weeklyTarget || 8)) * 100)
    return `**Progress Report — ${c.goal.title}**\n\nOverall: **${c.progress.overallPercent}%** (${c.completed.length}/${c.roadmap.length} stages)\n\n${lines}\n\n` +
      `This week: **${c.progress.weeklyHours}h / ${c.progress.weeklyTarget}h** (${pct}%) • Streak: ${c.progress.streak} days`
  },
  help(c) {
    return `I'm the **SmartPrep AI Kernel** for your **${c.goal.title}** roadmap.\n\n` +
      (c.current ? `You're on **${c.current.title}** with **${c.progress.overallPercent}%** overall progress.\n\n` : '') +
      `I can help with:\n→ What to study today\n→ Recovery plans if you missed days\n→ What comes next in your roadmap\n→ Practice questions\n→ Weak areas & progress reports\n\nTry a quick prompt below.`
  },
}

export function getAIResponse(message, progress, profile) {
  const ctx = buildContext(progress, profile)
  return replies[detectIntent(message)](ctx)
}
