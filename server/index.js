import app from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`[SmartPrep Server] REST API listening on http://localhost:${PORT}`)
  console.log(`[SmartPrep Server] Health Check: http://localhost:${PORT}/api/health`)
})
