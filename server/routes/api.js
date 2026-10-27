import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { getGoals, getRoadmap, completeStage, selectGoal } from '../controllers/roadmapController.js'
import { getProgress, logSession } from '../controllers/progressController.js'
import { queryKernel } from '../controllers/aiController.js'
import { getQuiz, submitQuiz } from '../controllers/diagnosticController.js'
import { resetAll } from '../controllers/resetController.js'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SmartPrep Backend REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Profile routes
router.get('/profile', getProfile)
router.put('/profile', updateProfile)

// Goals & Roadmap routes
router.get('/goals', getGoals)
router.get('/roadmap/:goalId', getRoadmap)
router.post('/roadmap/select-goal', selectGoal)
router.post('/roadmap/complete-stage', completeStage)

// Progress & Study Sessions
router.get('/progress', getProgress)
router.post('/progress/session', logSession)

// AI Kernel Assistant
router.post('/ai/kernel', queryKernel)

// Diagnostic Telemetry & Quiz
router.get('/diagnostic/quiz', getQuiz)
router.post('/diagnostic/submit', submitQuiz)

// System Reset
router.post('/reset', resetAll)

export default router
