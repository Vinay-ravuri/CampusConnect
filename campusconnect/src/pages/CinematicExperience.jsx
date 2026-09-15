import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'

const TOTAL_FRAMES = 71
const FOLDER = '/laptop-sequence'

function padNum(n) {
  return String(n).padStart(3, '0')
}

function frameUrl(i) {
  return `${FOLDER}/ezgif-frame-${padNum(i + 1)}.webp`
}

export default function CinematicExperience() {
  const navigate = useNavigate()
  const trackRef = useRef(null)
  const canvasRef = useRef(null)
  const particlesCanvasRef = useRef(null)
  
  // Decoded image bitmaps for zero-jank GPU rendering
  const bitmapsRef = useRef(new Array(TOTAL_FRAMES).fill(null))
  const loadingRef = useRef(new Array(TOTAL_FRAMES).fill(false))
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const rafRef = useRef(null)
  const particlesRafRef = useRef(null)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAssembled, setIsAssembled] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  /* ── Draw pre-decoded bitmap to canvas with contain/cover fit ── */
  const drawFrame = useCallback((bmp) => {
    const canvas = canvasRef.current
    if (!canvas || !bmp) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = bmp.width
    const ih = bmp.height

    ctx.clearRect(0, 0, cw, ch)

    // Fit contain with slight upscale
    const hRatio = cw / iw
    const vRatio = ch / ih
    const ratio = Math.min(hRatio, vRatio)

    const dw = iw * ratio
    const dh = ih * ratio
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.drawImage(bmp, dx, dy, dw, dh)
  }, [])

  /* ── Load single frame bitmap ── */
  const loadBitmap = useCallback((index) => {
    if (index < 0 || index >= TOTAL_FRAMES) return
    if (bitmapsRef.current[index] || loadingRef.current[index]) return
    loadingRef.current[index] = true

    fetch(frameUrl(index))
      .then((res) => res.blob())
      .then((blob) => createImageBitmap(blob, { colorSpaceConversion: 'none' }))
      .then((bmp) => {
        bitmapsRef.current[index] = bmp
        if (Math.abs(Math.round(currentFrameRef.current) - index) <= 1) {
          drawFrame(bmp)
        }
      })
      .catch(() => {
        loadingRef.current[index] = false
      })
  }, [drawFrame])

  /* ── Preload initial keyframes ── */
  useEffect(() => {
    let count = 0
    const eagerIndices = [0, 1, 2, 3, 4, 15, 25, 35, 45, 55, 65, 70]
    eagerIndices.forEach((idx) => {
      fetch(frameUrl(idx))
        .then((r) => r.blob())
        .then((b) => createImageBitmap(b))
        .then((bmp) => {
          bitmapsRef.current[idx] = bmp
          count++
          if (count >= 3) {
            setIsLoaded(true)
            if (idx === 0) drawFrame(bmp)
          }
        })
        .catch(() => {})
    })

    // Preload remainder progressively
    const timer = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        loadBitmap(i)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [drawFrame, loadBitmap])

  /* ── Canvas Resize ── */
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvasRef.current.width = rect.width * dpr
      canvasRef.current.height = rect.height * dpr

      const currentBmp = bitmapsRef.current[Math.round(currentFrameRef.current)]
      if (currentBmp) drawFrame(currentBmp)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawFrame])

  /* ── Scroll Lerp Render Loop ── */
  useEffect(() => {
    if (prefersReducedMotion) return

    const tick = () => {
      const target = targetFrameRef.current
      const current = currentFrameRef.current
      const diff = target - current

      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.15
        const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)))
        const bmp = bitmapsRef.current[frameIdx]
        if (bmp) {
          drawFrame(bmp)
        } else {
          loadBitmap(frameIdx)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [drawFrame, loadBitmap, prefersReducedMotion])

  /* ── Track Scroll Progress on the pinned section ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const scrollableDist = rect.height - window.innerHeight
      if (scrollableDist <= 0) return

      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDist))
      setScrollProgress(progress)
      setIsAssembled(progress > 0.85)

      targetFrameRef.current = progress * (TOTAL_FRAMES - 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Atmospheric Floating Particles Background ── */
  useEffect(() => {
    const canvas = particlesCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.4 - 0.1,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.35 + 0.15,
      color: Math.random() > 0.4 ? '#FDBA12' : '#F97316',
    }))

    const renderParticles = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < 0) p.y = H
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      ctx.globalAlpha = 1

      particlesRafRef.current = requestAnimationFrame(renderParticles)
    }

    particlesRafRef.current = requestAnimationFrame(renderParticles)

    const handlePResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handlePResize)

    return () => {
      cancelAnimationFrame(particlesRafRef.current)
      window.removeEventListener('resize', handlePResize)
    }
  }, [])

  return (
    <div
      style={{
        background: '#0B0F19',
        color: '#FFFFFF',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
        fontFamily: 'var(--font-heading)',
      }}
    >
      {/* ─── GLOBAL REUSABLE DARK NAVBAR ─────────────────────── */}
      <Navbar isDark={true} />

      {/* ─── ATMOSPHERIC PARTICLES CANVAS ────────────────────── */}
      <canvas
        ref={particlesCanvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.65,
        }}
      />

      {/* ─── AMBIENT VOLUMETRIC GLOW ─────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 68% 54%, rgba(249, 115, 22, 0.14) 0%, rgba(253, 186, 18, 0.05) 45%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(244, 81, 30, 0.12) 0%, transparent 60%), #0B0F19',
        }}
      />

      {/* ─── SCROLL TRACK FOR PINNED CINEMATIC EXPERIENCE ────── */}
      <div
        ref={trackRef}
        style={{
          height: '240vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Sticky 100vh viewport */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '0 clamp(24px, 5vw, 80px)',
          }}
        >
          {/* ─── TWO-COLUMN CINEMATIC COMPOSITION ─────────────── */}
          <div
            style={{
              width: '100%',
              maxWidth: '1440px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.3fr)',
              alignItems: 'center',
              gap: 'clamp(20px, 4vw, 60px)',
              position: 'relative',
              zIndex: 3,
            }}
            className="cinematic-grid"
          >
            {/* ════ LEFT COLUMN: TYPOGRAPHY HIERARCHY ════ */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: '40px',
                zIndex: 4,
              }}
            >
              {/* Small Orange Accent Bar */}
              <div
                style={{
                  width: '52px',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #FDBA12, #F97316)',
                  marginBottom: '20px',
                  boxShadow: '0 0 12px rgba(249, 115, 22, 0.6)',
                }}
              />

              {/* Eyebrow */}
              <span
                style={{
                  fontSize: 'clamp(11px, 1.1vw, 13px)',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: 'var(--cc-yellow, #FDBA12)',
                  marginBottom: '16px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                ACADEMIC &amp; PLACEMENT ECOSYSTEM
              </span>

              {/* Main Heading (Two Lines: Campus white, Connect orange) */}
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(44px, 6vw, 88px)',
                  fontWeight: 800,
                  lineHeight: 0.94,
                  letterSpacing: '-0.04em',
                  margin: '0 0 24px 0',
                  textTransform: 'none',
                }}
              >
                <span
                  style={{
                    color: '#FFFFFF',
                    display: 'block',
                    textShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  Campus
                </span>
                <span
                  style={{
                    color: 'var(--cc-orange, #F97316)',
                    display: 'block',
                    textShadow: '0 4px 32px rgba(249, 115, 22, 0.35)',
                  }}
                >
                  Connect
                </span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: 'clamp(17px, 1.7vw, 23px)',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.35,
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                One Platform. Limitless Possibilities.
              </p>

              {/* Description (Two lines, soft gray) */}
              <p
                style={{
                  fontSize: 'clamp(13.5px, 1.15vw, 16px)',
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.6,
                  maxWidth: '440px',
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                }}
              >
                Your complete academic and placement ecosystem<br />
                built for AP engineering students.
              </p>

              {/* Dynamic Assembly Status Badge */}
              <div
                style={{
                  marginTop: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 16px',
                  borderRadius: '100px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  backdropFilter: 'blur(16px)',
                  width: 'fit-content',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isAssembled ? '#10B981' : '#FDBA12',
                    boxShadow: isAssembled ? '0 0 10px #10B981' : '0 0 10px #FDBA12',
                    transition: 'all 0.3s ease',
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
                  {isAssembled ? 'Ecosystem Assembled & Ready' : `Assembling Building Blocks (${Math.round(scrollProgress * 100)}%)`}
                </span>
              </div>
            </motion.div>

            {/* ════ RIGHT COLUMN: FLOATING LAPTOP & HARDWARE CANVAS ════ */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(380px, 60vh, 640px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Circular Illuminated Golden Base Platform */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'clamp(280px, 45vw, 560px)',
                  height: 'clamp(70px, 12vw, 130px)',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at center, rgba(253, 186, 18, 0.28) 0%, rgba(249, 115, 22, 0.12) 50%, transparent 80%)',
                  border: '1px solid rgba(253, 186, 18, 0.22)',
                  boxShadow: '0 0 60px rgba(249, 115, 22, 0.35), inset 0 0 30px rgba(253, 186, 18, 0.15)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* Outer Golden Energy Ring Trails */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '50%',
                  transform: 'translateX(-50%) scaleY(0.4)',
                  width: 'clamp(320px, 52vw, 640px)',
                  height: 'clamp(320px, 52vw, 640px)',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(253, 186, 18, 0.25)',
                  boxShadow: '0 0 30px rgba(253, 186, 18, 0.20)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />

              {/* Main Sequence Canvas */}
              {!prefersReducedMotion ? (
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 2,
                    filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6))',
                  }}
                />
              ) : (
                /* Static High-Resolution Fallback Poster for Reduced Motion */
                <img
                  src="/laptop-sequence/ezgif-frame-035.webp"
                  alt="Campus Connect digital ecosystem assembled with floating components and glowing platform"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
              )}

              {/* Enter Portal CTA on Completion */}
              <AnimatePresence>
                {isAssembled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 12 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: 'absolute',
                      bottom: '12%',
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={() => navigate('/choose')}
                      style={{
                        padding: '13px 32px',
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #F4511E 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '0.6px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.45)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span>ENTER STUDENT PORTAL</span>
                      <span style={{ fontSize: '16px' }}>→</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── BOTTOM-LEFT SCROLL INDICATOR ─────────────────── */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: 'clamp(24px, 5vw, 80px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10,
              opacity: scrollProgress > 0.8 ? 0.3 : 0.85,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Mouse indicator icon */}
            <div
              style={{
                width: '20px',
                height: '32px',
                borderRadius: '12px',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '5px',
              }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '3px',
                  height: '6px',
                  borderRadius: '2px',
                  background: 'var(--cc-orange, #F97316)',
                }}
              />
            </div>

            <span
              style={{
                fontSize: '11px',
                letterSpacing: '2px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
              }}
            >
              SCROLL TO EXPLORE
            </span>
          </div>

          {/* ─── BOTTOM-RIGHT PROGRESS PERCENTAGE ─────────────── */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: 'clamp(24px, 5vw, 80px)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.45)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span>PROGRESS</span>
            <span style={{ color: 'var(--cc-orange, #F97316)' }}>
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cinematic-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .cinematic-grid > div:first-child {
            align-items: center;
            text-align: center;
            padding-top: 10px;
          }
          .cinematic-grid > div:first-child p {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </div>
  )
}
