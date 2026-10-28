// Small localStorage wrapper.
// Every read is wrapped in try/catch so a missing or corrupted value
// silently falls back to the default demo data instead of crashing the app.

export const STORAGE_KEYS = {
  PROFILE: 'smartprep_profile',
  PROGRESS: 'smartprep_progress',   // goal, completed stages, current stage, weekly hours
  SESSIONS: 'smartprep_sessions',
  ACTIVITY: 'smartprep_activity',
  THEME: 'smartprep_theme',
  AUTH: 'smartprep_auth',           // active session { userId, email, rollNo, name, token, loggedInAt }
  ACCOUNTS: 'smartprep_accounts',   // local student registry (offline-first auth fallback)
}

export function getItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    const parsed = JSON.parse(raw)
    // Guard against wrong shapes (e.g. someone stored a string where an object is expected)
    if (defaultValue !== null && typeof defaultValue === 'object' && typeof parsed !== 'object') return defaultValue
    return parsed
  } catch {
    return defaultValue
  }
}

export function setItem(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) }
  catch (e) { console.warn('localStorage write failed:', e) }
}

export function clearAll() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
}
