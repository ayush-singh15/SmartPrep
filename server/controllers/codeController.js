const LANGUAGE_PATTERNS = {
  JavaScript: /(function|const\s+\w+|let\s+\w+|return|=>)/,
  Python: /(def\s+\w+|return|for\s+\w+|while\s+)/,
  Java: /(class\s+\w+|public\s+|static\s+|return)/,
  'C++': /(include\s*<|int\s+main|std::|return)/,
}

const LANGUAGE_IDS = { JavaScript: 63, Python: 71, Java: 62, 'C++': 54 }
const PUBLIC_JUDGE0_URL = 'https://ce.judge0.com'
const MAX_CODE_LENGTH = 20000
const MAX_CASES = 10

function normalizeCases(testCases) {
  if (!Array.isArray(testCases)) return []
  return testCases.slice(0, MAX_CASES).map((test, index) => ({
    id: test.id || index + 1,
    input: String(test.input || '').slice(0, 2000),
    expected: String(test.expected || '').slice(0, 2000),
  }))
}

async function runJudge0({ language, code, testCases }) {
  const baseUrl = process.env.JUDGE0_URL || PUBLIC_JUDGE0_URL
  const apiKey = process.env.JUDGE0_API_KEY
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey) headers['X-RapidAPI-Key'] = apiKey
  const results = []
  for (const test of testCases) {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST', headers,
      body: JSON.stringify({ language_id: LANGUAGE_IDS[language], source_code: code, stdin: test.input, expected_output: test.expected }),
    })
    if (!response.ok) throw new Error(`Runner returned HTTP ${response.status}`)
    const result = await response.json()
    results.push({ id: test.id, status: result.status?.description || 'Unknown', passed: result.status?.id === 3, stdout: result.stdout || '', stderr: result.stderr || '', compileOutput: result.compile_output || '', time: result.time || null })
  }
  return results
}

export async function runCode(req, res) {
  const { language = 'JavaScript', code = '', testCases = [] } = req.body || {}
  const source = String(code).trim()
  if (!source) return res.status(400).json({ error: 'Code is required' })
  if (source.length > MAX_CODE_LENGTH) return res.status(413).json({ error: 'Code is too large' })
  if (!LANGUAGE_PATTERNS[language]) return res.status(400).json({ error: 'Unsupported language' })
  if (!LANGUAGE_PATTERNS[language].test(source)) return res.json({ data: { status: 'rejected', passed: false, message: `No recognizable ${language} solution structure found.`, results: [] } })

  const cases = normalizeCases(testCases)
  try {
    const results = await runJudge0({ language, code: source, testCases: cases })
    if (!results) return res.json({ data: { status: 'accepted-for-review', passed: false, message: 'Solution structure accepted. The free Judge0 runner is unavailable right now, so test cases remain pending.', results: cases.map(test => ({ ...test, status: 'pending', passed: false })) } })
    const passed = results.length > 0 && results.every(result => result.passed)
    return res.json({ data: { status: passed ? 'passed' : 'failed', passed, message: passed ? 'All test cases passed.' : 'One or more test cases failed.', results } })
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Code runner unavailable' })
  }
}
