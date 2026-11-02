import { useMemo, useState } from 'react'
import { useApp } from '../hooks/AppContext'
import { api } from '../services/api'

const TEST_CASES = {
  'Two Sum': [{ id: 1, input: '[2,7,11,15]\n9', expected: '[0,1]' }, { id: 2, input: '[3,2,4]\n6', expected: '[1,2]' }],
  'Best Time to Buy and Sell Stock': [{ id: 1, input: '[7,1,5,3,6,4]', expected: '5' }],
  'Contains Duplicate': [{ id: 1, input: '[1,2,3,1]', expected: 'true' }],
  'Valid Palindrome': [{ id: 1, input: 'A man, a plan, a canal: Panama', expected: 'true' }],
  'Two Sum II': [{ id: 1, input: '[2,7,11,15]\n9', expected: '[1,2]' }],
  '3Sum': [{ id: 1, input: '[-1,0,1,2,-1,-4]', expected: '[[-1,-1,2],[-1,0,1]]' }],
  'Longest Substring Without Repeating Characters': [{ id: 1, input: 'abcabcbb', expected: '3' }],
  'Minimum Window Substring': [{ id: 1, input: 'ADOBECODEBANC\nABC', expected: 'BANC' }],
  'Valid Parentheses': [{ id: 1, input: '()[]{}', expected: 'true' }, { id: 2, input: '(]', expected: 'false' }],
  'Binary Search': [{ id: 1, input: '[-1,0,3,5,9,12]\n9', expected: '4' }],
  'Reverse Linked List': [{ id: 1, input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' }],
  'Invert Binary Tree': [{ id: 1, input: '[4,2,7,1,3,6,9]', expected: '[4,7,2,9,6,3,1]' }],
}

const TEMPLATES = {
  JavaScript: {
    'Two Sum': 'function twoSum(nums, target) {\n  // return the indices of the two numbers\n  \n}',
    'Valid Parentheses': 'function isValid(s) {\n  // return true when brackets are balanced\n  \n}',
    'Binary Search': 'function search(nums, target) {\n  // return the target index, or -1\n  \n}',
    'Valid Palindrome': 'function isPalindrome(s) {\n  // normalize the string, then compare both ends\n  \n}',
  },
  Python: {
    'Two Sum': 'def two_sum(nums, target):\n    # return the indices of the two numbers\n    pass',
    'Valid Parentheses': 'def is_valid(s):\n    # return True when brackets are balanced\n    pass',
    'Binary Search': 'def search(nums, target):\n    # return the target index, or -1\n    pass',
    'Valid Palindrome': 'def is_palindrome(s):\n    # normalize the string, then compare both ends\n    pass',
  },
  Java: {
    'Two Sum': 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // return the indices of the two numbers\n    }\n}',
    'Valid Parentheses': 'class Solution {\n    public boolean isValid(String s) {\n        // return true when brackets are balanced\n    }\n}',
    'Binary Search': 'class Solution {\n    public int search(int[] nums, int target) {\n        // return the target index, or -1\n    }\n}',
  },
  'C++': {
    'Two Sum': 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // return the indices of the two numbers\n    }\n};',
    'Valid Parentheses': 'class Solution {\npublic:\n    bool isValid(string s) {\n        // return true when brackets are balanced\n    }\n};',
    'Binary Search': 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // return the target index, or -1\n    }\n};',
  },
}
const SHEET = [
  { topic: 'Arrays & Hashing', items: ['Two Sum', 'Best Time to Buy and Sell Stock', 'Contains Duplicate'] },
  { topic: 'Two Pointers', items: ['Valid Palindrome', 'Two Sum II', '3Sum'] },
  { topic: 'Sliding Window', items: ['Longest Substring Without Repeating Characters', 'Minimum Window Substring'] },
  { topic: 'Stack', items: ['Valid Parentheses', 'Min Stack', 'Daily Temperatures'] },
  { topic: 'Binary Search', items: ['Binary Search', 'Search a 2D Matrix', 'Koko Eating Bananas'] },
  { topic: 'Linked List', items: ['Reverse Linked List', 'Merge Two Sorted Lists', 'Linked List Cycle'] },
  { topic: 'Trees', items: ['Invert Binary Tree', 'Maximum Depth of Binary Tree', 'Subtree of Another Tree'] },
]

const EMPTY_FORM = { title: '', url: '', topic: '', source: 'LeetCode' }

export default function PracticeBoard() {
  const { practice, attempts, addPracticeQuestion, togglePracticeQuestion, markPracticeSolved, removePracticeQuestion, recordPracticeAttempt, awardPracticeXp } = useApp()
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [activeTopic, setActiveTopic] = useState('All topics')
  const [showSheet, setShowSheet] = useState(true)
  const [daily, setDaily] = useState(null)
  const [selected, setSelected] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [solution, setSolution] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [runResult, setRunResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [testCases, setTestCases] = useState([{ id: 1, input: '', expected: '' }])
  const [solutionFeedback, setSolutionFeedback] = useState(null)
  const [showCode, setShowCode] = useState(false)

  const done = practice.filter(item => item.status === 'done').length
  const topics = useMemo(() => Array.from(new Set(practice.map(item => item.topic).filter(Boolean))), [practice])
  const questions = activeTopic === 'All topics' ? practice : practice.filter(item => item.topic === activeTopic)
  const availableDaily = SHEET.flatMap(group => group.items.map(title => ({ title, topic: group.topic }))).filter(item => !practice.some(saved => saved.title === item.title))
  const weakTopics = useMemo(() => { const counts = attempts.filter(item => item.quality !== 'good').reduce((map, item) => { map[item.topic] = (map[item.topic] || 0) + 1; return map }, {}); return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([topic]) => topic) }, [attempts])
  const recommended = availableDaily.find(item => weakTopics.includes(item.topic)) || availableDaily.find(item => topics.includes(item.topic)) || availableDaily[0]
  function chooseDaily() { if (recommended) setDaily(recommended) }

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    addPracticeQuestion(form)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function addSheetQuestion(title, topic) {
    addPracticeQuestion({ title, topic, source: 'SmartPrep topic sheet', url: `https://leetcode.com/problemset/?search=${encodeURIComponent(title)}` })
  }

  function openReview(item) {
    setSelected(item)
    setAnswer('')
    setFeedback(null)
    setSolution('')
    setLanguage('JavaScript')
    setRunResult(null)
    setTestCases(TEST_CASES[item.title] || [{ id: 1, input: '', expected: '' }])
    setSolutionFeedback(null)
  }

  function updateTestCase(id, field, value) { setTestCases(cases => cases.map(test => test.id === id ? { ...test, [field]: value } : test)) }

  function loadTemplate() {
    const template = TEMPLATES[language]?.[selected?.title]
    if (template) setSolution(template)
  }

  async function runSolution(e) {
    e.preventDefault()
    const text = solution.trim()
    if (text.length < 10) {
      setRunResult({ type: 'error', text: 'Add a solution before running it.' })
      return
    }
    setRunning(true)
    try {
      const result = await api.runCode({ language, code: text, testCases })
      setRunResult({
        type: result.status === 'passed' || result.status === 'accepted-for-review' ? 'success' : 'error',
        text: result.message || 'Backend validation complete.',
        results: result.results || [],
      })
    } catch {
      setRunResult({ type: 'error', text: 'The backend runner is unavailable. Your solution was not executed.' })
    } finally {
      setRunning(false)
    }
  }
  function reviewSolution(e) {
    e.preventDefault()
    const text = solution.trim()
    if (text.length < 30) { setSolutionFeedback({ type: 'hint', text: 'Please add a more complete solution before checking it.' }); return }
    const hasCode = /(function|class|return|for|while|if|const|let|int|public|def)/i.test(text)
    const hasReasoning = /(complexity|because|approach|algorithm|time|space)/i.test(text)
    const quality = hasCode && hasReasoning ? 'good' : 'needs-detail'
    const message = quality === 'good' ? 'Your solution contains code and reasoning. Review the edge cases, then mark the question solved.' : 'Add both the implementation and a short explanation of the approach and complexity.'
    recordPracticeAttempt({ questionId: selected.id, title: selected.title, topic: selected.topic, answerLength: text.length, quality, feedback: message })
    if (quality === 'good') { markPracticeSolved(selected.id); awardPracticeXp(selected.id); setSolutionFeedback({ type: 'success', text: message + ' Question marked solved.' }); return }
    setSolutionFeedback({ type: 'hint', text: message })
  }

  function reviewAnswer(e) {
    e.preventDefault()
    const text = answer.trim()
    if (text.length < 25) {
      setFeedback({ type: 'hint', text: 'Add more detail: explain your approach, time complexity, and one edge case.' })
      return
    }
    const hasComplexity = /(complexity|o\s*\(|time|space)/i.test(text)
    const quality = hasComplexity ? 'good' : 'needs-detail'
    const feedbackText = hasComplexity ? 'Good explanation structure. Compare it with the official solution, then mark the question solved.' : 'Your idea is useful. Add the time and space complexity before marking it solved.'
    recordPracticeAttempt({ questionId: selected.id, title: selected.title, topic: selected.topic, answerLength: text.length, quality, feedback: feedbackText })
    setFeedback({ type: hasComplexity ? 'success' : 'hint', text: feedbackText })
  }

  return <div className="sp-practice-layout">
    <main className="sp-practice-board">
      <div className="sp-practice-head"><div><span className="sp-eyebrow">Daily problem solving</span><h1>Practice with purpose.</h1><p>Follow a topic-based sheet, explain your approach, and build evidence of progress one problem at a time.</p></div><button className="sp-btn-primary" onClick={() => setShowForm(value => !value)}><span className="material-symbols-outlined">add</span> Add question</button></div>
      <div className="sp-daily-card">
        <div>
          <span className="sp-eyebrow">Today’s recommendation</span>
          <h2>{daily ? daily.title : 'Get one focused problem for today'}</h2>
          <p>{daily ? `${daily.topic} · explain your approach after solving` : 'SmartPrep will choose from your next unfinished topic.'}</p>
        </div>
        <button className="sp-btn-primary" onClick={chooseDaily}>{daily ? 'Refresh question' : 'Choose today'}</button>
        {daily && <button className="sp-btn-secondary" onClick={() => { addSheetQuestion(daily.title, daily.topic); setDaily(null) }}>Add to queue</button>}
      </div>
      <div className="sp-weak-note">{weakTopics.length ? <><span className="material-symbols-outlined">priority_high</span> Focus suggestion: revisit {weakTopics.slice(0, 2).join(" and ")} today.</> : <><span className="material-symbols-outlined">trending_up</span> Keep explaining solutions to personalize your next questions.</>}</div>
      <div className="sp-practice-stats"><div><strong>{practice.length}</strong><span>in your queue</span></div><div><strong>{done}</strong><span>solved</span></div><div><strong>{practice.length ? Math.round(done / practice.length * 100) : 0}%</strong><span>completion</span></div></div>
      {showForm && <form className="sp-practice-form" onSubmit={submit}><input autoFocus placeholder="Question name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /><input placeholder="Link (optional)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} /><input placeholder="Topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} /><select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}><option>LeetCode</option><option>HackerRank</option><option>Class / notes</option><option>Personal</option></select><button className="sp-btn-primary" type="submit">Save</button></form>}
      <div className="sp-practice-toolbar"><div className="sp-practice-filters"><button className={activeTopic === 'All topics' ? 'active' : ''} onClick={() => setActiveTopic('All topics')}>All topics</button>{topics.map(topic => <button key={topic} className={activeTopic === topic ? 'active' : ''} onClick={() => setActiveTopic(topic)}>{topic}</button>)}</div><button className="sp-sheet-toggle" onClick={() => setShowSheet(value => !value)}><span className="material-symbols-outlined">{showSheet ? 'expand_less' : 'expand_more'}</span> Topic sheet</button></div>
      <div className="sp-practice-list">{questions.length === 0 ? <div className="sp-practice-empty"><span className="material-symbols-outlined">playlist_add</span><p>Your queue is empty. Add a question or pick one from the topic sheet.</p></div> : questions.map(item => <div className={`sp-practice-item ${item.status === 'done' ? 'is-done' : ''}`} key={item.id}><button className="sp-practice-check" onClick={() => togglePracticeQuestion(item.id)} aria-label="Toggle solved"><span className="material-symbols-outlined">{item.status === 'done' ? 'check_circle' : 'radio_button_unchecked'}</span></button><button className="sp-practice-copy sp-practice-open-answer" onClick={() => openReview(item)}><strong>{item.title}</strong><span>{item.topic || 'General practice'} · {item.source} · explain your approach</span></button>{item.url && <a href={item.url} target="_blank" rel="noreferrer" className="sp-practice-open"><span className="material-symbols-outlined">open_in_new</span></a>}<button className="sp-practice-delete" onClick={() => removePracticeQuestion(item.id)} aria-label="Delete question"><span className="material-symbols-outlined">delete</span></button></div>)}</div>
    </main>
    {showSheet && <aside className="sp-sheet"><div className="sp-sheet-header"><div><span className="sp-eyebrow">SmartPrep topic sheet</span><h2>Pick today’s topic</h2></div><span className="sp-sheet-count">{SHEET.length} topics</span></div>{SHEET.map(group => <section key={group.topic} className="sp-sheet-group"><h3>{group.topic}</h3>{group.items.map(title => { const already = practice.some(item => item.title === title); return <button key={title} disabled={already} onClick={() => addSheetQuestion(title, group.topic)}><span className="material-symbols-outlined">{already ? 'check_circle' : 'add_circle'}</span><span>{title}</span></button> })}</section>)}<p className="sp-sheet-note">A curated SmartPrep starter sheet. We can expand it with difficulty, daily plans, explanations, and leaderboards next.</p></aside>}
    {selected && <div className="sp-answer-modal"><div className="sp-answer-card"><button className="sp-answer-close" onClick={() => setSelected(null)} aria-label="Close review"><span className="material-symbols-outlined">close</span></button><span className="sp-eyebrow">Explain your solution</span><h2>{selected.title}</h2><p>Write your approach in your own words. SmartPrep checks whether you included an idea, complexity, and edge case.</p><form onSubmit={reviewAnswer}><textarea autoFocus value={answer} onChange={e => setAnswer(e.target.value)} placeholder="I would solve this by..." rows={7} /><button className="sp-btn-primary" type="submit">Check my explanation</button></form>{feedback && <div className={`sp-answer-feedback ${feedback.type}`}><span className="material-symbols-outlined">{feedback.type === 'success' ? 'check_circle' : 'lightbulb'}</span>{feedback.text}</div>}<button type="button" className="sp-code-toggle" onClick={() => setShowCode(value => !value)}><span className="material-symbols-outlined">{showCode ? "expand_less" : "code"}</span>{showCode ? "Hide code workspace" : "Paste or write your solution"}</button>{showCode && <form className="sp-solution-form" onSubmit={reviewSolution}><label>Your solution <span>Paste code or write pseudocode</span></label><select className="sp-language-select" value={language} onChange={e => { setLanguage(e.target.value); setSolution(TEMPLATES[e.target.value]?.[selected?.title] || "") }}><option>JavaScript</option><option>Python</option><option>Java</option><option>C++</option></select><button type="button" className="sp-template-button" onClick={loadTemplate}>Load starter template</button><textarea value={solution} onChange={e => setSolution(e.target.value)} placeholder="Paste your solution here..." rows={9} /><div className="sp-test-cases"><label>Sample test cases <span>These inputs are sent to the code runner</span></label>{testCases.map(test => <div className="sp-test-row" key={test.id}><input placeholder="Input" value={test.input} onChange={e => updateTestCase(test.id, "input", e.target.value)} /><input placeholder="Expected output" value={test.expected} onChange={e => updateTestCase(test.id, "expected", e.target.value)} /></div>)}<button type="button" className="sp-test-add" onClick={() => setTestCases(cases => [...cases, { id: Date.now(), input: "", expected: "" }])}>+ Add test case</button></div><div className="sp-solution-actions"><button className="sp-btn-secondary" type="button" onClick={runSolution}>{running ? "Checking..." : "Run backend check"}</button><button className="sp-btn-secondary" type="submit">Review solution</button></div>{runResult && <div className={`sp-answer-feedback ${runResult.type}`}><span className="material-symbols-outlined">{runResult.type === 'success' ? 'check_circle' : 'error'}</span><div><strong>{runResult.text}</strong>{runResult.results?.map(test => <div key={test.id} className="sp-run-result"><span>{test.passed ? '✓' : '✕'} Test {test.id}: {test.status}</span>{test.stderr && <small>{test.stderr}</small>}{test.compileOutput && <small>{test.compileOutput}</small>}{test.stdout && <small>Output: {test.stdout}</small>}</div>)}</div></div>}</form>}{showCode && solutionFeedback && <div className={`sp-answer-feedback ${solutionFeedback.type}`}><span className="material-symbols-outlined">{solutionFeedback.type === 'success' ? 'check_circle' : 'lightbulb'}</span>{solutionFeedback.text}</div>}</div></div>}
  </div>
}




















