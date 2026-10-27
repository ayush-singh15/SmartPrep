import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.join(__dirname, '../data/store.json')

export const INITIAL_DATA = {
  profile: {
    name: 'Ayush',
    degree: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: '3rd Semester',
    dailyStudyHours: 2,
    currentGoal: 'backend-developer'
  },
  progress: {
    goalId: 'backend-developer',
    completedStages: ['stage-01', 'stage-02'],
    currentStage: 'stage-03',
    overallPercent: 29,
    weeklyHours: 5.5,
    weeklyTarget: 8,
    streak: 6,
    masteredTopics: [
      'Java syntax', 'Variables and data types', 'Control flow', 'Loops', 'Methods', 'Basic OOP',
      'Classes and objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Interfaces', 'Abstraction'
    ]
  },
  sessions: [
    { id: 1, durationMinutes: 25, stage: 'stage-02', completedAt: '2026-10-25T14:30:00.000Z' },
    { id: 2, durationMinutes: 45, stage: 'stage-03', completedAt: '2026-10-26T16:00:00.000Z' }
  ],
  activity: [
    { id: 1, text: 'Solved: Binary Search on Sorted Array', time: '2h ago', color: 'tertiary' },
    { id: 2, text: 'Read: Arrays & Complexity (45m)', time: 'Yesterday', color: 'tertiary' },
    { id: 3, text: 'Completed OOP Mock Exam (Score: 92%)', time: '2d ago', color: 'primary' },
    { id: 4, text: 'Verified Stage 02: Object-Oriented Programming', time: '3d ago', color: 'tertiary' },
    { id: 5, text: 'Verified Stage 01: Programming Fundamentals', time: '1w ago', color: 'tertiary' }
  ],
  weakAreas: [
    { id: 1, stageId: 'stage-02', topic: 'Interface vs Abstract Class Polymorphism', severity: 'error', action: 'Review Recommended', time: '15 min patch' },
    { id: 2, stageId: 'stage-03', topic: 'Recursion & Call Stack Complexity', severity: 'warning', action: 'Flagged for Tree DFS', time: 'DSA Stage 03' },
    { id: 3, stageId: 'stage-03', topic: 'Binary Search Edge Cases', severity: 'warning', action: 'Off-by-one errors', time: '10 min patch' }
  ],
  goals: [
    { id: 'backend-developer', title: 'Backend Developer', subtitle: 'Java + Spring Boot', icon: 'dns', description: 'Master Java, DSA, SQL, and Spring Boot to build robust server-side applications.', duration: '6-8 months', stages: 7, difficulty: 'Intermediate', implemented: true },
    { id: 'full-stack', title: 'Full Stack Developer', subtitle: 'React + Node.js', icon: 'layers', description: 'Combine frontend and backend skills to build complete web applications.', duration: '8-10 months', stages: 6, difficulty: 'Advanced', implemented: true },
    { id: 'ai-ml', title: 'AI/ML Engineer', subtitle: 'Python + TensorFlow', icon: 'psychology', description: 'Learn machine learning, deep learning, and AI model development.', duration: '8-12 months', stages: 5, difficulty: 'Advanced', implemented: true },
    { id: 'data-engineer', title: 'Data Engineer', subtitle: 'Python + Spark', icon: 'bar_chart', description: 'Build data pipelines, work with big data tools and cloud platforms.', duration: '6-9 months', stages: 5, difficulty: 'Intermediate', implemented: true },
    { id: 'android-developer', title: 'Android Developer', subtitle: 'Kotlin + Jetpack', icon: 'phone_android', description: 'Build native Android apps using Kotlin and Jetpack Compose.', duration: '5-7 months', stages: 5, difficulty: 'Intermediate', implemented: true },
    { id: 'placement-prep', title: 'Placement Preparation', subtitle: 'DSA + CS Fundamentals', icon: 'work', description: 'Focused preparation for campus placements with DSA, aptitude, and interview skills.', duration: '3-5 months', stages: 5, difficulty: 'Beginner', implemented: true }
  ],
  roadmaps: {
    'backend-developer': [
      { id: 'stage-01', stage: 1, code: 'MOD_01', title: 'Programming Fundamentals (Java)', subtitle: 'JAVA_CORE', topics: ['Java syntax', 'Variables and data types', 'Control flow', 'Loops', 'Methods', 'Basic OOP'], resources: [{ type: 'video', title: 'Java for Beginners — Telusko' }, { type: 'book', title: 'Head First Java' }, { type: 'practice', title: 'HackerRank Java Track' }], outcome: 'Write basic Java programs and understand syntax and OOP primitives.', todayFocus: 'Loops & Methods', todayDescription: 'Write 5 small programs using for/while loops and reusable methods.', estimatedMinutes: 40, estimatedHours: 20, completedAt: 'Aug 2026', score: 88 },
      { id: 'stage-02', stage: 2, code: 'MOD_02', title: 'Object-Oriented Programming', subtitle: 'OOP_ARCH', topics: ['Classes and objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Interfaces', 'Abstraction'], resources: [{ type: 'video', title: 'OOP in Java — CodeWithHarry' }, { type: 'article', title: 'Java OOP Concepts — GeeksforGeeks' }, { type: 'practice', title: 'OOP Practice Problems' }], outcome: 'Design class hierarchies using all four OOP pillars.', todayFocus: 'Interfaces vs Abstract Classes', todayDescription: 'Model a payment system using an interface and an abstract base class.', estimatedMinutes: 45, estimatedHours: 18, completedAt: 'Sep 2026', score: 92 },
      { id: 'stage-03', stage: 3, code: 'MOD_03', title: 'Data Structures & Algorithms', subtitle: 'DSA_ALGORITHMS', topics: ['Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Searching', 'Sorting', 'Recursion', 'Trees', 'Basic problem solving'], resources: [{ type: 'video', title: 'Striver A2Z DSA Sheet' }, { type: 'practice', title: 'LeetCode Easy / Medium' }, { type: 'book', title: 'Introduction to Algorithms (CLRS)' }], outcome: 'Solve standard DSA problems and analyse time/space complexity.', todayFocus: 'Arrays & Searching', todayDescription: 'Revise array traversal, linear search and binary search. Solve 3 problems.', estimatedMinutes: 45, estimatedHours: 40 },
      { id: 'stage-04', stage: 4, code: 'MOD_04', title: 'SQL & Database Basics', subtitle: 'SQL_SCHEMAS', topics: ['SQL', 'CRUD', 'Joins', 'Normalization', 'PostgreSQL/MySQL'], resources: [{ type: 'article', title: 'SQL Tutorial — W3Schools' }, { type: 'practice', title: 'SQLZoo / LeetCode SQL 50' }], outcome: 'Write SQL queries with joins and design normalized schemas.', todayFocus: 'CRUD & Joins', todayDescription: 'Create a students/courses schema and practise INNER and LEFT joins.', estimatedMinutes: 45, estimatedHours: 15 },
      { id: 'stage-05', stage: 5, code: 'MOD_05', title: 'Git & GitHub', subtitle: 'VERSION_CTRL', topics: ['Git basics', 'Branching', 'Commits', 'Pull requests', 'Collaboration'], resources: [{ type: 'video', title: 'Git & GitHub Crash Course' }, { type: 'book', title: 'Pro Git (free online book)' }], outcome: 'Manage code with Git and collaborate through pull requests.', todayFocus: 'Branching & Pull Requests', todayDescription: 'Create a feature branch, commit, push and open a PR on your own repo.', estimatedMinutes: 30, estimatedHours: 8 },
      { id: 'stage-06', stage: 6, code: 'MOD_06', title: 'Spring Boot & REST APIs', subtitle: 'SPRING_REST', topics: ['Spring Boot', 'REST APIs', 'Controllers', 'Services', 'Repositories', 'Database integration'], resources: [{ type: 'video', title: 'Spring Boot Tutorial — Amigoscode' }, { type: 'article', title: 'spring.io Guides' }], outcome: 'Build a REST API with Spring Boot connected to a database.', todayFocus: 'Controllers & Services', todayDescription: 'Build a /students CRUD API with a controller, service and repository.', estimatedMinutes: 60, estimatedHours: 30 },
      { id: 'stage-07', stage: 7, code: 'MOD_07', title: 'Authentication & Deployment Basics', subtitle: 'AUTH_DEPLOY', topics: ['Authentication', 'JWT', 'API security', 'Docker basics', 'Cloud deployment basics'], resources: [{ type: 'video', title: 'JWT Auth with Spring Security' }, { type: 'article', title: 'Docker — Getting Started' }], outcome: 'Secure an API with JWT and deploy it using Docker.', todayFocus: 'JWT Authentication', todayDescription: 'Add login + JWT token validation to your Spring Boot API.', estimatedMinutes: 60, estimatedHours: 18 }
    ],
    'full-stack': [
      { id: 'fs-01', stage: 1, code: 'MOD_01', title: 'HTML, CSS & Modern JavaScript', subtitle: 'WEB_CORE', topics: ['Semantic HTML5', 'CSS Grid & Flexbox', 'ES6+ Syntax', 'Async/Await & Promises', 'DOM Manipulation'], resources: [{ type: 'video', title: 'JavaScript Mastery Full Course' }, { type: 'practice', title: 'Frontend Mentor' }], outcome: 'Build responsive, dynamic user interfaces with clean modern JavaScript.', todayFocus: 'Async JavaScript & Fetch API', todayDescription: 'Fetch data from public APIs and display with responsive grid.', estimatedMinutes: 45, estimatedHours: 25 },
      { id: 'fs-02', stage: 2, code: 'MOD_02', title: 'React Fundamentals & State Management', subtitle: 'REACT_APP', topics: ['JSX & Components', 'Props & State', 'useEffect & Hooks', 'React Router v6', 'Context API / Zustand'], resources: [{ type: 'video', title: 'React Documentation (react.dev)' }, { type: 'practice', title: 'Scrimba React Bootcamp' }], outcome: 'Architect scalable Single Page Applications with clean component trees.', todayFocus: 'Custom Hooks & State Management', todayDescription: 'Build an interactive CRUD dashboard using React hooks.', estimatedMinutes: 50, estimatedHours: 30 },
      { id: 'fs-03', stage: 3, code: 'MOD_03', title: 'Node.js & Express API Development', subtitle: 'NODE_BACKEND', topics: ['Node.js Runtime', 'Express Routing', 'Middleware Architecture', 'REST API Design', 'Error Handling'], resources: [{ type: 'video', title: 'Node.js & Express Crash Course' }, { type: 'practice', title: 'Postman API Lab' }], outcome: 'Develop modular, high-throughput REST APIs.', todayFocus: 'Custom Middleware & Validation', todayDescription: 'Write auth & schema validation middleware for API routes.', estimatedMinutes: 45, estimatedHours: 25 },
      { id: 'fs-04', stage: 4, code: 'MOD_04', title: 'Database Integration (SQL & MongoDB)', subtitle: 'DB_INTEGRATION', topics: ['MongoDB & Mongoose', 'PostgreSQL & Prisma ORM', 'Schema Design', 'Aggregation Pipelines', 'Indexing'], resources: [{ type: 'article', title: 'Prisma Getting Started Guide' }, { type: 'practice', title: 'MongoDB University' }], outcome: 'Design relational & document schemas with indexing and queries.', todayFocus: 'Prisma ORM with PostgreSQL', todayDescription: 'Perform complex relational joins and migrations.', estimatedMinutes: 50, estimatedHours: 20 },
      { id: 'fs-05', stage: 5, code: 'MOD_05', title: 'Authentication, Security & CORS', subtitle: 'SECURITY_AUTH', topics: ['JWT Tokens', 'HttpOnly Cookies', 'Bcrypt Hashing', 'CORS Policies', 'Rate Limiting'], resources: [{ type: 'article', title: 'OWASP Web Security Guidelines' }, { type: 'video', title: 'Complete Auth Tutorial' }], outcome: 'Protect applications against CSRF, XSS, and unauthorized API calls.', todayFocus: 'JWT Refresh Token Rotation', todayDescription: 'Implement secure login with access & refresh tokens.', estimatedMinutes: 45, estimatedHours: 15 },
      { id: 'fs-06', stage: 6, code: 'MOD_06', title: 'Fullstack Deployment & CI/CD', subtitle: 'DEPLOY_DEVOPS', topics: ['Docker Containers', 'GitHub Actions CI/CD', 'Vercel / Render Deployment', 'Environment Variables', 'Monitoring'], resources: [{ type: 'video', title: 'Docker for Developers' }, { type: 'article', title: 'Vercel Deployment Docs' }], outcome: 'Containerize and continuously deploy fullstack web applications.', todayFocus: 'CI/CD Pipeline Setup', todayDescription: 'Configure GitHub Actions for automated linting, test, and deploy.', estimatedMinutes: 60, estimatedHours: 15 }
    ],
    'ai-ml': [
      { id: 'ai-01', stage: 1, code: 'MOD_01', title: 'Python & Scientific Computing', subtitle: 'PYTHON_DATA', topics: ['Python OOP', 'NumPy Arrays & Vectorization', 'Pandas DataFrames', 'Matplotlib & Seaborn', 'Data Cleaning'], resources: [{ type: 'book', title: 'Python for Data Analysis' }, { type: 'practice', title: 'Kaggle Python Track' }], outcome: 'Manipulate, clean, and visualize large structured datasets.', todayFocus: 'NumPy Vectorization', todayDescription: 'Replace slow Python loops with vectorized NumPy matrix math.', estimatedMinutes: 45, estimatedHours: 20 },
      { id: 'ai-02', stage: 2, code: 'MOD_02', title: 'Mathematics for Machine Learning', subtitle: 'MATH_FOUNDATION', topics: ['Linear Algebra (Eigenvalues, SVD)', 'Multivariate Calculus (Gradients)', 'Probability & Bayes Theorem', 'Descriptive & Inferential Statistics'], resources: [{ type: 'video', title: '3Blue1Brown Linear Algebra' }, { type: 'book', title: 'Mathematics for Machine Learning' }], outcome: 'Understand optimization functions and mathematical proofs in ML.', todayFocus: 'Gradient Descent Optimization', todayDescription: 'Implement stochastic gradient descent from scratch in Python.', estimatedMinutes: 45, estimatedHours: 25 },
      { id: 'ai-03', stage: 3, code: 'MOD_03', title: 'Classical Machine Learning', subtitle: 'ML_ALGORITHMS', topics: ['Linear & Logistic Regression', 'Decision Trees & Random Forests', 'Support Vector Machines', 'k-Means Clustering', 'Evaluation Metrics (ROC-AUC, F1)'], resources: [{ type: 'video', title: 'Andrew Ng Machine Learning Specialization' }, { type: 'practice', title: 'Scikit-Learn Exercises' }], outcome: 'Train, tune, and evaluate classical ML models.', todayFocus: 'Random Forests & Cross Validation', todayDescription: 'Tune hyper-parameters with GridSearchCV on Kaggle dataset.', estimatedMinutes: 50, estimatedHours: 30 },
      { id: 'ai-04', stage: 4, code: 'MOD_04', title: 'Deep Learning & Neural Networks', subtitle: 'DEEP_LEARNING', topics: ['Perceptrons & Backpropagation', 'PyTorch / TensorFlow Frameworks', 'Convolutional Networks (CNN)', 'Recurrent Networks (LSTM, GRU)', 'Transfer Learning'], resources: [{ type: 'video', title: 'Deep Learning Specialization — DeepLearning.AI' }, { type: 'practice', title: 'PyTorch Tutorials' }], outcome: 'Build and train deep neural networks on GPU compute.', todayFocus: 'PyTorch Tensor Autograd', todayDescription: 'Implement a multi-layer neural network using PyTorch nn.Module.', estimatedMinutes: 60, estimatedHours: 35 },
      { id: 'ai-05', stage: 5, code: 'MOD_05', title: 'Transformers & LLM Engineering', subtitle: 'LLM_TRANSFORMERS', topics: ['Self-Attention Mechanism', 'Transformer Architecture', 'Hugging Face Transformers', 'Fine-tuning with LoRA', 'Retrieval Augmented Generation (RAG)'], resources: [{ type: 'article', title: 'The Illustrated Transformer' }, { type: 'video', title: 'Hugging Face NLP Course' }], outcome: 'Fine-tune pre-trained models and deploy production RAG pipelines.', todayFocus: 'RAG Pipeline with Vector Database', todayDescription: 'Build document retrieval QA bot using LangChain & ChromaDB.', estimatedMinutes: 60, estimatedHours: 30 }
    ],
    'data-engineer': [
      { id: 'de-01', stage: 1, code: 'MOD_01', title: 'Advanced SQL & Data Modeling', subtitle: 'DATA_MODELING', topics: ['Complex Joins & Window Functions', 'CTEs & Subqueries', 'Star & Snowflake Schemas', 'Database Normalization', 'Indexing Strategies'], resources: [{ type: 'practice', title: 'LeetCode Database Hard' }, { type: 'book', title: 'Designing Data-Intensive Applications' }], outcome: 'Architect analytical schemas and write high-performance SQL.', todayFocus: 'Window Functions (RANK, DENSE_RANK)', todayDescription: 'Analyze time-series running metrics with partition windows.', estimatedMinutes: 45, estimatedHours: 20 },
      { id: 'de-02', stage: 2, code: 'MOD_02', title: 'Big Data Processing with PySpark', subtitle: 'SPARK_COMPUTE', topics: ['RDDs vs DataFrames', 'PySpark Transformations', 'Spark SQL', 'Partitioning & Shuffling', 'Broadcast Joins'], resources: [{ type: 'video', title: 'Apache Spark with Python' }, { type: 'practice', title: 'Databricks Community' }], outcome: 'Process multi-gigabyte datasets with distributed Spark engines.', todayFocus: 'Spark Optimization & Catalyst Optimizer', todayDescription: 'Eliminate shuffle spill on wide transformations.', estimatedMinutes: 50, estimatedHours: 30 },
      { id: 'de-03', stage: 3, code: 'MOD_03', title: 'ETL Pipelines & Orchestration (Airflow)', subtitle: 'AIRFLOW_ETL', topics: ['DAG Construction', 'Airflow Operators & Sensors', 'Task Dependencies', 'Idempotency', 'Backfilling & Retries'], resources: [{ type: 'article', title: 'Apache Airflow Docs' }, { type: 'video', title: 'Data Pipelines with Airflow' }], outcome: 'Design resilient, self-healing data pipelines.', todayFocus: 'Custom Airflow Operators', todayDescription: 'Build an automated pipeline extracting data from REST API to warehouse.', estimatedMinutes: 50, estimatedHours: 25 },
      { id: 'de-04', stage: 4, code: 'MOD_04', title: 'Streaming Data with Apache Kafka', subtitle: 'STREAMING_KAFKA', topics: ['Producers & Consumers', 'Topics & Partitions', 'Consumer Groups', 'Kafka Connect', 'Stream Processing with Faust'], resources: [{ type: 'book', title: 'Kafka: The Definitive Guide' }, { type: 'video', title: 'Confluent Kafka Essentials' }], outcome: 'Ingest and process real-time event streams.', todayFocus: 'Event Stream Ingestion', todayDescription: 'Publish JSON telemetry events to partitioned Kafka topics.', estimatedMinutes: 50, estimatedHours: 25 },
      { id: 'de-05', stage: 5, code: 'MOD_05', title: 'Cloud Data Warehouses (Snowflake / BigQuery)', subtitle: 'CLOUD_WAREHOUSE', topics: ['Snowflake Architecture', 'Google BigQuery Partitioning', 'dbt (data build tool)', 'Data Quality Testing', 'IAM & Security'], resources: [{ type: 'article', title: 'dbt Fundamentals Course' }, { type: 'video', title: 'BigQuery Cost & Query Tuning' }], outcome: 'Build governed, production-grade cloud data warehouses with dbt.', todayFocus: 'dbt Models & Schema Tests', todayDescription: 'Write automated regression tests on analytical dimension tables.', estimatedMinutes: 55, estimatedHours: 20 }
    ],
    'android-developer': [
      { id: 'an-01', stage: 1, code: 'MOD_01', title: 'Kotlin Programming Fundamentals', subtitle: 'KOTLIN_CORE', topics: ['Kotlin Syntax & Null Safety', 'Data Classes & Sealed Classes', 'Lambdas & Higher Order Functions', 'Extension Functions', 'Kotlin Coroutines Basics'], resources: [{ type: 'video', title: 'Kotlin for Beginners — Philipp Lackner' }, { type: 'practice', title: 'Kotlin Koans' }], outcome: 'Write clean, null-safe Kotlin code using modern language paradigms.', todayFocus: 'Kotlin Coroutines & Dispatchers', todayDescription: 'Run background network calls off the main Android UI thread.', estimatedMinutes: 45, estimatedHours: 20 },
      { id: 'an-02', stage: 2, code: 'MOD_02', title: 'Modern UI with Jetpack Compose', subtitle: 'COMPOSE_UI', topics: ['Composables & Modifiers', 'State & Recomposition (remember/mutableStateOf)', 'LazyColumns & Lists', 'Material 3 Theming', 'Compose Navigation'], resources: [{ type: 'video', title: 'Jetpack Compose Android Basics' }, { type: 'article', title: 'developer.android.com/compose' }], outcome: 'Design declarative native Android UIs using Jetpack Compose.', todayFocus: 'State Hoisting in Compose', todayDescription: 'Build an interactive list with add/delete animation in Compose.', estimatedMinutes: 45, estimatedHours: 25 },
      { id: 'an-03', stage: 3, code: 'MOD_03', title: 'Architecture Components & MVVM', subtitle: 'MVVM_ARCH', topics: ['ViewModel & SavedStateHandle', 'StateFlow & SharedFlow', 'Repository Pattern', 'Dependency Injection (Hilt)', 'Lifecycle Awareness'], resources: [{ type: 'article', title: 'Guide to Android App Architecture' }, { type: 'video', title: 'MVVM with Hilt in Compose' }], outcome: 'Implement clean separation of concerns using Google recommended architecture.', todayFocus: 'Hilt Dependency Injection', todayDescription: 'Inject API services and repositories into ViewModels with @HiltViewModel.', estimatedMinutes: 50, estimatedHours: 25 },
      { id: 'an-04', stage: 4, code: 'MOD_04', title: 'Networking & Local Database (Room & Retrofit)', subtitle: 'ROOM_RETROFIT', topics: ['Retrofit & OkHttp', 'JSON Parsing with Moshi/Kotlinx.serialization', 'Room Database & SQLite', 'Offline Caching Strategy', 'WorkManager for Background Tasks'], resources: [{ type: 'video', title: 'Retrofit & Room Masterclass' }, { type: 'article', title: 'Offline-First Android Apps' }], outcome: 'Build offline-first Android applications syncing with remote REST APIs.', todayFocus: 'Room Database DAOs & Flow', todayDescription: 'Expose live database queries as Flow to update UI automatically.', estimatedMinutes: 50, estimatedHours: 25 },
      { id: 'an-05', stage: 5, code: 'MOD_05', title: 'Testing, Security & Play Store Release', subtitle: 'TEST_PUBLISH', topics: ['Unit Tests (JUnit, Mockk)', 'Compose UI Testing', 'ProGuard & R8 Obfuscation', 'App Signing & Keystores', 'Google Play Console'], resources: [{ type: 'article', title: 'Publishing your Android App' }, { type: 'video', title: 'Android Unit Testing Guide' }], outcome: 'Test, package, sign, and publish production Android apps.', todayFocus: 'App Bundle Generation & Signing', todayDescription: 'Generate an encrypted release AAB with ProGuard rules enabled.', estimatedMinutes: 50, estimatedHours: 15 }
    ],
    'placement-prep': [
      { id: 'pp-01', stage: 1, code: 'MOD_01', title: 'Data Structures & Algorithmic Core', subtitle: 'DSA_CORE', topics: ['Arrays & Two Pointers', 'Sliding Window', 'Linked Lists & Fast/Slow Pointers', 'Binary Search & Monotonic Predicates', 'Trees & Graph BFS/DFS', 'Dynamic Programming (1D & 2D)'], resources: [{ type: 'practice', title: 'Striver SDE Sheet' }, { type: 'practice', title: 'NeetCode 150' }], outcome: 'Solve standard SDE coding round interview problems within 25 minutes.', todayFocus: 'Sliding Window & Two Pointers', todayDescription: 'Solve 3 medium LeetCode questions using dynamic sliding windows.', estimatedMinutes: 45, estimatedHours: 40 },
      { id: 'pp-02', stage: 2, code: 'MOD_02', title: 'Computer Science Fundamentals', subtitle: 'CS_CORE', topics: ['Operating Systems (Process, Threads, Deadlocks, Paging)', 'DBMS (ACID, Normalization, Indexing, Transactions)', 'Computer Networks (OSI Model, TCP vs UDP, DNS, HTTPS)', 'Object-Oriented Design & SOLID'], resources: [{ type: 'article', title: 'Gate Smashers OS & DBMS Playlist' }, { type: 'book', title: 'Cracking the Coding Interview' }], outcome: 'Ace technical interview rounds on fundamental CS theory.', todayFocus: 'DBMS Indexing & B-Trees', todayDescription: 'Explain why B+ Trees are preferred for disk storage indexing in viva.', estimatedMinutes: 45, estimatedHours: 25 },
      { id: 'pp-03', stage: 3, code: 'MOD_03', title: 'Quantitative Aptitude & Logical Reasoning', subtitle: 'APTITUDE_ROUND', topics: ['Percentages & Profit/Loss', 'Time, Speed & Distance', 'Permutations & Probability', 'Syllogisms & Blood Relations', 'Data Interpretation'], resources: [{ type: 'practice', title: 'IndiaBIX Aptitude' }, { type: 'video', title: 'Campus Placement Aptitude Crash Course' }], outcome: 'Clear first-round online assessment (OA) aptitude cutoffs.', todayFocus: 'Time & Work Speed Shortcuts', todayDescription: 'Practice 20 speed math questions with target under 1 min each.', estimatedMinutes: 40, estimatedHours: 20 },
      { id: 'pp-04', stage: 4, code: 'MOD_04', title: 'Projects, GitHub Portfolio & Resume Tuning', subtitle: 'PORTFOLIO_RESUME', topics: ['ATS-Friendly Resume Construction', 'STAR Method for Project Bullet Points', 'GitHub Profile Readme', 'System Architecture Diagrams', 'Tech Stack Justification'], resources: [{ type: 'article', title: 'Overleaf Jake\'s Resume Template' }, { type: 'video', title: 'SDE Resume Review' }], outcome: 'Create an ATS 90+ score resume and polished GitHub portfolio.', todayFocus: 'STAR Format Project Descriptions', todayDescription: 'Rewrite SmartPrep project description using quantifiable metric impacts.', estimatedMinutes: 45, estimatedHours: 15 },
      { id: 'pp-05', stage: 5, code: 'MOD_05', title: 'Mock Interviews & Behavioral Drills', subtitle: 'MOCK_HR', topics: ['Behavioral Questions (Tell me about yourself, conflict resolution)', 'System Design Basics', 'Puzzles & Estimation', 'Salary & Offer Negotiation'], resources: [{ type: 'practice', title: 'Pramp Peer Mock Interviews' }, { type: 'video', title: 'Top 50 HR Interview Questions' }], outcome: 'Communicate with confidence and poise in front of technical interview panels.', todayFocus: 'Self-Introduction & Elevator Pitch', todayDescription: 'Record and review a crisp 90-second technical self-introduction.', estimatedMinutes: 45, estimatedHours: 15 }
    ]
  }
}

class Database {
  constructor() {
    this.memoryData = JSON.parse(JSON.stringify(INITIAL_DATA))
    this.init()
  }

  init() {
    try {
      const dir = path.dirname(DB_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8')
        this.memoryData = { ...this.memoryData, ...JSON.parse(raw) }
      } else {
        this.persist()
      }
    } catch (e) {
      console.warn('[DB] Using in-memory store:', e.message)
    }
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.memoryData, null, 2), 'utf-8')
    } catch {
      // In serverless / read-only environment, keep in memory
    }
  }

  get(key) {
    return this.memoryData[key]
  }

  set(key, value) {
    this.memoryData[key] = value
    this.persist()
    return this.memoryData[key]
  }

  reset() {
    this.memoryData = JSON.parse(JSON.stringify(INITIAL_DATA))
    this.persist()
    return this.memoryData
  }
}

export const db = new Database()
