import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ScrollSequence from '../components/ScrollSequence'
import Navbar from '../components/Navbar'
import WelcomeEffects3D from '../components/WelcomeEffects3D'
import { useAuth } from '../context/AuthContext'
import LoginModal from '../components/LoginModal'

/* ─── Data ──────────────────────────────────────────────── */
const STATS = [
  { value: '3+', label: 'Regulations', icon: '📔', color: '#FF9A3D' },
  { value: '200+', label: 'Subjects', icon: '📚', color: '#FFB84D' },
  { value: '1000+', label: 'Resources', icon: '📁', color: '#FFD86B' },
  { value: '50+', label: 'Companies', icon: '💼', color: '#FF9A3D' },
]

const FEATURES = [
  {
    icon: '📚', title: 'Syllabus-Aligned Learning',
    desc: 'Structured resources categorized by JNTUK, AU, and University regulations. Access study guides, recommended lectures, and syllabus breakdowns.',
    color: '#FF9A3D', tag: 'ACADEMICS',
  },
  {
    icon: '💼', title: 'Placement Preparation',
    desc: 'Accelerate your coding roadmap. Practice company-specific questions for TCS NQT, Wipro, Accenture with complete Aptitude, Reasoning, and Core CS prep.',
    color: '#FFB84D', tag: 'PLACEMENT',
  },
  {
    icon: '🤖', title: 'AI-Powered Assistant',
    desc: 'Get instant explanations right in the app. Our contextual AI chat assistant powered by Claude handles query clarifications and clears syllabus doubts instantly.',
    color: '#FFD86B', tag: 'INTELLIGENCE',
  },
]

const TESTIMONIALS = [
  { name: 'Ravi Kumar', college: 'SVEC — CSE 3rd Year', text: 'CampusConnect literally changed how I study. The JNTUK resources are so organized, I cleared all units in half the time!', avatar: 'R' },
  { name: 'Priya Sai', college: 'KLU — ECE 2nd Year', text: 'The placement portal prep helped me crack TCS NQT on my first attempt. The aptitude section is incredibly structured.', avatar: 'P' },
  { name: 'Anil Reddy', college: 'GITAM — IT 4th Year', text: 'Best educational platform for AP students. The AI assistant explains even tough DBMS topics in a way that actually makes sense!', avatar: 'A' },
  { name: 'Divya Lakshmi', college: 'VITU — CSE 2nd Year', text: 'I love how everything is in one place. From syllabus to company-wise mock prep — CampusConnect has it all!', avatar: 'D' },
  { name: 'Charan Tej', college: 'AU — ECE 3rd Year', text: 'The AU regulation materials are perfectly organized. This platform saved me so much time searching for resources online.', avatar: 'C' },
  { name: 'Manasa K', college: 'NIT-AP — CSE 4th Year', text: 'Got placed at Wipro using CampusConnect\'s preparation materials. Highly recommend for any engineering student!', avatar: 'M' },
]

const PORTAL_CARDS = [
  {
    id: 'student', path: '/student', emoji: '📚', label: 'STUDENT PORTAL', sub: 'Resource Center',
    desc: 'JNTUK · AU · University Regulations',
    detail: 'Access organized syllabus-based study guides, lecture videos, and critical exam questions structured unit by unit.',
    color: '#FF9A3D', glow: 'rgba(255, 154, 61, 0.16)', border: 'rgba(255, 154, 61, 0.35)',
    items: ['University Syllabi & Regulations', 'Curated Academic Resource PDFs', 'Important Doubts & Q&A Topics'],
  },
  {
    id: 'placement', path: '/placement', emoji: '💼', label: 'PLACEMENT PORTAL', sub: 'Preparation Suite',
    desc: 'Aptitude · Reasoning · Technical · Mock Interviews',
    detail: 'Master technical questions, interview roadmaps, and aptitude benchmarks tailored to premium corporate standard requirements.',
    color: '#FFB84D', glow: 'rgba(255, 184, 77, 0.16)', border: 'rgba(255, 184, 77, 0.35)',
    items: ['Structured Coding Roadmaps', 'Interactive Company Modules', 'Quantitative Aptitude Practice'],
  },
  {
    id: 'skills', path: '/placement', emoji: '⚡', label: 'SKILL PORTAL', sub: 'Skills Suite',
    desc: 'Technical & Practical Skill Development',
    detail: 'Hone your technical skills, master modern frameworks, and build a strong portfolio to stand out to recruiters.',
    color: '#FFB84D', glow: 'rgba(255, 184, 77, 0.16)', border: 'rgba(255, 184, 77, 0.35)',
    items: ['Web Development Tracks', 'Programming Language Mastery', 'DSA & Algorithms Practice'],
  },
  {
    id: 'career', path: '/career', emoji: '✨', label: 'AI CAREER ASSISTANT', sub: 'Career Workspace',
    desc: 'Resume Analysis · Learning Roadmap · Skill Gap Radar',
    detail: 'Harness the power of AI to analyze your resume, get placement readiness score, discover skill gaps, and view custom roadmap.',
    color: '#FF7A00', glow: 'rgba(255, 122, 0, 0.16)', border: 'rgba(255, 122, 0, 0.35)',
    items: ['Automated ATS Resume Scoring', 'Skill Gap Radar Visualizations', 'Interactive Workspace AI Mentor'],
  },
]

// No stage switching — single hero text

/* ─── Helpers ───────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const num = parseInt(target.replace(/\D/g, '')) || 0
    const duration = 1200
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const prog = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - prog, 3)
      setCount(Math.round(eased * num))
      if (prog < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

function RevealSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function TiltCard({ card, onClick, isLoggedIn }) {
  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setRotate({ x: (y - 0.5) * -14, y: (x - 0.5) * 14 })
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setRotate({ x: 0, y: 0 }) }}
      onClick={onClick}
      animate={{ rotateX: rotate.x, rotateY: rotate.y, scale: isHovered ? 1.025 : 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(28px)',
        border: `1px solid ${isHovered ? card.border : 'rgba(255, 255, 255, 0.45)'}`,
        borderRadius: '24px',
        padding: '48px 40px',
        cursor: 'pointer',
        boxShadow: isHovered ? `0 32px 80px ${card.glow}, 0 0 0 1px ${card.border}` : 'var(--shadow-md)',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        perspective: 1000,
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {isHovered && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle 280px at ${glowPos.x}px ${glowPos.y}px, ${card.glow} 0%, transparent 80%)`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
        opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 1,
      }} />
      <div style={{ transform: 'translateZ(30px)', position: 'relative', zIndex: 2 }}>
        <motion.div
          animate={{ scale: isHovered ? 1.15 : 1, y: isHovered ? -4 : 0 }}
          style={{ fontSize: '56px', marginBottom: '28px', display: 'inline-block', filter: isHovered ? `drop-shadow(0 4px 12px ${card.glow})` : 'none' }}
        >
          {card.emoji}
        </motion.div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '32px', letterSpacing: '-1px', color: card.color, lineHeight: 1.1, marginBottom: '4px' }}>
          {card.label}
        </h3>
        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', color: 'var(--text-3)', letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '22px' }}>
          {card.sub}
        </div>
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${card.color}35, transparent)`, marginBottom: '22px' }} />
        <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.7', marginBottom: '28px', fontWeight: 400 }}>{card.detail}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
          {card.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: card.color, boxShadow: `0 0 8px ${card.color}`, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-accent)', letterSpacing: '1.5px', color: card.color, textTransform: 'uppercase', fontWeight: 700 }}>
            {isLoggedIn ? 'Access Portal' : 'Authentication Required'}
          </span>
          <motion.div
            animate={{ x: isHovered ? 6 : 0 }}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: `1.5px solid rgba(255, 154, 61, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontSize: '16px' }}
          >→</motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function FeatureCard({ feature }) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })
  return (
    <motion.div
      ref={ref}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); setGlowPos({ x: e.clientX - r.left, y: e.clientY - r.top }) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        background: hover ? `${feature.color}08` : 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(28px)',
        border: `1px solid ${hover ? feature.color + '35' : 'rgba(255,255,255,0.5)'}`,
        borderRadius: 24, padding: '44px 36px',
        boxShadow: hover ? `0 32px 72px ${feature.color}14` : 'var(--shadow-sm)',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
        cursor: 'default',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`, opacity: hover ? 1 : 0, transition: 'opacity 0.3s' }} />
      {hover && (<div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle 300px at ${glowPos.x}px ${glowPos.y}px, ${feature.color}10 0%, transparent 80%)`, pointerEvents: 'none' }} />)}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, background: `${feature.color}12`, border: `1px solid ${feature.color}25`, marginBottom: 24 }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-accent)', fontWeight: 800, color: feature.color, letterSpacing: '1.5px' }}>{feature.tag}</span>
      </div>
      <motion.div animate={{ scale: hover ? 1.1 : 1, y: hover ? -4 : 0 }} style={{ fontSize: 44, marginBottom: 20, display: 'inline-block' }}>{feature.icon}</motion.div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.4px' }}>{feature.title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75 }}>{feature.desc}</p>
    </motion.div>
  )
}

function TestimonialCard({ t, flip = false }) {
  return (
    <div style={{
      background: flip ? 'rgba(255,253,248,0.9)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)', border: '1px solid rgba(255,154,61,0.1)',
      borderRadius: 20, padding: '24px 28px', width: 320, flexShrink: 0,
      boxShadow: '0 4px 20px rgba(255,154,61,0.05)',
    }}>
      <div style={{ fontSize: 28, color: 'var(--accent)', marginBottom: 12, opacity: 0.6 }}>"</div>
      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 20 }}>{t.text}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #FF7A00, #FFB800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-accent)' }}>{t.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.college}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: 10, color: '#FF9A3D' }}>★</span>)}</div>
      </div>
    </div>
  )
}

/* ─── Main Component ────────────────────────────────────── */
export default function Welcome() {
  const navigate = useNavigate()
  const location = useLocation()
  const welcomeRef = useRef(null)
  const heroSectionRef = useRef(null)
  const contactRef = useRef(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { isLoggedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [target, setTarget] = useState('')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (location.hash === '#contact') {
      setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 300)
    }
  }, [location.hash])

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false); setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    }, 1200)
  }

  const isFinished = scrollProgress >= 0.85

  return (
    <div ref={welcomeRef} style={{ background: '#FFFDF8', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
      {/* ── Navbar always on top ── */}
      <Navbar isDark={false} />

      {/* ══════════════════════════════════════════
          HERO — full-screen scroll sequence
      ══════════════════════════════════════════ */}
      <section
        ref={heroSectionRef}
        style={{
          height: '800vh',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Sticky viewport — stays fixed while parent scrolls */}
        <div style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 50%, #f7ebd9 0%, #e8d9c8 40%, #cfc0b0 80%, #bfb0a0 100%)',
        }}>

          {/* ── Full-screen frame sequence ── */}
          <ScrollSequence
            triggerRef={heroSectionRef}
            progressCallback={setScrollProgress}
          />

          {/* ── Ambient sparkles ── */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
            <WelcomeEffects3D />
          </div>

          {/* ── Subtle warm right-edge fade so text stays legible on left ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
            background: 'linear-gradient(90deg, rgba(247,235,217,0.55) 0%, rgba(247,235,217,0.18) 35%, transparent 60%)',
          }} />

          {/* ══ HERO TYPOGRAPHY — Premium left-pinned, Apple-style ══ */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: isMobile ? '90vw' : '38vw',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: isMobile ? '6vw' : '7vw',
            paddingRight: '2vw',
            pointerEvents: 'none',
          }}>
            {/* Eyebrow — fade up, delay 0 */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginBottom: 20,
              }}
            >
              {/* Amber pulse dot */}
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#F59E0B',
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 11,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                letterSpacing: '2.5px',
                color: '#92400E',
                textTransform: 'uppercase',
              }}>
                Academic &amp; Placement Ecosystem
              </span>
            </motion.div>

            {/* Main heading — "Campus Connect" */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: isMobile ? 'clamp(3rem, 12vw, 5.5rem)' : 'clamp(4.2rem, 7vw, 7.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                margin: 0,
                marginBottom: 28,
              }}
            >
              {/* Campus — solid dark charcoal, always visible */}
              <span style={{
                color: '#1F2937',
                display: 'block',
              }}>Campus</span>
              {/* Connect — solid amber, no webkit tricks, always visible */}
              <span style={{
                color: '#E8920A',
                display: 'block',
              }}>Connect</span>
            </motion.h1>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.34 }}
              style={{
                width: 56, height: 2,
                background: 'linear-gradient(90deg, #F59E0B 0%, #FCD34D 60%, transparent 100%)',
                borderRadius: 2,
                transformOrigin: 'left center',
                marginBottom: 22,
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
              style={{
                fontSize: isMobile ? 14 : 16,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                color: '#4B5563',
                lineHeight: 1.65,
                letterSpacing: '0px',
                margin: 0,
                marginBottom: 40,
                maxWidth: 340,
              }}
            >
              One Platform.{' '}
              <span style={{ color: '#B45309', fontWeight: 600 }}>Limitless</span>{' '}
              Possibilities.
            </motion.p>

            {/* Enter Portal — hidden until scroll completes (≥85%) */}
            <AnimatePresence>
              {isFinished && (
                <motion.div
                  key="enter-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <motion.button
                    onClick={() => {
                      const el = document.getElementById('choose-your-path-section')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    whileHover={{ scale: 1.04, boxShadow: '0 16px 44px rgba(245,158,11,0.38)', y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '13px 34px', borderRadius: 100,
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      border: 'none',
                      color: '#fff',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(245,158,11,0.28)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    Enter Portal
                    <span style={{ fontSize: 16, fontWeight: 400 }}>→</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Scroll indicator — visible only at very top ── */}
          <AnimatePresence>
            {scrollProgress < 0.04 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute', bottom: 32, left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  zIndex: 10, pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: 9, letterSpacing: '2.5px', color: 'rgba(55,65,81,0.45)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, textTransform: 'uppercase' }}>
                  SCROLL
                </span>
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  style={{ width: 1, height: 28, background: 'linear-gradient(180deg, rgba(245,158,11,0.6), transparent)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Thin scroll progress bar at bottom ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 2, background: 'rgba(245,158,11,0.12)',
            zIndex: 10, pointerEvents: 'none',
          }}>
            <motion.div
              style={{
                height: '100%',
                width: `${scrollProgress * 100}%`,
                background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CHOOSE YOUR PATH
      ══════════════════════════════════════════ */}
      <section
        id="choose-your-path-section"
        style={{
          minHeight: '100vh', width: '100%',
          position: 'relative', zIndex: 10,
          padding: '120px 24px 100px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#FFFDF8',
          borderTop: '1px solid rgba(255,154,61,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '600px' }}>
          <span style={{
            fontSize: '11px', fontFamily: 'var(--font-accent)',
            letterSpacing: '4px', color: 'var(--accent)',
            textTransform: 'uppercase', marginBottom: '16px',
            fontWeight: 700, display: 'block',
          }}>
            — SELECT YOUR PORTAL —
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 56px)',
            letterSpacing: '-2px', color: '#111827',
            lineHeight: 1.05, textTransform: 'uppercase',
          }}>
            Choose Your <span className="luxury-gradient-text">Path</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px', width: '100%', maxWidth: '1020px',
        }}>
          {PORTAL_CARDS.map(card => (
            <TiltCard
              key={card.id}
              card={card}
              onClick={() => {
                if (!isLoggedIn) { setTarget(card.path); setShowLogin(true) }
                else navigate(card.path)
              }}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PLATFORM ECOSYSTEM
      ══════════════════════════════════════════ */}
      <section style={sectionStyle}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(rgba(255,154,61,0.07) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ maxWidth: 1160, width: '100%', position: 'relative', zIndex: 1 }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
                <span style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-accent)' }}>— THE PLATFORM ECOSYSTEM —</span>
                <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--text)', lineHeight: 1.1 }}>
                Redefining Academic Preparation
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 520, margin: '16px auto 0', lineHeight: 1.75, fontFamily: 'var(--font-accent)', fontWeight: 500 }}>
                Everything you need to excel academically and land your dream job — all in one beautiful platform.
              </p>
            </div>
          </RevealSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {FEATURES.map((f, i) => (
              <RevealSection key={i} delay={i * 0.12}>
                <FeatureCard feature={f} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(255,154,61,0.04) 0%, rgba(255,184,77,0.03) 50%, rgba(255,216,107,0.02) 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(255,154,61,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1000, width: '100%', position: 'relative' }}>
          <RevealSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-3px', color: s.color, lineHeight: 1, marginBottom: 8 }}>
                    <AnimatedCounter target={s.value} suffix={s.value.includes('+') ? '+' : ''} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, fontFamily: 'var(--font-accent)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,154,61,0.08)', background: 'rgba(255,255,255,0.5)' }}>
        <RevealSection>
          <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
            <span style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-accent)', display: 'block', marginBottom: 12 }}>— STUDENT VOICES —</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text)' }}>What Students Are Saying</h2>
          </div>
        </RevealSection>
        <div style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 20, animation: 'marquee 35s linear infinite', width: 'max-content' }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 20, animation: 'marqueeReverse 40s linear infinite', width: 'max-content' }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => <TestimonialCard key={i + 100} t={t} flip />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <section ref={contactRef} id="contact-section" style={{ ...sectionStyle, background: 'rgba(252,252,253,0.9)', borderTop: '1px solid rgba(255,122,0,0.08)' }}>
        <div style={{ maxWidth: 1040, width: '100%' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span style={{ fontSize: 11, color: '#FF7A00', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: 16, fontFamily: 'var(--font-accent)' }}>— GET IN TOUCH —</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--text)', lineHeight: 1.1 }}>Have Questions? Reach Out</h2>
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: '✉️', title: 'Email Correspondence', desc: 'For platform bugs, support inquiries, student gates, or general suggestions.', link: 'support@campusconnect.space', href: 'mailto:support@campusconnect.space' },
                  { icon: '🏛️', title: 'Headquarters', desc: 'Engineering Portal Platform Office, Andhra Pradesh, India.', link: 'Visakhapatnam Gateway' },
                  { icon: '🤖', title: 'AI Assistant', desc: 'Use the floating chat button on any page to get instant help from our AI.', link: 'Available 24/7' },
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(255,122,0,0.1)' }} style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(28px)', border: '1px solid rgba(255,122,0,0.1)', borderRadius: 20, padding: '28px', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s ease' }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 10 }}>{item.desc}</p>
                    {item.href
                      ? <a href={item.href} style={{ fontFamily: 'var(--font-accent)', fontSize: 13, fontWeight: 700, color: '#FF7A00', textDecoration: 'none' }}>{item.link}</a>
                      : <span style={{ fontFamily: 'var(--font-accent)', fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{item.link}</span>
                    }
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ boxShadow: '0 32px 80px rgba(255,122,0,0.12)' }} style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(28px)', border: '1px solid rgba(255,122,0,0.12)', borderRadius: 24, padding: '40px 36px', boxShadow: 'var(--shadow-md)', transition: 'box-shadow 0.3s' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 28, letterSpacing: '-0.3px' }}>Send us a Message</h3>
                <form onSubmit={handleContactSubmit}>
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name', required: true },
                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'student@college.edu', required: true },
                    { label: 'Subject', key: 'subject', type: 'text', placeholder: 'How can we help?' },
                  ].map(field => (
                    <div key={field.key} style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>{field.label}</label>
                      <input
                        type={field.type} required={field.required} value={form[field.key]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        placeholder={field.placeholder} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,154,61,0.2)'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      required rows="4" value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us what you need support with..."
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,154,61,0.2)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <AnimatePresence>
                    {success && (
                      <motion.div initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '12px 16px', color: '#10B981', fontSize: 13, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>✓</span> Message dispatched! We'll reply soon.
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button
                    type="submit" disabled={loading}
                    whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 28px rgba(255,122,0,0.35)' } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{ width: '100%', padding: '14px', background: loading ? 'rgba(255,122,0,0.45)' : 'linear-gradient(135deg, #FF7A00, #FFB800)', border: 'none', borderRadius: 12, color: '#fff', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(255,122,0,0.2)' }}
                  >
                    {loading ? '⏳ Sending...' : 'Send Message →'}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: 'rgba(255,255,255,0.9)', borderTop: '1px solid rgba(255,122,0,0.08)', padding: '48px 40px 32px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FF7A00, #FFB800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, color: '#0B0F19' }}>Campus<span style={{ color: '#FF7A00' }}>Connect</span></span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', maxWidth: 280, lineHeight: 1.7 }}>Premium academic and placement preparation ecosystem for engineering students across Andhra Pradesh.</p>
            </div>
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {[
                { heading: 'Platform', links: [
                  { label: 'Student Portal', path: '/student' },
                  { label: 'Placement Portal', path: '/placement' },
                  { label: 'Skill Portal', path: '/placement' },
                  { label: 'AI Career Assistant', path: '/career' }
                ] },
                { heading: 'Company', links: [{ label: 'About Us', action: 'about' }, { label: 'Contact', path: '/contact' }] },
              ].map(col => (
                <div key={col.heading}>
                  <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase', marginBottom: 14, fontFamily: 'var(--font-accent)' }}>{col.heading}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.links.map(link => (
                      <a key={link.label} href={link.path || '#'} style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#FF7A00'} onMouseLeave={e => e.target.style.color = 'var(--text-2)'}>{link.label}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,122,0,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12, letterSpacing: '2px', color: 'rgba(255,122,0,0.65)' }}>CAMPUSCONNECT</div>
            <div style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.3px' }}>© {new Date().getFullYear()} CampusConnect. All rights reserved. Built with ❤️ for AP Students.</div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => { setShowLogin(false); if (target) navigate(target) }}
        />
      )}
    </div>
  )
}

/* ─── Static styles ─── */
const sectionStyle = {
  minHeight: '80vh', width: '100%', position: 'relative', zIndex: 3,
  padding: '120px 24px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(252,252,253,0.85)', backdropFilter: 'blur(16px)',
  borderTop: '1px solid rgba(255,122,0,0.08)', overflow: 'hidden',
}
const labelStyle = {
  display: 'block', fontSize: 11, color: 'var(--text-3)',
  marginBottom: 6, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
}
const inputStyle = {
  width: '100%', background: '#FFFDF8',
  border: '1px solid rgba(255,154,61,0.2)', borderRadius: 12,
  padding: '12px 16px', color: 'var(--text)', fontSize: 13,
  outline: 'none', fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}