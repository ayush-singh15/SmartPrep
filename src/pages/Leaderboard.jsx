import { useMemo } from 'react'
import { useApp } from '../hooks/AppContext'

const MOCK_STUDENTS = [
  { name: 'Riya Sharma', handle: '@riya.codes', xp: 1860, streak: 14, solved: 48 },
  { name: 'Arjun Mehta', handle: '@arjunbuilds', xp: 1620, streak: 9, solved: 41 },
  { name: 'Neha Verma', handle: '@neha.dev', xp: 1480, streak: 11, solved: 36 },
  { name: 'Kabir Singh', handle: '@kabirlearns', xp: 1260, streak: 7, solved: 30 },
]

export default function Leaderboard() {
  const { profile, practice, progress, gamification } = useApp()
  const solved = practice.filter(item => item.status === 'done').length
  const xp = (gamification?.xp || 0) + (progress.streak || 0) * 10 + Math.round((progress.weeklyHours || 0) * 20)
  const students = useMemo(() => [...MOCK_STUDENTS, { name: profile.name || 'You', handle: '@you', xp, streak: gamification?.streak || progress.streak || 0, solved }].sort((a, b) => b.xp - a.xp), [profile.name, progress.streak, progress.weeklyHours, solved, xp, gamification?.xp])
  const rank = students.findIndex(student => student.handle === '@you') + 1

  return <div className="sp-leaderboard"><div className="sp-leaderboard-head"><div><span className="sp-eyebrow">Weekly challenge</span><h1>Compete with your consistency.</h1><p>Earn points for focused practice, completed sessions, and showing up regularly. This prototype uses local progress; online rankings come later.</p></div><div className="sp-rank-card"><span>Your rank</span><strong>#{rank}</strong><small>{xp} XP this week</small></div></div><div className="sp-leaderboard-grid"><section className="sp-leaderboard-list"><div className="sp-list-title"><h2>Campus leaderboard</h2><span>Resets Monday</span></div>{students.map((student, index) => <div className={`sp-rank-row ${student.handle === '@you' ? 'is-you' : ''}`} key={student.handle}><b>#{index + 1}</b><div className="sp-rank-avatar">{student.name[0]}</div><div className="sp-rank-person"><strong>{student.name}</strong><span>{student.handle}</span></div><div className="sp-rank-stats"><strong>{student.xp} XP</strong><span>{student.solved} solved · {student.streak} day streak</span></div></div>)}</section><aside className="sp-earning-card"><span className="material-symbols-outlined">emoji_events</span><h2>How to move up</h2><div><b>+40 XP</b><span>solve a question</span></div><div><b>+20 XP</b><span>study for one hour</span></div><div><b>+10 XP</b><span>protect your streak</span></div><p>Small daily wins compound. Your rank is a reflection of consistency, not speed.</p></aside></div></div>
}
