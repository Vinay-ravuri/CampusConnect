import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import PremiumBackground3D from '../components/PremiumBackground3D'
import { getSubjectsByRegulation } from '../api/subjects'

const REG_INFO = {
  JNTUK: { label: 'JNTUK Regulation', color: '#FF7A00' },
  AU:    { label: 'Andhra University',  color: '#FFB800' },
  UNI:   { label: 'University Syllabus', color: '#F97316' },
}

const YEARS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year']

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }
  }),
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.2 } },
}

export default function SubjectList() {
  const { regId }   = useParams()
  const navigate    = useNavigate()
  const [search, setSearch]       = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [visible, setVisible]     = useState(false)
  const [hovered, setHovered]     = useState(null)
  const [subjects, setSubjects]   = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [regId])

  useEffect(() => {
    setLoading(true)
    getSubjectsByRegulation(regId)
      .then(data => setSubjects(data))
      .catch(err => console.error('Failed to load subjects:', err))
      .finally(() => setLoading(false))
  }, [regId])

  const reg = REG_INFO[regId] || REG_INFO.JNTUK

  const filtered = subjects.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchYear   = yearFilter === 'All' || s.year === yearFilter
    return matchSearch && matchYear
  })

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* 3D background dynamic effect */}
      <PremiumBackground3D />

      {/* Navigation */}
      <Navbar />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1020px',
        margin: '0 auto',
        padding: '120px 24px 60px',
      }}>

        {/* Back Link */}
        <motion.button
          onClick={() => navigate('/student')}
          whileHover={{ x: -4, color: reg.color }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-3)',
            cursor: 'pointer',
            fontSize: '12px',
            letterSpacing: '1.5px',
            fontFamily: 'var(--font-accent)',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            transition: 'color 0.25s',
          }}
        >
          ← Back to Regulations
        </motion.button>

        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '40px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 14px',
            borderRadius: '8px',
            background: reg.color + '15',
            border: `1px solid ${reg.color}25`,
            marginBottom: '16px',
          }}>
            <span style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: reg.color,
              textTransform: 'uppercase',
            }}>
              {reg.label}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: 'clamp(28px, 5vw, 56px)',
            letterSpacing: '-1.5px',
            color: 'var(--text)',
            lineHeight: 1.05,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            Select Subject
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-4)', fontWeight: 500, fontFamily: 'var(--font-accent)', letterSpacing: '0.5px' }}>
            {loading ? 'READING DATABASE…' : `${filtered.length} SUBJECTS INDEXED`}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: '16px', marginBottom: '44px', flexWrap: 'wrap' }}
        >
          {/* Search bar */}
          <div style={{
            flex: 1,
            minWidth: '240px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(91, 108, 255, 0.15)',
            borderRadius: '14px',
            padding: '10px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <span style={{ fontSize: '16px', opacity: 0.5 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subjects by keyword…"
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}
            />
          </div>

          {/* Year pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {YEARS.map(y => (
              <motion.button
                key={y}
                onClick={() => setYearFilter(y)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  background: yearFilter === y ? reg.color : 'rgba(255, 255, 255, 0.65)',
                  color: yearFilter === y ? '#fff' : 'var(--text-2)',
                  border: `1px solid ${yearFilter === y ? reg.color : 'rgba(91, 108, 255, 0.15)'}`,
                  boxShadow: yearFilter === y ? `0 4px 14px ${reg.color}35` : 'var(--shadow-sm)',
                  transition: 'all 0.25s ease',
                }}
              >
                {y}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: `3px solid ${reg.color}18`,
              borderTopColor: reg.color,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px',
            }} />
          </div>
        )}

        {/* Subject Cards Grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((s, i) => {
                const isCardHovered = hovered === s.id
                return (
                  <motion.div
                    key={s.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    onClick={() => navigate(`/student/${regId}/${s.id}`)}
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() => setHovered(null)}
                    whileHover={{ y: -5, scale: 1.015 }}
                    style={{
                      background: isCardHovered ? reg.color + '09' : 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${isCardHovered ? reg.color + '35' : 'rgba(255, 255, 255, 0.45)'}`,
                      borderRadius: '16px',
                      padding: '24px 22px',
                      cursor: 'pointer',
                      boxShadow: isCardHovered ? `0 12px 32px ${reg.color}12` : 'var(--shadow-sm)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
                    }}
                  >
                    {/* Left Accent indicator */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: '3px',
                      borderRadius: '0 3px 3px 0',
                      background: isCardHovered ? reg.color : 'transparent',
                      transition: 'background 0.3s',
                    }} />

                    {/* Title */}
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '16px',
                      fontWeight: 800,
                      color: 'var(--text)',
                      marginBottom: '14px',
                      lineHeight: 1.35,
                      letterSpacing: '-0.2px',
                    }}>
                      {s.name}
                    </div>

                    {/* Tags Footer */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      <span style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-accent)',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: reg.color + '15',
                        color: reg.color,
                        border: `1px solid ${reg.color}25`,
                        fontWeight: 700,
                      }}>
                        {s.year}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: 'rgba(91, 108, 255, 0.05)',
                        color: 'var(--text-3)',
                        border: '1px solid rgba(91, 108, 255, 0.08)',
                        fontWeight: 500,
                      }}>
                        {s.semester}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-3)' }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-2)',
              marginBottom: '8px',
            }}>
              No Subjects Matches
            </h4>
            <p style={{ fontSize: '13px' }}>Refine search strings or reset filters.</p>
          </motion.div>
        )}
      </div>

      <AIAssistant />
    </div>
  )
}