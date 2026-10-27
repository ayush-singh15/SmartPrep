import { db } from '../models/db.js'

export function getProfile(req, res) {
  try {
    const profile = db.get('profile')
    res.json({ success: true, data: profile })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function updateProfile(req, res) {
  try {
    const updates = req.body
    const current = db.get('profile')
    const updated = db.set('profile', { ...current, ...updates })

    // If goal was changed, update progress goal as well
    if (updates.currentGoal && updates.currentGoal !== db.get('progress').goalId) {
      const currentProg = db.get('progress')
      db.set('progress', {
        ...currentProg,
        goalId: updates.currentGoal,
        completedStages: [],
        currentStage: 'stage-01',
        overallPercent: 0
      })
    }

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
