import PracticeBoard from '../components/PracticeBoard'
import { useApp } from '../hooks/AppContext'

export default function Practice() {
  const { practice, attempts, gamification } = useApp()
  const solved = practice.filter(item => item.status === 'done').length
  const failed = attempts.filter(item => item.quality !== 'good').length
  const accuracy = attempts.length ? Math.round((attempts.filter(item => item.quality === 'good').length / attempts.length) * 100) : 0
  return <div className='sp-practice-page'><div className='sp-practice-overview'><div><span className='sp-eyebrow'>Your practice lab</span><h1>Build skill through repetition.</h1><p>Every attempt gives SmartPrep a better signal for what you should practise next.</p></div><div className='sp-practice-kpis'><div><strong>{gamification?.xp || 0}</strong><span>XP</span></div><div><strong>{solved}</strong><span>solved</span></div><div><strong>{accuracy}%</strong><span>quality</span></div><div><strong>{failed}</strong><span>needs review</span></div></div></div><PracticeBoard /></div>
}
