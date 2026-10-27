import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { getGoals, getRoadmap, completeStage, selectGoal, toggleTopic } from '../controllers/roadmapController.js'
import { getProgress, logSession } from '../controllers/progressController.js'
import { queryKernel } from '../controllers/aiController.js'
import { getQuiz, submitQuiz } from '../controllers/diagnosticController.js'
import { resetAll } from '../controllers/resetController.js'

const router = Router()

// Interactive API Documentation for Viva & External Evaluators
router.get('/', (req, res) => {
  res.json({
    service: 'SmartPrep Career Telemetry Engine',
    version: '1.0.0',
    status: 'online',
    description: 'B.Tech CSE Autonomous Career Progression & Telemetry REST API',
    timestamp: new Date().toISOString(),
    endpoints: [
      { method: 'GET', path: '/api', desc: 'Interactive API catalog & service metadata' },
      { method: 'GET', path: '/api/health', desc: 'System health & uptime check' },
      { method: 'GET', path: '/api/profile', desc: 'Fetch student profile data' },
      { method: 'PUT', path: '/api/profile', desc: 'Update student profile fields' },
      { method: 'GET', path: '/api/goals', desc: 'List all available career tracks' },
      { method: 'GET', path: '/api/roadmap/:goalId', desc: 'Fetch roadmap stages with prerequisite status' },
      { method: 'POST', path: '/api/roadmap/select-goal', desc: 'Select active career goal track' },
      { method: 'POST', path: '/api/roadmap/complete-stage', desc: 'Verify stage completion and compute next stage' },
      { method: 'POST', path: '/api/roadmap/toggle-topic', desc: 'Toggle individual topic checklist mastery' },
      { method: 'GET', path: '/api/progress', desc: 'Fetch progress telemetry, weekly hours, streak' },
      { method: 'POST', path: '/api/progress/session', desc: 'Log completed study session minutes' },
      { method: 'POST', path: '/api/ai/kernel', desc: 'State-aware AI assistant prompt evaluation' },
      { method: 'GET', path: '/api/diagnostic/quiz', desc: 'Fetch diagnostic telemetry questions' },
      { method: 'POST', path: '/api/diagnostic/submit', desc: 'Submit quiz answers and generate roadmap patch' },
      { method: 'POST', path: '/api/reset', desc: 'Reset demo database state to Ayush CSE defaults' }
    ]
  })
})

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
router.post('/roadmap/toggle-topic', toggleTopic)

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

