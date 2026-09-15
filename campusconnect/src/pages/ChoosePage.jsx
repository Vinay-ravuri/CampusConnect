import AIAssistant from '../components/AIAssistant'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import LoginModal from '../components/LoginModal'
import PremiumBackground3D from '../components/PremiumBackground3D'

const CARDS = [
  {
    id: 'student',
    path: '/student',
    emoji: '📚',
    label: 'STUDENT RESOURCES PORTAL',
    sub: 'Academic Resource Center',
    desc: 'JNTUK · AU · University Regulations',
    detail: 'Access organized syllabus-based study guides, lecture videos, PDFs, past question papers, and unit notes in one place.',
    color: '#FF9A3D',
    glow: 'rgba(255, 154, 61, 0.16)',
    border: 'rgba(255, 154, 61, 0.35)',
    items: ['University Syllabi & Regulations', 'Curated Academic Resource PDFs', 'Previous Question Papers & Lab Manuals'],
  },
  {
    id: 'placement',
    path: '/placement',
    emoji: '💼',
    label: 'PLACEMENT RESOURCES PORTAL',
    sub: 'Placement Preparation Suite',
    desc: 'Aptitude · Core CS · Coding · Company PYQs',
    detail: 'Master quantitative aptitude, logical reasoning, verbal ability, DSA, DBMS, OS, CN, and company-specific interview questions.',
    color: '#FFB84D',
    glow: 'rgba(255, 184, 77, 0.16)',
    border: 'rgba(255, 184, 77, 0.35)',
    items: ['Structured Coding & DSA Roadmaps', 'Aptitude & Core CS Preparation', 'Company-Specific Interview Question Papers'],
  },
  {
    id: 'jobs',
    path: '/jobs',
    emoji: '🎯',
    label: 'JOBS',
    sub: 'Opportunity Gateway',
    desc: 'Full-Time · Internships · 2027/2026/2025 Batches',
    detail: 'Discover and apply for verified tech jobs and internships tailored to your branch, graduation year, and target career goals.',
    color: '#0078D4',
    glow: 'rgba(0, 120, 212, 0.16)',
    border: 'rgba(0, 120, 212, 0.35)',
    items: ['Verified Company Job Listings', 'Direct External Application Links', 'Filter by Batch, Skill & Experience'],
  },
  {
    id: 'career',
    path: '/career',
    emoji: '✨',
    label: 'AI SKILL ASSESSMENT ASSISTANT',
    sub: 'AI Career Intelligence',
    desc: 'ATS Resume Score · Job Fit % · Skill Gap Radar',
    detail: 'Harness AI to analyze your resume, measure job-fit percentage, identify missing skill gaps, and generate customized project roadmaps.',
    color: '#FF7A00',
    glow: 'rgba(255, 122, 0, 0.16)',
    border: 'rgba(255, 122, 0, 0.35)',
    items: ['Automated ATS Resume Scoring', 'Job Fit Percentage & Missing Skill Radar', 'Recruiter-Ready Project Blueprints'],
  },
]

function TiltCard({ card, onClick, isLoggedIn }) {
  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const { clientX, clientY } = e
    const rect = cardRef.current.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width
    const y = (clientY - rect.top) / rect.height

    const tiltX = (y - 0.5) * -14
    const tiltY = (x - 0.5) * 14
    setRotate({ x: tiltX, y: tiltY })
    setGlowPos({ x: clientX - rect.left, y: clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
        scale: isHovered ? 1.025 : 1,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(28px)',
        border: `1px solid ${isHovered ? card.border : 'rgba(255, 255, 255, 0.45)'}`,
        borderRadius: '24px',
        padding: '48px 40px',
        cursor: 'pointer',
        boxShadow: isHovered 
          ? `0 32px 80px ${card.glow}, 0 0 0 1px ${card.border}`
          : 'var(--shadow-md)',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: 1000,
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {isHovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 280px at ${glowPos.x}px ${glowPos.y}px, ${card.glow} 0%, transparent 80%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 1,
      }} />

      <div style={{ transform: 'translateZ(30px)', position: 'relative', zIndex: 2 }}>
        <motion.div
          animate={{ scale: isHovered ? 1.15 : 1, y: isHovered ? -4 : 0 }}
          style={{
            fontSize: '56px',
            marginBottom: '28px',
            display: 'inline-block',
            filter: isHovered ? `drop-shadow(0 4px 12px ${card.glow})` : 'none',
          }}
        >
          {card.emoji}
        </motion.div>

        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '28px',
          letterSpacing: '-1px',
          color: card.color,
          lineHeight: 1.1,
          marginBottom: '4px',
        }}>
          {card.label}
        </h3>
        
        <div style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '11px',
          color: 'var(--text-3)',
          letterSpacing: '2px',
          fontWeight: 600,
          textTransform: 'uppercase',
          marginBottom: '22px',
        }}>
          {card.sub}
        </div>

        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, ${card.color}35, transparent)`,
          marginBottom: '22px',
        }} />

        <p style={{
          fontSize: '14px',
          color: 'var(--text-2)',
          lineHeight: '1.7',
          marginBottom: '28px',
          fontWeight: 400,
        }}>
          {card.detail}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
          {card.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: card.color,
                boxShadow: `0 0 8px ${card.color}`,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{
            fontSize: '12px',
            fontFamily: 'var(--font-accent)',
            letterSpacing: '1.5px',
            color: card.color,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            {isLoggedIn ? 'Access Portal' : 'Authentication Required'}
          </span>
          <motion.div
            animate={{ x: isHovered ? 6 : 0, borderColor: isHovered ? card.color : 'rgba(255, 154, 61, 0.15)' }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: `1.5px solid rgba(255, 154, 61, 0.15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: card.color,
              fontSize: '16px',
            }}
          >
            →
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChoosePage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [visible, setVisible] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [target, setTarget] = useState('')

  useEffect(() => {
    setTimeout(() => setVisible(true), 150)
  }, [])

  const handleClick = (path) => {
    if (!isLoggedIn) {
      setTarget(path)
      setShowLogin(true)
    } else {
      navigate(path)
    }
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflowX: 'hidden',
    }}>
      <PremiumBackground3D />

      <div style={{
        position: 'absolute',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 154, 61, 0.05) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '48px',
        padding: '100px 24px 60px',
        width: '100%',
        maxWidth: '1160px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center' }}
        >
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-accent)',
            letterSpacing: '4px',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: '16px',
            fontWeight: 700,
            display: 'block',
          }}>
            — THE FOUR PILLARS OF CAMPUS CONNECT —
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: 'clamp(32px, 5.5vw, 64px)',
            letterSpacing: '-2px',
            color: 'var(--text)',
            lineHeight: 1.05,
            textTransform: 'uppercase',
          }}>
            Choose Your{' '}
            <span className="luxury-gradient-text">Path</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={visible ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            width: '100%',
          }}
        >
          {CARDS.map(card => (
            <motion.div
              key={card.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
            >
              <TiltCard
                card={card}
                onClick={() => handleClick(card.path)}
                isLoggedIn={isLoggedIn}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-accent)',
            color: 'var(--text-4)',
            letterSpacing: '2px',
            textAlign: 'center',
            marginTop: '16px',
          }}
        >
          {isLoggedIn ? '✦ CHOOSE ANY PORTAL TO LAUNCH THE ECOSYSTEM ✦' : '🔒 SECURE IDENTITY GATE: SIGN IN REQUIRED TO PROCEED'}
        </motion.p>
      </div>

      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectTo={target} />}
      </AnimatePresence>

      <AIAssistant />
    </div>
  )
}