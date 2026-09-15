import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const TOTAL_FRAMES = 71
const FOLDER = '/laptop-sequence'

function padNum(n) {
  return String(n).padStart(3, '0')
}

function frameUrl(i) {
  return `${FOLDER}/ezgif-frame-${padNum(i + 1)}.webp`
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Track and canvas refs
  const trackRef = useRef(null)
  const canvasRef = useRef(null)
  const particlesCanvasRef = useRef(null)
  const dashboardContentRef = useRef(null)

  // Bitmaps caching for smooth 60fps GPU drawing
  const bitmapsRef = useRef(new Array(TOTAL_FRAMES).fill(null))
  const loadingRef = useRef(new Array(TOTAL_FRAMES).fill(false))
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const rafRef = useRef(null)
  const particlesRafRef = useRef(null)

  // Scroll and assembly states
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Live Dashboard Data from GET /api/dashboard
  const [dashboardData, setDashboardData] = useState(null)
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  const [dashboardError, setDashboardError] = useState(null)

  // Fetch dashboard data from backend
  useEffect(() => {
    let isMounted = true
    const fetchDashboard = async () => {
      try {
        setLoadingDashboard(true)
        const res = await api.get('/dashboard')
        if (isMounted) {
          setDashboardData(res.data)
          setLoadingDashboard(false)
        }
      } catch (err) {
        console.warn('Dashboard API failed or backend in mock mode:', err)
        if (isMounted) {
          // Provide fallback structure if backend is not reachable
          setDashboardData({
            profile: {
              name: user?.name || 'Engineering Student',
              email: user?.email || 'student@college.edu',
              university: 'JNTUK',
              branch: 'CSE',
              semester: 'Sem 5',
              cgpa: 8.4,
              targetRole: 'Software Engineer',
              skills: ['Java', 'Data Structures', 'SQL', 'React'],
            },
            academic: {
              activeRegulation: 'R20',
              subjects: [
                { id: 1, name: 'Database Management Systems', regulationCode: 'JNTUK', semester: 'Sem 5', branch: 'CSE' },
                { id: 2, name: 'Computer Networks', regulationCode: 'JNTUK', semester: 'Sem 5', branch: 'CSE' },
                { id: 3, name: 'Operating Systems', regulationCode: 'JNTUK', semester: 'Sem 5', branch: 'CSE' },
                { id: 4, name: 'Design and Analysis of Algorithms', regulationCode: 'JNTUK', semester: 'Sem 5', branch: 'CSE' },
              ],
              continueLearning: {
                subjectId: 1,
                subjectName: 'Database Management Systems',
                unitNum: 3,
                unitTitle: 'Unit 3: Relational Algebra & SQL Mastery',
                regCode: 'JNTUK',
              },
              bookmarks: [],
            },
            placement: {
              progress: {
                readinessScore: 35,
                totalCompleted: 7,
                totalTopics: 20,
                trackProgress: {
                  'dsa': { completed: 3, total: 6, percentage: 50 },
                  'dbms': { completed: 2, total: 4, percentage: 50 },
                  'sql': { completed: 1, total: 3, percentage: 33 },
                  'oop': { completed: 1, total: 3, percentage: 33 },
                  'os': { completed: 0, total: 2, percentage: 0 },
                  'cn': { completed: 0, total: 2, percentage: 0 },
                }
              }
            },
            jobs: {
              applications: [],
              savedJobs: [],
              featuredJobs: [
                { id: '1', title: 'Graduate Software Engineer', company: 'Google', location: 'Hyderabad, India', type: 'Full-time', salary: '₹18 - ₹24 LPA' },
                { id: '2', title: 'Associate Java Developer', company: 'Microsoft', location: 'Bengaluru, India', type: 'Full-time', salary: '₹16 - ₹22 LPA' },
                { id: '3', title: 'Cloud Platform Intern', company: 'Amazon AWS', location: 'Hyderabad, India', type: 'Internship', salary: '₹60,000 / mo' },
              ]
            },
            resume: {
              hasResume: false,
              targetRole: 'Software Engineer',
              atsScore: null,
              topImprovement: 'Upload your resume in PDF format to receive instant AI ATS score and keyword gap analysis.',
            },
            ai: {
              headline: 'Strengthen Core SQL & DSA',
              recommendation: 'Complete 3 more DSA problems and practice SQL window functions before tackling backend interviews.',
              actionLabel: 'Practice SQL & DSA',
              actionUrl: '/placement',
            },
            activity: [],
            quickActions: [
              { label: 'Continue Learning', path: '/student', icon: '📖', desc: 'Resume academic curriculum' },
              { label: 'Practice DSA', path: '/placement', icon: '💻', desc: 'Coding challenges & structures' },
              { label: 'Practice SQL', path: '/placement', icon: '🗄️', desc: 'Relational queries & joins' },
              { label: 'Find Jobs', path: '/jobs', icon: '🎯', desc: 'Explore graduate & intern roles' },
              { label: 'Analyze Resume', path: '/career', icon: '📄', desc: 'AI ATS scoring & suggestions' },
              { label: 'Ask Campus AI', path: '/career', icon: '✨', desc: '24/7 personalized mentorship' },
            ],
            isNewStudent: true,
          })
          setLoadingDashboard(false)
        }
      }
    }

    fetchDashboard()
    return () => { isMounted = false }
  }, [user])

  // Reduced motion detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const listener = (e) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  /* ── Canvas Draw Function (Contain / Cover Fit) ── */
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

    const hRatio = cw / iw
    const vRatio = ch / ih
    const ratio = Math.min(hRatio, vRatio)

    const dw = iw * ratio
    const dh = ih * ratio
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.drawImage(bmp, dx, dy, dw, dh)
  }, [])

  /* ── Load single frame bitmap with GPU decoding ── */
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

  /* ── Initial Eager Preload ── */
  useEffect(() => {
    let count = 0
    const eager = [0, 1, 2, 3, 4, 15, 25, 35, 45, 55, 65, 70]
    eager.forEach((idx) => {
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

    const timer = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        loadBitmap(i)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [drawFrame, loadBitmap])

  /* ── Canvas Resize Observer ── */
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

  /* ── Smooth RAF Lerp Loop (Bi-directional, zero jumps) ── */
  useEffect(() => {
    if (prefersReducedMotion) return

    const tick = () => {
      const target = targetFrameRef.current
      const current = currentFrameRef.current
      const diff = target - current

      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.16
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

  /* ── Scroll Progress Mapping (0% to 100% and 100% to 0% fully reversible) ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const scrollableDist = rect.height - window.innerHeight
      if (scrollableDist <= 0) return

      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDist))
      setScrollProgress(progress)

      // Map progress directly to frame index
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

    const particles = Array.from({ length: 36 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -Math.random() * 0.35 - 0.08,
      radius: Math.random() * 2.2 + 0.6,
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

  // Quick scroll helper
  const scrollToDashboard = () => {
    if (dashboardContentRef.current) {
      dashboardContentRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Safe data access
  const profile = dashboardData?.profile || {}
  const academic = dashboardData?.academic || {}
  const placement = dashboardData?.placement?.progress || {}
  const jobs = dashboardData?.jobs || {}
  const resume = dashboardData?.resume || {}
  const ai = dashboardData?.ai || {}
  const activity = dashboardData?.activity || []
  const quickActions = dashboardData?.quickActions || []

  const readinessScore = placement.readinessScore || 0
  const isAssembled = scrollProgress >= 0.85

  return (
    <div
      style={{
        background: '#0B0F19',
        color: '#FFFFFF',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
        fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
      }}
    >
      {/* ─── FLOATING GLASS DASHBOARD NAVBAR ─── */}
      <DashboardNavbar studentName={profile.name} studentEmail={profile.email} />

      {/* ─── ATMOSPHERIC PARTICLES CANVAS ─── */}
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

      {/* ─── VOLUMETRIC GLOW & GRAPHITE AMBIENCE ─── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 68% 45%, rgba(249, 115, 22, 0.16) 0%, rgba(253, 186, 18, 0.06) 45%, transparent 72%), radial-gradient(circle at 40% 90%, rgba(234, 88, 12, 0.14) 0%, transparent 65%), #0B0F19',
        }}
      />

      {/* ════════════════════════════════════════════════════════════
          HERO PINNED SECTION: 3D SCROLL HARDWARE ASSEMBLY
      ════════════════════════════════════════════════════════════ */}
      <div
        ref={trackRef}
        style={{
          height: '240vh',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '0 clamp(20px, 4vw, 70px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1440px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.35fr)',
              alignItems: 'center',
              gap: 'clamp(20px, 4vw, 60px)',
              position: 'relative',
              zIndex: 3,
            }}
            className="cc-hero-grid"
          >
            {/* LEFT COLUMN: Large Editorial Typography */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                zIndex: 4,
              }}
            >
              {/* Illuminated Golden Accent Bar */}
              <div
                style={{
                  width: '56px',
                  height: '3.5px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #FDBA12, #F97316)',
                  marginBottom: '18px',
                  boxShadow: '0 0 16px rgba(249, 115, 22, 0.75)',
                }}
              />

              {/* Eyebrow */}
              <span
                style={{
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: '#FDBA12',
                  marginBottom: '14px',
                }}
              >
                STUDENT COMMAND CENTER
              </span>

              {/* Main Headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  fontSize: 'clamp(44px, 5.8vw, 84px)',
                  fontWeight: 800,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  margin: '0 0 20px 0',
                }}
              >
                <span style={{ color: '#FFFFFF', display: 'block', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
                  Campus
                </span>
                <span style={{ color: '#F97316', display: 'block', textShadow: '0 4px 32px rgba(249, 115, 22, 0.4)' }}>
                  Connect
                </span>
              </h1>

              {/* Editorial Subtitle */}
              <p
                style={{
                  fontSize: 'clamp(17px, 1.6vw, 22px)',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.35,
                  margin: '0 0 12px 0',
                }}
              >
                Your academic and career command center.
              </p>

              {/* Secondary Supporting Statement */}
              <p
                style={{
                  fontSize: 'clamp(13px, 1.1vw, 15px)',
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.6,
                  maxWidth: '460px',
                  margin: '0 0 28px 0',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                }}
              >
                Learn. Practice. Apply. Grow. A unified 3D-assembled operating system engineered for your academic success and career readiness.
              </p>

              {/* Assembly Status Capsule */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 18px',
                  borderRadius: '100px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(249, 115, 22, 0.28)',
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
                    boxShadow: isAssembled ? '0 0 12px #10B981' : '0 0 12px #FDBA12',
                    transition: 'all 0.3s ease',
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '0.4px' }}>
                  {isAssembled
                    ? 'Command Center Assembled & Synchronized'
                    : `Converging Hardware Components (${Math.round(scrollProgress * 100)}%)`}
                </span>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Floating 3D Laptop Hardware & Glowing Platform */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(380px, 62vh, 640px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Metallic Glowing Circular Base Platform */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '9%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'clamp(280px, 46vw, 580px)',
                  height: 'clamp(70px, 12vw, 130px)',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at center, rgba(253, 186, 18, 0.32) 0%, rgba(249, 115, 22, 0.14) 52%, transparent 80%)',
                  border: '1px solid rgba(253, 186, 18, 0.28)',
                  boxShadow: '0 0 70px rgba(249, 115, 22, 0.4), inset 0 0 32px rgba(253, 186, 18, 0.2)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* Concentric Golden Energy Ring Trails */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '6%',
                  left: '50%',
                  transform: 'translateX(-50%) scaleY(0.38)',
                  width: 'clamp(320px, 52vw, 640px)',
                  height: 'clamp(320px, 52vw, 640px)',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(253, 186, 18, 0.26)',
                  boxShadow: '0 0 36px rgba(253, 186, 18, 0.22)',
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
                    filter: 'drop-shadow(0 24px 44px rgba(0, 0, 0, 0.7))',
                  }}
                />
              ) : (
                <img
                  src="/laptop-sequence/ezgif-frame-035.webp"
                  alt="Campus Connect 3D Assembled Student Command Center"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 2,
                  }}
                />
              )}

              {/* Scroll To Dashboard CTA Pill on Assembly */}
              <AnimatePresence>
                {isAssembled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 14 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      position: 'absolute',
                      bottom: '10%',
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={scrollToDashboard}
                      style={{
                        padding: '13px 32px',
                        borderRadius: '100px',
                        background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #EA580C 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                        letterSpacing: '0.8px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span>ACCESS COMMAND CENTER</span>
                      <span style={{ fontSize: '16px' }}>↓</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '28px',
              left: 'clamp(20px, 4vw, 70px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10,
              opacity: scrollProgress > 0.85 ? 0.35 : 0.85,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '28px',
                borderRadius: '10px',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '4px',
              }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '3px',
                  height: '6px',
                  borderRadius: '2px',
                  background: '#F97316',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '10.5px',
                letterSpacing: '2px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.75)',
                textTransform: 'uppercase',
              }}
            >
              SCROLL TO ASSEMBLE
            </span>
          </div>

          {/* Bottom Progress Counter */}
          <div
            style={{
              position: 'absolute',
              bottom: '28px',
              right: 'clamp(20px, 4vw, 70px)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.45)',
              letterSpacing: '1px',
            }}
          >
            <span>SYSTEM STATE</span>
            <span style={{ color: '#F97316', fontWeight: 800 }}>
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          LIVE STUDENT COMMAND CENTER DASHBOARD (REVEALED SECTION)
      ════════════════════════════════════════════════════════════ */}
      <div
        ref={dashboardContentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'linear-gradient(180deg, #0B0F19 0%, #101625 50%, #0B0F19 100%)',
          borderTop: '1px solid rgba(253, 186, 18, 0.18)',
          boxShadow: '0 -24px 60px rgba(0, 0, 0, 0.9)',
          padding: '60px clamp(20px, 4vw, 80px) 100px',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

          {/* ─── SECTION HEADER / COMMAND STATUS ─── */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '24px',
              marginBottom: '44px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '28px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#FDBA12',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                <span>OPERATING SYSTEM</span>
                <span>•</span>
                <span>ONLINE</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: 800,
                  margin: 0,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                Welcome back, <span style={{ color: '#F97316' }}>{profile.name || 'Student'}</span>
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: '8px 0 0 0',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                }}
              >
                {profile.university || 'JNTUK'} • {profile.branch || 'CSE'} • {profile.semester || 'Sem 5'} • Target: {profile.targetRole || 'Software Engineer'}
              </p>
            </div>

            {/* Quick Metrics Capsule */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 20px',
                borderRadius: '16px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Placement Readiness
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FDBA12' }}>
                  {readinessScore}%
                </div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Active Regulation
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                  {academic.activeRegulation || 'R20'}
                </div>
              </div>
            </div>
          </div>

          {/* ─── GRID LAYOUT: 10 ARCHITECTURAL AREAS ─── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '24px',
            }}
          >

            {/* ════ 1. TODAY'S PLAN (Full or 8 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 8',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(253, 186, 18, 0.22)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="cc-col-12-mobile"
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(253, 186, 18, 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🎯</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                    Today's Plan
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    padding: '4px 10px',
                    borderRadius: '100px',
                    background: 'rgba(249, 115, 22, 0.15)',
                    color: '#F97316',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                  }}
                >
                  RECOMMENDED NEXT MOVE
                </span>
              </div>

              {academic.continueLearning ? (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: '#FDBA12', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      ACADEMIC SYLLABUS CONTINUATION
                    </span>
                    <h4 style={{ margin: '4px 0', fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                      {academic.continueLearning.subjectName}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', fontFamily: 'var(--font-body, "Inter", sans-serif)' }}>
                      {academic.continueLearning.unitTitle || `Unit ${academic.continueLearning.unitNum}`}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/student/${academic.continueLearning.regCode || 'JNTUK'}/${academic.continueLearning.subjectId}`)}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '100px',
                      background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
                    }}
                  >
                    Continue Learning →
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: '0 0 16px 0' }}>
                    Your Campus Connect journey starts here. Explore University syllabus or start placement preparation.
                  </p>
                  <button
                    onClick={() => navigate('/student')}
                    style={{
                      padding: '9px 20px',
                      borderRadius: '100px',
                      background: '#F97316',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Explore Resources
                  </button>
                </div>
              )}
            </div>

            {/* ════ 2. PLACEMENT READINESS RING (4 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 4',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              className="cc-col-12-mobile"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>
                  Placement Readiness
                </h3>
                <span style={{ fontSize: '18px' }}>⚡</span>
              </div>

              {/* Radial Meter Presentation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '18px 0' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: `conic-gradient(#F97316 ${readinessScore * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(249, 115, 22, 0.25)',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '66px',
                      height: '66px',
                      borderRadius: '50%',
                      background: '#0F1420',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>
                      {readinessScore}%
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                    {placement.totalCompleted || 0} of {placement.totalTopics || 0} Topics
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', fontFamily: 'var(--font-body, "Inter", sans-serif)' }}>
                    {readinessScore > 0
                      ? 'Calculated from verified track progress.'
                      : 'Complete a few preparation topics to build your readiness score.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/placement')}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
              >
                Open Placement Suite →
              </button>
            </div>

            {/* ════ 3. ACADEMIC PROGRESS (6 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 6',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
              }}
              className="cc-col-12-mobile"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>📚</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                    Academic Progress
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 600 }}>
                  Regulation: {academic.activeRegulation || 'R20'}
                </span>
              </div>

              {/* Subject list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {academic.subjects && academic.subjects.length > 0 ? (
                  academic.subjects.slice(0, 4).map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => navigate(`/student/${sub.regulationCode || 'JNTUK'}/${sub.id}`)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(253, 186, 18, 0.4)'
                        e.currentTarget.style.background = 'rgba(253, 186, 18, 0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                          {sub.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-body, "Inter", sans-serif)' }}>
                          {sub.semester} • {sub.branch}
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', color: '#FDBA12' }}>→</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                    No subjects loaded for this regulation.
                  </p>
                )}
              </div>
            </div>

            {/* ════ 4. PLACEMENT TRACKS SUMMARY (6 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 6',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
              }}
              className="cc-col-12-mobile"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>💼</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                    Placement Tracks
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/placement')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F97316',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  View All Tracks →
                </button>
              </div>

              {/* Progress bars per track */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { key: 'dsa', label: 'Data Structures & Algorithms', defaultPct: 50 },
                  { key: 'dbms', label: 'Database Systems & SQL', defaultPct: 40 },
                  { key: 'oop', label: 'Object-Oriented Programming (Java/C++)', defaultPct: 30 },
                  { key: 'os', label: 'Operating Systems & Networks', defaultPct: 15 },
                ].map((item) => {
                  const trackData = placement?.trackProgress?.[item.key]
                  const pct = trackData ? trackData.percentage : item.defaultPct
                  return (
                    <div key={item.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>{item.label}</span>
                        <span style={{ fontWeight: 700, color: '#FDBA12' }}>{pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: 'linear-gradient(90deg, #FDBA12, #F97316)',
                            borderRadius: '100px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ════ 5. JOBS & INTERNSHIPS (7 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 7',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
              }}
              className="cc-col-12-mobile"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🎯</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                    Jobs &amp; Applications
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/jobs')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F97316',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Explore Board →
                </button>
              </div>

              {jobs.applications && jobs.applications.length > 0 ? (
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.8px' }}>
                    Your Submitted Applications
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {jobs.applications.slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                            {app.jobTitle || 'Software Role'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            {app.company || 'Company'}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: app.status === 'OFFER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                            color: app.status === 'OFFER' ? '#10B981' : '#F97316',
                            border: '1px solid rgba(249, 115, 22, 0.3)',
                          }}
                        >
                          {app.status || 'APPLIED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.8px' }}>
                    Featured Engineering Openings
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {jobs.featuredJobs?.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        onClick={() => navigate('/jobs')}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{job.title}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>{job.company} • {job.location}</div>
                        </div>
                        <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>{job.salary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ════ 6. RESUME & ATS SECTION (5 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 5',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              className="cc-col-12-mobile"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                      Resume &amp; ATS
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '100px',
                      background: resume.hasResume ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                      color: resume.hasResume ? '#10B981' : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {resume.hasResume ? 'UPLOADED' : 'NOT UPLOADED'}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: '0 0 16px 0', fontFamily: 'var(--font-body, "Inter", sans-serif)' }}>
                  {resume.topImprovement}
                </p>
              </div>

              <button
                onClick={() => navigate('/career')}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(249, 115, 22, 0.25)',
                }}
              >
                {resume.hasResume ? 'Review AI ATS Feedback →' : 'Upload Resume for AI Audit →'}
              </button>
            </div>

            {/* ════ 7. AI CAREER COACH CARD (12 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 12',
                background: 'radial-gradient(ellipse at top left, rgba(253, 186, 18, 0.15) 0%, rgba(25, 32, 50, 0.8) 60%, rgba(15, 20, 32, 0.95) 100%)',
                border: '1px solid rgba(253, 186, 18, 0.3)',
                borderRadius: '24px',
                padding: '32px clamp(20px, 3vw, 40px)',
                backdropFilter: 'blur(24px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '24px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(253, 186, 18, 0.2)',
              }}
            >
              <div style={{ maxWidth: '780px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FDBA12', fontSize: '11.5px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <span>CAMPUS AI MENTOR</span>
                  <span>•</span>
                  <span>PERSONALIZED INSIGHT</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
                  {ai.headline || 'Your Next Best Move'}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-body, "Inter", sans-serif)' }}>
                  {ai.recommendation}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate(ai.actionUrl || '/placement')}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                  }}
                >
                  {ai.actionLabel || 'Follow Recommendation →'}
                </button>
                <button
                  onClick={() => navigate('/career')}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '100px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ASK CAMPUS AI ✨
                </button>
              </div>
            </div>

            {/* ════ 8. RECENT ACTIVITY (6 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 6',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
              }}
              className="cc-col-12-mobile"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>⏱️</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                  Recent Activity
                </h3>
              </div>

              {activity && activity.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activity.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {item.subtitle}
                        </div>
                      </div>
                      <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.4)' }}>
                        {item.timestamp ? String(item.timestamp).substring(0, 10) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '28px 0', color: 'rgba(255, 255, 255, 0.45)', fontSize: '13px' }}>
                  No recent activities recorded yet. Complete a placement topic or save a job to start your activity timeline.
                </div>
              )}
            </div>

            {/* ════ 9. QUICK ACTIONS (6 cols) ════ */}
            <div
              style={{
                gridColumn: 'span 6',
                background: 'linear-gradient(135deg, rgba(25, 32, 50, 0.7) 0%, rgba(15, 20, 32, 0.85) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '24px',
                padding: '28px',
                backdropFilter: 'blur(20px)',
              }}
              className="cc-col-12-mobile"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                  Quick Actions
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}
              >
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.45)'
                      e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{action.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{action.label}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-body, "Inter", sans-serif)' }}>
                      {action.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cc-hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .cc-hero-grid > div:first-child {
            align-items: center;
            text-align: center;
          }
          .cc-col-12-mobile {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  )
}
