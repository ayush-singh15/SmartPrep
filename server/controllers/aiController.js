import { db } from '../models/db.js'

const INTENTS = [
  ['today', ['today', 'study now', 'what should i study', 'plan for today', 'directive']],
  ['missed', ['missed', 'adjust', 'behind', 'skipped', 'lazy', 'catch up']],
  ['next', ['after', 'next', 'comes after', 'upcoming', 'future']],
  ['practice', ['practice', 'question', 'quiz', 'problem', 'exercise']],
  ['weak', ['weak', 'gap', 'improve', 'struggle', 'telemetry']],
  ['progress', ['progress', 'status', 'how am i', 'report', 'metric']],
]

function detectIntent(msg) {
  const m = (msg || '').toLowerCase()
  for (const [intent, words] of INTENTS) {
    if (words.some(w => m.includes(w))) return intent
  }
  return 'help'
}

export function queryKernel(req, res) {
  try {
    const { message } = req.body
    const progress = db.get('progress')
    const profile = db.get('profile')
    const roadmaps = db.get('roadmaps')
    const goals = db.get('goals')
    const weakAreas = db.get('weakAreas') || []

    const currentRoadmap = roadmaps[progress.goalId] || roadmaps['backend-developer'] || []
    const currentGoal = goals.find(g => g.id === progress.goalId) || goals[0]
    const completed = progress.completedStages || []
    const currentStage = currentRoadmap.find(s => s.id === progress.currentStage && !completed.includes(s.id))
    const currentIdx = currentStage ? currentRoadmap.indexOf(currentStage) : currentRoadmap.length
    const nextStage = currentRoadmap[currentIdx + 1] || null

    const touched = [...completed, currentStage?.id].filter(Boolean)
    const activeWeak = weakAreas.filter(w => touched.includes(w.stageId))
    const dailyMin = Math.round((Number(profile.dailyStudyHours) || 2) * 60)

    const intent = detectIntent(message)
    let reply = ''

    if (intent === 'today') {
      if (!currentStage) {
        reply = `You have completed all stages of **${currentGoal.title}**. Start building capstone projects and mock interview drills.`
      } else {
        const session = Math.min(currentStage.estimatedMinutes || 45, dailyMin)
        const rest = dailyMin - session
        reply = `Your current stage is **${currentStage.title}** (Stage ${currentStage.stage}/${currentRoadmap.length}).\n\n` +
          `Today's directive: **${currentStage.todayFocus}** (~${session} min).\n` +
          `${currentStage.todayDescription || ''}\n`
        if (activeWeak.length && rest >= 15) {
          reply += `\nWith remaining ${rest} min, patch a flagged gap: *${activeWeak[0].topic}*.`
        }
      }
    } else if (intent === 'missed') {
      const left = Math.max(0, (progress.weeklyTarget || 8) - (progress.weeklyHours || 0))
      reply = `No worries — here is your recovery sprint plan for **${currentGoal.title}**:\n\n` +
        `Current stage: **${currentStage ? currentStage.title : 'Active track'}** (${progress.overallPercent}% complete).\n\n` +
        `3-Day Catch-up Schedule:\n` +
        `→ **Day 1:** 30 min review of ${currentStage?.topics?.[0] || 'core concepts'}\n` +
        `→ **Day 2:** 45 min focus on ${currentStage?.todayFocus || 'active topic'}\n` +
        `→ **Day 3:** Practice problem set + 1 diagnostic patch (~45 min)\n\n` +
        `You need **${left.toFixed(1)}h** more to hit your weekly target.`
    } else if (intent === 'next') {
      if (!currentStage) {
        reply = `You are at the final stage of **${currentGoal.title}**!`
      } else if (!nextStage) {
        reply = `**${currentStage.title}** is your final stage! Finish it to complete the full ${currentGoal.title} roadmap.`
      } else {
        reply = `After **${currentStage.title}**, the next milestone is:\n\n` +
          `**Stage ${nextStage.stage} → ${nextStage.title}**\n` +
          `Topics: ${nextStage.topics.join(', ')}\n` +
          `\n🔒 Unlocks immediately when Stage ${currentStage.stage} is verified.`
      }
    } else if (intent === 'practice') {
      const t = currentStage?.topics || ['Core concepts', 'Problem solving', 'Implementation']
      reply = `Diagnostic practice questions for **${currentStage?.title || currentGoal.title}**:\n\n` +
        t.slice(0, 4).map((topic, i) =>
          `**${i + 1}.** *${topic}*: ${['Explain the architectural trade-offs in 2 minutes.', 'Implement a clean working snippet.', 'Solve a medium complexity trace question.', 'Identify standard edge cases.'][i]}`
        ).join('\n')
    } else if (intent === 'weak') {
      if (!activeWeak.length) {
        reply = `No flagged knowledge gaps in your current telemetry! Your foundation is verified.`
      } else {
        reply = `You have **${activeWeak.length} flagged knowledge gap${activeWeak.length > 1 ? 's' : ''}**:\n\n` +
          activeWeak.map(w => `⚠️ **${w.topic}** — ${w.action} (${w.time})`).join('\n') +
          `\n\nRun the 5-Min Diagnostic Patch on the Dashboard to resolve them.`
      }
    } else if (intent === 'progress') {
      const pct = Math.round(((progress.weeklyHours || 0) / (progress.weeklyTarget || 8)) * 100)
      reply = `**SmartPrep Telemetry Report // ${currentGoal.title}**\n\n` +
        `Overall Competency: **${progress.overallPercent}%** (${completed.length}/${currentRoadmap.length} stages)\n` +
        `Weekly Study Time: **${progress.weeklyHours}h / ${progress.weeklyTarget}h** (${pct}%)\n` +
        `Consistency Streak: **${progress.streak} days active run**\n` +
        `Status: **${currentStage ? `Stage ${currentStage.stage} Active` : 'Roadmap Complete'}**`
    } else {
      reply = `Hello, I'm the **SmartPrep AI Kernel** for your **${currentGoal.title}** track.\n\n` +
        (currentStage ? `Currently tracking: **${currentStage.title}** (${progress.overallPercent}% complete).\n\n` : '') +
        `Ask me anything about:\n` +
        `→ What to study today\n` +
        `→ Recovery plans if you skipped days\n` +
        `→ What unlocks next in your roadmap\n` +
        `→ Practice questions & weak areas\n\n` +
        `Tap a prompt below or type your question!`
    }

    res.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString(),
        intent
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
