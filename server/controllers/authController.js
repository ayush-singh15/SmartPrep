import crypto from 'crypto'
import { db } from '../models/db.js'

// Demo-grade auth for students and independent learners.
// Hash format matches the frontend (SHA-256 of "smartprep::<password>") so
// accounts created on either side can be verified on the other.

const hash = (pw) => crypto.createHash('sha256').update(`smartprep::${pw}`).digest('hex')
const token = () => `sp_${crypto.randomUUID()}`
const norm = (s) => String(s || '').trim().toLowerCase()

const SEED_USERS = [
  { id: 'demo-ayush', name: 'Ayush Kumar Singh', username: 'ayush', email: 'ayush@smartprep.com', goalId: 'backend-developer' },
  { id: 'demo-priya', name: 'Priya Sharma', username: 'priya', email: 'priya@smartprep.com', goalId: 'ai-ml' },
  { id: 'demo-fresh', name: 'Alex Carter', username: 'alex', email: 'alex@smartprep.com', goalId: 'placement-prep' },
]

function getUsers() {
  let users = db.get('users')
  if (!Array.isArray(users) || users.length === 0 || !users[0].username) {
    users = SEED_USERS.map(u => ({ ...u, passwordHash: hash('smartprep123'), createdAt: new Date().toISOString() }))
    db.set('users', users)
  }
  return users
}

const publicUser = ({ passwordHash: _omit, ...u }) => u

export function login(req, res) {
  try {
    const { identifier, password } = req.body || {}
    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'identifier and password are required' })
    }
    const user = getUsers().find(u =>
      norm(u.email) === norm(identifier) ||
      norm(u.username) === norm(identifier) ||
      (u.rollNo && norm(u.rollNo) === norm(identifier))
    )
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    if (user.passwordHash !== hash(password)) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    res.json({ success: true, data: { user: publicUser(user), token: token() } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function register(req, res) {
  try {
    const { name, username, email, password, goalId } = req.body || {}
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, error: 'name, username, email and password are required' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' })
    }
    const users = getUsers()
    if (users.some(u => norm(u.email) === norm(email) || norm(u.username) === norm(username))) {
      return res.status(409).json({ success: false, error: 'Email or username already registered' })
    }
    const user = {
      id: `user-${Date.now().toString(36)}`,
      name: name.trim(),
      username: norm(username),
      email: norm(email),
      goalId: goalId || 'backend-developer',
      passwordHash: hash(password),
      createdAt: new Date().toISOString(),
    }
    db.set('users', [...users, user])
    res.status(201).json({ success: true, data: { user: publicUser(user), token: token() } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
