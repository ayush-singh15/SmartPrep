import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/api.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Mount API routes under /api
app.use('/api', apiRoutes)

// Root fallback for server status
app.get('/', (req, res) => {
  res.json({
    name: 'SmartPrep Backend REST API',
    status: 'online',
    endpoints: {
      health: '/api/health',
      profile: '/api/profile',
      goals: '/api/goals',
      progress: '/api/progress'
    }
  })
})

export default app
