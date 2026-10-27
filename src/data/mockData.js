// All static demo data lives here — UI components never hard-code content.

export const GOALS = [
  { id: 'backend-developer', title: 'Backend Developer', subtitle: 'Java + Spring Boot', icon: 'dns',
    description: 'Master Java, DSA, SQL, and Spring Boot to build robust server-side applications.',
    duration: '6-8 months', stages: 7, difficulty: 'Intermediate' },
  { id: 'full-stack', title: 'Full Stack Developer', subtitle: 'React + Node.js', icon: 'layers',
    description: 'Combine frontend and backend skills to build complete web applications.',
    duration: '8-10 months', stages: 6, difficulty: 'Advanced' },
  { id: 'ai-ml', title: 'AI/ML Engineer', subtitle: 'Python + TensorFlow', icon: 'psychology',
    description: 'Learn machine learning, deep learning, and AI model development.',
    duration: '8-12 months', stages: 5, difficulty: 'Advanced' },
  { id: 'data-engineer', title: 'Data Engineer', subtitle: 'Python + Spark', icon: 'bar_chart',
    description: 'Build data pipelines, work with big data tools and cloud platforms.',
    duration: '6-9 months', stages: 5, difficulty: 'Intermediate' },
  { id: 'android-developer', title: 'Android Developer', subtitle: 'Kotlin + Jetpack', icon: 'phone_android',
    description: 'Build native Android apps using Kotlin and Jetpack Compose.',
    duration: '5-7 months', stages: 5, difficulty: 'Intermediate' },
  { id: 'placement-prep', title: 'Placement Preparation', subtitle: 'DSA + CS Fundamentals', icon: 'work',
    description: 'Focused preparation for campus placements with DSA, aptitude, and interview skills.',
    duration: '3-5 months', stages: 5, difficulty: 'Beginner' },
]
// Every goal is selectable (Backend is the fully detailed one).
GOALS.forEach(g => { g.implemented = true })

export const BACKEND_ROADMAP = [
  { id: 'stage-01', stage: 1, code: 'MOD_01', title: 'Programming Fundamentals (Java)', subtitle: 'JAVA_CORE',
    topics: ['Java syntax', 'Variables and data types', 'Control flow', 'Loops', 'Methods', 'Basic OOP'],
    resources: [
      { type: 'video', title: 'Java for Beginners — Telusko' },
      { type: 'book', title: 'Head First Java' },
      { type: 'practice', title: 'HackerRank Java Track' }],
    outcome: 'Write basic Java programs and understand syntax and OOP primitives.',
    todayFocus: 'Loops & Methods', todayDescription: 'Write 5 small programs using for/while loops and reusable methods.',
    estimatedMinutes: 40, estimatedHours: 20, completedAt: 'Aug 2026', score: 88 },
  { id: 'stage-02', stage: 2, code: 'MOD_02', title: 'Object-Oriented Programming', subtitle: 'OOP_ARCH',
    topics: ['Classes and objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Interfaces', 'Abstraction'],
    resources: [
      { type: 'video', title: 'OOP in Java — CodeWithHarry' },
      { type: 'article', title: 'Java OOP Concepts — GeeksforGeeks' },
      { type: 'practice', title: 'OOP Practice Problems' }],
    outcome: 'Design class hierarchies using all four OOP pillars.',
    todayFocus: 'Interfaces vs Abstract Classes', todayDescription: 'Model a payment system using an interface and an abstract base class.',
    estimatedMinutes: 45, estimatedHours: 18, completedAt: 'Sep 2026', score: 92 },
  { id: 'stage-03', stage: 3, code: 'MOD_03', title: 'Data Structures & Algorithms', subtitle: 'DSA_ALGORITHMS',
    topics: ['Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Searching', 'Sorting', 'Recursion', 'Trees', 'Basic problem solving'],
    resources: [
      { type: 'video', title: 'Striver A2Z DSA Sheet' },
      { type: 'practice', title: 'LeetCode Easy / Medium' },
      { type: 'book', title: 'Introduction to Algorithms (CLRS)' }],
    outcome: 'Solve standard DSA problems and analyse time/space complexity.',
    todayFocus: 'Arrays & Searching', todayDescription: 'Revise array traversal, linear search and binary search. Solve 3 problems.',
    estimatedMinutes: 45, estimatedHours: 40 },
  { id: 'stage-04', stage: 4, code: 'MOD_04', title: 'SQL & Database Basics', subtitle: 'SQL_SCHEMAS',
    topics: ['SQL', 'CRUD', 'Joins', 'Normalization', 'PostgreSQL/MySQL'],
    resources: [
      { type: 'article', title: 'SQL Tutorial — W3Schools' },
      { type: 'practice', title: 'SQLZoo / LeetCode SQL 50' }],
    outcome: 'Write SQL queries with joins and design normalized schemas.',
    todayFocus: 'CRUD & Joins', todayDescription: 'Create a students/courses schema and practise INNER and LEFT joins.',
    estimatedMinutes: 45, estimatedHours: 15 },
  { id: 'stage-05', stage: 5, code: 'MOD_05', title: 'Git & GitHub', subtitle: 'VERSION_CTRL',
    topics: ['Git basics', 'Branching', 'Commits', 'Pull requests', 'Collaboration'],
    resources: [
      { type: 'video', title: 'Git & GitHub Crash Course' },
      { type: 'book', title: 'Pro Git (free online book)' }],
    outcome: 'Manage code with Git and collaborate through pull requests.',
    todayFocus: 'Branching & Pull Requests', todayDescription: 'Create a feature branch, commit, push and open a PR on your own repo.',
    estimatedMinutes: 30, estimatedHours: 8 },
  { id: 'stage-06', stage: 6, code: 'MOD_06', title: 'Spring Boot & REST APIs', subtitle: 'SPRING_REST',
    topics: ['Spring Boot', 'REST APIs', 'Controllers', 'Services', 'Repositories', 'Database integration'],
    resources: [
      { type: 'video', title: 'Spring Boot Tutorial — Amigoscode' },
      { type: 'article', title: 'spring.io Guides' }],
    outcome: 'Build a REST API with Spring Boot connected to a database.',
    todayFocus: 'Controllers & Services', todayDescription: 'Build a /students CRUD API with a controller, service and repository.',
    estimatedMinutes: 60, estimatedHours: 30 },
  { id: 'stage-07', stage: 7, code: 'MOD_07', title: 'Authentication & Deployment Basics', subtitle: 'AUTH_DEPLOY',
    topics: ['Authentication', 'JWT', 'API security', 'Docker basics', 'Cloud deployment basics'],
    resources: [
      { type: 'video', title: 'JWT Auth with Spring Security' },
      { type: 'article', title: 'Docker — Getting Started' }],
    outcome: 'Secure an API with JWT and deploy it using Docker.',
    todayFocus: 'JWT Authentication', todayDescription: 'Add login + JWT token validation to your Spring Boot API.',
    estimatedMinutes: 60, estimatedHours: 18 },
]

// Shorter mock roadmaps for the other goals.
const short = (prefix, items) => items.map(([title, topics], i) => ({
  id: `${prefix}-0${i + 1}`, stage: i + 1, code: `MOD_0${i + 1}`, title,
  subtitle: title.toUpperCase().replace(/[^A-Z]+/g, '_').replace(/^_|_$/g, '').slice(0, 16),
  topics, todayFocus: topics[0], estimatedMinutes: 45,
  outcome: `Comfortable with ${topics.slice(0, 2).join(' and ')}.`,
}))

export const OTHER_ROADMAPS = {
  'full-stack': short('fs', [
    ['HTML, CSS & JavaScript', ['HTML5', 'CSS3', 'ES6+', 'DOM']],
    ['React Fundamentals', ['Components', 'Hooks', 'State', 'Props']],
    ['Node.js & Express', ['Node.js', 'Express', 'REST APIs', 'Middleware']],
    ['Databases', ['MongoDB', 'SQL', 'Mongoose']],
    ['Auth & Security', ['JWT', 'OAuth', 'CORS']],
    ['Deployment', ['Docker', 'CI/CD', 'Vercel/Render']]]),
  'ai-ml': short('ai', [
    ['Python Fundamentals', ['Python', 'NumPy', 'Pandas', 'Matplotlib']],
    ['Math for ML', ['Linear Algebra', 'Statistics', 'Probability']],
    ['Machine Learning', ['Scikit-learn', 'Regression', 'Classification', 'Clustering']],
    ['Deep Learning', ['TensorFlow', 'PyTorch', 'CNNs', 'RNNs']],
    ['NLP & Computer Vision', ['Transformers', 'OpenCV', 'Projects']]]),
  'data-engineer': short('de', [
    ['Python & SQL', ['Python', 'SQL', 'Pandas']],
    ['Data Warehousing', ['Star Schema', 'BigQuery', 'Snowflake']],
    ['Apache Spark', ['PySpark', 'Batch Processing', 'Streaming']],
    ['Data Pipelines', ['Airflow', 'Kafka', 'ETL']],
    ['Cloud Platforms', ['AWS S3', 'GCP', 'Azure']]]),
  'android-developer': short('an', [
    ['Kotlin Basics', ['Kotlin', 'Data Classes', 'Coroutines']],
    ['Android Fundamentals', ['Activities', 'Layouts', 'Navigation']],
    ['Jetpack Compose', ['Composables', 'State', 'Theming']],
    ['Networking & Storage', ['Retrofit', 'Room', 'Hilt']],
    ['Publishing', ['Signing', 'Play Store', 'Analytics']]]),
  'placement-prep': short('pp', [
    ['DSA Core', ['Arrays', 'Strings', 'Trees', 'Graphs', 'DP']],
    ['CS Fundamentals', ['OS', 'DBMS', 'Computer Networks', 'OOP']],
    ['Aptitude', ['Quant', 'Logical Reasoning', 'Verbal']],
    ['Projects & Resume', ['Portfolio', 'GitHub', 'Resume']],
    ['Mock Interviews', ['Behavioral', 'Technical', 'HR']]]),
}

export function getRoadmapForGoal(goalId) {
  return goalId === 'backend-developer' ? BACKEND_ROADMAP : (OTHER_ROADMAPS[goalId] || [])
}

export const DEFAULT_PROFILE = {
  name: 'Ayush Kumar Singh', rollNo: '2501530100037', section: '2-A', degree: 'B.Tech', branch: 'CSE', year: '2nd Year', semester: '3rd Semester',
  dailyStudyHours: 2, currentGoal: 'backend-developer',
}

export const DEFAULT_PROGRESS = {
  goalId: 'backend-developer',
  completedStages: ['stage-01', 'stage-02'],
  currentStage: 'stage-03',
  overallPercent: 29,     // 2 of 7 stages = 28.6% -> 29%
  weeklyHours: 5.5,
  weeklyTarget: 8,
  streak: 6,
}

export const DEFAULT_ACTIVITY = [
  { id: 1, text: 'Solved: Binary Search on Sorted Array', time: '2h ago', color: 'tertiary' },
  { id: 2, text: 'Read: Arrays & Complexity (45m)', time: 'Yesterday', color: 'tertiary' },
  { id: 3, text: 'Completed OOP Mock Exam (Score: 92%)', time: '2d ago', color: 'primary' },
]

// Weak areas are tied to a stage, so they only show when relevant.
export const WEAK_AREAS = [
  { id: 1, stageId: 'stage-02', topic: 'Interface vs Abstract Class Polymorphism', severity: 'error', action: 'Review Recommended', time: '15 min patch' },
  { id: 2, stageId: 'stage-03', topic: 'Recursion & Call Stack Complexity', severity: 'warning', action: 'Flagged for Tree DFS', time: 'DSA Stage 03' },
  { id: 3, stageId: 'stage-03', topic: 'Binary Search Edge Cases', severity: 'warning', action: 'Off-by-one errors', time: '10 min patch' },
]
