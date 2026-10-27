import { db } from '../models/db.js'

function computeRoadmapStatus(roadmap, completedStages) {
  const currentIdx = roadmap.findIndex(s => !completedStages.includes(s.id))
  return roadmap.map((stage, idx) => {
    let status = 'locked'
    if (completedStages.includes(stage.id)) {
      status = 'completed'
    } else if (idx === currentIdx) {
      status = 'current'
    } else if (idx === currentIdx + 1) {
      status = 'upcoming'
    }
    return { ...stage, status }
  })
}

export function getGoals(req, res) {
  try {
    const goals = db.get('goals')
    res.json({ success: true, data: goals })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function getRoadmap(req, res) {
  try {
    const { goalId } = req.params
    const roadmaps = db.get('roadmaps')
    const progress = db.get('progress')
    const baseRoadmap = roadmaps[goalId] || roadmaps['backend-developer'] || []
    const withStatus = computeRoadmapStatus(baseRoadmap, progress.completedStages || [])
    res.json({
      success: true,
      data: {
        goalId,
        stages: withStatus,
        masteredTopics: progress.masteredTopics || []
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function completeStage(req, res) {
  try {
    const { stageId } = req.body
    const progress = db.get('progress')
    const roadmaps = db.get('roadmaps')
    const currentRoadmap = roadmaps[progress.goalId] || roadmaps['backend-developer'] || []

    const completed = progress.completedStages || []
    if (!completed.includes(stageId)) {
      completed.push(stageId)
    }

    // Determine next active stage
    const nextStage = currentRoadmap.find(s => !completed.includes(s.id))
    const overallPercent = Math.round((completed.length / currentRoadmap.length) * 100)

    const updatedProgress = db.set('progress', {
      ...progress,
      completedStages: completed,
      currentStage: nextStage ? nextStage.id : null,
      overallPercent
    })

    // Add activity record
    const completedStageObj = currentRoadmap.find(s => s.id === stageId)
    const stageTitle = completedStageObj ? completedStageObj.title : stageId
    const currentActivity = db.get('activity') || []
    currentActivity.unshift({
      id: Date.now(),
      text: `Stage Verified: ${stageTitle}`,
      time: 'Just now',
      color: 'tertiary'
    })
    db.set('activity', currentActivity.slice(0, 10))

    const roadmapWithStatus = computeRoadmapStatus(currentRoadmap, completed)

    res.json({
      success: true,
      data: {
        progress: updatedProgress,
        stages: roadmapWithStatus,
        completedStage: completedStageObj
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function toggleTopic(req, res) {
  try {
    const { topic } = req.body
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic string required' })
    }

    const progress = db.get('progress')
    let mastered = progress.masteredTopics || []

    if (mastered.includes(topic)) {
      mastered = mastered.filter(t => t !== topic)
    } else {
      mastered = [...mastered, topic]
    }

    const updated = db.set('progress', {
      ...progress,
      masteredTopics: mastered
    })

    res.json({
      success: true,
      data: {
        masteredTopics: updated.masteredTopics,
        toggled: topic,
        isMastered: mastered.includes(topic)
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function selectGoal(req, res) {
  try {
    const { goalId } = req.body
    const goals = db.get('goals')
    const goalExists = goals.some(g => g.id === goalId)
    if (!goalExists) {
      return res.status(404).json({ success: false, error: 'Goal track not found' })
    }

    const updatedProgress = db.set('progress', {
      goalId,
      completedStages: [],
      currentStage: 'stage-01',
      overallPercent: 0,
      weeklyHours: 0,
      weeklyTarget: 8,
      streak: 1,
      masteredTopics: []
    })

    const profile = db.get('profile')
    db.set('profile', { ...profile, currentGoal: goalId })

    const currentActivity = db.get('activity') || []
    currentActivity.unshift({
      id: Date.now(),
      text: `Selected Career Goal: ${goalId.replace(/-/g, ' ')}`,
      time: 'Just now',
      color: 'primary'
    })
    db.set('activity', currentActivity.slice(0, 10))

    res.json({ success: true, data: updatedProgress })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
