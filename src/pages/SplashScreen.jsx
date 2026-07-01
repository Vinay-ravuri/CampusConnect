import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { pct: 18, text: 'Loading Resource Libraries…', t: 600 },
  { pct: 42, text: 'Preparing Portal Modules…', t: 650 },
  { pct: 68, text: 'Setting Up Regulations…', t: 580 },
  { pct: 88, text: 'Configuring AI Assistant…', t: 500 },
  { pct: 100, text: 'System Ready! 🚀', t: 400 },
]

const PILLS = ['JNTUK Regulation', 'AU Regulation', 'AI Assistant', 'Placement Prep', 'DSA Roadmap', 'Company Prep']
const MARQUEE_ITEMS = [
  'JNTU REGULATION', 'AU REGULATION', 'PLACEMENT PREP', 'APTITUDE', 'REASONING',
  'COMPANY WISE', 'AI ASSISTANT', 'DSA', 'DBMS', 'CN', 'OS',
  'JNTU REGULATION', 'AU REGULATION', 'PLACEMENT PREP', 'APTITUDE', 'REASONING',
  'COMPANY WISE', 'AI ASSISTANT', 'DSA', 'DBMS', 'CN', 'OS',
]

export default function SplashScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing System…')
  const [fadeOut, setFadeOut] = useState(false)
  const canvasRef = useRef(null)

  /* ── Particle Canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let animId

    // Particles
    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.5 + 0.8,
      c: ['#FF9A3D', '#FFB84D', '#FFD86B', '#FFA84D', '#FF7A00'][~~(Math.random() * 5)],
      alpha: Math.random() * 0.4 + 0.15,
    }))

    function tick() {
      ctx.clearRect(0, 0, W, H)

      // Draw particles
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.c
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  /* ── Progress Steps ── */
  useEffect(() => {
    let delay = 400
    STEPS.forEach(({ pct, text, t }) => {
      setTimeout(() => { setProgress(pct); setStatusText(text) }, delay)
      delay += t
    })
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setFadeOut(true), 600)
      setTimeout(() => navigate('/welcome'), 1300)
    }
  }, [progress, navigate])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#FFFDF8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      {/* Particle Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Ambient orbs */}
      <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,154,61,0.07) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: 'orbMove 10s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,184,77,0.05) 0%, transparent 65%)', bottom: '-80px', right: '-80px', animation: 'orbMove 14s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,216,107,0.04) 0%, transparent 65%)', top: '-40px', left: '-40px' }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,154,61,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,154,61,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}
      >
        {/* Logo Mark */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Outer ring */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid transparent', borderTopColor: 'var(--accent)',
            borderRightColor: 'rgba(255,154,61,0.25)',
            animation: 'spinSlow 2.5s linear infinite',
          }} />
          {/* Mid ring */}
          <div style={{
            position: 'absolute', inset: 12, borderRadius: '50%',
            border: '1.5px solid transparent', borderBottomColor: 'var(--accent-2)',
            borderLeftColor: 'rgba(255,184,77,0.25)',
            animation: 'spinReverse 1.8s linear infinite',
          }} />
          {/* Inner ring */}
          <div style={{
            position: 'absolute', inset: 24, borderRadius: '50%',
            border: '1px solid transparent', borderTopColor: '#FFA84D',
            animation: 'spinSlow 3.5s linear infinite',
          }} />
          {/* Core */}
          <motion.div
            animate={{ boxShadow: ['0 0 28px rgba(255,154,61,0.3), 0 0 60px rgba(255,154,61,0.1)', '0 0 50px rgba(255,154,61,0.5), 0 0 100px rgba(255,154,61,0.2)', '0 0 28px rgba(255,154,61,0.3), 0 0 60px rgba(255,154,61,0.1)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              width: 60, height: 60, borderRadius: 16,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 22, color: '#FFFDF8', letterSpacing: 1 }}>CC</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(42px, 8vw, 88px)',
              fontWeight: 900, letterSpacing: '1px', lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            <span style={{
              background: 'linear-gradient(to bottom, #111827 0%, rgba(17,24,39,0.7) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>CAMPUS</span>
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>CONNECT</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              fontSize: 11, letterSpacing: '4px', color: 'var(--text-4)',
              marginTop: 10, textTransform: 'uppercase',
              fontWeight: 600, fontFamily: 'var(--font-accent)',
            }}
          >
            Academic &amp; Placement Portal
          </motion.div>
        </div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ width: 'min(360px, 80vw)', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {/* Progress bar */}
          <div style={{
            width: '100%', height: 4, background: 'rgba(255,154,61,0.12)',
            borderRadius: 100, overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3))',
              backgroundSize: '200% 100%',
              borderRadius: 100,
              transition: 'width 0.65s cubic-bezier(0.4,0,0.2,1)',
              animation: 'barFlow 1.8s linear infinite',
            }} />
            {/* Leading dot */}
            <div style={{
              position: 'absolute', top: '50%', left: `${progress}%`,
              transform: 'translate(-50%,-50%)',
              width: 10, height: 10, borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 10px rgba(255,154,61,0.8), 0 0 20px rgba(255,154,61,0.4)',
              transition: 'left 0.65s cubic-bezier(0.4,0,0.2,1)',
              opacity: progress < 100 ? 1 : 0,
            }} />
          </div>

          {/* Status row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={statusText}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: 11, color: 'var(--accent)', letterSpacing: '1px',
                  fontWeight: 700, fontFamily: 'var(--font-accent)',
                }}
              >
                {statusText}
              </motion.span>
            </AnimatePresence>
            <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'monospace', fontWeight: 600 }}>
              {progress}%
            </span>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480 }}
        >
          {PILLS.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.08, type: 'spring', stiffness: 200 }}
              style={{
                fontSize: 11, padding: '5px 14px', borderRadius: 100,
                background: 'rgba(255,154,61,0.08)',
                color: 'var(--accent)', border: '1px solid rgba(255,154,61,0.18)',
                fontWeight: 700, letterSpacing: '0.5px',
                fontFamily: 'var(--font-accent)',
              }}
            >{t}</motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Marquee */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        overflow: 'hidden', borderTop: '1px solid rgba(255,154,61,0.08)', padding: '12px 0',
        background: 'rgba(255,253,248,0.5)', backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', gap: 56, animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}>
          {MARQUEE_ITEMS.map((t, i) => (
            <span key={i} style={{ fontSize: 11, color: 'rgba(255,154,61,0.4)', letterSpacing: '3px', fontWeight: 700, fontFamily: 'var(--font-accent)' }}>
              {t} <span style={{ color: 'rgba(255,154,61,0.5)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}