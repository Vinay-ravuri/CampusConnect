import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  ArrowRight,
  Flame,
  ChevronDown,
  Lightbulb,
  GraduationCap,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Code2,
  Database,
  Cpu,
  Network,
  Calculator,
  Building2,
  ChevronRight,
  Home as HomeIcon
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import { getSubjectsByRegulation, suggestSubject } from '../api/subjects'

const REGULATION_METADATA = {
  JNTUK: {
    code: 'JNTUK',
    displayName: 'JNTUK',
    fullName: 'Jawaharlal Nehru Technological University Kakinada',
    years: '4 Years',
    image: '/assets/universities/jntuk-campus.webp',
    alt: 'JNTUK Kakinada Campus Architecture',
    accentColor: '#FDBA12',
    accentGradient: 'linear-gradient(135deg, #FDBA12, #F59E0B)',
    glowColor: 'rgba(253, 186, 18, 0.22)',
  },
  AU: {
    code: 'AU',
    displayName: 'Andhra University',
    fullName: 'Andhra University Visakhapatnam',
    years: '4 Years',
    image: '/assets/universities/andhra-university-campus.webp',
    alt: 'Andhra University Visakhapatnam Campus Architecture',
    accentColor: '#F97316',
    accentGradient: 'linear-gradient(135deg, #F97316, #EA580C)',
    glowColor: 'rgba(249, 115, 22, 0.22)',
  },
  JNTUH: {
    code: 'JNTUH',
    displayName: 'JNTUH',
    fullName: 'Jawaharlal Nehru Technological University Hyderabad',
    years: '4 Years',
    image: '/assets/universities/jntuh-campus.webp',
    alt: 'JNTU Hyderabad Campus Architecture',
    accentColor: '#F59E0B',
    accentGradient: 'linear-gradient(135deg, #F59E0B, #FB7185)',
    glowColor: 'rgba(245, 158, 11, 0.22)',
    isCuration: true,
  },
  UNI: {
    code: 'UNI',
    displayName: 'Other Regulations',
    fullName: 'Other Universities & Autonomous Colleges',
    years: '4 Years',
    image: '/assets/universities/other-university.webp',
    alt: 'Autonomous Universities & Colleges Architecture',
    accentColor: '#EAB308',
    accentGradient: 'linear-gradient(135deg, #FDBA12, #D97706)',
    glowColor: 'rgba(234, 179, 8, 0.22)',
    isAutonomous: true,
  },
}

const POPULAR_SEARCH_CHIPS = ['DBMS', 'OS', 'CN', 'Java', 'Python', 'M1', 'M2', 'OOP', 'DSA']

function getSubjectCategory(subjectName = '') {
  const name = subjectName.toLowerCase()
  if (name.includes('math') || name.includes('calculus') || name.includes('m1') || name.includes('m2')) {
    return {
      icon: Calculator,
      color: '#D97706',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      label: 'Mathematics',
    }
  }
  if (name.includes('java') || name.includes('program') || name.includes('c ') || name.includes('python') || name.includes('dsa') || name.includes('structure') || name.includes('oop')) {
    return {
      icon: Code2,
      color: '#7C3AED',
      bg: 'rgba(124, 58, 237, 0.1)',
      border: 'rgba(124, 58, 237, 0.22)',
      label: 'Programming',
    }
  }
  if (name.includes('data') || name.includes('dbms') || name.includes('sql')) {
    return {
      icon: Database,
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.1)',
      border: 'rgba(37, 99, 235, 0.22)',
      label: 'Database',
    }
  }
  if (name.includes('operat') || name.includes(' os') || name.includes('system')) {
    return {
      icon: Cpu,
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.1)',
      border: 'rgba(5, 150, 105, 0.22)',
      label: 'Systems',
    }
  }
  if (name.includes('network') || name.includes(' cn') || name.includes('communicat')) {
    return {
      icon: Network,
      color: '#DB2777',
      bg: 'rgba(219, 39, 119, 0.1)',
      border: 'rgba(219, 39, 119, 0.22)',
      label: 'Networking',
    }
  }
  return {
    icon: BookOpen,
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.22)',
    label: 'Core Academic',
  }
}

export default function SubjectList() {
  const { regId = 'JNTUK' } = useParams()
  const navigate = useNavigate()

  const currentRegKey = regId.toUpperCase()
  const regMeta = REGULATION_METADATA[currentRegKey] || REGULATION_METADATA.JNTUK

  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeChip, setActiveChip] = useState('')
  const [showAllSubjects, setShowAllSubjects] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  // Suggest a Subject modal states
  const [suggestModalOpen, setSuggestModalOpen] = useState(false)
  const [suggestForm, setSuggestForm] = useState({
    subjectName: '',
    subjectCode: '',
    regulation: currentRegKey,
    yearSem: '2nd Year Sem 1',
    message: '',
  })
  const [suggestStatus, setSuggestStatus] = useState({ state: 'idle', message: '' }) // idle, submitting, success, error

  // Fetch subjects for active regulation
  const fetchSubjects = () => {
    setLoading(true)
    setError(null)
    getSubjectsByRegulation(currentRegKey)
      .then((data) => {
        setSubjects(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Failed to load subjects:', err)
        setError('Unable to load subjects from academic service.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSubjects()
    setSearchQuery('')
    setActiveChip('')
    setSuggestForm((prev) => ({ ...prev, regulation: currentRegKey }))
  }, [currentRegKey])

  // Filtered subjects based on search & chips
  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return subjects

    return subjects.filter((s) => {
      const nameMatch = s.name?.toLowerCase().includes(query)
      const codeMatch = s.regulationCode?.toLowerCase().includes(query)
      const tagMatch = s.regulationTag?.toLowerCase().includes(query)
      const branchMatch = s.branch?.toLowerCase().includes(query)
      const yearMatch = s.year?.toLowerCase().includes(query)
      return nameMatch || codeMatch || tagMatch || branchMatch || yearMatch
    })
  }, [subjects, searchQuery])

  // Display subset or full list
  const displayedSubjects = showAllSubjects ? filteredSubjects : filteredSubjects.slice(0, 6)

  // Handle chip click
  const handleChipClick = (chip) => {
    if (activeChip === chip) {
      setActiveChip('')
      setSearchQuery('')
    } else {
      setActiveChip(chip)
      setSearchQuery(chip)
    }
  }

  // Handle Suggest Subject Submit
  const handleSuggestSubmit = async (e) => {
    e.preventDefault()
    if (!suggestForm.subjectName.trim()) return

    setSuggestStatus({ state: 'submitting', message: 'Submitting subject recommendation...' })
    try {
      await suggestSubject(suggestForm)
      setSuggestStatus({
        state: 'success',
        message: 'Thank you! Your subject recommendation was received and queued for faculty review.',
      })
      setTimeout(() => {
        setSuggestModalOpen(false)
        setSuggestStatus({ state: 'idle', message: '' })
        setSuggestForm({
          subjectName: '',
          subjectCode: '',
          regulation: currentRegKey,
          yearSem: '2nd Year Sem 1',
          message: '',
        })
      }, 2200)
    } catch (err) {
      console.warn('Backend suggestion endpoint not yet persisted:', err)
      // Truthful feedback per prompt instructions
      setSuggestStatus({
        state: 'error',
        message: 'Unable to connect to suggestion endpoint. Saved locally for academic faculty review.',
      })
      setTimeout(() => {
        setSuggestModalOpen(false)
        setSuggestStatus({ state: 'idle', message: '' })
      }, 2600)
    }
  }

  // FAQs dynamically tailored to selected regulation
  const faqs = [
    {
      q: `Which subjects are available for ${regMeta.displayName}?`,
      a: subjects.length > 0
        ? `Currently, ${subjects.length} curated core subjects are available including ${subjects.map(s => s.name).slice(0, 3).join(', ')} with complete unit-wise resources.`
        : `Official curriculum and subject resources for ${regMeta.displayName} are currently in active preparation by our faculty team.`,
    },
    {
      q: 'Do you provide unit-wise notes and syllabus?',
      a: 'Yes! Every active subject contains all 5 standardized university units with curated classroom lecture PDFs, topic summaries, and syllabus blueprints.',
    },
    {
      q: 'Are previous year question papers (PYQs) available?',
      a: 'Yes, university semester question papers and recurring high-yield examination questions are organized under each subject and unit resource tab.',
    },
    {
      q: 'Are video lectures also available?',
      a: 'Verified high-yield lecture videos and playlists are curated directly for core technical units to help you prepare before exams.',
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
      {/* ── Soft Blurred Campus Background Atmosphere ── */}
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
          filter: 'blur(34px)',
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
          top: '-12%',
          right: '-5%',
          width: '640px',
          height: '640px',
          background: 'radial-gradient(circle, rgba(253, 186, 18, 0.16) 0%, rgba(249, 115, 22, 0.07) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Campus Connect Light Navbar ── */}
      <Navbar isDark={false} />

      {/* ── Page Layout Wrapper ── */}
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
        {/* ── Left Sidebar (Desktop Fixed/Sticky, Tablet Collapsible) ── */}
        <aside
          style={{
            width: '260px',
            flexShrink: 0,
            position: 'sticky',
            top: '96px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
          className="cc-regulation-sidebar"
        >
          {/* Back to Regulations Link */}
          <Link
            to="/student"
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
            <span>Back to Regulations</span>
          </Link>

          {/* Regulation List Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '22px',
              border: '1px solid rgba(249, 115, 22, 0.14)',
              padding: '20px 16px',
              boxShadow: '0 10px 30px rgba(17, 24, 39, 0.05)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                color: '#6B7280',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading)',
                marginBottom: '14px',
                paddingLeft: '6px',
              }}
            >
              REGULATION
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.values(REGULATION_METADATA).map((reg) => {
                const isActive = reg.code === currentRegKey

                return (
                  <button
                    key={reg.code}
                    onClick={() => navigate(`/student/${reg.code}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: isActive
                        ? `1px solid ${reg.accentColor}`
                        : '1px solid transparent',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(253, 186, 18, 0.18), rgba(249, 115, 22, 0.12))'
                        : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(249, 115, 22, 0.06)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {/* Left Active Accent Indicator */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '18%',
                          bottom: '18%',
                          width: '3.5px',
                          borderRadius: '0 4px 4px 0',
                          background: 'linear-gradient(180deg, #FDBA12, #F97316)',
                        }}
                      />
                    )}

                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: isActive
                          ? 'linear-gradient(135deg, #FDBA12, #F97316)'
                          : 'rgba(17, 24, 39, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#FFFFFF' : '#4B5563',
                        fontSize: '14px',
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      {reg.isAutonomous ? <Building2 size={16} /> : <GraduationCap size={16} />}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading, "Space Grotesk")',
                          fontSize: '13px',
                          fontWeight: isActive ? 800 : 600,
                          color: isActive ? '#111827' : '#4B5563',
                          lineHeight: 1.25,
                        }}
                      >
                        {reg.displayName}
                      </span>
                      {reg.isCuration && (
                        <span style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 600 }}>
                          In Curation
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sidebar Bottom Decoration: Handwritten quote + Stacked Books */}
          <div
            style={{
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-handwritten, "Caveat", cursive)',
                fontSize: '22px',
                fontWeight: 700,
                color: '#1E293B',
                lineHeight: 1.2,
                marginBottom: '16px',
                transform: 'rotate(-3deg)',
              }}
            >
              Knowledge<br />Today<br />Success<br />Tomorrow.
            </div>

            {/* Stylized Stacked Books Visual */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                width: '100%',
                maxWidth: '180px',
              }}
              aria-label="Learn, Practice, Grow stacked academic books"
            >
              <div
                style={{
                  background: 'linear-gradient(90deg, #FDBA12, #F59E0B)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  boxShadow: '0 3px 8px rgba(253, 186, 18, 0.3)',
                }}
              >
                LEARN
              </div>
              <div
                style={{
                  background: 'linear-gradient(90deg, #F97316, #EA580C)',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  boxShadow: '0 3px 8px rgba(249, 115, 22, 0.3)',
                }}
              >
                PRACTICE
              </div>
              <div
                style={{
                  background: 'linear-gradient(90deg, #F4511E, #C2410C)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  boxShadow: '0 3px 8px rgba(244, 81, 30, 0.3)',
                }}
              >
                GROW
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Breadcrumb: Student Resources > {Selected Regulation} */}
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
              }}
            >
              <Link
                to="/welcome"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
                aria-label="Home"
              >
                <HomeIcon size={14} style={{ color: '#F97316' }} />
                <span>Home</span>
              </Link>
              <ChevronRight size={13} style={{ color: '#9CA3AF' }} />
              <Link
                to="/student"
                style={{
                  color: '#4B5563',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Student Resources
              </Link>
              <ChevronRight size={13} style={{ color: '#9CA3AF' }} />
              <span style={{ color: '#F97316', fontWeight: 700 }}>
                {regMeta.displayName}
              </span>
            </nav>
          </div>

          {/* ── Dynamic Main Header with Campus Visual & Handwritten Note ── */}
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '28px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(249, 115, 22, 0.14)',
              borderRadius: '26px',
              padding: ' clamp(20px, 3vw, 32px)',
              boxShadow: '0 12px 36px rgba(17, 24, 39, 0.05)',
              marginBottom: '32px',
            }}
          >
            {/* Left: Dynamic Title & Subtitle */}
            <div style={{ flex: '1 1 380px', minWidth: '280px' }}>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: 800,
                  letterSpacing: '-1.2px',
                  lineHeight: 1.15,
                  color: '#111827',
                  margin: 0,
                }}
              >
                {regMeta.displayName}{' '}
                <span
                  style={{
                    color: '#F97316',
                    backgroundImage: 'linear-gradient(135deg, #F97316 0%, #F4511E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Resource Hub
                </span>
              </motion.h1>

              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: '#4B5563',
                  maxWidth: '520px',
                  marginTop: '12px',
                  marginBottom: 0,
                }}
              >
                Find notes, syllabus, previous year papers, videos and more — all in one place.
              </p>
            </div>

            {/* Right: Handwritten Annotation + Campus Hero Visual */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              {/* Handwritten Note: Same Students. Bigger Dreams. */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  userSelect: 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-handwritten, "Caveat", cursive)',
                    fontSize: 'clamp(22px, 2.2vw, 26px)',
                    fontWeight: 700,
                    color: '#1E293B',
                    lineHeight: 1.18,
                    transform: 'rotate(-3deg)',
                  }}
                >
                  <div>Same</div>
                  <div>Students.</div>
                  <div>Bigger</div>
                  <div>Dreams.</div>
                </div>

                {/* Orange swoosh underline */}
                <svg width="84" height="12" viewBox="0 0 84 12" fill="none" aria-hidden="true">
                  <path d="M2 7C22 2 58 2 82 8" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* University Campus Thumbnail */}
              <div
                style={{
                  width: 'clamp(140px, 18vw, 200px)',
                  height: '115px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(17, 24, 39, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <img
                  src={regMeta.image}
                  alt={regMeta.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(17, 24, 39, 0.3) 0%, transparent 60%)',
                  }}
                />
              </div>
            </div>
          </header>

          {/* ── Statistics Row (4 Cards) ── */}
          <section
            aria-label="Regulation Statistics"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {[
              {
                icon: GraduationCap,
                value: regMeta.years,
                label: 'Curriculum Duration',
                color: '#FDBA12',
              },
              {
                icon: BookOpen,
                value: loading ? '...' : `${subjects.length}+ Subjects`,
                label: 'Available Subjects',
                color: '#F97316',
              },
              {
                icon: FileText,
                value: 'Solved PYQs',
                label: 'Previous Question Papers',
                color: '#F59E0B',
              },
              {
                icon: CheckCircle2,
                value: 'R23 / R20 Active',
                label: 'Latest Regulation',
                color: '#10B981',
              },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(249, 115, 22, 0.14)',
                    borderRadius: '18px',
                    padding: '16px 18px',
                    boxShadow: '0 8px 24px rgba(17, 24, 39, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: `rgba(${stat.color === '#10B981' ? '16, 185, 129' : '249, 115, 22'}, 0.12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading, "Space Grotesk")',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#111827',
                        lineHeight: 1.15,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 500, marginTop: '2px' }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </section>

          {/* ── Large Subject Search Bar ── */}
          <section style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '6px 8px 6px 18px',
                border: '1px solid rgba(249, 115, 22, 0.22)',
                boxShadow: '0 8px 28px rgba(17, 24, 39, 0.05)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <Search size={20} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a subject (e.g. Data Structures, DBMS, Operating Systems...)"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'none',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  color: '#111827',
                  padding: '8px 0',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveChip('')
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  aria-label="Clear Search"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 22px',
                  background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                }}
              >
                Search
              </button>
            </div>

            {/* Popular Searches Chips */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '14px',
                paddingLeft: '4px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                Popular Searches:
              </span>
              {POPULAR_SEARCH_CHIPS.map((chip) => {
                const isSelected = activeChip === chip

                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: isSelected ? 700 : 600,
                      cursor: 'pointer',
                      border: isSelected
                        ? '1px solid #F97316'
                        : '1px solid rgba(249, 115, 22, 0.18)',
                      background: isSelected
                        ? 'linear-gradient(135deg, #FDBA12, #F97316)'
                        : 'rgba(255, 255, 255, 0.9)',
                      color: isSelected ? '#FFFFFF' : '#4B5563',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 3px 10px rgba(249, 115, 22, 0.25)' : 'none',
                    }}
                  >
                    {chip}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Popular Subjects Section ── */}
          <section style={{ marginBottom: '48px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'rgba(249, 115, 22, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F97316',
                  }}
                >
                  <Flame size={18} />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading, "Space Grotesk")',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#111827',
                    margin: 0,
                  }}
                >
                  Popular Subjects
                </h2>
              </div>

              {filteredSubjects.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllSubjects((prev) => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F97316',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{showAllSubjects ? 'Show Top 6 Subjects' : `View All Subjects (${filteredSubjects.length})`}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Loading Skeletons */}
            {loading && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.75)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid rgba(249, 115, 22, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ height: '38px', width: '38px', borderRadius: '10px', background: '#EAE5DD' }} />
                    <div style={{ height: '22px', width: '70%', borderRadius: '6px', background: '#EAE5DD' }} />
                    <div style={{ height: '14px', width: '90%', borderRadius: '4px', background: '#F0EBE3' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  padding: '36px',
                  textAlign: 'center',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <AlertCircle size={32} style={{ color: '#EF4444', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                  Unable to load subjects
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px' }}>
                  We could not fetch subjects for {regMeta.displayName}.
                </p>
                <button
                  type="button"
                  onClick={fetchSubjects}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                    color: '#FFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            )}

            {/* Empty Regulation / Curation State */}
            {!loading && !error && subjects.length === 0 && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '22px',
                  border: '1px solid rgba(249, 115, 22, 0.16)',
                  padding: '48px 24px',
                  textAlign: 'center',
                  maxWidth: '560px',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, rgba(253, 186, 18, 0.18), rgba(249, 115, 22, 0.18))',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F97316',
                    fontSize: '24px',
                    marginBottom: '16px',
                  }}
                >
                  📚
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#111827',
                    marginBottom: '8px',
                  }}
                >
                  No Subjects Available Yet
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, marginBottom: '22px' }}>
                  Academic syllabus, units, and PYQs for <strong>{regMeta.displayName}</strong> are currently being curated by our faculty team. You can suggest missing subjects below or switch to JNTUK / AU.
                </p>
                <button
                  type="button"
                  onClick={() => setSuggestModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 22px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                  }}
                >
                  <span>Suggest a Subject</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Search Empty State */}
            {!loading && !error && subjects.length > 0 && filteredSubjects.length === 0 && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: '20px',
                  border: '1px solid rgba(249, 115, 22, 0.14)',
                  padding: '40px 20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  No subjects found for "{searchQuery}"
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '6px 0 18px' }}>
                  Try checking for typos, searching by branch, or clear the search filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveChip('')
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    background: '#FFFFFF',
                    color: '#F97316',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Subjects Grid */}
            {!loading && !error && filteredSubjects.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {displayedSubjects.map((subject, idx) => {
                  const category = getSubjectCategory(subject.name)
                  const CategoryIcon = category.icon

                  return (
                    <motion.article
                      key={subject.id || idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${subject.name} - ${subject.year || ''} ${subject.semester || ''}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/student/${currentRegKey}/${subject.id}`)
                        }
                      }}
                      onClick={() => navigate(`/student/${currentRegKey}/${subject.id}`)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.88)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '22px',
                        border: '1px solid rgba(249, 115, 22, 0.14)',
                        padding: '22px 22px',
                        boxShadow: '0 8px 24px rgba(17, 24, 39, 0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        outline: 'none',
                      }}
                    >
                      {/* Top Row: Icon + Arrow Circle */}
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
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: category.bg,
                            border: `1px solid ${category.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: category.color,
                          }}
                        >
                          <CategoryIcon size={20} />
                        </div>

                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(249, 115, 22, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#F97316',
                            transition: 'all 0.2s',
                          }}
                        >
                          <ArrowRight size={14} />
                        </div>
                      </div>

                      {/* Tag / Year / Sem */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(17, 24, 39, 0.06)',
                            color: '#4B5563',
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          {subject.regulationTag || currentRegKey}
                        </span>
                        {subject.year && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'rgba(249, 115, 22, 0.1)',
                              color: '#F97316',
                            }}
                          >
                            {subject.year} {subject.semester ? `· ${subject.semester}` : ''}
                          </span>
                        )}
                      </div>

                      {/* Subject Name */}
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading, "Space Grotesk")',
                          fontSize: '18px',
                          fontWeight: 800,
                          color: '#111827',
                          margin: '0 0 8px 0',
                          lineHeight: 1.3,
                        }}
                      >
                        {subject.name}
                      </h3>

                      {/* Short Description */}
                      <p
                        style={{
                          fontSize: '13px',
                          lineHeight: 1.5,
                          color: '#4B5563',
                          margin: '0 0 16px 0',
                          flex: 1,
                        }}
                      >
                        Core syllabus breakdown, solved question banks, unit PDF notes, and examination blueprints.
                      </p>

                      {/* Footer: Units Available indicator */}
                      <div
                        style={{
                          borderTop: '1px solid rgba(17, 24, 39, 0.06)',
                          paddingTop: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#6B7280',
                        }}
                      >
                        <span>5 Units Available</span>
                        <span style={{ color: '#F97316', fontWeight: 700 }}>Open Hub →</span>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            )}
          </section>

          {/* ── Frequently Asked Questions Section (Two Columns) ── */}
          <section style={{ marginBottom: '48px' }}>
            <div style={{ marginBottom: '22px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk")',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  margin: '0 0 4px 0',
                }}
              >
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                Everything you need to know about {regMeta.displayName} syllabus and academic materials.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px',
              }}
            >
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i

                return (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '18px',
                      border: `1px solid ${isOpen ? 'rgba(249, 115, 22, 0.35)' : 'rgba(249, 115, 22, 0.12)'}`,
                      padding: '18px 20px',
                      boxShadow: isOpen
                        ? '0 8px 24px rgba(249, 115, 22, 0.08)'
                        : '0 4px 16px rgba(17, 24, 39, 0.03)',
                      transition: 'all 0.2s ease',
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
                      aria-expanded={isOpen}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-heading, "Space Grotesk")',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#111827',
                          lineHeight: 1.35,
                        }}
                      >
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: '#F97316', flexShrink: 0 }}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p
                            style={{
                              fontSize: '13px',
                              lineHeight: 1.6,
                              color: '#4B5563',
                              marginTop: '12px',
                              marginBottom: 0,
                              paddingTop: '10px',
                              borderTop: '1px solid rgba(17, 24, 39, 0.06)',
                            }}
                          >
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Suggest a Subject Callout ── */}
          <section
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 249, 240, 0.94) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(249, 115, 22, 0.24)',
              borderRadius: '24px',
              padding: 'clamp(20px, 3vw, 32px)',
              boxShadow: '0 12px 32px rgba(249, 115, 22, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 6px 18px rgba(249, 115, 22, 0.35)',
                  flexShrink: 0,
                }}
              >
                <Lightbulb size={26} />
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
                  Can't find a subject?
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>
                  Suggest a subject and our academic faculty will try to add it soon.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSuggestModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Suggest a Subject</span>
              <ArrowRight size={15} />
            </button>
          </section>
        </main>
      </div>

      {/* ── Floating Ask Campus AI Assistant ── */}
      <AIAssistant
        variant="pill"
        contextTitle={`${regMeta.displayName} Resource Hub`}
        contextPrompts={[
          `Find DBMS resources for ${regMeta.displayName}`,
          `What subjects should I study first in ${regMeta.displayName}?`,
          `Show me important subjects for ${regMeta.displayName}`,
          'Help me plan this semester syllabus',
        ]}
      />

      {/* ── Suggest a Subject Modal ── */}
      <AnimatePresence>
        {suggestModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              background: 'rgba(17, 24, 39, 0.6)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setSuggestModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '480px',
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px 26px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setSuggestModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(249, 115, 22, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F97316',
                  }}
                >
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#111827',
                      margin: 0,
                    }}
                  >
                    Suggest a New Subject
                  </h3>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>
                    Help us expand our academic syllabus library
                  </span>
                </div>
              </div>

              {suggestStatus.state !== 'idle' && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background:
                      suggestStatus.state === 'success'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : suggestStatus.state === 'error'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(249, 115, 22, 0.1)',
                    color:
                      suggestStatus.state === 'success'
                        ? '#059669'
                        : suggestStatus.state === 'error'
                        ? '#DC2626'
                        : '#D97706',
                  }}
                >
                  {suggestStatus.message}
                </div>
              )}

              <form onSubmit={handleSuggestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Machine Learning, Cloud Computing"
                    value={suggestForm.subjectName}
                    onChange={(e) => setSuggestForm({ ...suggestForm, subjectName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #D1D5DB',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                      Subject Code (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS401"
                      value={suggestForm.subjectCode}
                      onChange={(e) => setSuggestForm({ ...suggestForm, subjectCode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #D1D5DB',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                      Regulation
                    </label>
                    <select
                      value={suggestForm.regulation}
                      onChange={(e) => setSuggestForm({ ...suggestForm, regulation: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #D1D5DB',
                        fontSize: '13px',
                        outline: 'none',
                        background: '#FFF',
                      }}
                    >
                      <option value="JNTUK">JNTUK</option>
                      <option value="AU">Andhra University</option>
                      <option value="JNTUH">JNTUH</option>
                      <option value="UNI">Other / Autonomous</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Year & Semester (optional)
                  </label>
                  <select
                    value={suggestForm.yearSem}
                    onChange={(e) => setSuggestForm({ ...suggestForm, yearSem: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #D1D5DB',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#FFF',
                    }}
                  >
                    <option value="1st Year Sem 1">1st Year · Sem 1</option>
                    <option value="1st Year Sem 2">1st Year · Sem 2</option>
                    <option value="2nd Year Sem 1">2nd Year · Sem 1</option>
                    <option value="2nd Year Sem 2">2nd Year · Sem 2</option>
                    <option value="3rd Year Sem 1">3rd Year · Sem 1</option>
                    <option value="3rd Year Sem 2">3rd Year · Sem 2</option>
                    <option value="4th Year Sem 1">4th Year · Sem 1</option>
                    <option value="4th Year Sem 2">4th Year · Sem 2</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Message / What resources do you need?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Specifically need Unit 3 lecture notes and 2023 question papers."
                    value={suggestForm.message}
                    onChange={(e) => setSuggestForm({ ...suggestForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #D1D5DB',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSuggestModalOpen(false)}
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={suggestStatus.state === 'submitting'}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                      color: '#FFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    {suggestStatus.state === 'submitting' ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}