import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Code,
  Layers,
  Database,
  Terminal,
  Cpu,
  Globe,
  Award,
  Sparkles,
  BookOpen,
  Monitor,
  Flame,
  Zap,
  Target,
  FileCheck,
  ChevronDown
} from 'lucide-react'

import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import LoginModal from '../components/LoginModal'
import CertificateModal from '../components/ui/CertificateModal'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import api from '../api/axios'

// Sub-components for Placement Platform
import PlacementSidebar, { SIDEBAR_ITEMS } from '../components/placement/PlacementSidebar'
import PlacementHero from '../components/placement/PlacementHero'
import PlacementSearchFilters from '../components/placement/PlacementSearchFilters'
import PopularTracks from '../components/placement/PopularTracks'
import CourseCard from '../components/placement/CourseCard'
import CourseDetailView from '../components/placement/CourseDetailView'
import LessonPlayerView from '../components/placement/LessonPlayerView'
import MyProgressView from '../components/placement/MyProgressView'
import CertificationsView from '../components/placement/CertificationsView'
import MockTestsView from '../components/placement/MockTestsView'

/* ─── BASE COURSE METADATA TEMPLATE MATCHING TARGET SCREENSHOT ─── */
const TARGET_COURSE_PRESETS = [
  {
    slug: 'prog-fund',
    matchKeywords: ['c programming', 'prog-fund', 'programming fundamentals', 'c'],
    title: 'C Programming Basics',
    description: 'Variables, Loops, Functions and Problem Solving',
    difficulty: 'Beginner',
    isCertified: false,
    rating: '4.8',
    reviewsCount: '2.1k',
    estimatedHours: '12 hrs',
    lessonCount: '60 Lessons',
    iconEmoji: '💻',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    category: 'DSA',
    defaultProgress: 30,
  },
  {
    slug: 'dsa',
    matchKeywords: ['data structures', 'dsa', 'algorithms'],
    title: 'Data Structures & Algorithms',
    description: 'Arrays, Linked Lists, Trees, Graphs and More',
    difficulty: 'Intermediate',
    isCertified: false,
    rating: '4.9',
    reviewsCount: '5.4k',
    estimatedHours: '40 hrs',
    lessonCount: '200 Lessons',
    iconEmoji: '📊',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    category: 'DSA',
    defaultProgress: 15,
  },
  {
    slug: 'dbms',
    matchKeywords: ['database', 'dbms'],
    title: 'Database Management Systems',
    description: 'SQL, Normalization, Indexing and Transactions',
    difficulty: 'Intermediate',
    isCertified: true,
    rating: '4.7',
    reviewsCount: '1.8k',
    estimatedHours: '25 hrs',
    lessonCount: '95 Lessons',
    iconEmoji: '🗄️',
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    category: 'CORE_CS',
    defaultProgress: 0,
  },
  {
    slug: 'dev',
    matchKeywords: ['web development', 'dev', 'full-stack', 'react'],
    title: 'Web Development Full Course',
    description: 'HTML, CSS, JavaScript, React and Node.js',
    difficulty: 'Advanced',
    isCertified: true,
    rating: '4.8',
    reviewsCount: '3.2k',
    estimatedHours: '50 hrs',
    lessonCount: '180 Lessons',
    iconEmoji: '🖥️',
    iconColor: '#EA580C',
    iconBg: '#FFF7ED',
    category: 'DEV',
    defaultProgress: 0,
  },
  {
    slug: 'os',
    matchKeywords: ['operating system', 'os'],
    title: 'Operating Systems',
    description: 'Processes, Threads, Memory Management and File Systems',
    difficulty: 'Intermediate',
    isCertified: false,
    rating: '4.7',
    reviewsCount: '1.6k',
    estimatedHours: '20 hrs',
    lessonCount: '75 Lessons',
    iconEmoji: '⚙️',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
    category: 'CORE_CS',
    defaultProgress: 0,
  },
  {
    slug: 'system-design',
    matchKeywords: ['system design', 'oop', 'architecture'],
    title: 'System Design',
    description: 'HLD, LLD, Scalability and Real-world Architecture',
    difficulty: 'Advanced',
    isCertified: false,
    rating: '4.9',
    reviewsCount: '2.8k',
    estimatedHours: '35 hrs',
    lessonCount: '90 Lessons',
    iconEmoji: '🧱',
    iconColor: '#E11D48',
    iconBg: '#FFF1F2',
    category: 'SYSTEM_DESIGN',
    defaultProgress: 0,
  },
  {
    slug: 'aptitude',
    matchKeywords: ['aptitude', 'reasoning', 'quantitative'],
    title: 'Aptitude & Logical Reasoning',
    description: 'Quantitative Aptitude, Logical Reasoning and Verbal Ability',
    difficulty: 'Beginner',
    isCertified: false,
    rating: '4.6',
    reviewsCount: '3.1k',
    estimatedHours: '30 hrs',
    lessonCount: '120 Lessons',
    iconEmoji: '❤️',
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
    category: 'APTITUDE',
    defaultProgress: 0,
  },
  {
    slug: 'interview-prep',
    matchKeywords: ['interview', 'interview-prep', 'hr', 'mock'],
    title: 'Mock Interviews',
    description: 'Company-wise questions, behavioral prep and technical drills',
    difficulty: 'Intermediate',
    isCertified: false,
    rating: '4.8',
    reviewsCount: '1.9k',
    estimatedHours: '15 hrs',
    lessonCount: '50 Lessons',
    iconEmoji: '🎯',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    category: 'INTERVIEW',
    defaultProgress: 0,
  },
  {
    slug: 'sql',
    matchKeywords: ['sql', 'query'],
    title: 'SQL Mastery & Practical Queries',
    description: 'From DDL/DML to Window Functions & CTEs',
    difficulty: 'Intermediate',
    isCertified: false,
    rating: '4.9',
    reviewsCount: '2.4k',
    estimatedHours: '40 hrs',
    lessonCount: '85 Lessons',
    iconEmoji: '⚡',
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
    category: 'CORE_CS',
    defaultProgress: 0,
  },
  {
    slug: 'cn',
    matchKeywords: ['network', 'cn', 'computer networks'],
    title: 'Computer Networks',
    description: 'OSI 7 Layers, TCP/IP, Sockets, DNS & Web Protocols',
    difficulty: 'Intermediate',
    isCertified: false,
    rating: '4.7',
    reviewsCount: '1.5k',
    estimatedHours: '30 hrs',
    lessonCount: '70 Lessons',
    iconEmoji: '🌐',
    iconColor: '#0284C7',
    iconBg: '#F0F9FF',
    category: 'CORE_CS',
    defaultProgress: 0,
  },
  {
    slug: 'python-mastery',
    matchKeywords: ['python', 'py', 'automation'],
    title: 'Python for Developers & Problem Solving',
    description: 'Data Structures, OOP, Generators, Automation & Scripting',
    difficulty: 'Beginner',
    isCertified: true,
    rating: '4.9',
    reviewsCount: '4.1k',
    estimatedHours: '35 hrs',
    lessonCount: '110 Lessons',
    iconEmoji: '🐍',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    category: 'DEV',
    defaultProgress: 0,
  },
  {
    slug: 'spring-microservices',
    matchKeywords: ['spring', 'spring boot', 'microservices', 'java'],
    title: 'Spring Boot & Microservices Architecture',
    description: 'REST APIs, JPA/Hibernate, Spring Security, JWT & Docker',
    difficulty: 'Advanced',
    isCertified: true,
    rating: '4.9',
    reviewsCount: '3.6k',
    estimatedHours: '45 hrs',
    lessonCount: '140 Lessons',
    iconEmoji: '🍃',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    category: 'DEV',
    defaultProgress: 0,
  },
  {
    slug: 'devops-docker',
    matchKeywords: ['devops', 'docker', 'kubernetes', 'ci/cd'],
    title: 'DevOps, Docker & Cloud Deployment',
    description: 'Containerization, Kubernetes, GitHub Actions & CI/CD Pipelines',
    difficulty: 'Intermediate',
    isCertified: true,
    rating: '4.8',
    reviewsCount: '2.3k',
    estimatedHours: '28 hrs',
    lessonCount: '80 Lessons',
    iconEmoji: '🐳',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    category: 'DEV',
    defaultProgress: 0,
  },
  {
    slug: 'ai-ml-basics',
    matchKeywords: ['ai', 'machine learning', 'genai', 'llm'],
    title: 'Generative AI & LLM Foundations',
    description: 'Prompt Engineering, LangChain, RAG Systems & Vector Databases',
    difficulty: 'Intermediate',
    isCertified: true,
    rating: '4.9',
    reviewsCount: '5.2k',
    estimatedHours: '32 hrs',
    lessonCount: '95 Lessons',
    iconEmoji: '🤖',
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    category: 'DEV',
    defaultProgress: 0,
  },
  {
    slug: 'cloud-aws',
    matchKeywords: ['cloud', 'aws', 'infrastructure'],
    title: 'AWS Cloud Architecture & Serverless',
    description: 'EC2, S3, Lambda, API Gateway, DynamoDB & VPC Setup',
    difficulty: 'Intermediate',
    isCertified: true,
    rating: '4.8',
    reviewsCount: '2.7k',
    estimatedHours: '30 hrs',
    lessonCount: '85 Lessons',
    iconEmoji: '☁️',
    iconColor: '#EA580C',
    iconBg: '#FFF7ED',
    category: 'SYSTEM_DESIGN',
    defaultProgress: 0,
  },
]

export default function PlacementPortal() {
  const { isLoggedIn, user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Navigation & Sub-View State
  const [activeSidebarItem, setActiveSidebarItem] = useState('all-courses')
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard' | 'course-detail' | 'lesson-player' | 'my-progress' | 'certifications' | 'mock-tests'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilterChip, setActiveFilterChip] = useState('ALL')
  const [sortBy, setSortBy] = useState('popular') // 'popular' | 'rating' | 'progress' | 'newest'

  // Backend Data State
  const [tracks, setTracks] = useState([])
  const [practiceQuestions, setPracticeQuestions] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(true)
  const [loadingPractice, setLoadingPractice] = useState(true)

  // Selected Course & Lesson Player State
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [trackDetailData, setTrackDetailData] = useState(null)
  const [loadingTrackDetail, setLoadingTrackDetail] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [currentModules, setCurrentModules] = useState([])

  // User Progress State
  const [userProgress, setUserProgress] = useState({
    completedTopicIds: new Set(),
    readinessScore: 35,
    totalCompleted: 12,
    totalTopics: 34,
    trackProgress: {},
  })

  // Bookmarks State (persisted in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_placement_bookmarks')
      return saved ? new Set(JSON.parse(saved)) : new Set(['prog-fund', 'dsa'])
    } catch {
      return new Set(['prog-fund', 'dsa'])
    }
  })

  // Modals
  const [certificateData, setCertificateData] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // ── Initial Data Fetch ──
  useEffect(() => {
    fetchTracks()
    fetchPracticeQuestions()
    if (isLoggedIn) {
      fetchUserProgress()
    }
  }, [isLoggedIn])

  const fetchTracks = async () => {
    setLoadingTracks(true)
    try {
      const res = await api.get('/public/placement/tracks')
      if (Array.isArray(res.data) && res.data.length > 0) {
        setTracks(res.data)
      } else {
        setTracks([])
      }
    } catch (err) {
      console.warn('Failed to load placement tracks from backend:', err)
    } finally {
      setLoadingTracks(false)
    }
  }

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

  const fetchUserProgress = async () => {
    try {
      const res = await api.get('/placement/progress')
      if (res.data) {
        setUserProgress({
          completedTopicIds: new Set(res.data.completedTopicIds || []),
          readinessScore: res.data.readinessScore || 35,
          totalCompleted: res.data.totalCompleted || 12,
          totalTopics: res.data.totalTopics || 34,
          trackProgress: res.data.trackProgress || {},
        })
      }
    } catch (err) {
      console.warn('Unable to fetch authenticated placement progress:', err)
    }
  }

  // ── Bookmark Toggle ──
  const handleToggleBookmark = (courseId) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) {
        next.delete(courseId)
        showToast('Removed from saved courses', 'info')
      } else {
        next.add(courseId)
        showToast('Course bookmarked for offline review', 'success')
      }
      try {
        localStorage.setItem('cc_placement_bookmarks', JSON.stringify(Array.from(next)))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  // ── Open Course Detail View ──
  const handleOpenCourse = async (course) => {
    setSelectedCourse(course)
    setActiveView('course-detail')
    setLoadingTrackDetail(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const slug = course.slug || 'dsa'
    try {
      const res = await api.get(`/public/placement/tracks/${slug}`)
      setTrackDetailData(res.data)
      setCurrentModules(res.data?.modules || [])
    } catch (err) {
      console.warn(`Unable to fetch /public/placement/tracks/${slug}, using fallback details:`, err)
      // Provide clean simulated module tree if backend slug doesn't match
      const generatedModules = [
        {
          id: 101,
          title: '01. Foundational Architecture & Core Blueprint',
          description: `Essential principles, language syntactical patterns, and time-space memory allocation for ${course.title}.`,
          topics: [
            { id: 1, title: `${course.title} — Blueprint & Mental Models`, description: 'Core principles tested in recruiter screening rounds and technical assessments.', practiceType: 'CONCEPT', difficulty: 'Easy', conceptSummary: `Foundational overview of ${course.title}. Covers the primary building blocks, operational flow, and mental models necessary to excel in technical assessments.` },
            { id: 2, title: 'Hands-on Implementation & Edge Cases', description: 'Interactive coding drill with edge case verification and boundary checks.', practiceType: 'CODING', difficulty: 'Medium', conceptSummary: 'Detailed practical implementation. We analyze boundary conditions, null checks, and memory footprint.' },
          ],
        },
        {
          id: 102,
          title: '02. Algorithmic Optimization & Trade-offs',
          description: 'Transforming naive brute force approaches into production-grade optimal solutions.',
          topics: [
            { id: 3, title: 'Time & Space Complexity Optimization', description: 'Transforming brute force O(N²) to optimal O(N) or O(log N) algorithms.', practiceType: 'CODING', difficulty: 'Medium', conceptSummary: 'Techniques for profiling code execution and choosing the right auxiliary data structures to minimize runtime.' },
            { id: 4, title: 'Concurrency, Data Integrity & Scalability', description: 'Thread safety, atomic transactions, and distributed considerations.', practiceType: 'CONCEPT', difficulty: 'Hard', conceptSummary: 'Evaluating system behavior under heavy student traffic and high transaction concurrency.' },
          ],
        },
        {
          id: 103,
          title: '03. Real-world Industry Patterns & Case Studies',
          description: 'Production best practices, design patterns, and defensive programming.',
          topics: [
            { id: 5, title: 'Design Patterns & High-Scale Refactoring', description: 'Factory, Singleton, Repository, and Observer patterns applied in real code.', practiceType: 'CODING', difficulty: 'Hard', conceptSummary: 'Structuring code cleanly for long-term maintainability and modular decoupling.' },
            { id: 6, title: 'Enterprise Security & Performance Audits', description: 'Input sanitation, JWT validation, caching strategies, and indexing.', practiceType: 'CONCEPT', difficulty: 'Medium', conceptSummary: 'Preventing vulnerabilities and profiling bottle-necks before deploying to production.' },
          ],
        },
        {
          id: 104,
          title: '04. Campus Recruitment & FAANG Technical Screening',
          description: 'Company-specific recurring questions, live whiteboard drills, and STAR defense.',
          topics: [
            { id: 7, title: 'Live Coding Benchmark & Whiteboard Drill', description: 'Simulated 45-minute live coding challenge with automated test suites.', practiceType: 'CODING', difficulty: 'Hard', conceptSummary: 'Practicing effective communication while coding live under strict assessment time limits.' },
            { id: 8, title: 'Technical Interview Defense & STAR Discussion', description: 'Defending architectural decisions in 1-on-1 rounds with Senior Engineering Leads.', practiceType: 'CONCEPT', difficulty: 'Hard', conceptSummary: 'Structuring technical explanations using the STAR framework to convince hiring managers.' },
          ],
        },
      ]

      setTrackDetailData({
        ...course,
        modules: generatedModules,
      })
      setCurrentModules(generatedModules)
    } finally {
      setLoadingTrackDetail(false)
    }
  }

  // ── Open Lesson Player View ──
  const handleStartLesson = (topic, modules) => {
    setSelectedTopic(topic)
    if (modules && modules.length > 0) {
      setCurrentModules(modules)
    }
    setActiveView('lesson-player')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Toggle Topic Completion ──
  const handleToggleTopic = async (topicId, trackSlug) => {
    const slug = trackSlug || selectedCourse?.slug || 'dsa'
    if (!isLoggedIn) {
      // Local state toggle for guest
      setUserProgress((prev) => {
        const nextSet = new Set(prev.completedTopicIds)
        if (nextSet.has(topicId)) {
          nextSet.delete(topicId)
          showToast('Topic marked incomplete.', 'info')
        } else {
          nextSet.add(topicId)
          showToast('Topic marked complete! Sign in to permanently save your progress.', 'success')
        }
        const total = prev.totalTopics || 34
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
        trackSlug: slug,
        topicId: topicId,
      })
      if (res.data) {
        setUserProgress((prev) => {
          const nextSet = new Set(prev.completedTopicIds)
          if (res.data.completed) {
            nextSet.add(topicId)
            showToast('Progress saved to your verified profile!', 'success')
          } else {
            nextSet.delete(topicId)
            showToast('Topic marked incomplete.', 'info')
          }
          return {
            ...prev,
            completedTopicIds: nextSet,
          }
        })
        fetchUserProgress()
      }
    } catch (err) {
      console.error('Failed to update progress on server:', err)
      showToast('Failed to save progress to server.', 'error')
    }
  }

  // ── Handle Sidebar Selection ──
  const handleSelectSidebar = (itemId) => {
    setActiveSidebarItem(itemId)

    if (itemId === 'all-courses') {
      setActiveView('dashboard')
      setSearchQuery('')
      setActiveFilterChip('ALL')
    } else if (itemId === 'learning-paths') {
      setActiveView('dashboard')
      const tracksEl = document.getElementById('popular-tracks-section')
      if (tracksEl) tracksEl.scrollIntoView({ behavior: 'smooth' })
    } else if (itemId === 'my-progress') {
      setActiveView('my-progress')
    } else if (itemId === 'certifications') {
      setActiveView('certifications')
    } else if (itemId === 'mock-tests') {
      setActiveView('mock-tests')
    } else if (itemId === 'resume-builder') {
      navigate('/career')
    } else {
      // Category filter: DSA, Aptitude, Core CS, Web Dev, System Design, Interview
      const item = SIDEBAR_ITEMS.find((s) => s.id === itemId)
      setActiveView('dashboard')
      if (item?.category) {
        setActiveFilterChip(item.category)
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Merge Backend Tracks with Screenshot Presets ──
  const mergedCourses = useMemo(() => {
    // If backend provided tracks, map each to preset or create enriched card
    return TARGET_COURSE_PRESETS.map((preset) => {
      // Check if backend has a corresponding track
      const matchingBackend = tracks.find((t) => {
        const slug = (t.slug || '').toLowerCase()
        const title = (t.title || '').toLowerCase()
        return (
          slug === preset.slug ||
          preset.matchKeywords.some((kw) => slug.includes(kw) || title.includes(kw))
        )
      })

      if (matchingBackend) {
        return {
          ...preset,
          id: matchingBackend.id || preset.slug,
          slug: matchingBackend.slug || preset.slug,
          backendTrack: matchingBackend,
          estimatedHours: matchingBackend.estimatedHours || preset.estimatedHours,
          lessonCount: matchingBackend.topicCount
            ? `${matchingBackend.topicCount * 4} Lessons`
            : preset.lessonCount,
        }
      }

      return {
        ...preset,
        id: preset.slug,
      }
    })
  }, [tracks])

  // ── Filtered & Sorted Courses ──
  const displayedCourses = useMemo(() => {
    return mergedCourses
      .filter((course) => {
        // Chip Filter
        if (activeFilterChip !== 'ALL') {
          if (activeFilterChip === 'BEGINNER' && course.difficulty.toLowerCase() !== 'beginner') {
            return false
          }
          if (activeFilterChip === 'INTERMEDIATE' && course.difficulty.toLowerCase() !== 'intermediate') {
            return false
          }
          if (activeFilterChip === 'ADVANCED' && course.difficulty.toLowerCase() !== 'advanced') {
            return false
          }
          if (activeFilterChip === 'FREE' && course.isCertified) {
            return false
          }
          if (activeFilterChip === 'CERTIFIED' && !course.isCertified) {
            return false
          }
          if (['DSA', 'CORE_CS', 'DEV', 'APTITUDE', 'INTERVIEW', 'SYSTEM_DESIGN'].includes(activeFilterChip)) {
            if (course.category !== activeFilterChip) return false
          }
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const inTitle = course.title?.toLowerCase().includes(q)
          const inDesc = course.description?.toLowerCase().includes(q)
          const inCategory = course.category?.toLowerCase().includes(q)
          if (!inTitle && !inDesc && !inCategory) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating)
        if (sortBy === 'progress') {
          const pA = userProgress.trackProgress[a.slug]?.percentage || a.defaultProgress || 0
          const pB = userProgress.trackProgress[b.slug]?.percentage || b.defaultProgress || 0
          return pB - pA
        }
        return 0 // default 'popular' maintains curated order
      })
  }, [mergedCourses, activeFilterChip, searchQuery, sortBy, userProgress])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#FAFBF9',
        color: '#0F172A',
        fontFamily: 'Inter, sans-serif',
        overflowX: 'hidden',
      }}
    >
      {/* ── Atmospheric Emerald Radial Background Glows ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-15%',
          right: '-5%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, rgba(5, 150, 105, 0.02) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '-10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Global CampusConnect Navbar ── */}
      <Navbar isDark={false} />

      {/* ── Main Layout Container (Sidebar + Content) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '92px clamp(14px, 2.5vw, 36px) 60px',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* ── Mobile Sidebar Toggle Button ── */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="placement-mobile-btn"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '20px',
            zIndex: 40,
            background: '#059669',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 18px',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Menu size={16} />
          <span>Menu</span>
        </button>

        {/* ── Placement Sidebar (Desktop + Mobile Drawer) ── */}
        <PlacementSidebar
          activeItem={activeSidebarItem}
          onSelectItem={handleSelectSidebar}
          completedTopicsCount={userProgress.totalCompleted || userProgress.completedTopicIds.size || 12}
          totalTopicsCount={userProgress.totalTopics || 34}
          readinessPercentage={userProgress.readinessScore || 35}
          onContinueLearning={() => {
            const firstIncomplete = mergedCourses[0]
            handleOpenCourse(firstIncomplete)
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* ── Main Content Area ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* VIEW 1: Course Detail Page */}
          {activeView === 'course-detail' && (
            <CourseDetailView
              course={selectedCourse}
              trackDetailData={trackDetailData}
              loading={loadingTrackDetail}
              completedTopicIds={userProgress.completedTopicIds}
              onBack={() => setActiveView('dashboard')}
              onStartLesson={handleStartLesson}
              onToggleTopic={handleToggleTopic}
              onViewCertificate={() => {
                setCertificateData({
                  trackTitle: selectedCourse?.title || 'Data Structures & Algorithms',
                  studentName: user?.name || 'Vinay Kumar',
                  date: 'October 2026',
                  credentialId: `CC-2026-${(selectedCourse?.slug || 'DSA').toUpperCase()}-9481`,
                })
              }}
            />
          )}

          {/* VIEW 2: Lesson Learning Player */}
          {activeView === 'lesson-player' && (
            <LessonPlayerView
              course={selectedCourse}
              topic={selectedTopic}
              modules={currentModules}
              completedTopicIds={userProgress.completedTopicIds}
              onBackToCourse={() => setActiveView('course-detail')}
              onSelectTopic={(t) => setSelectedTopic(t)}
              onToggleCompletion={(tId) => handleToggleTopic(tId, selectedCourse?.slug)}
              onCompleteCourse={() => {
                setCertificateData({
                  trackTitle: selectedCourse?.title || 'Course Mastery',
                  studentName: user?.name || 'Vinay Kumar',
                  date: 'October 2026',
                  credentialId: `CC-2026-${(selectedCourse?.slug || 'CERT').toUpperCase()}-9481`,
                })
              }}
            />
          )}

          {/* VIEW 3: My Progress Page */}
          {activeView === 'my-progress' && (
            <MyProgressView
              readinessScore={userProgress.readinessScore}
              completedTopicsCount={userProgress.totalCompleted}
              totalTopicsCount={userProgress.totalTopics}
              tracks={mergedCourses}
              completedTopicIds={userProgress.completedTopicIds}
              onSelectTrack={handleOpenCourse}
              onViewCertificates={() => setActiveView('certifications')}
            />
          )}

          {/* VIEW 4: My Certifications Page */}
          {activeView === 'certifications' && (
            <CertificationsView
              tracks={mergedCourses}
              completedTopicIds={userProgress.completedTopicIds}
              userName={user?.name || 'Vinay Kumar'}
              onOpenCertificateModal={(data) => setCertificateData(data)}
            />
          )}

          {/* VIEW 5: Mock Tests / Practice Arena */}
          {activeView === 'mock-tests' && (
            <MockTestsView
              questions={practiceQuestions}
              loading={loadingPractice}
              onSolveQuestion={(qId) => showToast('Challenge solved!', 'success')}
            />
          )}

          {/* VIEW 6: Placement Preparation Main Dashboard */}
          {activeView === 'dashboard' && (
            <div>
              {/* 1. Placement Hero Banner */}
              <PlacementHero
                courseCount="50+"
                problemCount="1000+"
                syllabusBadge="Industry"
                certificateBadge="Completion"
              />

              {/* 2. Course Search & Filter Chips Bar */}
              <PlacementSearchFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilterChip}
                onFilterChange={setActiveFilterChip}
                onSearchSubmit={(q) => console.log('Searching:', q)}
              />

              {/* 3. Popular Learning Tracks */}
              <div id="popular-tracks-section">
                <PopularTracks
                  onSelectTrack={(track) => {
                    const matched = mergedCourses.find((c) => c.slug === track.trackSlug)
                    if (matched) {
                      handleOpenCourse(matched)
                    } else {
                      setActiveFilterChip(track.targetCategory || 'ALL')
                    }
                  }}
                  onViewAll={() => setActiveFilterChip('ALL')}
                />
              </div>

              {/* 4. All Courses Header & Sort Row */}
              <section style={{ marginBottom: '40px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '18px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>📚</span>
                      <h2
                        style={{
                          fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                          fontSize: '20px',
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: 0,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        All Courses
                      </h2>
                    </div>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#64748B',
                        margin: '3px 0 0 0',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Choose from our industry-aligned courses and start learning today.
                    </p>
                  </div>

                  {/* Sort By Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748B' }}>
                    <span style={{ fontWeight: 600 }}>Sort by:</span>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '6px 26px 6px 10px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          color: '#0F172A',
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        <option value="popular">Popular</option>
                        <option value="rating">Rating</option>
                        <option value="progress">Progress</option>
                        <option value="newest">Newest</option>
                      </select>
                      <ChevronDown
                        size={13}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#64748B',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Course Cards Grid (Strict 4-Column on Desktop) */}
                <div className="cc-placement-course-grid">
                  {displayedCourses.map((course) => {
                    const isBookmarked = bookmarkedIds.has(course.id)
                    const progress =
                      userProgress.trackProgress[course.slug]?.percentage || course.defaultProgress || 0

                    return (
                      <CourseCard
                        key={course.id || course.slug}
                        course={course}
                        progressPercentage={progress}
                        isBookmarked={isBookmarked}
                        onToggleBookmark={handleToggleBookmark}
                        onStartLearning={handleOpenCourse}
                      />
                    )
                  })}
                </div>

                {displayedCourses.length === 0 && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px dashed #CBD5E1',
                      padding: '48px 24px',
                      textAlign: 'center',
                      color: '#64748B',
                      marginTop: '20px',
                    }}
                  >
                    <BookOpen size={36} style={{ color: '#94A3B8', margin: '0 auto 12px auto' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
                      No courses found
                    </h3>
                    <p style={{ fontSize: '13px', margin: 0 }}>
                      Try adjusting your search terms or filter chip selection.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ── Contextual Campus AI Career Assistant Widget ── */}
      <AIAssistant
        context="PLACEMENT_PREPARATION"
        customPrompts={[
          'Create a 30-day DSA study plan for me',
          'What DBMS topics are important for interviews?',
          'Give me top 5 SQL interview queries with solutions',
          'Explain OS deadlock conditions and prevention',
          'Review my placement preparation roadmap',
        ]}
      />

      {/* ── Official Course Completion Certificate Modal ── */}
      <CertificateModal
        isOpen={Boolean(certificateData)}
        onClose={() => setCertificateData(null)}
        {...certificateData}
      />

      {/* ── Login Modal ── */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}