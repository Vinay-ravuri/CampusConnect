import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import ScrollSequence from '../components/ScrollSequence'
import { getRegulations } from '../api/subjects'

const STYLE_MAP = {
  JNTUK: { color: '#FF9A3D', bg: 'rgba(255, 154, 61, 0.05)', glow: 'rgba(255, 154, 61, 0.16)', icon: '🎓', tags: ['R23','R20','R19','R18'] },
  AU:    { color: '#FFB84D', bg: 'rgba(255, 184, 77, 0.05)',  glow: 'rgba(255, 184, 77, 0.16)',  icon: '📘', tags: ['CSE','ECE','EEE','MECH'] },
  UNI:   { color: '#FFD86B', bg: 'rgba(255, 216, 107, 0.05)', glow: 'rgba(255, 216, 107, 0.16)', icon: '🏛️', tags: ['SVEC','VITU','KLU','Others'] },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } }
}

export default function StudentPortal() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [regulations, setRegulations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const portalTriggerRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    getRegulations()
      .then(data => {
        setRegulations(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error('Failed to load regulations:', err)
        setRegulations([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Filter regulations based on search query
  const filteredRegulations = regulations.filter(reg =>
    reg.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const contentLayout = (
    <>
      {/* Header Title (Large UPPERCASE) */}
      <div style={{ textAlign: 'left', marginBottom: '44px' }}>
        <span style={{
          fontSize: '11px',
          fontFamily: 'var(--font-accent)',
          letterSpacing: '4px',
          color: '#FF7A00',
          textTransform: 'uppercase',
          marginBottom: '14px',
          fontWeight: 700,
          display: 'block',
        }}>
          — SELECT UNIVERSITY PORTAL —
        </span>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 900,
          fontSize: 'clamp(28px, 4vw, 48px)',
          letterSpacing: '-1.5px',
          color: '#FFFFFF',
          lineHeight: 1.1,
          textTransform: 'uppercase',
        }}>
          ACADEMIC GATEWAYS
        </h2>
        <p style={{
          fontSize: '14px',
          fontFamily: 'var(--font-accent)',
          color: 'rgba(255, 255, 255, 0.85)',
          maxWidth: '520px',
          margin: '18px 0 0',
          lineHeight: '1.75',
          fontWeight: 500,
        }}>
          Discover syllabus guidelines, lecture materials, reference files, and important questions sorted by regulation boards.
        </p>
      </div>

      {/* Modern Search Bar */}
      <div style={{
        maxWidth: '520px',
        margin: '0 0 44px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '12px 20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      }}>
        <span style={{ fontSize: '18px', opacity: 0.8 }}>🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search regulations (JNTUK, AU...)"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
          }}
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ padding: '60px 0' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            borderTopColor: '#FFFFFF',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '18px',
          }} />
          <div style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '2px',
            fontWeight: 600,
          }}>
            FETCHING SYLLABUS GATEWAYS…
          </div>
        </div>
      )}

      {/* Regulations cards grid */}
      {!loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <AnimatePresence mode="popLayout">
            {filteredRegulations.map((reg, i) => {
              const style = STYLE_MAP[reg.code] || STYLE_MAP.UNI
              const isCardHovered = hovered === reg.id

              return (
                <motion.div
                  key={reg.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  onClick={() => navigate(`/student/${reg.code}`)}
                  onMouseEnter={() => setHovered(reg.id)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  style={{
                    background: isCardHovered ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(28px)',
                    border: `1px solid ${isCardHovered ? style.color + '66' : 'rgba(255, 255, 255, 0.45)'}`,
                    borderRadius: '20px',
                    padding: '32px 28px',
                    cursor: 'pointer',
                    boxShadow: isCardHovered ? `0 24px 50px ${style.glow}` : '0 8px 32px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
                  }}
                >
                  {/* Top linear glow line */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${style.color}, transparent)`,
                    opacity: isCardHovered ? 1 : 0,
                    transition: 'opacity 0.3s',
                  }} />

                  {/* Icon */}
                  <motion.div
                    animate={{ filter: isCardHovered ? `drop-shadow(0 0 10px ${style.color})` : 'none', scale: isCardHovered ? 1.08 : 1 }}
                    style={{ fontSize: '40px', marginBottom: '18px', display: 'inline-block' }}
                  >
                    {style.icon}
                  </motion.div>

                  {/* Regulation Code Tag */}
                  <div style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    border: `1px solid rgba(255, 255, 255, 0.6)`,
                    marginBottom: '14px',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                      color: '#0B0F19',
                    }}>
                      {reg.code}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '22px',
                    color: '#0B0F19',
                    marginBottom: '8px',
                    lineHeight: 1.15,
                    letterSpacing: '-0.5px',
                  }}>
                    {reg.displayName}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-2)',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    fontWeight: 400,
                  }}>
                    {reg.description}
                  </p>

                  {/* Department Tag list */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px', marginTop: 'auto' }}>
                    {style.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: '10px',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.4)',
                        color: 'var(--text-2)',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        fontWeight: 500,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-accent)',
                      color: '#FF7A00',
                      letterSpacing: '1.5px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>
                      Browse Subjects
                    </span>
                    <motion.div
                      animate={{ x: isCardHovered ? 5 : 0 }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: `1.5px solid rgba(255, 122, 0, 0.35)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FF7A00',
                        fontSize: '13px',
                      }}
                    >
                      →
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty Search State */}
      {!loading && filteredRegulations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255, 255, 255, 0.8)' }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '6px',
          }}>
            No Gateway Matches Found
          </h4>
          <p style={{ fontSize: '13px' }}>Refine your search parameters or query keywords.</p>
        </motion.div>
      )}
    </>
  )

  return (
    <div ref={portalTriggerRef} style={{
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #a08d7c 0%, #c5b9a8 50%, #d1c8b9 100%)',
    }}>
      <Navbar />

      {/* Cinematic book sequence background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        opacity: 0.08,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <ScrollSequence
          folder="/book-sequence"
          totalFrames={56}
          triggerRef={portalTriggerRef}
          progressCallback={(p) => setScrollProgress(p)}
          fit="cover"
        />
      </div>

      {/* Centered Content Layout */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: isMobile ? '100px 16px 80px' : '140px 24px 120px',
      }}>
        {contentLayout}
      </div>

      <AIAssistant />
    </div>
  )
}