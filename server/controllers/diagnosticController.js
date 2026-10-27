import { db } from '../models/db.js'

const QUESTIONS = [
  {
    id: 1,
    topic: 'Interface vs Abstract Class',
    question: 'When should you choose an Interface over an Abstract Class in modern Java architecture?',
    options: [
      { text: 'When you need to support multiple inheritance of type & contracts across unrelated classes', correct: true },
      { text: 'When you need to store non-static mutable state variables across subclasses', correct: false },
      { text: 'Only when every single method must have a private implementation', correct: false },
      { text: 'When you want to prevent any class from implementing polymorphism', correct: false },
    ],
    explanation: 'Interfaces define contracts that any class can implement regardless of hierarchy. Abstract classes are suited for shared code and state across closely related classes.',
  },
  {
    id: 2,
    topic: 'Recursion & Call Stack',
    question: 'What is the primary risk of an unoptimized recursive Tree DFS on deeply unbalanced trees?',
    options: [
      { text: 'StackOverflowError due to O(N) active call stack frames exceeding JVM stack memory', correct: true },
      { text: 'Heap OutOfMemoryError because local primitive variables are allocated on the garbage collector heap', correct: false },
      { text: 'Deadlock between concurrent reader threads on the root node', correct: false },
      { text: 'Compile-time type erasure failure in generic nodes', correct: false },
    ],
    explanation: 'Each recursive call adds a frame to the thread stack. If a tree degenerates into a linked list with N nodes, recursion depth is O(N), which risks exhausting the thread stack limit.',
  },
  {
    id: 3,
    topic: 'Binary Search Mechanics',
    question: 'To avoid potential 32-bit integer overflow when calculating mid, which calculation is recommended?',
    options: [
      { text: 'int mid = low + (high - low) / 2;', correct: true },
      { text: 'int mid = (low + high) / 2;', correct: false },
      { text: 'int mid = (low * high) / 2;', correct: false },
      { text: 'int mid = Math.sqrt(low + high);', correct: false },
    ],
    explanation: '(low + high) can exceed Integer.MAX_VALUE (2,147,483,647) and wrap into negative numbers. Using low + (high - low) / 2 prevents numerical overflow.',
  },
]

export function getQuiz(req, res) {
  try {
    // Return questions without the correct answer flag to prevent client-side inspection tampering
    const sanitized = QUESTIONS.map(q => ({
      id: q.id,
      topic: q.topic,
      question: q.question,
      options: q.options.map(o => ({ text: o.text })),
      explanation: q.explanation
    }))
    res.json({ success: true, data: sanitized })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export function submitQuiz(req, res) {
  try {
    const { answers } = req.body // array of { questionId, selectedIndex }
    let score = 0
    const results = []

    QUESTIONS.forEach(q => {
      const submitted = (answers || []).find(a => a.questionId === q.id)
      const selectedIdx = submitted ? submitted.selectedIndex : -1
      const isCorrect = selectedIdx >= 0 && q.options[selectedIdx]?.correct === true
      if (isCorrect) score++
      results.push({
        questionId: q.id,
        isCorrect,
        correctIndex: q.options.findIndex(o => o.correct),
        explanation: q.explanation
      })
    })

    const passed = score >= 2

    // If passed, resolve first flagged weak area
    if (passed) {
      const weak = db.get('weakAreas') || []
      if (weak.length > 0) {
        weak.shift() // remove top resolved gap
        db.set('weakAreas', weak)
      }

      const activity = db.get('activity') || []
      activity.unshift({
        id: Date.now(),
        text: `Diagnostic Patch Verified (${score}/${QUESTIONS.length} scored)`,
        time: 'Just now',
        color: 'tertiary'
      })
      db.set('activity', activity.slice(0, 10))
    }

    res.json({
      success: true,
      data: {
        score,
        total: QUESTIONS.length,
        passed,
        results,
        remainingWeakAreas: db.get('weakAreas')
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
