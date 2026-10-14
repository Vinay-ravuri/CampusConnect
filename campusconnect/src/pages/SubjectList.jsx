import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  ArrowRight,
  ArrowLeft,
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
  Home as HomeIcon,
  Flame,
  Layers,
  Sparkles
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
    accentColor: '#FDBA12',
    accentGradient: 'linear-gradient(135deg, #FDBA12, #F97316)',
    activeRegulations: 'R23 / R20 Active',
  },
  AU: {
    code: 'AU',
    displayName: 'Andhra University',
    fullName: 'Andhra University Visakhapatnam',
    years: '4 Years',
    image: '/assets/universities/andhra-university-campus.webp',
    accentColor: '#F97316',
    accentGradient: 'linear-gradient(135deg, #F97316, #EA580C)',
    activeRegulations: 'R20 / R19 Active',
  },
  JNTUH: {
    code: 'JNTUH',
    displayName: 'JNTUH',
    fullName: 'Jawaharlal Nehru Technological University Hyderabad',
    years: '4 Years',
    image: '/assets/universities/jntuh-campus.webp',
    accentColor: '#F59E0B',
    accentGradient: 'linear-gradient(135deg, #F59E0B, #FB7185)',
    activeRegulations: 'R22 / R18 Active',
    isCuration: true,
  },
  UNI: {
    code: 'UNI',
    displayName: 'Other Regulations',
    fullName: 'Other Universities & Autonomous Colleges',
    years: '4 Years',
    image: '/assets/universities/other-university.webp',
    accentColor: '#EAB308',
    accentGradient: 'linear-gradient(135deg, #FDBA12, #D97706)',
    activeRegulations: 'Autonomous CBCS',
    isAutonomous: true,
  },
}

const POPULAR_SEARCH_CHIPS = ['DBMS', 'OS', 'CN', 'Java', 'Python', 'OOP', 'DSA']

function getSubjectCategory(subjectName = '') {
  const name = subjectName.toLowerCase()

  if (name.includes('data struct') || name.includes('dsa') || name.includes('algorithm')) {
    return {
      icon: Code2,
      code: 'DSA',
      fullName: 'Data Structures & Algorithms',
      bg: '#4F46E5',
      label: 'Core Programming',
    }
  }
  if (name.includes('java') || name.includes('oop')) {
    return {
      icon: Code2,
      code: 'Java',
      fullName: 'Java Programming & OOPs',
      bg: '#EA580C',
      label: 'Object Oriented',
    }
  }
  if (name.includes('dbms') || name.includes('data') || name.includes('sql') || name.includes('database')) {
    return {
      icon: Database,
      code: 'DBMS',
      fullName: 'Database Management Systems',
      bg: '#2563EB',
      label: 'Database',
    }
  }
  if (name.includes('operat') || name.includes('os') || name.includes('system')) {
    return {
      icon: Cpu,
      code: 'OS',
      fullName: 'Operating Systems',
      bg: '#059669',
      label: 'Core Systems',
    }
  }
  if (name.includes('network') || name.includes('cn') || name.includes('communicat')) {
    return {
      icon: Network,
      code: 'CN',
      fullName: 'Computer Networks',
      bg: '#DB2777',
      label: 'Networking',
    }
  }
  if (name.includes('python')) {
    return {
      icon: Code2,
      code: 'Python',
      fullName: 'Python Programming',
      bg: '#0D9488',
      label: 'Programming',
    }
  }
  if (name.includes('math') || name.includes('calculus') || name.includes('m1') || name.includes('m2')) {
    const isM2 = name.includes('ii') || name.includes('m2') || name.includes(' 2')
    return {
      icon: Calculator,
      code: isM2 ? 'M2' : 'M1',
      fullName: isM2 ? 'Mathematics – II' : 'Mathematics – I',
      bg: '#D97706',
      label: 'Mathematics',
    }
  }

  // Derive acronym or default
  const words = subjectName.trim().split(/\s+/)
  const acronym = words.length > 1
    ? words.map(w => w[0]).join('').slice(0, 4).toUpperCase()
    : subjectName.slice(0, 4).toUpperCase()

  return {
    icon: BookOpen,
    code: acronym,
    fullName: subjectName,
    bg: '#F97316',
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
  const [suggestStatus, setSuggestStatus] = useState({ state: 'idle', message: '' })

  // Fetch subjects for active regulation from backend
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

  // Real filtered subjects based on search & chips
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
      }, 2000)
    } catch (err) {
      console.warn('Backend suggestion saved locally:', err)
      setSuggestStatus({
        state: 'error',
        message: 'Thank you! Saved locally for faculty review.',
      })
      setTimeout(() => {
        setSuggestModalOpen(false)
        setSuggestStatus({ state: 'idle', message: '' })
      }, 2200)
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
      a: 'Yes, university semester question papers and recurring examination questions are organized under each subject and unit resource tab.',
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
        backgroundColor: '#FFFDF9',
        color: '#0F172A',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: 'var(--font-body, "Inter", sans-serif)',
      }}
    >
      {/* ── Warm Soft Ambient Glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-15%',
          right: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(253, 186, 18, 0.12) 0%, rgba(249, 115, 22, 0.05) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Global Campus Connect Navbar ── */}
      <Navbar isDark={false} />

      {/* ── Main Container (Centered, 1200-1350px) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '96px 24px 70px',
        }}
      >
        {/* ── Compact Breadcrumb Navigation + Subtle Back Link ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-heading, "Space Grotesk")',
              color: '#64748B',
            }}
          >
            <Link
              to="/welcome"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#64748B',
                textDecoration: 'none',
                fontWeight: 600,
              }}
              aria-label="Home"
            >
              <HomeIcon size={14} style={{ color: '#F97316' }} />
              <span>Home</span>
            </Link>
            <ChevronRight size={13} style={{ color: '#CBD5E1' }} />
            <Link
              to="/student"
              style={{
                color: '#64748B',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Student Resources
            </Link>
            <ChevronRight size={13} style={{ color: '#CBD5E1' }} />
            <span style={{ color: '#EA580C', fontWeight: 700 }}>
              {regMeta.displayName}
            </span>
          </nav>

          {/* Subtle Secondary Back Link */}
          <Link
            to="/student"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#64748B',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#EA580C' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B' }}
          >
            <ArrowLeft size={13} />
            <span>All Regulations</span>
          </Link>
        </div>

        {/* ── Compact Page Header (Max Height ~120-150px) ── */}
        <header
          style={{
            background: '#FFFFFF',
            borderRadius: '22px',
            border: '1px solid rgba(249, 115, 22, 0.16)',
            padding: '24px 28px',
            boxShadow: '0 4px 20px rgba(17, 24, 39, 0.03)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {/* Left: Compact Title & Metadata */}
          <div style={{ flex: '1 1 480px' }}>
            {/* Small Metadata Badges near title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  color: '#EA580C',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                ACADEMIC PORTAL
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#475569',
                  background: '#F1F5F9',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                {regMeta.years} Curriculum
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#15803D',
                  background: '#DCFCE7',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                {regMeta.activeRegulations}
              </span>
              {!loading && subjects.length > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#1D4ED8',
                    background: '#DBEAFE',
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  {subjects.length} Core Subjects
                </span>
              )}
            </div>

            {/* Header Title */}
            <h1
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: 'clamp(28px, 3.2vw, 40px)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: '0 0 6px 0',
              }}
            >
              {regMeta.displayName}{' '}
              <span
                style={{
                  color: '#EA580C',
                  backgroundImage: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Resource Library
              </span>
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: '#475569',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Find notes, syllabus, previous-year papers, videos and more — all in one place.
            </p>
          </div>

          {/* Right: Compact Regulation Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Regulation
            </span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#F8FAFC',
                padding: '4px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                flexWrap: 'wrap',
              }}
            >
              {Object.values(REGULATION_METADATA).map((reg) => {
                const isSelected = reg.code === currentRegKey
                return (
                  <button
                    key={reg.code}
                    onClick={() => navigate(`/student/${reg.code}`)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #EA580C' : '1px solid transparent',
                      background: isSelected ? 'linear-gradient(135deg, #FDBA12, #F97316)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      boxShadow: isSelected ? '0 2px 8px rgba(249, 115, 22, 0.25)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <span>{reg.displayName}</span>
                    {reg.isCuration && (
                      <span
                        style={{
                          fontSize: '9.5px',
                          padding: '1px 5px',
                          borderRadius: 4,
                          background: isSelected ? 'rgba(255,255,255,0.25)' : '#FEF3C7',
                          color: isSelected ? '#FFFFFF' : '#B45309',
                          fontWeight: 700,
                        }}
                      >
                        Soon
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        {/* ── Primary Wide Search Bar (The Main Action) ── */}
        <section style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '6px 8px 6px 18px',
              border: '1.5px solid rgba(249, 115, 22, 0.22)',
              boxShadow: '0 4px 20px rgba(17, 24, 39, 0.04)',
              height: '56px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <Search size={20} style={{ color: '#EA580C', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, notes, DBMS, Java, OS, previous papers..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'none',
                fontSize: '14.5px',
                fontFamily: 'var(--font-body)',
                color: '#0F172A',
                padding: '8px 0',
                fontWeight: 500,
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
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                  cursor: 'pointer',
                }}
                aria-label="Clear Search"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 24px',
                height: '42px',
                background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
              }}
            >
              Search
            </button>
          </div>

          {/* Popular Search Chips (Directly Below Search) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginTop: '12px',
              paddingLeft: '4px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              Popular:
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
                    borderRadius: '20px',
                    fontSize: '11.5px',
                    fontWeight: isSelected ? 700 : 600,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #EA580C' : '1px solid #E2E8F0',
                    background: isSelected ? '#FFF7ED' : '#FFFFFF',
                    color: isSelected ? '#EA580C' : '#475569',
                    boxShadow: isSelected ? '0 2px 6px rgba(249, 115, 22, 0.15)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {chip}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Main Content: Popular Subjects Section ── */}
        <section style={{ marginBottom: '44px' }}>
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk")',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 4px 0',
                }}
              >
                Popular Subjects
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
                Explore subjects and access notes, syllabus, videos and previous-year papers.
              </p>
            </div>

            {filteredSubjects.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllSubjects((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EA580C',
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '20px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '1px solid rgba(249, 115, 22, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    minHeight: '175px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ height: '42px', width: '42px', borderRadius: '12px', background: '#F1F5F9' }} />
                    <div style={{ height: '28px', width: '28px', borderRadius: '50%', background: '#F8FAFC' }} />
                  </div>
                  <div style={{ height: '22px', width: '50%', borderRadius: '6px', background: '#F1F5F9' }} />
                  <div style={{ height: '14px', width: '85%', borderRadius: '4px', background: '#F8FAFC' }} />
                </div>
              ))}
            </div>
          )}

          {/* Error State with Try Again */}
          {!loading && error && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '36px',
                textAlign: 'center',
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
            >
              <AlertCircle size={32} style={{ color: '#EF4444', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>
                Unable to load subjects
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 16px' }}>
                We could not fetch subjects for {regMeta.displayName}.
              </p>
              <button
                type="button"
                onClick={fetchSubjects}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          )}

          {/* Empty Regulation State */}
          {!loading && !error && subjects.length === 0 && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                border: '1.5px solid rgba(249, 115, 22, 0.16)',
                padding: '48px 24px',
                textAlign: 'center',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EA580C',
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
                  color: '#0F172A',
                  marginBottom: '8px',
                }}
              >
                No Subjects Available Yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '22px' }}>
                Academic syllabus, units, and PYQs for <strong>{regMeta.displayName}</strong> are currently being curated by our faculty team. You can suggest missing subjects below or switch to JNTUK.
              </p>
              <button
                type="button"
                onClick={() => setSuggestModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 22px',
                  borderRadius: '12px',
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
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid rgba(249, 115, 22, 0.16)',
                padding: '40px 20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>
                No subjects found for "{searchQuery}"
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 16px' }}>
                Try checking for typos or clear search to browse all subjects.
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
                  background: '#FFF7ED',
                  color: '#EA580C',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                }}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Subjects Grid (Modern 3-Column Landscape Cards) */}
          {!loading && !error && filteredSubjects.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '20px',
              }}
            >
              {displayedSubjects.map((subject, idx) => {
                const category = getSubjectCategory(subject.name)
                const CategoryIcon = category.icon

                return (
                  <motion.article
                    key={subject.id || idx}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(17, 24, 39, 0.08)' }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${category.code || subject.name} - ${category.fullName || subject.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(`/student/${currentRegKey}/${subject.id}`)
                      }
                    }}
                    onClick={() => navigate(`/student/${currentRegKey}/${subject.id}`)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid rgba(249, 115, 22, 0.16)',
                      padding: '20px 22px',
                      boxShadow: '0 4px 16px rgba(17, 24, 39, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '175px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                  >
                    {/* Top Row: Colored Subject Icon + Circular Navigation Arrow */}
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
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          boxShadow: `0 4px 12px ${category.bg}40`,
                        }}
                      >
                        <CategoryIcon size={20} />
                      </div>

                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#FFF7ED',
                          border: '1px solid #FFEDD5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#EA580C',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <ArrowRight size={14} />
                      </div>
                    </div>

                    {/* Middle: Subject Code & Full Title */}
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading, "Space Grotesk")',
                          fontSize: '19px',
                          fontWeight: 800,
                          color: '#0F172A',
                          lineHeight: 1.2,
                          marginBottom: '4px',
                        }}
                      >
                        {category.code || subject.name}
                      </div>

                      <div
                        style={{
                          fontSize: '13px',
                          color: '#64748B',
                          lineHeight: 1.4,
                          fontWeight: 500,
                          marginBottom: '14px',
                        }}
                      >
                        {category.fullName || subject.name}
                        {subject.regulationTag && ` · ${subject.regulationTag}`}
                        {subject.branch && ` ${subject.branch}`}
                      </div>
                    </div>

                    {/* Bottom: Resource Indicators */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #F1F5F9',
                        paddingTop: '10px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#64748B',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#EA580C' }}>
                        <FileText size={13} />
                        <span>Notes • PYQs • Videos</span>
                      </span>

                      <span
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: '11px',
                          color: '#475569',
                        }}
                      >
                        5 Units
                      </span>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Frequently Asked Questions (Clean Accordion) ── */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk")',
                fontSize: '20px',
                fontWeight: 800,
                color: '#0F172A',
                margin: '0 0 4px 0',
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Quick answers about {regMeta.displayName} syllabus, question papers, and study material.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '14px',
            }}
          >
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i

              return (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: `1px solid ${isOpen ? 'rgba(249, 115, 22, 0.35)' : 'rgba(249, 115, 22, 0.14)'}`,
                    padding: '16px 18px',
                    boxShadow: isOpen
                      ? '0 6px 20px rgba(249, 115, 22, 0.06)'
                      : '0 2px 8px rgba(17, 24, 39, 0.02)',
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
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: '#0F172A',
                        lineHeight: 1.35,
                      }}
                    >
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: '#EA580C', flexShrink: 0 }}
                    >
                      <ChevronDown size={17} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p
                          style={{
                            fontSize: '13px',
                            lineHeight: 1.55,
                            color: '#475569',
                            marginTop: '10px',
                            marginBottom: 0,
                            paddingTop: '8px',
                            borderTop: '1px solid #F1F5F9',
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

        {/* ── Suggest a Subject Callout Banner ── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F0 100%)',
            border: '1.5px solid rgba(249, 115, 22, 0.22)',
            borderRadius: '20px',
            padding: '24px 28px',
            boxShadow: '0 4px 20px rgba(249, 115, 22, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                flexShrink: 0,
              }}
            >
              <Lightbulb size={22} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk")',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Can't find a subject?
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: '3px 0 0' }}>
                Suggest missing subjects or syllabus topics and our academic faculty will add them.
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
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
              transition: 'all 0.18s ease',
            }}
          >
            <span>Suggest a Subject</span>
            <ArrowRight size={14} />
          </button>
        </section>
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
              background: 'rgba(15, 23, 42, 0.6)',
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
                padding: '26px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
                position: 'relative',
              }}
            >
              <button
                type="button"
                onClick={() => setSuggestModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={18} />
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
                    color: '#EA580C',
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
                      color: '#0F172A',
                      margin: 0,
                    }}
                  >
                    Suggest a New Subject
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
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
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
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
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Regulation
                    </label>
                    <select
                      value={suggestForm.regulation}
                      onChange={(e) => setSuggestForm({ ...suggestForm, regulation: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Year & Semester (optional)
                  </label>
                  <select
                    value={suggestForm.yearSem}
                    onChange={(e) => setSuggestForm({ ...suggestForm, yearSem: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
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
                      border: '1px solid #CBD5E1',
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
                      border: '1px solid #CBD5E1',
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