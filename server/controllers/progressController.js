import { db } from '../models/db.js'

export function getProgress(req, res) {
  try {
    const progress = db.get('progress')
    const activity = db.get('activity')
    const sessions = db.get('sessions')
    const weakAreas = db.get('weakAreas')

    res.json({
      success: true,
      data: {
        progress,
        activity,
        sessions,
        weakAreas
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function logSession(req, res) {
  try {
    const { durationMinutes } = req.body
    if (!durationMinutes || durationMinutes <= 0) {
      return res.status(400).json({ success: false, error: 'Valid durationMinutes required' })
    }

    const progress = db.get('progress')
    const sessions = db.get('sessions') || []
    const activity = db.get('activity') || []

    const hours = Math.round((durationMinutes / 60) * 10) / 10
    const newWeeklyHours = Math.round(((progress.weeklyHours || 0) + hours) * 10) / 10

    const newSession = {
      id: Date.now(),
      durationMinutes,
      completedAt: new Date().toISOString()
    }
    sessions.unshift(newSession)
    db.set('sessions', sessions.slice(0, 50))

    const updatedProgress = db.set('progress', {
      ...progress,
      weeklyHours: newWeeklyHours
    })

    const newActivity = {
      id: Date.now(),
      text: `Focus Session: ${durationMinutes} min logged`,
      time: new Date().toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      color: 'primary'
    }
    activity.unshift(newActivity)
    db.set('activity', activity.slice(0, 10))

    res.json({
      success: true,
      data: {
        progress: updatedProgress,
        session: newSession,
        activity: activity.slice(0, 10)
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
