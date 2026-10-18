import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_FRAMES = 71
const FOLDER = '/laptop-sequence'

function padNum(n) {
  return String(n).padStart(3, '0')
}

function frameUrl(i) {
  return `${FOLDER}/ezgif-frame-${padNum(i + 1)}.webp`
}

export default function CinematicHero({ onScrollProgressChange, onExploreClick }) {
  const trackRef = useRef(null)
  const canvasRef = useRef(null)
  const particlesCanvasRef = useRef(null)

  // Decoded image bitmaps for smooth 60fps GPU rendering
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

  /* ── Draw pre-decoded bitmap to canvas ── */
  const drawFrame = useCallback((bmp) => {
    const canvas = canvasRef.current
    if (!canvas || !bmp) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const cw = canvas.width
    const ch = canvas.height
    const iw = bmp.width
    const ih = bmp.height

    ctx.clearRect(0, 0, cw, ch)

    // Fit and center crisply without over-zooming so native 1080p details remain razor sharp
    const isMobile = window.innerWidth < 900
    const hRatio = cw / iw
    const vRatio = ch / ih
    const scaleFactor = isMobile ? 1.02 : 1.06
    const ratio = Math.max(hRatio, vRatio) * scaleFactor

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
          const cur = Math.round(currentFrameRef.current)
          if (cur === idx || (idx === 0 && !bitmapsRef.current[cur])) {
            drawFrame(bmp)
          }
          if (count >= 2) {
            setIsLoaded(true)
            const activeBmp = bitmapsRef.current[cur] || bitmapsRef.current[0]
            if (activeBmp) drawFrame(activeBmp)
          }
        })
        .catch(() => {})
    })

    const timer = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        loadBitmap(i)
      }
    }, 300)

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
        currentFrameRef.current += diff * 0.18
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

  /* ── Track Scroll Progress ── */
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

      if (onScrollProgressChange) {
        onScrollProgressChange(progress, -rect.top)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onScrollProgressChange])

  /* ── Floating Golden Particles Background ── */
  useEffect(() => {
    const canvas = particlesCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.1,
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
      ref={trackRef}
      style={{
        height: '400vh',
        position: 'relative',
        background: '#05070B',
        color: '#FFFFFF',
        fontFamily: 'var(--font-heading)',
        zIndex: 10,
      }}
    >
      {/* Sticky 100vh Hero Environment */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: '#05070B',
          zIndex: 2,
        }}
      >
        {/* Background Particles Canvas */}
        <canvas
          ref={particlesCanvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.65,
          }}
        />

        {/* Cinematic Atmospheric Warm Glow & Radial Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 65% 55% at 72% 52%, rgba(249, 115, 22, 0.14) 0%, rgba(253, 186, 18, 0.06) 42%, rgba(5, 7, 11, 0.85) 75%, #05070B 100%), radial-gradient(circle at 20% 70%, rgba(244, 81, 30, 0.05) 0%, transparent 60%)',
          }}
        />

        {/* ════ CANVAS SEQUENCE (Full Hero Atmosphere Layer) ════ */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 'clamp(16px, 3.5vw, 64px)',
          }}
        >
          {/* Canvas Wrapper with Razor-Sharp Frame (No Murky Blurs, 100% Solid Opacity) */}
          <div
            className="cinematic-canvas-wrapper"
            style={{
              position: 'relative',
              width: 'clamp(580px, 56vw, 1160px)',
              height: 'clamp(520px, 88vh, 880px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              /* Smooth edge dissolve strictly at outer perimeter, preserving 100% crisp center */
              maskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 72%, rgba(0, 0, 0, 0.82) 84%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 72%, rgba(0, 0, 0, 0.82) 84%, transparent 100%)',
            }}
          >
            {/* Glowing Pedestal Backdrop Ring */}
            <div
              style={{
                position: 'absolute',
                bottom: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '84%',
                height: '90px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(253, 186, 18, 0.4) 0%, rgba(249, 115, 22, 0.18) 50%, transparent 75%)',
                filter: 'blur(24px)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            {!prefersReducedMotion ? (
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  zIndex: 2,
                  filter: 'contrast(1.04) brightness(1.02) saturate(1.12)',
                }}
              />
            ) : (
              <img
                src="/laptop-sequence/ezgif-frame-001.webp"
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

            {/* Warm Golden Atmosphere Bloom Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 4,
                pointerEvents: 'none',
                background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(249, 115, 22, 0.12) 0%, rgba(253, 186, 18, 0.05) 42%, transparent 75%)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </div>

        {/* ════ HERO CONTENT COMPOSITION (Overlaid Left Column) ════ */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 clamp(24px, 5vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          {/* Left Hero Typography Hierarchy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              maxWidth: '560px',
              paddingTop: '20px',
              pointerEvents: 'auto',
            }}
          >
            {/* Eyebrow with Amber Accent Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '2px',
                  background: '#FDBA12',
                }}
              />
              <span
                style={{
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: '#FDBA12',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                ACADEMIC &amp; PLACEMENT ECOSYSTEM
              </span>
            </div>

            {/* Giant Main Title: Campus (White) Connect (Orange/Gold) */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(56px, 7.8vw, 108px)',
                fontWeight: 800,
                lineHeight: 0.94,
                letterSpacing: '-0.04em',
                margin: '0 0 18px 0',
              }}
            >
              <span
                style={{
                  color: '#FFFFFF',
                  display: 'block',
                  textShadow: '0 4px 28px rgba(0, 0, 0, 0.6)',
                }}
              >
                Campus
              </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #F97316 0%, #FDBA12 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 28px rgba(249, 115, 22, 0.35))',
                }}
              >
                Connect
              </span>
            </h1>

            {/* Accent Underline Bar */}
            <div
              style={{
                width: '38px',
                height: '3px',
                background: '#FDBA12',
                borderRadius: '2px',
                marginBottom: '24px',
              }}
            />

            {/* Subtitle */}
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(18px, 1.8vw, 23px)',
                fontWeight: 600,
                color: '#FFFFFF',
                margin: '0 0 12px 0',
                letterSpacing: '-0.01em',
              }}
            >
              One Platform. Limitless Possibilities.
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(14px, 1.15vw, 16px)',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.6,
                maxWidth: '440px',
                margin: '0 0 36px 0',
              }}
            >
              Your complete academic and placement ecosystem built for AP engineering students.
            </p>

            {/* Bottom-left: Mouse Scroll Indicator */}
            <div
              onClick={() => {
                if (onExploreClick) onExploreClick()
                else {
                  window.scrollTo({ top: window.innerHeight * 3.5, behavior: 'smooth' })
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                width: 'fit-content',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '32px',
                  borderRadius: '12px',
                  border: '2px solid #FDBA12',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '5px',
                  boxShadow: '0 0 12px rgba(249, 115, 22, 0.25)',
                }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '3.5px',
                    height: '6px',
                    borderRadius: '2px',
                    background: '#F97316',
                  }}
                />
              </div>

              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '2px',
                  fontWeight: 800,
                  color: '#FDBA12',
                  textTransform: 'uppercase',
                }}
              >
                SCROLL TO EXPLORE
              </span>
            </div>
          </motion.div>
        </div>

        {/* Assemble complete notification badge (bottom center) */}
        <AnimatePresence>
          {isAssembled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                bottom: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => {
                  if (onExploreClick) onExploreClick()
                  else {
                    window.scrollTo({ top: window.innerHeight * 4, behavior: 'smooth' })
                  }
                }}
                style={{
                  padding: '12px 28px',
                  borderRadius: '100px',
                  background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #F4511E 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.45)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>ENTER PORTAL</span>
                <span>↓</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Percentage Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: 'clamp(24px, 5vw, 80px)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '1px',
          }}
        >
          <span>PROGRESS</span>
          <span style={{ color: '#F97316' }}>{Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>

      {/* Atmospheric Seamless Bottom Transition into Warm Ivory (#FFF9F0) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(5, 7, 11, 0.8) 40%, #FFF9F0 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <style>{`
        @media (max-width: 900px) {
          .cinematic-canvas-wrapper {
            width: 100vw !important;
            height: 68vh !important;
            margin-right: 0 !important;
            opacity: 1 !important;
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.2) 8%, black 22%, black 80%, transparent 100%) !important;
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.2) 8%, black 22%, black 80%, transparent 100%) !important;
          }
        }
      `}</style>
    </div>
  )
}

