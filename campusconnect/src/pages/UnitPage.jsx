import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  Clock,
  Play,
  Share2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Home as HomeIcon,
  ChevronRight,
  X
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import api from '../api/axios'
import { getUnitsBySubject, getResourcesByUnit } from '../api/subjects'

// Default topics generator if unit has no granular breakdown
function getUnitGlanceTopics(unitTitle = '', subjectName = '') {
  const title = unitTitle.toLowerCase()
  if (title.includes('relational') || title.includes('sql') || subjectName.toLowerCase().includes('database')) {
    return [
      'Relational Algebra',
      'SQL Queries',
      'Constraints',
      'Views',
      'Nested Queries',
      'Set Operations',
      'Equi-Joins',
      'Aggregate Functions',
    ]
  }
  if (title.includes('tree') || title.includes('algorithm') || subjectName.toLowerCase().includes('data structure')) {
    return [
      'Binary Trees',
      'BST Operations',
      'AVL Rotations',
      'Tree Traversals',
      'Red-Black Trees',
      'Heap Properties',
      'B-Trees',
      'Complexity Analysis',
    ]
  }
  if (title.includes('process') || title.includes('schedul') || subjectName.toLowerCase().includes('operating')) {
    return [
      'Process Control Blocks',
      'CPU Scheduling',
      'FCFS & Round Robin',
      'Thread Synchronization',
      'Semaphores & Mutex',
      'Critical Section',
      'Peterson Algorithm',
      'IPC Mechanisms',
    ]
  }
  if (title.includes('transport') || title.includes('tcp') || subjectName.toLowerCase().includes('network')) {
    return [
      'TCP Handshake',
      'UDP Datagrams',
      'Congestion Control',
      'Sliding Window',
      'Flow Control',
      'Socket Addressing',
      'Error Detection',
      'Port Multiplexing',
    ]
  }
  return [
    'Core Fundamentals',
    'Theoretical Principles',
    'Algorithmic Formulations',
    'Implementation Rules',
    'Standard Architecture',
    'Exam Q&A Analysis',
  ]
}

// Important numbered topics generator
function getImportantTopics(unitTitle = '', subjectName = '') {
  const title = unitTitle.toLowerCase()
  if (title.includes('relational') || title.includes('sql') || subjectName.toLowerCase().includes('database')) {
    return [
      { num: '01', title: 'Selection & Projection Operators', desc: 'Fundamental unary relational operators and algebraic expression trees.' },
      { num: '02', title: 'Relational Joins & Cartesian Products', desc: 'Inner, natural, equi-joins, and outer joins (left, right, full).' },
      { num: '03', title: 'SQL Integrity Constraints & Keys', desc: 'Primary key, foreign key references, unique, not null, and check assertions.' },
      { num: '04', title: 'Nested Subqueries & Correlated Queries', desc: 'Single-row vs multi-row subqueries, IN, EXISTS, ANY, and ALL predicates.' },
      { num: '05', title: 'Views, Triggers & Indexing Mechanisms', desc: 'Virtual tables, with-check-option views, and B-Tree database indexing.' },
    ]
  }
  if (title.includes('tree') || subjectName.toLowerCase().includes('data structure')) {
    return [
      { num: '01', title: 'Binary Tree Traversals (Inorder, Preorder, Postorder)', desc: 'Recursive and iterative tree traversal algorithms and stack models.' },
      { num: '02', title: 'Binary Search Tree (BST) Insertion & Deletion', desc: 'Searching, finding successor/predecessor, and complex node deletion cases.' },
      { num: '03', title: 'AVL Tree Self-Balancing Rotations', desc: 'LL, RR, LR, and RL rotations to maintain log(n) height balance.' },
      { num: '04', title: 'Priority Queues & Binary Heaps', desc: 'Min-heap, max-heap heapify operations, and heap sort complexity.' },
      { num: '05', title: 'B-Trees and B+ Trees for Database Storage', desc: 'Multi-way search trees, node splitting, and block indexing.' },
    ]
  }
  return [
    { num: '01', title: 'Core Conceptual Foundation', desc: 'Formal definitions, theorem statements, and foundational architectural models.' },
    { num: '02', title: 'Standard Operational Mechanisms', desc: 'Algorithm design steps, mathematical derivations, and workflow stages.' },
    { num: '03', title: 'Comparative Analysis & Trade-offs', desc: 'Time and space trade-offs, performance bottlenecks, and design choices.' },
    { num: '04', title: 'Real-World Technical Implementation', desc: 'Practical programming patterns, API bindings, and industry use-cases.' },
    { num: '05', title: 'University Exam Question Types', desc: 'Most recurrent 10-mark descriptive problems and solved numericals.' },
  ]
}

export default function UnitPage() {
  const { regId = 'JNTUK', subjectId = '3', unitNum } = useParams()
  const navigate = useNavigate()

  const [subject, setSubject] = useState(null)
  const [units, setUnits] = useState([])
  const [activeUnit, setActiveUnit] = useState(null)
  const [resources, setResources] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [resourceLoading, setResourceLoading] = useState(false)
  const [completedUnits, setCompletedUnits] = useState({})
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [previewModal, setPreviewModal] = useState(null) // { type, title, url }

  // 1. Fetch Subject & Units
  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/public/subject/${subjectId}`).catch(() => ({ data: null })),
      getUnitsBySubject(subjectId).catch(() => []),
    ])
      .then(([subjectRes, unitsData]) => {
        let sub = subjectRes.data
        // Fallback: If single subject API not available, find in regulation subjects
        if (!sub) {
          api.get(`/public/subjects/${regId}`)
            .then((res) => {
              const matched = res.data?.find((s) => s.id === Number(subjectId))
              if (matched) setSubject(matched)
            })
            .catch((e) => console.warn(e))
        } else {
          setSubject(sub)
        }

        const unitList = Array.isArray(unitsData) ? unitsData : []
        setUnits(unitList)

        // Select targeted unit or default to first
        let targetedUnit = null
        if (unitNum) {
          targetedUnit = unitList.find((u) => u.unitNum === Number(unitNum))
        }
        if (!targetedUnit && unitList.length > 0) {
          targetedUnit = unitList[0]
        }
        setActiveUnit(targetedUnit)
      })
      .catch((err) => {
        console.error('Failed to load subject units:', err)
      })
      .finally(() => setLoading(false))
  }, [subjectId, regId])

  // 2. When unitNum changes in URL, update activeUnit
  useEffect(() => {
    if (unitNum && units.length > 0) {
      const found = units.find((u) => u.unitNum === Number(unitNum))
      if (found) setActiveUnit(found)
    }
  }, [unitNum, units])

  // 3. Fetch Resources for Active Unit
  useEffect(() => {
    if (!activeUnit?.id) {
      setResources([])
      return
    }

    setResourceLoading(true)
    getResourcesByUnit(activeUnit.id)
      .then((data) => {
        setResources(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Failed to load unit resources:', err)
        setResources([])
      })
      .finally(() => setResourceLoading(false))
  }, [activeUnit?.id])

  // Clean unit title (removes "Unit 3: " prefix if present in string)
  const cleanTitle = useMemo(() => {
    if (!activeUnit?.title) return 'Unit Overview'
    return activeUnit.title.replace(/^Unit\s*\d+\s*:\s*/i, '').trim()
  }, [activeUnit])

  // Categorize resources
  const pdfResources = resources.filter((r) => r.type === 'PDF' || r.type === 'NOTES')
  const videoResources = resources.filter((r) => r.type === 'YOUTUBE' || r.type === 'VIDEO')
  const questionResources = resources.filter((r) => r.type === 'IMPORTANT_QUESTION' || r.type === 'PYQ')

  // Unit topics & important topics
  const glanceTopics = getUnitGlanceTopics(cleanTitle, subject?.name || '')
  const importantTopics = getImportantTopics(cleanTitle, subject?.name || '')

  // Navigation handlers
  const handleUnitSelect = (unit) => {
    setActiveUnit(unit)
    navigate(`/student/${regId}/${subjectId}/${unit.unitNum}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentIndex = units.findIndex((u) => u.id === activeUnit?.id)
  const prevUnit = currentIndex > 0 ? units[currentIndex - 1] : null
  const nextUnit = currentIndex < units.length - 1 ? units[currentIndex + 1] : null

  const isUnitCompleted = Boolean(activeUnit && completedUnits[activeUnit.id])
  const toggleUnitCompletion = () => {
    if (!activeUnit) return
    setCompletedUnits((prev) => ({
      ...prev,
      [activeUnit.id]: !prev[activeUnit.id],
    }))
  }

  // FAQs
  const faqs = [
    {
      q: `What core topics are covered in Unit ${activeUnit?.unitNum || ''}?`,
      a: `Unit ${activeUnit?.unitNum || ''} focuses on ${cleanTitle}, encompassing ${glanceTopics.slice(0, 4).join(', ')}, and end-semester numerical exam problems.`,
    },
    {
      q: 'Which resource should I study first?',
      a: 'We recommend reviewing the complete Unit Lecture Notes PDF first to grasp core definitions, followed by the video tutorials for query syntax, and concluding with university PYQs.',
    },
    {
      q: 'Are these lecture notes sufficient for university end-examinations?',
      a: `Yes! These notes are curated directly in alignment with the official ${regId} syllabus guidelines, covering all recurring 10-mark descriptive questions.`,
    },
    {
      q: 'Where can I find previous year solved question papers?',
      a: 'All previous year questions for this unit are mapped under the "Previous Questions" tab with examination blueprints.',
    },
    {
      q: 'How should I practice SQL queries and problem sets?',
      a: 'Write queries step-by-step using relational algebra expressions first, then test in PostgreSQL or MySQL environments as illustrated in our video lessons.',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFF9F0',
        color: '#111827',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: 'var(--font-body, "Inter", sans-serif)',
      }}
    >
      {/* ── Soft Blurred Campus Atmosphere ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url('/assets/campus/campus_ambient_blur.jpg')`,
          backgroundPosition: 'center 70%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.08,
          filter: 'blur(36px)',
          transform: 'scale(1.08)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Warm Ambient Radial Glows ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(253, 186, 18, 0.15) 0%, rgba(249, 115, 22, 0.06) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Campus Connect Light Navbar ── */}
      <Navbar isDark={false} />

      {/* ── Main Layout Wrapper ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '100px clamp(16px, 3vw, 36px) 60px',
          display: 'flex',
          gap: '36px',
          alignItems: 'flex-start',
        }}
      >
        {/* ── Left Unit Syllabus Sidebar ── */}
        <aside
          style={{
            width: '270px',
            flexShrink: 0,
            position: 'sticky',
            top: '96px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Back to Subjects Link */}
          <Link
            to={`/student/${regId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#4B5563',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading, "Space Grotesk")',
              padding: '8px 14px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(249, 115, 22, 0.18)',
              width: 'fit-content',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F97316'
              e.currentTarget.style.borderColor = '#F97316'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4B5563'
              e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.18)'
            }}
          >
            <span style={{ color: '#F97316', fontSize: '15px' }}>←</span>
            <span>Back to Subjects</span>
          </Link>

          {/* Subject Identity Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '22px',
              border: '1px solid rgba(249, 115, 22, 0.14)',
              padding: '20px 18px',
              boxShadow: '0 10px 30px rgba(17, 24, 39, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#F97316',
                  background: 'rgba(249, 115, 22, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {subject?.regulationTag || regId}
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
                {subject?.branch || 'CSE'} · {subject?.year || '2nd Year'}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk")',
                fontSize: '18px',
                fontWeight: 800,
                color: '#111827',
                margin: '0 0 16px 0',
                lineHeight: 1.25,
              }}
            >
              {subject?.name || 'Subject Units'}
            </h2>

            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                color: '#6B7280',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading)',
                marginBottom: '12px',
                borderTop: '1px solid rgba(17, 24, 39, 0.06)',
                paddingTop: '14px',
              }}
            >
              SYLLABUS
            </div>

            {/* Units Navigation List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loading && [1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ height: '42px', background: '#F0EBE3', borderRadius: '12px' }} />
              ))}

              {!loading && units.map((u) => {
                const isActive = activeUnit?.id === u.id
                const isComplete = completedUnits[u.id]

                return (
                  <button
                    key={u.id}
                    onClick={() => handleUnitSelect(u)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '14px',
                      border: isActive ? '1px solid #F97316' : '1px solid transparent',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(253, 186, 18, 0.18), rgba(249, 115, 22, 0.12))'
                        : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(249, 115, 22, 0.06)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '18%',
                          bottom: '18%',
                          width: '3.5px',
                          borderRadius: '0 4px 4px 0',
                          background: '#F97316',
                        }}
                      />
                    )}

                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isActive
                          ? 'linear-gradient(135deg, #FDBA12, #F97316)'
                          : 'rgba(17, 24, 39, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#FFFFFF' : '#4B5563',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        flexShrink: 0,
                      }}
                    >
                      {isComplete ? '✓' : `0${u.unitNum}`}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading, "Space Grotesk")',
                          fontSize: '13px',
                          fontWeight: isActive ? 800 : 600,
                          color: isActive ? '#111827' : '#4B5563',
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        Unit {u.unitNum}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#6B7280',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {u.title.replace(/^Unit\s*\d+\s*:\s*/i, '')}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Sidebar Unit Progress Bar */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(17, 24, 39, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#6B7280', marginBottom: '6px' }}>
                <span>Unit Progress</span>
                <span style={{ color: '#F97316', fontWeight: 700 }}>
                  {isUnitCompleted ? '100%' : '0%'}
                </span>
              </div>
              <div style={{ height: '6px', background: '#F0EBE3', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: isUnitCompleted ? '100%' : '0%',
                    background: 'linear-gradient(90deg, #FDBA12, #F97316)',
                    borderRadius: '999px',
                    transition: 'width 0.35s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Decoration */}
          <div style={{ textAlign: 'center', padding: '12px 10px' }}>
            <div
              style={{
                fontFamily: 'var(--font-handwritten, "Caveat", cursive)',
                fontSize: '22px',
                fontWeight: 700,
                color: '#1E293B',
                lineHeight: 1.2,
                marginBottom: '14px',
                transform: 'rotate(-3deg)',
              }}
            >
              Learn Today.<br />Build Tomorrow.
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxWidth: '170px',
                margin: '0 auto',
              }}
            >
              <div style={{ background: 'linear-gradient(90deg, #FDBA12, #F59E0B)', borderRadius: '6px', padding: '5px 12px', color: '#FFF', fontSize: '10px', fontWeight: 800, letterSpacing: '2px' }}>
                LEARN
              </div>
              <div style={{ background: 'linear-gradient(90deg, #F97316, #EA580C)', borderRadius: '6px', padding: '6px 12px', color: '#FFF', fontSize: '10px', fontWeight: 800, letterSpacing: '2px' }}>
                PRACTICE
              </div>
              <div style={{ background: 'linear-gradient(90deg, #F4511E, #C2410C)', borderRadius: '6px', padding: '7px 12px', color: '#FFF', fontSize: '10px', fontWeight: 800, letterSpacing: '2px' }}>
                GROW
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Academic Unit Workspace ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '20px' }}>
            <nav
              aria-label="Breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontFamily: 'var(--font-heading, "Space Grotesk")',
                color: '#4B5563',
                flexWrap: 'wrap',
              }}
            >
              <Link to="/welcome" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4B5563', textDecoration: 'none' }}>
                <HomeIcon size={14} style={{ color: '#F97316' }} />
                <span>Home</span>
              </Link>
              <ChevronRight size={13} style={{ color: '#9CA3AF' }} />
              <Link to="/student" style={{ color: '#4B5563', textDecoration: 'none' }}>
                Student Resources
              </Link>
              <ChevronRight size={13} style={{ color: '#9CA3AF' }} />
              <Link to={`/student/${regId}`} style={{ color: '#4B5563', textDecoration: 'none' }}>
                {regId}
              </Link>
              <ChevronRight size={13} style={{ color: '#9CA3AF' }} />
              <Link to={`/student/${regId}/${subjectId}`} style={{ color: '#4B5563', textDecoration: 'none' }}>
                {subject?.name || 'Subject'}
              </Link>
              <ChevronRight size={13} style={{ color: '#9CA3AF' }} />
              <span style={{ color: '#F97316', fontWeight: 700 }}>
                Unit {activeUnit?.unitNum || 1}
              </span>
            </nav>
          </div>

          {/* ── Unit Header Card ── */}
          <header
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(249, 115, 22, 0.14)',
              borderRadius: '26px',
              padding: 'clamp(20px, 3vw, 32px)',
              boxShadow: '0 12px 36px rgba(17, 24, 39, 0.05)',
              marginBottom: '28px',
            }}
          >
            {/* Unit Number Supertitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#F97316',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                UNIT {activeUnit?.unitNum || 1}
              </span>
              <span style={{ color: '#D1D5DB' }}>·</span>
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                {subject?.name}
              </span>
            </div>

            {/* Main Title */}
            <motion.h1
              key={cleanTitle}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: 'clamp(26px, 3.2vw, 40px)',
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: 1.15,
                color: '#111827',
                margin: '0 0 12px 0',
              }}
            >
              {cleanTitle}
            </motion.h1>

            {/* Description */}
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.65,
                color: '#4B5563',
                maxWidth: '740px',
                margin: '0 0 20px 0',
              }}
            >
              {activeUnit?.description || 'Explore the key concepts, resources and practice material for this unit.'}
            </p>

            {/* Metadata Badges & Progress Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(17, 24, 39, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#4B5563', background: '#F3EFEA', padding: '4px 10px', borderRadius: '8px' }}>
                  <FileText size={13} style={{ color: '#F97316' }} />
                  {pdfResources.length} PDF Notes
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#4B5563', background: '#F3EFEA', padding: '4px 10px', borderRadius: '8px' }}>
                  <Video size={13} style={{ color: '#2563EB' }} />
                  {videoResources.length} Video Lessons
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: '#4B5563', background: '#F3EFEA', padding: '4px 10px', borderRadius: '8px' }}>
                  <HelpCircle size={13} style={{ color: '#059669' }} />
                  {questionResources.length} PYQs
                </span>
              </div>

              {/* Progress & Mark Complete */}
              <button
                type="button"
                onClick={toggleUnitCompletion}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: isUnitCompleted ? '1px solid #10B981' : '1px solid rgba(249, 115, 22, 0.25)',
                  background: isUnitCompleted ? 'rgba(16, 185, 129, 0.1)' : '#FFFFFF',
                  color: isUnitCompleted ? '#059669' : '#111827',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <CheckCircle2 size={15} style={{ color: isUnitCompleted ? '#059669' : '#F97316' }} />
                <span>{isUnitCompleted ? 'Unit Completed ✓' : 'Mark Unit Complete'}</span>
              </button>
            </div>
          </header>

          {/* ── Tabs Navigation ── */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid rgba(17, 24, 39, 0.1)',
              marginBottom: '28px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'pdfs', label: `PDF Resources (${pdfResources.length})`, icon: FileText },
              { id: 'videos', label: `Video Lectures (${videoResources.length})`, icon: Video },
              { id: 'questions', label: `Previous Questions (${questionResources.length})`, icon: HelpCircle },
              { id: 'faqs', label: 'FAQs', icon: MessageSquare },
            ].map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2.5px solid #F97316' : '2.5px solid transparent',
                    color: isActive ? '#111827' : '#6B7280',
                    fontFamily: 'var(--font-heading, "Space Grotesk")',
                    fontSize: '14px',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                    bottom: '-1px',
                  }}
                >
                  <TabIcon size={16} style={{ color: isActive ? '#F97316' : '#9CA3AF' }} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>

          {/* ── Tab Content Area ── */}
          <div>
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Unit at a Glance */}
                <section
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(249, 115, 22, 0.14)',
                    padding: '24px 26px',
                    boxShadow: '0 8px 24px rgba(17, 24, 39, 0.04)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Space Grotesk")',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#111827',
                      margin: '0 0 16px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Unit at a Glance</span>
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {glanceTopics.map((topic, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          background: 'rgba(249, 115, 22, 0.08)',
                          border: '1px solid rgba(249, 115, 22, 0.18)',
                          color: '#111827',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '13px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ color: '#F97316' }}>✦</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Important Topics (Numbered 01, 02, 03...) */}
                <section
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(249, 115, 22, 0.14)',
                    padding: '24px 26px',
                    boxShadow: '0 8px 24px rgba(17, 24, 39, 0.04)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Space Grotesk")',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#111827',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Important Topics
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {importantTopics.map((item) => (
                      <div
                        key={item.num}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(17, 24, 39, 0.06)',
                          boxShadow: '0 2px 8px rgba(17, 24, 39, 0.02)',
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(253, 186, 18, 0.2), rgba(249, 115, 22, 0.2))',
                            color: '#F97316',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '13px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {item.num}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800, color: '#111827' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px', lineHeight: 1.5 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* 2. PDF RESOURCES TAB */}
            {activeTab === 'pdfs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pdfResources.length === 0 && (
                  <div style={{ padding: '48px 24px', textAlign: 'center', background: '#FFF', borderRadius: '20px', border: '1px solid rgba(249, 115, 22, 0.14)' }}>
                    <FileText size={36} style={{ color: '#9CA3AF', marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>No PDF resources available yet</h4>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>Our academic team is curating classroom notes for this unit.</p>
                  </div>
                )}

                {pdfResources.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      border: '1px solid rgba(249, 115, 22, 0.14)',
                      padding: '20px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      boxShadow: '0 4px 16px rgba(17, 24, 39, 0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px', flex: 1 }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#EF4444',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            {res.title}
                          </h4>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            PDF
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0', lineHeight: 1.45 }}>
                          {res.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewModal({ type: 'pdf', title: res.title, url: res.url })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 16px',
                          borderRadius: '10px',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          background: '#FFFFFF',
                          color: '#F97316',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span>Open</span>
                        <ExternalLink size={13} />
                      </button>

                      <a
                        href={res.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 18px',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 3px 10px rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. VIDEO LECTURES TAB */}
            {activeTab === 'videos' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {videoResources.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '48px 24px', textAlign: 'center', background: '#FFF', borderRadius: '20px', border: '1px solid rgba(249, 115, 22, 0.14)' }}>
                    <Video size={36} style={{ color: '#9CA3AF', marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>No video lectures available yet</h4>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>Video lessons for this unit are being curated.</p>
                  </div>
                )}

                {videoResources.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid rgba(249, 115, 22, 0.14)',
                      boxShadow: '0 4px 16px rgba(17, 24, 39, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Video Thumbnail with Play Button */}
                    <div
                      style={{
                        height: '140px',
                        background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPreviewModal({ type: 'video', title: v.title, url: v.url })}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                          boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
                        }}
                      >
                        <Play size={18} style={{ marginLeft: '2px' }} />
                      </div>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#FFF',
                          background: 'rgba(0,0,0,0.65)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        YouTube Playlist
                      </span>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                        {v.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px 0', flex: 1, lineHeight: 1.5 }}>
                        {v.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setPreviewModal({ type: 'video', title: v.title, url: v.url })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '9px 14px',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                          color: '#FFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span>Watch Video</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. PREVIOUS QUESTIONS TAB */}
            {activeTab === 'questions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {questionResources.length === 0 && (
                  <div style={{ padding: '48px 24px', textAlign: 'center', background: '#FFF', borderRadius: '20px', border: '1px solid rgba(249, 115, 22, 0.14)' }}>
                    <HelpCircle size={36} style={{ color: '#9CA3AF', marginBottom: '10px' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>No previous-year questions available yet</h4>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>University examination questions will appear here when curated.</p>
                  </div>
                )}

                {questionResources.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid rgba(249, 115, 22, 0.14)',
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                        UNIVERSITY PYQ
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800, color: '#111827', margin: '6px 0 4px' }}>
                        {q.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                        {q.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewModal({ type: 'pdf', title: q.title, url: q.url })}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        background: '#FFFFFF',
                        color: '#F97316',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Practice Questions →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 5. FAQS TAB */}
            {activeTab === 'faqs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {faqs.map((faq, i) => {
                  const isOpen = openFaqIndex === i

                  return (
                    <div
                      key={i}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '18px',
                        border: `1px solid ${isOpen ? 'rgba(249, 115, 22, 0.35)' : 'rgba(249, 115, 22, 0.12)'}`,
                        padding: '16px 20px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          textAlign: 'left',
                          cursor: 'pointer',
                          gap: '12px',
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                          {faq.q}
                        </span>
                        <ChevronDown size={18} style={{ color: '#F97316', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>

                      {isOpen && (
                        <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#4B5563', margin: '12px 0 0', paddingTop: '8px', borderTop: '1px solid rgba(17, 24, 39, 0.06)' }}>
                          {faq.a}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Bottom Navigation Bar (Previous Unit / Next Unit) ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '44px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(249, 115, 22, 0.14)',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <button
              type="button"
              disabled={!prevUnit}
              onClick={() => prevUnit && handleUnitSelect(prevUnit)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(17, 24, 39, 0.12)',
                background: '#FFFFFF',
                color: prevUnit ? '#111827' : '#9CA3AF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: prevUnit ? 'pointer' : 'not-allowed',
                opacity: prevUnit ? 1 : 0.5,
              }}
            >
              <ArrowLeft size={14} />
              <span>{prevUnit ? `Unit ${prevUnit.unitNum}: Previous Unit` : 'Previous Unit'}</span>
            </button>

            <button
              type="button"
              disabled={!nextUnit}
              onClick={() => nextUnit && handleUnitSelect(nextUnit)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                background: nextUnit ? 'linear-gradient(135deg, #FDBA12, #F97316)' : '#E5E7EB',
                color: nextUnit ? '#FFFFFF' : '#9CA3AF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: nextUnit ? 'pointer' : 'not-allowed',
                boxShadow: nextUnit ? '0 4px 14px rgba(249, 115, 22, 0.35)' : 'none',
              }}
            >
              <span>{nextUnit ? `Unit ${nextUnit.unitNum}: Next Unit` : 'Next Unit'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </main>
      </div>

      {/* ── Floating Ask Campus AI Assistant ── */}
      <AIAssistant
        variant="pill"
        contextTitle={`${subject?.name || 'Subject'} Unit ${activeUnit?.unitNum || 1} — ${cleanTitle}`}
        contextPrompts={[
          `Explain ${cleanTitle}`,
          `What should I study first in Unit ${activeUnit?.unitNum || 1}?`,
          `Give me important exam questions for ${cleanTitle}`,
          `Explain relational algebra and SQL queries`,
          `Create a quick revision plan for this unit`,
        ]}
      />

      {/* ── Resource Preview Modal (for PDF/Video) ── */}
      <AnimatePresence>
        {previewModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setPreviewModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '600px',
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: previewModal.type === 'video' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: previewModal.type === 'video' ? '#2563EB' : '#EF4444',
                  }}
                >
                  {previewModal.type === 'video' ? <Video size={22} /> : <FileText size={22} />}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: 0, color: '#111827' }}>
                    {previewModal.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>
                    {previewModal.type === 'video' ? 'Interactive Video Player' : 'Digital Classroom Reference PDF'}
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                  This official academic resource is hosted on Campus Connect's verified document server.
                  <br />
                  Source: <code>{previewModal.url}</code>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    background: '#FFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <a
                  href={previewModal.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 22px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                  }}
                >
                  <span>Open Full Resource</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}