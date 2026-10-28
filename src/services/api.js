// SmartPrep Frontend API Client
// Connects to Node.js / Express backend with automatic fail-safe fallback to localStorage.

const CLOUD_API = 'https://smartprep-jet.vercel.app/api'
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io')
const isDev = import.meta.env.DEV

// On GitHub Pages, direct requests to the live Vercel Cloud API
// On Vercel, use relative /api for zero-latency same-origin serverless routing
// In local dev, use port 5000 Express backend
const API_BASE = isGitHubPages ? CLOUD_API : (isDev ? 'http://localhost:5000/api' : '/api')

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const res = await fetch(url, config)
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}: ${res.statusText}`)
      err.status = res.status
      throw err
    }
    const json = await res.json()
    return json.data || json
  } catch (error) {
    console.warn(`[API] ${endpoint} request failed: ${error.message} - Using fallback store`)
    throw error
  }
}

export const api = {
  // System Health & Documentation
  async checkHealth() {
    return request('/health')
  },

  async getApiDocs() {
    return request('/')
  },

  // Authentication
  async login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  async register(studentData) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    })
  },

  // Student Profile
  async getProfile() {
    return request('/profile')
  },

  async updateProfile(profileData) {
    return request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  },

  // Goals & Roadmaps
  async getGoals() {
    return request('/goals')
  },

  async getRoadmap(goalId) {
    return request(`/roadmap/${goalId}`)
  },

  async completeStage(stageId) {
    return request('/roadmap/complete-stage', {
      method: 'POST',
      body: JSON.stringify({ stageId }),
    })
  },

  async selectGoal(goalId) {
    return request('/roadmap/select-goal', {
      method: 'POST',
      body: JSON.stringify({ goalId }),
    })
  },

  async toggleTopic(topic) {
    return request('/roadmap/toggle-topic', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    })
  },

  // Progress & Study Sessions
  async getProgress() {
    return request('/progress')
  },

  async logSession(durationMinutes) {
    return request('/progress/session', {
      method: 'POST',
      body: JSON.stringify({ durationMinutes }),
    })
  },

  // AI Kernel Query
  async queryAI(message) {
    return request('/ai/kernel', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  },

  // Diagnostic Quiz
  async getDiagnosticQuiz() {
    return request('/diagnostic/quiz')
  },

  async submitDiagnosticQuiz(answers) {
    return request('/diagnostic/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    })
  },

  // System Reset
  async resetAll() {
    return request('/reset', {
      method: 'POST',
    })
  },
}
