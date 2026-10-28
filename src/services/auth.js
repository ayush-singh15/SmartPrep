// SmartPrep Auth Service
// Offline-first authentication for students and independent learners.
// Supports sign-in via username or email + password.
// Local student registry (localStorage) is the primary store so the app works
// on Vercel, GitHub Pages, or offline, with opportunistic Express backend sync.

import { getItem, setItem, STORAGE_KEYS } from '../utils/storage'
import { DEFAULT_PROFILE, DEFAULT_PROGRESS, DEFAULT_ACTIVITY } from '../data/mockData'
import { api } from './api'

export const DEMO_PASSWORD = 'smartprep123'

// ── Pre-seeded demo students (1-click access for testing & demos) ──
export const DEMO_ACCOUNTS = [
  {
    id: 'demo-ayush',
    name: 'Ayush Kumar Singh',
    username: 'ayush',
    email: 'ayush@smartprep.com',
    tagline: 'Backend Track • Java & Spring',
    accent: 'var(--primary)',
    icon: 'dns',
    profile: {
      ...DEFAULT_PROFILE,
      name: 'Ayush Kumar Singh',
      username: 'ayush',
      email: 'ayush@smartprep.com',
    },
    progress: { ...DEFAULT_PROGRESS },
    activity: [...DEFAULT_ACTIVITY],
  },
  {
    id: 'demo-priya',
    name: 'Priya Sharma',
    username: 'priya',
    email: 'priya@smartprep.com',
    tagline: 'AI/ML Track • Python & ML',
    accent: 'var(--accent-purple)',
    icon: 'psychology',
    profile: {
      name: 'Priya Sharma',
      username: 'priya',
      email: 'priya@smartprep.com',
      degree: 'B.Tech',
      branch: 'CSE',
      year: '3rd Year',
      semester: '5th Semester',
      dailyStudyHours: 3,
      currentGoal: 'ai-ml',
    },
    progress: {
      goalId: 'ai-ml',
      completedStages: ['ai-01', 'ai-02'],
      currentStage: 'ai-03',
      overallPercent: 40,
      weeklyHours: 7,
      weeklyTarget: 10,
      streak: 11,
      masteredTopics: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Linear Algebra', 'Statistics', 'Probability'],
    },
    activity: [
      { id: 1, text: 'Completed: Math for ML', time: '1d ago', color: 'tertiary' },
      { id: 2, text: 'Study session: 60 min completed', time: '2d ago', color: 'primary' },
    ],
  },
  {
    id: 'demo-fresh',
    name: 'Alex Carter',
    username: 'alex',
    email: 'alex@smartprep.com',
    tagline: 'Placement Prep • Fresh Start',
    accent: 'var(--warning)',
    icon: 'rocket_launch',
    profile: {
      name: 'Alex Carter',
      username: 'alex',
      email: 'alex@smartprep.com',
      degree: 'Self-Taught / Student',
      branch: 'Computer Science',
      year: 'Learner',
      semester: 'Stage 1',
      dailyStudyHours: 2,
      currentGoal: 'placement-prep',
    },
    progress: {
      goalId: 'placement-prep',
      completedStages: [],
      currentStage: 'pp-01',
      overallPercent: 0,
      weeklyHours: 0,
      weeklyTarget: 8,
      streak: 0,
      masteredTopics: [],
    },
    activity: [{ id: 1, text: 'Account created — welcome to SmartPrep!', time: 'Just now', color: 'primary' }],
  },
]

// ── Helpers ──
export async function hashPassword(password) {
  const data = new TextEncoder().encode(`smartprep::${password}`)
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  let h = 0x811c9dc5
  for (const byte of data) { h ^= byte; h = Math.imul(h, 0x01000193) >>> 0 }
  return `fnv-${h.toString(16)}`
}

function makeToken() {
  const rand = globalThis.crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  return `sp_${rand}`
}

function normalize(s) { return String(s || '').trim().toLowerCase() }

export function isValidEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s).trim()) }
export function isValidUsername(s) { return /^[a-zA-Z0-9_.-]{3,30}$/.test(String(s).trim()) }

// ── Local registry ──
export function getAccounts() {
  return getItem(STORAGE_KEYS.ACCOUNTS, {})
}

function saveAccounts(accounts) {
  setItem(STORAGE_KEYS.ACCOUNTS, accounts)
}

async function ensureSeeded() {
  const accounts = getAccounts()
  let changed = false
  const demoHash = await hashPassword(DEMO_PASSWORD)
  for (const demo of DEMO_ACCOUNTS) {
    // If not existing or missing username, seed / refresh demo
    if (!accounts[demo.id] || !accounts[demo.id].username) {
      accounts[demo.id] = {
        id: demo.id,
        name: demo.name,
        username: demo.username,
        email: demo.email,
        passwordHash: demoHash,
        createdAt: new Date().toISOString(),
        profile: demo.profile,
        progress: demo.progress,
        activity: demo.activity,
        sessions: [],
      }
      changed = true
    }
  }
  if (changed) saveAccounts(accounts)
  return accounts
}

function findAccount(accounts, identifier) {
  const id = normalize(identifier)
  return Object.values(accounts).find(a =>
    normalize(a.email) === id ||
    normalize(a.username) === id ||
    (a.rollNo && normalize(a.rollNo) === id)
  )
}

export function snapshotAccount(userId, data) {
  if (!userId) return
  const accounts = getAccounts()
  if (!accounts[userId]) return
  accounts[userId] = {
    ...accounts[userId],
    ...data,
    name: data.profile?.name || accounts[userId].name,
    username: data.profile?.username || accounts[userId].username,
  }
  saveAccounts(accounts)
}

function toSession(account, remember) {
  return {
    userId: account.id,
    name: account.name,
    username: account.username || account.name.toLowerCase().replace(/\s+/g, ''),
    email: account.email,
    token: makeToken(),
    remember: !!remember,
    loggedInAt: new Date().toISOString(),
  }
}

function freshProgress(goalId) {
  const prefix = {
    'backend-developer': 'stage',
    'full-stack': 'fs',
    'ai-ml': 'ai',
    'data-engineer': 'de',
    'android-developer': 'an',
    'placement-prep': 'pp',
  }[goalId] || 'stage'
  return {
    goalId,
    completedStages: [],
    currentStage: `${prefix}-01`,
    overallPercent: 0,
    weeklyHours: 0,
    weeklyTarget: 8,
    streak: 0,
    masteredTopics: [],
  }
}

// Starting state for "Reset Demo Data"
export function getResetState(userId, currentProfile) {
  const demo = DEMO_ACCOUNTS.find(d => d.id === userId)
  if (demo || !userId) {
    const d = demo || DEMO_ACCOUNTS[0]
    return { profile: d.profile, progress: d.progress, activity: d.activity }
  }
  const goalId = currentProfile?.currentGoal || 'backend-developer'
  return {
    profile: currentProfile,
    progress: freshProgress(goalId),
    activity: [{ id: Date.now(), text: 'Progress reset', time: 'Just now', color: 'primary' }],
  }
}

// ── Public API ──
export async function login({ identifier, password, remember = true }) {
  if (!identifier || !password) throw new Error('Enter your username or email and password.')
  const accounts = await ensureSeeded()
  const account = findAccount(accounts, identifier)

  if (account) {
    const hash = await hashPassword(password)
    if (hash !== account.passwordHash) throw new Error('Incorrect password. Please try again.')
    return { account, session: toSession(account, remember) }
  }

  // Not in local registry — ask the backend (account may exist on another device / server)
  try {
    const res = await api.login({ identifier, password })
    if (res?.user) {
      const u = res.user
      const created = {
        id: u.id,
        name: u.name,
        username: u.username || u.name.toLowerCase().replace(/\s+/g, ''),
        email: u.email,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
        profile: {
          ...DEFAULT_PROFILE,
          ...(u.profile || {}),
          name: u.name,
          username: u.username,
          email: u.email,
        },
        progress: u.progress || freshProgress(u.profile?.currentGoal || u.goalId || 'backend-developer'),
        activity: [],
        sessions: [],
      }
      saveAccounts({ ...getAccounts(), [created.id]: created })
      return { account: created, session: { ...toSession(created, remember), token: res.token || makeToken() } }
    }
  } catch (e) {
    if (e.status === 401) throw new Error('Incorrect password. Please try again.')
  }
  throw new Error('No account found with that username or email.')
}

export async function register({ name, username, email, password, goalId, dailyStudyHours }) {
  const accounts = await ensureSeeded()
  const cleanUsername = normalize(username)
  const cleanEmail = normalize(email)

  if (findAccount(accounts, cleanEmail)) throw new Error('An account with this email already exists.')
  if (findAccount(accounts, cleanUsername)) throw new Error('This username is already taken.')

  // Best-effort backend registration (ignored when offline / static hosting)
  try {
    await api.register({ name, username: cleanUsername, email: cleanEmail, password, goalId })
  } catch (e) {
    if (e.status === 409) throw new Error('This username or email is already registered.')
  }

  const id = `user-${Date.now().toString(36)}`
  const account = {
    id,
    name: name.trim(),
    username: cleanUsername,
    email: cleanEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
    profile: {
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      degree: 'Student',
      branch: 'Computer Science',
      year: 'Active Learner',
      semester: 'Current',
      dailyStudyHours: Number(dailyStudyHours) || 2,
      currentGoal: goalId || 'backend-developer',
    },
    progress: freshProgress(goalId || 'backend-developer'),
    activity: [{ id: Date.now(), text: 'Account created — welcome to SmartPrep!', time: 'Just now', color: 'primary' }],
    sessions: [],
  }
  saveAccounts({ ...getAccounts(), [id]: account })
  return { account, session: toSession(account, true) }
}

export async function demoLogin(demoId) {
  const demo = DEMO_ACCOUNTS.find(d => d.id === demoId)
  if (!demo) throw new Error('Unknown demo account')
  return login({ identifier: demo.username || demo.email, password: DEMO_PASSWORD, remember: true })
}
