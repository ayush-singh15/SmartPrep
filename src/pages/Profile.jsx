import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import { GOALS } from '../data/mockData'

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const SEMESTERS = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester']
const STUDY_HOURS = ['1', '2', '3', '4', '5', '6']

export default function Profile() {
  const { profile, updateProfile, progress, selectGoal, theme, toggleTheme, resetDemo, logout, auth } = useApp()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...profile })
  const [saved, setSaved] = useState(false)

  function handleChange(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleSave() {
    updateProfile(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleGoalChange(goalId) {
    if (goalId === progress.goalId) return
    if (window.confirm('Changing your goal will reset progress. Continue?')) {
      selectGoal(goalId)
      handleChange('currentGoal', goalId)
    }
  }

  const goalLabel = (progress.goalId || 'backend-developer')
    .split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Profile hero */}
      <div style={{
        backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {(profile.name || 'A')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--on-surface)' }}>{profile.name || 'Ayush Kumar Singh'}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-dim)' }}>
            {profile.degree} — {profile.branch} (Sec {profile.section || '2-A'})
          </div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 2, fontWeight: 600 }}>
            @{auth?.username || profile.username || 'student'} • {auth?.email || profile.email || 'Active Learner'}
          </div>
        </div>
        <button
          className={editing ? 'sp-btn-secondary' : 'sp-btn-primary'}
          onClick={() => { if (editing) handleSave(); else { setForm({ ...profile }); setEditing(true) } }}
          style={{ padding: '6px 14px', fontSize: '0.8125rem', flexShrink: 0 }}
        >
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      {saved && (
        <div style={{
          backgroundColor: 'var(--tertiary-bg)', border: '1px solid var(--tertiary)',
          borderRadius: 6, padding: '8px 12px', fontSize: '0.875rem', color: 'var(--tertiary)',
          display: 'flex', alignItems: 'center', gap: 6,
        }} className="sp-fadein">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
          Profile updated successfully
        </div>
      )}

      
      {/* Achievements & Engineering Badges */}
      <Section title="Engineering Badges & Badges" code="ACHIEVEMENTS">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
          {[
            { icon: 'local_fire_department', name: '6-Day Streak', desc: 'Active consistently', color: '#f59e0b', earned: true },
            { icon: 'terminal', name: 'Terminal Native', desc: 'Commands & Hotkeys', color: '#14b8a6', earned: true },
            { icon: 'verified', name: 'OOP Architect', desc: 'Score 92% in OOP', color: '#10b981', earned: true },
            { icon: 'timer', name: 'Deep Focus', desc: 'Logged 5.5+ hours', color: '#8b5cf6', earned: true },
            { icon: 'military_tech', name: 'DSA Grandmaster', desc: 'Finish Stage 03', color: '#ec4899', earned: false },
            { icon: 'cloud_done', name: 'Cloud Deployed', desc: 'Docker + Spring Boot', color: '#3b82f6', earned: false },
          ].map(b => (
            <div key={b.name} style={{
              padding: '10px 8px', borderRadius: 8, textAlign: 'center',
              backgroundColor: b.earned ? 'var(--surface-mid)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${b.earned ? 'var(--border)' : 'rgba(255, 255, 255, 0.05)'}`,
              opacity: b.earned ? 1 : 0.45,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: b.color, display: 'block', margin: '0 auto 4px' }}>
                {b.icon}
              </span>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface)' }}>{b.name}</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--on-surface-dim)', marginTop: 2 }}>{b.desc}</div>
              {b.earned && (
                <span className="mono" style={{ fontSize: '0.5625rem', color: '#10b981', fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
                  ✓ UNLOCKED
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Personal info */}
      <Section title="Personal Information" code="USR_INFO">
        <Field label="Name" editing={editing}>
          {editing
            ? <input style={inputStyle} value={form.name || ''} onChange={e => handleChange('name', e.target.value)} />
            : <span>{profile.name}</span>
          }
        </Field>
        <Field label="Degree" editing={editing}>
          {editing
            ? <input style={inputStyle} value={form.degree || ''} onChange={e => handleChange('degree', e.target.value)} />
            : <span>{profile.degree}</span>
          }
        </Field>
        <Field label="Branch" editing={editing}>
          {editing
            ? <input style={inputStyle} value={form.branch || ''} onChange={e => handleChange('branch', e.target.value)} />
            : <span>{profile.branch}</span>
          }
        </Field>
        <Field label="Year" editing={editing}>
          {editing
            ? <select style={inputStyle} value={form.year || ''} onChange={e => handleChange('year', e.target.value)}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            : <span>{profile.year}</span>
          }
        </Field>
        <Field label="Semester" editing={editing}>
          {editing
            ? <select style={inputStyle} value={form.semester || ''} onChange={e => handleChange('semester', e.target.value)}>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            : <span>{profile.semester}</span>
          }
        </Field>
        <Field label="Daily Study Target" editing={editing}>
          {editing
            ? <select style={inputStyle} value={String(form.dailyStudyHours || 2)} onChange={e => handleChange('dailyStudyHours', Number(e.target.value))}>
                {STUDY_HOURS.map(h => <option key={h} value={h}>{h} hour{h !== '1' ? 's' : ''}</option>)}
              </select>
            : <span>{profile.dailyStudyHours || 2} hours/day</span>
          }
        </Field>
      </Section>

      {/* Goal */}
      <Section title="Current Goal" code="GOAL_CFG">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {GOALS.map(g => (
            <div
              key={g.id}
              onClick={() => g.implemented ? handleGoalChange(g.id) : null}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6,
                backgroundColor: progress.goalId === g.id ? 'var(--primary-bg)' : 'var(--surface-mid)',
                border: `1px solid ${progress.goalId === g.id ? 'var(--primary)' : 'var(--border)'}`,
                cursor: g.implemented ? 'pointer' : 'not-allowed',
                opacity: g.implemented ? 1 : 0.5,
                transition: 'border-color 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: progress.goalId === g.id ? 'var(--primary)' : 'var(--on-surface-dim)', flexShrink: 0 }}>{g.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface)' }}>{g.title}</div>
                <div className="mono" style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>{g.subtitle}</div>
              </div>
              {progress.goalId === g.id && (
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)', flexShrink: 0 }}>check_circle</span>
              )}
              {!g.implemented && (
                <span style={{ fontSize: '0.625rem', color: 'var(--on-surface-dim)', fontWeight: 600 }}>SOON</span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" code="UI_PREFS">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--on-surface)' }}>Theme</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)' }}>Currently: {theme === 'dark' ? 'Dark (Terminal)' : 'Light'}</div>
          </div>
          <button
            onClick={toggleTheme}
            className="sp-btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </Section>

      {/* Stats */}
      <Section title="Progress Stats" code="TELEMETRY">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Overall', value: `${progress.overallPercent || 0}%` },
            { label: 'Streak', value: `${progress.streak || 0}d` },
            { label: 'Weekly', value: `${progress.weeklyHours || 0}h` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', backgroundColor: 'var(--surface-mid)', borderRadius: 6, padding: '10px 6px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-dim)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/roadmap')}
          className="sp-btn-secondary"
          style={{ width: '100%', padding: '8px 0', fontSize: '0.875rem', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_tree</span>
          View Full Roadmap
        </button>
        <button
          onClick={() => { if (window.confirm('Reset your data to its starting state?')) { resetDemo(); setEditing(false) } }}
          style={{ width: '100%', padding: '8px 0', fontSize: '0.8125rem', borderRadius: 4, background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', cursor: 'pointer' }}
        >
          Reset Demo Data
        </button>
        <button
          id="profile-signout-btn"
          onClick={() => { logout(); navigate('/login', { replace: true }) }}
          className="sp-btn-secondary"
          style={{ width: '100%', padding: '8px 0', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
          Sign Out / Switch Student
        </button>
      </Section>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '6px 10px', borderRadius: 4,
  backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
  color: 'var(--on-surface)', fontSize: '0.875rem', outline: 'none',
  boxSizing: 'border-box',
}

function Section({ title, code, children }) {
  return (
    <div style={{ backgroundColor: 'var(--surface-low)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{
        padding: '8px 14px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
        backgroundColor: 'var(--surface-mid)',
      }}>
        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.06em' }}>{code}</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface)' }}>{title}</span>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, editing, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <label style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)', fontWeight: 500 }}>{label}</label>
      <div style={{ fontSize: '0.875rem', color: 'var(--on-surface)' }}>{children}</div>
    </div>
  )
}
