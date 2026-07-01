import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'

/* ─── DATA ──────────────────────────────────────────────────── */

const CATEGORIES = [
  { id: 'ALL',         label: 'All Tracks',       icon: '🎯' },
  { id: 'DSA',         label: 'DSA',              icon: '📊' },
  { id: 'LANGUAGES',   label: 'Programming',      icon: '💻' },
  { id: 'WEBDEV',      label: 'Web Dev',          icon: '🌐' },
  { id: 'APTITUDE',    label: 'Aptitude',         icon: '🧮' },
  { id: 'PYQ',         label: 'Company PYQ',      icon: '🏢' },
]

const COURSES = [
  /* ── DSA ── */
  {
    id: 'dsa',
    category: 'DSA',
    icon: '📊',
    badge: 'DSA',
    badgeColor: '#7C3AED',
    title: 'DSA Masterclass',
    subtitle: 'Data Structures & Algorithms',
    desc: 'Arrays, Linked Lists, Trees, Graphs, DP, Backtracking, Sorting, Searching — from scratch to advanced.',
    topics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Recursion & Backtracking', 'Sorting & Searching'],
    difficulty: 'Intermediate → Advanced',
    hours: '80 hrs',
    problems: '350+ Problems',
    companies: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
    color: '#7C3AED',
    lightColor: '#EDE9FE',
  },

  /* ── LANGUAGES ── */
  {
    id: 'c',
    category: 'LANGUAGES',
    icon: '🔵',
    badge: 'C LANG',
    badgeColor: '#1D4ED8',
    title: 'C Programming',
    subtitle: 'Core Fundamentals',
    desc: 'Pointers, memory management, file I/O, structures, and core concepts required for system programming.',
    topics: ['Pointers & Memory', 'Structs & Unions', 'File I/O', 'Dynamic Allocation', 'Bitwise Ops', 'Recursion'],
    difficulty: 'Beginner → Intermediate',
    hours: '40 hrs',
    problems: '120+ Exercises',
    companies: ['TCS', 'Wipro', 'Infosys', 'HCL'],
    color: '#1D4ED8',
    lightColor: '#DBEAFE',
  },
  {
    id: 'cpp',
    category: 'LANGUAGES',
    icon: '⚡',
    badge: 'C++',
    badgeColor: '#0369A1',
    title: 'C++ Programming',
    subtitle: 'OOPs + STL Mastery',
    desc: 'Object-oriented design, STL containers (vector, map, set), templates, competitive programming techniques.',
    topics: ['OOPs in C++', 'STL Containers', 'Templates', 'Operator Overloading', 'Smart Pointers', 'Competitive Tricks'],
    difficulty: 'Beginner → Advanced',
    hours: '55 hrs',
    problems: '200+ Problems',
    companies: ['Google', 'Samsung', 'Qualcomm', 'Oracle'],
    color: '#0369A1',
    lightColor: '#E0F2FE',
  },
  {
    id: 'java',
    category: 'LANGUAGES',
    icon: '☕',
    badge: 'JAVA',
    badgeColor: '#DC2626',
    title: 'Java Programming',
    subtitle: 'OOPs + Collections',
    desc: 'Core Java, OOPs, Collections Framework, Multithreading, JVM internals — all interview-ready concepts.',
    topics: ['Java OOPs', 'Collections Framework', 'Multithreading', 'Exception Handling', 'JVM Architecture', 'Java 8+ Features'],
    difficulty: 'Beginner → Advanced',
    hours: '60 hrs',
    problems: '180+ Problems',
    companies: ['TCS', 'Goldman Sachs', 'Cognizant', 'Capgemini'],
    color: '#DC2626',
    lightColor: '#FEE2E2',
  },
  {
    id: 'python',
    category: 'LANGUAGES',
    icon: '🐍',
    badge: 'PYTHON',
    badgeColor: '#059669',
    title: 'Python Programming',
    subtitle: 'Scripting to ML Basics',
    desc: 'Python fundamentals, OOPs, file handling, comprehensions, NumPy/Pandas basics, and automation scripts.',
    topics: ['Python OOPs', 'List Comprehensions', 'File Handling', 'Decorators', 'NumPy & Pandas', 'Automation & Scripting'],
    difficulty: 'Beginner → Intermediate',
    hours: '45 hrs',
    problems: '150+ Exercises',
    companies: ['Amazon', 'Netflix', 'Adobe', 'Accenture'],
    color: '#059669',
    lightColor: '#D1FAE5',
  },
  {
    id: 'javascript',
    category: 'LANGUAGES',
    icon: '⚡',
    badge: 'JS',
    badgeColor: '#B45309',
    title: 'JavaScript',
    subtitle: 'ES6+ & Browser APIs',
    desc: 'Core JS, ES6+ features, async/await, Promises, closures, DOM APIs, event loop — for full-stack roles.',
    topics: ['ES6+ Features', 'Async/Await & Promises', 'Closures & Scope', 'DOM Manipulation', 'Event Loop', 'Error Handling'],
    difficulty: 'Beginner → Advanced',
    hours: '50 hrs',
    problems: '160+ Challenges',
    companies: ['Google', 'Meta', 'Flipkart', 'Razorpay'],
    color: '#B45309',
    lightColor: '#FEF3C7',
  },

  /* ── WEB DEV ── */
  {
    id: 'webdev',
    category: 'WEBDEV',
    icon: '🌐',
    badge: 'FULL STACK',
    badgeColor: '#0891B2',
    title: 'Web Development',
    subtitle: 'HTML · CSS · React · Node',
    desc: 'Build real-world projects: HTML/CSS layout, React.js components, REST APIs with Node.js and MongoDB.',
    topics: ['HTML & CSS', 'React.js', 'Node.js & Express', 'MongoDB', 'REST API Design', 'Deployment (Vercel/Render)'],
    difficulty: 'Beginner → Advanced',
    hours: '90 hrs',
    problems: '10+ Projects',
    companies: ['Startups', 'Product Companies', 'Razorpay', 'Zepto'],
    color: '#0891B2',
    lightColor: '#E0F2FE',
  },

  /* ── APTITUDE ── */
  {
    id: 'quant',
    category: 'APTITUDE',
    icon: '🧮',
    badge: 'QUANT',
    badgeColor: '#FF7A00',
    title: 'Quantitative Aptitude',
    subtitle: 'Numbers & Speed Math',
    desc: 'Time & Work, Ratios, Percentages, Profit-Loss, Speed-Distance, Series — all with shortcut techniques.',
    topics: ['Number Theory', 'Time & Work', 'Percentages', 'Ratio & Proportion', 'Profit & Loss', 'Speed & Distance'],
    difficulty: 'Beginner → Intermediate',
    hours: '35 hrs',
    problems: '500+ MCQs',
    companies: ['TCS NQT', 'Wipro', 'Infosys', 'Capgemini'],
    color: '#FF7A00',
    lightColor: '#FFF7ED',
  },
  {
    id: 'logical',
    category: 'APTITUDE',
    icon: '🧩',
    badge: 'LOGICAL',
    badgeColor: '#7C3AED',
    title: 'Logical Reasoning',
    subtitle: 'Patterns & Puzzles',
    desc: 'Blood relations, coding-decoding, seating arrangements, syllogisms, puzzles — full placement test coverage.',
    topics: ['Blood Relations', 'Seating Arrangements', 'Syllogisms', 'Coding-Decoding', 'Analogies', 'Puzzles'],
    difficulty: 'Beginner → Intermediate',
    hours: '30 hrs',
    problems: '400+ MCQs',
    companies: ['TCS NQT', 'Accenture', 'Cognizant', 'HCL'],
    color: '#7C3AED',
    lightColor: '#EDE9FE',
  },
  {
    id: 'verbal',
    category: 'APTITUDE',
    icon: '📝',
    badge: 'VERBAL',
    badgeColor: '#0369A1',
    title: 'Verbal Ability',
    subtitle: 'Reading & Communication',
    desc: 'Reading comprehension, grammar correction, sentence rearrangement, vocabulary — for online assessments.',
    topics: ['Reading Comprehension', 'Grammar & Usage', 'Synonyms & Antonyms', 'Sentence Correction', 'Para-Jumbles', 'Error Spotting'],
    difficulty: 'Beginner → Intermediate',
    hours: '25 hrs',
    problems: '300+ Questions',
    companies: ['TCS', 'Wipro', 'Infosys', 'Accenture'],
    color: '#0369A1',
    lightColor: '#E0F2FE',
  },
]

const COMPANY_PYQ = [
  {
    id: 'tcs', name: 'TCS', fullName: 'Tata Consultancy Services',
    logo: '🔷', color: '#1A5276', lightColor: '#D6EAF8',
    rounds: ['TCS NQT Aptitude', 'TCS CodeVita', 'Technical Interview', 'HR Round'],
    tags: ['Most Asked', 'NQT Pattern', 'C Language', 'Aptitude Heavy'],
    papers: 48, yearRange: '2019–2024',
    difficulty: 'Moderate',
    tip: 'Focus on C output questions, Verbal Ability, and Quantitative in NQT.',
  },
  {
    id: 'google', name: 'Google', fullName: 'Google India',
    logo: '🔴', color: '#EA4335', lightColor: '#FDECEA',
    rounds: ['Online Assessment', 'Phone Screening', '4–5 Technical Rounds', 'Googleyness Round'],
    tags: ['DSA Heavy', 'Graphs & DP', 'System Design', 'Algorithm Focus'],
    papers: 32, yearRange: '2020–2024',
    difficulty: 'Very Hard',
    tip: 'Master Graphs, DP, and Big-O analysis. Practice on LeetCode Hard.',
  },
  {
    id: 'amazon', name: 'Amazon', fullName: 'Amazon Development Centre',
    logo: '🟠', color: '#FF9900', lightColor: '#FFF4E0',
    rounds: ['Online Coding Test', 'Bar Raiser Round', 'Leadership Principles', 'System Design'],
    tags: ['OOPs Focus', 'Leadership Principles', 'Arrays & Trees', 'System Design'],
    papers: 38, yearRange: '2019–2024',
    difficulty: 'Hard',
    tip: 'Prepare STAR answers for Leadership Principles alongside DSA.',
  },
  {
    id: 'microsoft', name: 'Microsoft', fullName: 'Microsoft India',
    logo: '🟦', color: '#0078D4', lightColor: '#E6F2FB',
    rounds: ['Online Coding Round', '3 Technical Interviews', 'Hiring Manager Round'],
    tags: ['DSA + OOPs', 'Puzzles', 'OS Concepts', 'C++ / Java'],
    papers: 30, yearRange: '2020–2024',
    difficulty: 'Hard',
    tip: 'Focus on Trees, Linked Lists, and OS internals. Puzzles are common.',
  },
  {
    id: 'infosys', name: 'Infosys', fullName: 'Infosys Ltd.',
    logo: '🟢', color: '#007CC2', lightColor: '#E0F3FB',
    rounds: ['Hackwithinfy (Optional)', 'Online Test', 'Technical Interview', 'HR Round'],
    tags: ['Aptitude', 'Coding (Easy)', 'Verbal', 'Puzzle Solving'],
    papers: 42, yearRange: '2019–2024',
    difficulty: 'Moderate',
    tip: 'Infosys values aptitude score. English proficiency matters a lot.',
  },
  {
    id: 'wipro', name: 'Wipro', fullName: 'Wipro Technologies',
    logo: '🟡', color: '#45B39D', lightColor: '#D5F5E3',
    rounds: ['Online Aptitude Test', 'Essay Writing', 'Technical Interview', 'HR Round'],
    tags: ['Aptitude', 'Essay', 'C/C++ Basics', 'Communication'],
    papers: 36, yearRange: '2019–2024',
    difficulty: 'Easy → Moderate',
    tip: 'Essay writing and communication are key. Practice writing structured paragraphs.',
  },
  {
    id: 'accenture', name: 'Accenture', fullName: 'Accenture India',
    logo: '🟣', color: '#A100FF', lightColor: '#F3E5FF',
    rounds: ['Cognitive Assessment', 'Technical Test', 'Communication Test', 'HR Round'],
    tags: ['Cognitive Skills', 'Verbal Ability', 'Coding (Basic)', 'Situational Judgment'],
    papers: 40, yearRange: '2020–2024',
    difficulty: 'Easy → Moderate',
    tip: 'Accenture focuses heavily on cognitive ability and communication skills.',
  },
  {
    id: 'adobe', name: 'Adobe', fullName: 'Adobe Systems India',
    logo: '🔴', color: '#FF0000', lightColor: '#FFE5E5',
    rounds: ['Online Coding Round', '3 Technical Interviews', 'Bar Raiser Style'],
    tags: ['DSA Advanced', 'System Design', 'C++/Java', 'Creative Problem Solving'],
    papers: 22, yearRange: '2021–2024',
    difficulty: 'Hard',
    tip: 'Adobe values clean code and optimized solutions. Practice code quality.',
  },
]

/* ─── SUB COMPONENTS ────────────────────────────────────────── */

function CourseCard({ course, i }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 })
    setGlow({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1], rotateX: { type: 'spring', stiffness: 200, damping: 22 }, rotateY: { type: 'spring', stiffness: 200, damping: 22 } }}
      whileHover={{ y: -7, scale: 1.012 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        background: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? course.color + '30' : 'rgba(255,255,255,0.5)'}`,
        borderTop: `3px solid ${course.color}`,
        borderRadius: '20px',
        padding: '28px 26px 24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transformStyle: 'preserve-3d',
        boxShadow: hovered
          ? `0 20px 48px ${course.color}15, 0 2px 8px ${course.color}08`
          : '0 4px 20px rgba(17,24,39,0.04)',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Mouse glow */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(circle 180px at ${glow.x}px ${glow.y}px, ${course.color}10 0%, transparent 75%)`,
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: course.lightColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>
            {course.icon}
          </div>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '1.5px',
            padding: '4px 10px', borderRadius: 100,
            background: course.lightColor,
            color: course.color,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {course.badge}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800, fontSize: 20, color: '#111827',
          marginBottom: 4, letterSpacing: '-0.3px',
        }}>
          {course.title}
        </h3>
        <div style={{ fontSize: 11, color: course.color, fontWeight: 700, marginBottom: 10, letterSpacing: '0.3px' }}>
          {course.subtitle}
        </div>

        {/* Desc */}
        <p style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.65, marginBottom: 18 }}>
          {course.desc}
        </p>

        {/* Topic chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20 }}>
          {course.topics.map(t => (
            <span key={t} style={{
              fontSize: 10.5, padding: '3px 9px', borderRadius: 100,
              background: course.lightColor, color: course.color,
              fontWeight: 600, letterSpacing: '0.2px',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { label: course.hours, icon: '⏱' },
            { label: course.problems, icon: '📋' },
            { label: course.difficulty, icon: '📈' },
          ].map(s => (
            <div key={s.label} style={{
              fontSize: 10.5, color: '#6B7280', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span>{s.icon}</span> {s.label}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 14, borderTop: `1px solid ${course.color}12`, marginTop: 'auto',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {course.companies.map(c => (
              <span key={c} style={{
                fontSize: 9, padding: '2px 7px', borderRadius: 100,
                background: 'rgba(17,24,39,0.04)',
                color: '#374151', fontWeight: 700, letterSpacing: '0.3px',
              }}>
                {c}
              </span>
            ))}
          </div>
          <motion.div
            animate={{ x: hovered ? 4 : 0, color: hovered ? course.color : '#9CA3AF' }}
            style={{ fontSize: 18 }}
          >
            →
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function CompanyCard({ company, i }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? company.color + '35' : 'rgba(255,255,255,0.5)'}`,
        borderLeft: `5px solid ${company.color}`,
        borderRadius: '20px',
        padding: '26px 24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered
          ? `0 20px 48px ${company.color}15`
          : '0 4px 20px rgba(17,24,39,0.04)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Company Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: company.lightColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          {company.logo}
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 19, color: '#111827', marginBottom: 2, letterSpacing: '-0.3px',
          }}>
            {company.name}
          </h3>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{company.fullName}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: company.color, fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.papers}
          </div>
          <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600 }}>PAPERS</div>
        </div>
      </div>

      {/* Difficulty + Year */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <span style={{
          fontSize: 10, padding: '3px 10px', borderRadius: 100,
          background: company.lightColor, color: company.color, fontWeight: 700,
        }}>
          {company.difficulty}
        </span>
        <span style={{
          fontSize: 10, padding: '3px 10px', borderRadius: 100,
          background: 'rgba(17,24,39,0.04)', color: '#374151', fontWeight: 600,
        }}>
          📅 {company.yearRange}
        </span>
      </div>

      {/* Rounds */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '1.5px', marginBottom: 7, textTransform: 'uppercase' }}>
          INTERVIEW ROUNDS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {company.rounds.map((r, idx) => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: company.lightColor, color: company.color,
                fontSize: 9, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>
              <span style={{ fontSize: 11.5, color: '#374151', fontWeight: 500 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
        {company.tags.map(t => (
          <span key={t} style={{
            fontSize: 10, padding: '3px 9px', borderRadius: 100,
            background: 'rgba(17,24,39,0.04)', color: '#374151', fontWeight: 600,
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Tip */}
      <div style={{
        background: company.lightColor,
        borderRadius: 12, padding: '10px 14px',
        display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: 11, color: company.color, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
          {company.tip}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────────── */

export default function PlacementPortal() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = COURSES.filter(c => {
    const matchCat = activeCategory === 'ALL' || activeCategory === 'PYQ' || c.category === activeCategory
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  const showPYQ = activeCategory === 'ALL' || activeCategory === 'PYQ'
  const showCourses = activeCategory !== 'PYQ'

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF8', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── Watermark brand backdrop ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        overflow: 'hidden', opacity: 0.03,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignContent: 'space-around', padding: '5vh 5vw',
      }}>
        {['GOOGLE', 'MICROSOFT', 'AMAZON', 'ADOBE', 'NETFLIX', 'TCS', 'INFOSYS', 'ACCENTURE'].map((n, i) => (
          <div key={n} style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
            fontSize: 'clamp(40px, 8vw, 130px)', letterSpacing: '-0.04em',
            color: '#111827', transform: `rotate(${(i % 3 - 1) * 8}deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {n}
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ════════ HERO ════════ */}
        <section style={{ padding: '110px 24px 48px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF7A00' }} />
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '3px',
                color: '#92400E', textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Career Preparation Suite
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              letterSpacing: '-0.04em', lineHeight: 0.95,
              color: '#111827', marginBottom: 20,
            }}>
              Placement<br />
              <span style={{ color: '#FF7A00' }}>Portal</span>
            </h1>

            <p style={{
              fontSize: 15, color: '#4B5563',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, lineHeight: 1.65,
              maxWidth: 500, margin: '0 auto 36px',
            }}>
              DSA · Programming Languages · Web Dev · Aptitude · Company PYQs —
              everything you need for campus placements, in one place.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              {[
                { num: '9+', label: 'Course Tracks' },
                { num: '8+', label: 'Company PYQs' },
                { num: '2000+', label: 'Practice Problems' },
                { num: '300+', label: 'Hours of Content' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,122,0,0.15)',
                  borderRadius: 14, padding: '12px 20px', textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(255,122,0,0.06)',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#FF7A00', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px' }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ════════ SEARCH + CATEGORY TABS ════════ */}
        <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 40px' }}>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,122,0,0.22)',
            borderRadius: 16, padding: '13px 20px',
            marginBottom: 24, maxWidth: 560,
            boxShadow: '0 4px 20px rgba(255,122,0,0.06)',
          }}>
            <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search courses, topics, skills…"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#111827', fontSize: 14,
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
              }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', borderRadius: 12,
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.3px',
                  background: activeCategory === cat.id
                    ? '#FF7A00'
                    : 'rgba(255,255,255,0.7)',
                  color: activeCategory === cat.id ? '#fff' : '#374151',
                  border: `1px solid ${activeCategory === cat.id ? '#FF7A00' : 'rgba(255,122,0,0.18)'}`,
                  boxShadow: activeCategory === cat.id
                    ? '0 6px 20px rgba(255,122,0,0.28)'
                    : '0 2px 8px rgba(17,24,39,0.04)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ════════ COURSE CARDS ════════ */}
        {showCourses && filteredCourses.length > 0 && (
          <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 64px' }}>

            {/* Section heading */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2.5px', color: '#FF7A00', textTransform: 'uppercase', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
                — STUDY TRACKS —
              </div>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: 'clamp(22px, 3.5vw, 36px)',
                color: '#111827', letterSpacing: '-0.5px',
              }}>
                {activeCategory === 'ALL' ? 'All Courses' :
                 activeCategory === 'DSA' ? 'Data Structures & Algorithms' :
                 activeCategory === 'LANGUAGES' ? 'Programming Languages' :
                 activeCategory === 'WEBDEV' ? 'Web Development' :
                 'Aptitude Training'}
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: 24,
            }}>
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, i) => (
                  <CourseCard key={course.id} course={course} i={i} />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* ════════ COMPANY PYQ SECTION ════════ */}
        {showPYQ && (
          <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 80px' }}>

            {/* Section heading */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2.5px', color: '#FF7A00', textTransform: 'uppercase', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
                — COMPANY PREVIOUS YEAR QUESTIONS —
              </div>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: 'clamp(22px, 3.5vw, 36px)',
                color: '#111827', letterSpacing: '-0.5px',
              }}>
                Practice by Company
              </h2>
              <p style={{ fontSize: 13, color: '#6B7280', marginTop: 8, fontWeight: 500, maxWidth: 500 }}>
                Company-specific question papers, interview rounds, and insider tips to crack each company's selection process.
              </p>
            </div>

            {/* Company cards grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24,
            }}>
              {COMPANY_PYQ.map((company, i) => (
                <CompanyCard key={company.id} company={company} i={i} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {showCourses && filteredCourses.length === 0 && activeCategory !== 'PYQ' && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#374151', marginBottom: 8 }}>No courses matched</h4>
            <p style={{ fontSize: 13 }}>Try a different search or select another category.</p>
          </div>
        )}

      </div>

      <AIAssistant />
    </div>
  )
}