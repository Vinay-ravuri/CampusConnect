import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Target,
  Code,
  Layers,
  Database,
  Terminal,
  Cpu,
  Globe,
  Award,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Flame,
  Check,
  Zap,
  Star,
  Compass,
  FileCode,
  TrendingUp,
  X,
  ExternalLink,
  Lock,
  Unlock,
  Building2,
  GraduationCap,
  ShieldCheck,
  Play
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import LoginModal from '../components/LoginModal'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import api from '../api/axios'

/* ─── 7-STAGE PLACEMENT JOURNEY BLUEPRINT ──────────────────── */
const ROADMAP_STAGES = [
  { id: 'ALL', label: 'All Stages', icon: '🌟' },
  { id: 'FOUNDATION', label: '1. Foundation', icon: '🌱', desc: 'Programming & Aptitude Basics' },
  { id: 'CORE_CS', label: '2. Core CS', icon: '🧱', desc: 'OOP, DBMS, SQL, OS, CN' },
  { id: 'DSA', label: '3. DSA', icon: '📊', desc: 'Algorithms & Coding Patterns' },
  { id: 'DEVELOPMENT', label: '4. Development', icon: '🚀', desc: 'Spring Boot, APIs & React' },
  { id: 'PRACTICE', label: '5. Practice', icon: '⚡', desc: 'Coding & Query Arena' },
  { id: 'INTERVIEW', label: '6. Interview', icon: '🎯', desc: 'Technical & STAR Behavioral' },
  { id: 'COMPANY_PREP', label: '7. Company Prep', icon: '🏢', desc: 'Company Patterns & PYQs' },
]

/* ─── CATEGORY FILTER CHIPS ────────────────────────────────── */
const CATEGORIES = [
  { id: 'ALL', label: 'All Tracks', icon: '🎯' },
  { id: 'DSA', label: 'DSA Masterclass', icon: '📊' },
  { id: 'CORE_CS', label: 'Core CS (DBMS/SQL/OS)', icon: '🧱' },
  { id: 'DEV', label: 'Development & APIs', icon: '🚀' },
  { id: 'APTITUDE', label: 'Aptitude & Reasoning', icon: '🧮' },
  { id: 'INTERVIEW', label: 'Interview & HR', icon: '💼' },
]

/* ─── TOP RECRUITERS BLUEPRINTS ────────────────────────────── */
const RECRUITERS = [
  {
    id: 'tcs',
    name: 'TCS Digital & Ninja',
    logo: '🔷',
    color: '#1A5276',
    lightColor: '#EAF2F8',
    rounds: ['NQT Aptitude (Quant + Verbal + Reasoning)', 'Advanced Coding (C/Java/Python)', 'Technical Interview (OOP + DBMS)', 'HR Round'],
    focus: 'C Language Fundamentals, Time & Work, Normalization, SQL Joins',
    tip: 'TCS NQT values high accuracy in quantitative aptitude and clean standard I/O in coding rounds.',
  },
  {
    id: 'google',
    name: 'Google',
    logo: '🔴',
    color: '#EA4335',
    lightColor: '#FDECEA',
    rounds: ['Online Coding Assessment', 'Technical Screening Phone Interview', '3–4 Algorithmic Technical Rounds', 'Googleyness & Leadership'],
    focus: 'Graph BFS/DFS, Dynamic Programming, Time Complexity Optimization',
    tip: 'Google interviewers evaluate thought process, edge cases, and code modularity rather than just the final answer.',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '🟠',
    color: '#D97706',
    lightColor: '#FEF3C7',
    rounds: ['Online Assessment (Coding + Work Styles)', 'Technical Round 1 (DSA + Tree/Graph)', 'Technical Round 2 (OOP + DBMS/System Design)', 'Bar Raiser (STAR Leadership Principles)'],
    focus: 'Trees, Heaps, Sliding Window, Amazon 16 Leadership Principles',
    tip: 'Prepare 2 real-world project stories for every Amazon Leadership Principle using the STAR technique.',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🟦',
    color: '#0078D4',
    lightColor: '#E6F2FB',
    rounds: ['Online Coding Challenge', 'Round 1: Problem Solving & Pointers', 'Round 2: OS Internals & DBMS Queries', 'Hiring Manager Round'],
    focus: 'Linked Lists, Binary Trees, Concurrency & Virtual Memory, SQL Subqueries',
    tip: 'Microsoft questions frequently test low-level data structure manipulation and operating system memory concepts.',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: '💳',
    color: '#072654',
    lightColor: '#EBF0F7',
    rounds: ['Machine Coding Round (Clean Architecture)', 'System Design / Low Level Design (LLD)', 'Database Design & SQL Deep-Dive', 'Culture Fit / Founder Round'],
    focus: 'Java Spring Boot, REST APIs, Database Transactions & ACID, Indexing',
    tip: 'Focus on writing object-oriented, testable code adhering to SOLID principles in the machine coding round.',
  },
  {
    id: 'infosys',
    name: 'Infosys (DSE & SP)',
    logo: '🟢',
    color: '#0284C7',
    lightColor: '#E0F2FE',
    rounds: ['InfyTQ / HackWithInfy Screening', 'Advanced Technical Round', 'HR Round'],
    focus: 'Java Collections, DBMS Normalization, Aptitude Speed, Basic DP',
    tip: 'Qualifying HackWithInfy opens direct interview slots for Specialist Programmer (SP - 9.5 LPA) roles.',
  },
]

export default function PlacementPortal() {
  const { isLoggedIn, user } = useAuth()
  const { showToast } = useToast()

  // State
  const [tracks, setTracks] = useState([])
  const [practiceQuestions, setPracticeQuestions] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(true)
  const [loadingPractice, setLoadingPractice] = useState(true)
  const [activeStage, setActiveStage] = useState('ALL')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Practice filter state
  const [practiceCategory, setPracticeCategory] = useState('ALL')
  const [practiceDifficulty, setPracticeDifficulty] = useState('ALL')
  const [expandedQuestionId, setExpandedQuestionId] = useState(null)

  // Track Deep-Dive Modal State
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [loadingTrackDetail, setLoadingTrackDetail] = useState(false)
  const [trackDetailData, setTrackDetailData] = useState(null)

  // User Progress state
  const [userProgress, setUserProgress] = useState({
    completedTopicIds: new Set(),
    readinessScore: 0,
    totalCompleted: 0,
    totalTopics: 0,
    trackProgress: {},
  })
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Initial Data Fetch
  useEffect(() => {
    fetchTracks()
    fetchPracticeQuestions()
    if (isLoggedIn) {
      fetchUserProgress()
    }
  }, [isLoggedIn])

  // Fetch Tracks Summary
  const fetchTracks = async () => {
    setLoadingTracks(true)
    try {
      const res = await api.get('/public/placement/tracks')
      if (Array.isArray(res.data) && res.data.length > 0) {
        setTracks(res.data)
      } else {
        // Fallback placeholder if database is initializing
        setTracks([])
      }
    } catch (err) {
      console.warn('Failed to load placement tracks from backend:', err)
    } finally {
      setLoadingTracks(false)
    }
  }

  // Fetch Practice Questions
  const fetchPracticeQuestions = async () => {
    setLoadingPractice(true)
    try {
      const res = await api.get('/public/placement/practice')
      if (Array.isArray(res.data)) {
        setPracticeQuestions(res.data)
      }
    } catch (err) {
      console.warn('Failed to load practice questions:', err)
    } finally {
      setLoadingPractice(false)
    }
  }

  // Fetch Authenticated Progress
  const fetchUserProgress = async () => {
    try {
      const res = await api.get('/placement/progress')
      if (res.data) {
        setUserProgress({
          completedTopicIds: new Set(res.data.completedTopicIds || []),
          readinessScore: res.data.readinessScore || 0,
          totalCompleted: res.data.totalCompleted || 0,
          totalTopics: res.data.totalTopics || 0,
          trackProgress: res.data.trackProgress || {},
        })
      }
    } catch (err) {
      console.warn('Unable to fetch authenticated placement progress:', err)
    }
  }

  // Open Track Detail Modal
  const handleOpenTrack = async (track) => {
    setSelectedTrack(track)
    setLoadingTrackDetail(true)
    try {
      const res = await api.get(`/public/placement/tracks/${track.slug}`)
      setTrackDetailData(res.data)
    } catch (err) {
      console.error('Failed to load track details:', err)
      showToast('Unable to load track syllabus tree.', 'error')
    } finally {
      setLoadingTrackDetail(false)
    }
  }

  // Toggle Topic Completion
  const handleToggleTopic = async (topicId, trackSlug) => {
    if (!isLoggedIn) {
      // Guest local simulation with prompt
      setUserProgress((prev) => {
        const nextSet = new Set(prev.completedTopicIds)
        if (nextSet.has(topicId)) {
          nextSet.delete(topicId)
          showToast('Topic marked incomplete.', 'info')
        } else {
          nextSet.add(topicId)
          showToast('Topic completed! Sign in to permanently save your placement readiness.', 'success')
        }
        const total = prev.totalTopics || 40
        const completed = nextSet.size
        const score = Math.round((completed / total) * 100)
        return {
          ...prev,
          completedTopicIds: nextSet,
          totalCompleted: completed,
          readinessScore: Math.min(score, 100),
        }
      })
      return
    }

    try {
      const res = await api.post('/placement/progress', {
        trackSlug: trackSlug,
        topicId: topicId,
      })
      if (res.data) {
        setUserProgress((prev) => {
          const nextSet = new Set(prev.completedTopicIds)
          if (res.data.completed) {
            nextSet.add(topicId)
            showToast('Progress saved to your profile!', 'success')
          } else {
            nextSet.delete(topicId)
            showToast('Topic marked incomplete.', 'info')
          }
          return {
            ...prev,
            completedTopicIds: nextSet,
          }
        })
        fetchUserProgress() // Sync recalculated score from server
      }
    } catch (err) {
      console.error('Failed to update progress on server:', err)
      showToast('Failed to save progress to server.', 'error')
    }
  }

  // Filtered Tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      const matchesStage = activeStage === 'ALL' || t.stage === activeStage
      const matchesCategory = activeCategory === 'ALL' || t.category === activeCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        t.title?.toLowerCase().includes(query) ||
        t.subtitle?.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      return matchesStage && matchesCategory && matchesSearch
    })
  }, [tracks, activeStage, activeCategory, searchQuery])

  // Filtered Practice Questions
  const filteredPractice = useMemo(() => {
    return practiceQuestions.filter((q) => {
      const matchesCat = practiceCategory === 'ALL' || q.category === practiceCategory
      const matchesDiff = practiceDifficulty === 'ALL' || q.difficulty === practiceDifficulty
      return matchesCat && matchesDiff
    })
  }, [practiceQuestions, practiceCategory, practiceDifficulty])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#FFF9F0',
        color: '#111827',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
        overflowX: 'hidden',
      }}
    >
      {/* ── Atmospheric Warm Radial Glows ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10%',
          right: '-5%',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(253, 186, 18, 0.16) 0%, rgba(249, 115, 22, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '10%',
          left: '-5%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.10) 0%, rgba(244, 81, 30, 0.04) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Soft Grid Pattern Texture ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(249, 115, 22, 0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Campus Connect Light Navbar ── */}
      <Navbar isDark={false} />

      {/* ── Main Layout Container ── */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '100px clamp(16px, 3.5vw, 40px) 80px',
        }}
      >
        {/* ── Breadcrumb Navigation ── */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontFamily: 'var(--font-heading, "Space Grotesk")',
            color: '#6B7280',
            marginBottom: '24px',
          }}
        >
          <Link
            to="/welcome"
            style={{
              color: '#4B5563',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Home</span>
          </Link>
          <ChevronRight size={13} style={{ color: '#9CA3AF' }} />
          <span style={{ color: '#F97316', fontWeight: 700 }}>Placement Preparation</span>
        </nav>

        {/* ─── 1. PAGE 6 HERO SECTION ───────────────────────── */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(249, 115, 22, 0.18)',
            borderRadius: '28px',
            padding: 'clamp(24px, 4vw, 44px)',
            boxShadow: '0 16px 40px rgba(17, 24, 39, 0.05)',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Accent Gradient Bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #FDBA12, #F97316, #F4511E)',
            }}
          />

          {/* Left: Heading & Value Proposition */}
          <div style={{ flex: '1 1 540px', minWidth: '300px' }}>
            {/* Eyebrow Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '100px',
                background: 'rgba(249, 115, 22, 0.12)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                color: '#EA580C',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading)',
                marginBottom: '14px',
              }}
            >
              <Sparkles size={13} style={{ color: '#F97316' }} />
              <span>CAMPUS CONNECT CAREER ACCELERATOR</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk")',
                fontSize: 'clamp(32px, 3.8vw, 46px)',
                fontWeight: 900,
                color: '#111827',
                lineHeight: 1.12,
                letterSpacing: '-0.025em',
                margin: '0 0 14px 0',
              }}
            >
              Placement Preparation
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #F4511E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Get Interview Ready.
              </span>
            </h1>

            <p
              style={{
                fontSize: '15.5px',
                color: '#4B5563',
                lineHeight: 1.6,
                maxWidth: '560px',
                margin: '0 0 24px 0',
              }}
            >
              Master the exact interview patterns tested by top tech companies. From fundamental
              problem solving and DSA to Core CS (DBMS, SQL, OS) and behavioral HR rounds.
            </p>

            {/* Visual Progression Journey Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                background: 'rgba(255, 249, 240, 0.9)',
                border: '1px solid rgba(249, 115, 22, 0.20)',
                padding: '10px 16px',
                borderRadius: '16px',
                width: 'fit-content',
              }}
            >
              {['LEARN', 'PRACTICE', 'MEASURE', 'IMPROVE', 'APPLY', 'GET HIRED'].map((step, idx) => (
                <div key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      color: idx === 5 ? '#10B981' : '#F97316',
                    }}
                  >
                    {step}
                  </span>
                  {idx < 5 && <span style={{ color: '#D1D5DB', fontSize: '11px' }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Editorial Career Illustration */}
          <div
            style={{
              flex: '1 1 380px',
              maxWidth: '460px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                borderRadius: '22px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #FFFDF8, #FEF3C7)',
                border: '1px solid rgba(249, 115, 22, 0.22)',
                boxShadow: '0 12px 30px rgba(249, 115, 22, 0.12)',
              }}
            >
              <img
                src="/assets/illustrations/card_placement_growth.jpg"
                alt="Student career growth and interview placement preparation"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Handwritten Style Floating Note */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  boxShadow: '0 4px 12px rgba(17, 24, 39, 0.08)',
                  transform: 'rotate(2deg)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Caveat, cursive, sans-serif',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#EA580C',
                  }}
                >
                  Dream Big. Prepare Smart. ✍
                </span>
              </div>

              {/* Bottom Badge Overlays */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(17, 24, 39, 0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <ShieldCheck size={13} style={{ color: '#10B981' }} />
                  <span>Verified Curriculum</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ─── 2. PLACEMENT READINESS DASHBOARD ─────────────── */}
        <section
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(249, 115, 22, 0.16)',
            padding: '28px clamp(18px, 3vw, 32px)',
            marginBottom: '40px',
            boxShadow: '0 8px 28px rgba(17, 24, 39, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(253, 186, 18, 0.2), rgba(249, 115, 22, 0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F97316',
                }}
              >
                <TrendingUp size={22} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#111827',
                    margin: 0,
                  }}
                >
                  Placement Readiness Score
                </h2>
                <div style={{ fontSize: '12.5px', color: '#6B7280', marginTop: '2px' }}>
                  {isLoggedIn
                    ? `Logged in as ${user?.email || 'Student'} • Synced with your academic profile`
                    : 'Track your preparation progress across DSA, Core CS, and Aptitude'}
                </div>
              </div>
            </div>

            {/* Score & Completed Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '28px',
                    fontWeight: 900,
                    color: userProgress.readinessScore > 0 ? '#10B981' : '#F97316',
                    lineHeight: 1,
                  }}
                >
                  {userProgress.readinessScore}%
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, marginTop: '4px' }}>
                  {userProgress.totalCompleted} of {userProgress.totalTopics || 32} Topics Completed
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '10px',
              background: 'rgba(17, 24, 39, 0.06)',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(userProgress.readinessScore, 2)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background:
                  userProgress.readinessScore > 50
                    ? 'linear-gradient(90deg, #10B981, #059669)'
                    : 'linear-gradient(90deg, #FDBA12, #F97316)',
                borderRadius: '9999px',
              }}
            />
          </div>

          {/* Onboarding State or Key Metrics Breakdown */}
          {userProgress.totalCompleted === 0 ? (
            <div
              style={{
                background: 'rgba(255, 249, 240, 0.75)',
                border: '1px dashed rgba(249, 115, 22, 0.35)',
                borderRadius: '16px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>🚀</span>
                <span style={{ fontSize: '13.5px', color: '#4B5563', fontWeight: 500 }}>
                  Start your preparation to build your readiness score. Pick a foundational track below to begin!
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const dsaTrack = tracks.find((t) => t.slug === 'dsa') || tracks[0]
                  if (dsaTrack) handleOpenTrack(dsaTrack)
                }}
                style={{
                  background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '7px 16px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Begin Recommended Track →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12.5px', color: '#4B5563' }}>
              <div>
                <strong>Next Step:</strong> Complete remaining Core CS modules in DBMS & SQL to increase score by +15%.
              </div>
            </div>
          )}
        </section>

        {/* ─── 3. PLACEMENT ROADMAP STAGES STRIP ────────────── */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk")',
                fontSize: '22px',
                fontWeight: 800,
                color: '#111827',
                margin: 0,
              }}
            >
              Structured Learning Roadmap
            </h2>
            <span style={{ fontSize: '12.5px', color: '#6B7280', fontWeight: 500 }}>
              Step-by-step preparation order
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'thin',
            }}
          >
            {ROADMAP_STAGES.map((stage) => {
              const active = activeStage === stage.id
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '14px',
                    border: active ? '1px solid #F97316' : '1px solid rgba(17, 24, 39, 0.08)',
                    background: active
                      ? 'linear-gradient(135deg, #FFF7ED, #FFEDD5)'
                      : 'rgba(255, 255, 255, 0.85)',
                    color: active ? '#EA580C' : '#4B5563',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 4px 14px rgba(249, 115, 22, 0.15)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{stage.icon}</span>
                  <span>{stage.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ─── 4. SEARCH & CATEGORY FILTER ──────────────────── */}
        <section style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: '1 1 320px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '8px 16px',
                border: '1px solid rgba(249, 115, 22, 0.22)',
                boxShadow: '0 4px 16px rgba(17, 24, 39, 0.03)',
              }}
            >
              <Search size={18} style={{ color: '#9CA3AF' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, topics (e.g. DSA, DBMS, Normalization, SQL)..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  color: '#111827',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: active ? '1px solid #F97316' : '1px solid rgba(17, 24, 39, 0.06)',
                      background: active ? '#F97316' : 'rgba(255, 255, 255, 0.85)',
                      color: active ? '#FFFFFF' : '#4B5563',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── 5. LEARNING TRACKS GRID ──────────────────────── */}
        <section style={{ marginBottom: '48px' }}>
          {loadingTracks && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    height: '240px',
                    borderRadius: '22px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(249, 115, 22, 0.1)',
                  }}
                />
              ))}
            </div>
          )}

          {!loadingTracks && filteredTracks.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'rgba(255, 255, 255, 0.85)',
                borderRadius: '20px',
                border: '1px solid rgba(249, 115, 22, 0.15)',
              }}
            >
              <HelpCircle size={36} style={{ color: '#F97316', marginBottom: '10px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>No tracks found</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                Try adjusting your search query or switching the category filter.
              </p>
            </div>
          )}

          {!loadingTracks && filteredTracks.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredTracks.map((track, idx) => {
                const trackProg = userProgress.trackProgress[track.slug]
                const completedPct = trackProg?.percentage || 0

                return (
                  <motion.article
                    key={track.id || track.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    whileHover={{ y: -5 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.90)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '22px',
                      border: '1px solid rgba(249, 115, 22, 0.16)',
                      borderTop: `4px solid ${track.color || '#F97316'}`,
                      padding: '24px',
                      boxShadow: '0 8px 24px rgba(17, 24, 39, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    <div>
                      {/* Top Row: Icon + Difficulty Badge */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '14px',
                        }}
                      >
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: track.lightColor || '#FFF7ED',
                            border: `1px solid ${track.color || '#F97316'}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                          }}
                        >
                          {track.icon || '📚'}
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            background: 'rgba(17, 24, 39, 0.05)',
                            color: '#4B5563',
                          }}
                        >
                          {track.difficulty || 'Intermediate'}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading, "Space Grotesk")',
                          fontSize: '19px',
                          fontWeight: 800,
                          color: '#111827',
                          margin: '0 0 6px 0',
                          lineHeight: 1.25,
                        }}
                      >
                        {track.title}
                      </h3>

                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: track.color || '#EA580C',
                          marginBottom: '10px',
                        }}
                      >
                        {track.subtitle}
                      </div>

                      <p
                        style={{
                          fontSize: '13px',
                          color: '#4B5563',
                          lineHeight: 1.55,
                          margin: '0 0 16px 0',
                        }}
                      >
                        {track.description}
                      </p>

                      {/* Target Companies */}
                      {track.targetCompanies && track.targetCompanies.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            marginBottom: '18px',
                          }}
                        >
                          {track.targetCompanies.map((c) => (
                            <span
                              key={c}
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: 'rgba(17, 24, 39, 0.04)',
                                color: '#374151',
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Metadata & CTA */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: '#6B7280',
                          fontWeight: 600,
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(17, 24, 39, 0.06)',
                          marginBottom: '14px',
                        }}
                      >
                        <span>⏱ {track.estimatedHours || '30 hrs'}</span>
                        <span>📑 {track.moduleCount || 3} Modules • {track.topicCount || 8} Topics</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenTrack(track)}
                        style={{
                          width: '100%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '10px 18px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                          color: '#FFFFFF',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(249, 115, 22, 0.25)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span>{completedPct > 0 ? `Continue Track (${completedPct}%)` : 'Start Learning Track'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </section>

        {/* ─── 6. PRACTICE ARENA ────────────────────────────── */}
        <section
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            border: '1px solid rgba(249, 115, 22, 0.16)',
            padding: 'clamp(22px, 3.5vw, 36px)',
            marginBottom: '48px',
            boxShadow: '0 12px 36px rgba(17, 24, 39, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#EA580C',
                  marginBottom: '4px',
                }}
              >
                <Zap size={14} />
                <span>INTERVIEW PRACTICE ARENA</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk")',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#111827',
                  margin: 0,
                }}
              >
                Practical Coding & Query Challenges
              </h2>
            </div>

            {/* Practice Category Filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All Challenges' },
                { id: 'CODING', label: 'Coding' },
                { id: 'SQL', label: 'SQL Queries' },
                { id: 'CORE_CS', label: 'Core CS' },
                { id: 'APTITUDE', label: 'Aptitude' },
              ].map((pCat) => {
                const active = practiceCategory === pCat.id
                return (
                  <button
                    key={pCat.id}
                    type="button"
                    onClick={() => setPracticeCategory(pCat.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: active ? '1px solid #F97316' : '1px solid rgba(17, 24, 39, 0.08)',
                      background: active ? '#F97316' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#4B5563',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {pCat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Question Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredPractice.map((q) => {
              const isExpanded = expandedQuestionId === q.id
              const isSQL = q.category === 'SQL'
              const isCoding = q.category === 'CODING'

              return (
                <div
                  key={q.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(249, 115, 22, 0.12)',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '12px',
                      background: isExpanded ? 'rgba(255, 249, 240, 0.5)' : '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background:
                            q.difficulty === 'Easy'
                              ? '#ECFDF5'
                              : q.difficulty === 'Hard'
                              ? '#FEF2F2'
                              : '#FFFBEB',
                          color:
                            q.difficulty === 'Easy'
                              ? '#059669'
                              : q.difficulty === 'Hard'
                              ? '#DC2626'
                              : '#D97706',
                        }}
                      >
                        {q.difficulty}
                      </span>

                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '15.5px',
                          fontWeight: 700,
                          color: '#111827',
                        }}
                      >
                        {q.title}
                      </span>

                      {/* Company Tags */}
                      {q.companies && q.companies.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: 'rgba(17, 24, 39, 0.05)',
                            color: '#4B5563',
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#F97316', fontWeight: 600 }}>
                        {isExpanded ? 'Hide Solution' : 'View Approach'}
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          color: '#F97316',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Expanded Solution Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          padding: '0 20px 20px',
                          borderTop: '1px solid rgba(17, 24, 39, 0.06)',
                          background: 'rgba(255, 249, 240, 0.3)',
                        }}
                      >
                        <div style={{ paddingTop: '16px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#374151', margin: '0 0 6px 0' }}>
                            Problem Description:
                          </h4>
                          <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                            {q.description}
                          </p>

                          {q.sampleInput && (
                            <div
                              style={{
                                background: '#111827',
                                color: '#E5E7EB',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                fontFamily: 'Consolas, monospace',
                                fontSize: '12.5px',
                                marginBottom: '14px',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              <div style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}>SAMPLE INPUT / OUTPUT:</div>
                              <div>{q.sampleInput}</div>
                              <div style={{ color: '#10B981', marginTop: '6px' }}>{q.sampleOutput}</div>
                            </div>
                          )}

                          <div
                            style={{
                              background: 'rgba(254, 243, 199, 0.6)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              padding: '12px 16px',
                              borderRadius: '10px',
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400E', marginBottom: '4px' }}>
                              💡 RECOMMENDED INTERVIEW APPROACH & SOLUTION NOTES:
                            </div>
                            <div style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.55 }}>
                              {q.solutionNotes}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── 7. TOP RECRUITERS COMPANY BLUEPRINTS ─────────── */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#EA580C',
                marginBottom: '4px',
              }}
            >
              <Building2 size={14} />
              <span>COMPANY SPECIFIC PATTERNS</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk")',
                fontSize: '24px',
                fontWeight: 800,
                color: '#111827',
                margin: 0,
              }}
            >
              Target Recruiter Blueprints
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '20px',
            }}
          >
            {RECRUITERS.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(249, 115, 22, 0.14)',
                  padding: '22px',
                  boxShadow: '0 6px 20px rgba(17, 24, 39, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '24px' }}>{rec.logo}</span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#111827',
                        margin: 0,
                      }}
                    >
                      {rec.name}
                    </h3>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Interview Rounds:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#4B5563', lineHeight: 1.6 }}>
                      {rec.rounds.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 249, 240, 0.8)',
                      border: '1px solid rgba(249, 115, 22, 0.2)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      fontSize: '12px',
                      color: '#4B5563',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                    }}
                  >
                    <strong style={{ color: '#EA580C' }}>Key Focus:</strong> {rec.focus}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '11.5px',
                    color: '#6B7280',
                    borderTop: '1px solid rgba(17, 24, 39, 0.06)',
                    paddingTop: '10px',
                  }}
                >
                  💡 <em>{rec.tip}</em>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── 8. TRACK DEEP-DIVE MODAL / SYLLABUS EXPLORER ─── */}
      <AnimatePresence>
        {selectedTrack && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrack(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(17, 24, 39, 0.65)',
                backdropFilter: 'blur(8px)',
              }}
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '780px',
                maxHeight: '85vh',
                background: '#FFFFFF',
                borderRadius: '24px',
                boxShadow: '0 25px 60px rgba(17, 24, 39, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 1,
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '22px 28px',
                  background: 'linear-gradient(135deg, #FFFDF8, #FFF7ED)',
                  borderBottom: '1px solid rgba(249, 115, 22, 0.16)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: selectedTrack.lightColor || '#FFF7ED',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    {selectedTrack.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading, "Space Grotesk")',
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#111827',
                        margin: 0,
                      }}
                    >
                      {selectedTrack.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#EA580C', fontWeight: 600 }}>
                      {selectedTrack.subtitle}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTrack(null)}
                  style={{
                    background: 'rgba(17, 24, 39, 0.05)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6B7280',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body: Syllabus Tree */}
              <div
                style={{
                  padding: '24px 28px',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {loadingTrackDetail && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
                    Loading track modules & topics...
                  </div>
                )}

                {!loadingTrackDetail && trackDetailData && (
                  <div>
                    <p style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: 1.6, marginBottom: '22px' }}>
                      {trackDetailData.description}
                    </p>

                    {trackDetailData.modules && trackDetailData.modules.map((m, mIdx) => (
                      <div
                        key={m.id || mIdx}
                        style={{
                          marginBottom: '20px',
                          border: '1px solid rgba(249, 115, 22, 0.14)',
                          borderRadius: '16px',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Module Header */}
                        <div
                          style={{
                            background: 'rgba(255, 249, 240, 0.8)',
                            padding: '12px 18px',
                            borderBottom: '1px solid rgba(249, 115, 22, 0.10)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#EA580C' }}>
                              MODULE {mIdx + 1}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                              {m.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#6B7280' }}>
                            {m.topics?.length || 0} Topics
                          </span>
                        </div>

                        {/* Topics List */}
                        <div style={{ padding: '8px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {m.topics && m.topics.map((topic) => {
                            const isCompleted = userProgress.completedTopicIds.has(topic.id)
                            return (
                              <div
                                key={topic.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 0',
                                  borderBottom: '1px solid rgba(17, 24, 39, 0.04)',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleTopic(topic.id, trackDetailData.slug)}
                                    style={{
                                      background: isCompleted ? '#10B981' : 'transparent',
                                      border: isCompleted ? '1px solid #10B981' : '2px solid #D1D5DB',
                                      borderRadius: '6px',
                                      width: '20px',
                                      height: '20px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      color: '#FFFFFF',
                                      marginTop: '2px',
                                      flexShrink: 0,
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    {isCompleted && <Check size={13} />}
                                  </button>
                                  <div>
                                    <div
                                      style={{
                                        fontSize: '13.5px',
                                        fontWeight: 700,
                                        color: isCompleted ? '#6B7280' : '#111827',
                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                      }}
                                    >
                                      {topic.title}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                                      {topic.conceptSummary || topic.description}
                                    </div>
                                  </div>
                                </div>

                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    background:
                                      topic.difficulty === 'Easy'
                                        ? '#ECFDF5'
                                        : topic.difficulty === 'Hard'
                                        ? '#FEF2F2'
                                        : '#FFFBEB',
                                    color:
                                      topic.difficulty === 'Easy'
                                        ? '#059669'
                                        : topic.difficulty === 'Hard'
                                        ? '#DC2626'
                                        : '#D97706',
                                    flexShrink: 0,
                                  }}
                                >
                                  {topic.difficulty}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '16px 28px',
                  background: '#F9FAFB',
                  borderTop: '1px solid rgba(17, 24, 39, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  Click checkboxes to record your lesson progress.
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTrack(null)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#111827',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 9. CONTEXTUAL AI CAREER ASSISTANT ──────────────── */}
      <AIAssistant
        context="PLACEMENT_PREPARATION"
        customPrompts={[
          'Create a 30-day DSA study plan for me',
          'What DBMS topics are important for interviews?',
          'Give me top 5 SQL interview queries with solutions',
          'How should I prepare for a Java fresher interview?',
          'Explain OS deadlock conditions and prevention',
          'Review my placement preparation roadmap',
        ]}
      />

      {/* ── Login Modal if triggered ── */}
      <AnimatePresence>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </AnimatePresence>
    </div>
  )
}