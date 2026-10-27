import { db } from '../models/db.js'

export function resetAll(req, res) {
  try {
    const data = db.reset()
    res.json({
      success: true,
      message: 'Database reset to initial demo state successfully',
      data
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
