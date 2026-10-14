import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  GraduationCap, 
  Code, 
  CheckCircle2, 
  Building2, 
  TrendingUp, 
  Users, 
  FolderCheck, 
  Compass, 
  Bot 
} from 'lucide-react'
import Navbar from '../components/Navbar'
import CinematicHero from '../components/CinematicHero'
import { useAuth } from '../context/AuthContext'
import LoginModal from '../components/LoginModal'
import AIAssistant from '../components/AIAssistant'

export default function Welcome() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isDarkNav, setIsDarkNav] = useState(true)
  const homeRef = useRef(null)

  // Listen to scroll to seamlessly flip Navbar between Dark (Cinematic) and Light Ivory (Home)
  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 1.3
      setIsDarkNav(window.scrollY < threshold)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHome = () => {
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCardNavigate = (route) => {
    if (!isLoggedIn && (route.startsWith('/student') || route.startsWith('/placement') || route.startsWith('/jobs') || route.startsWith('/career'))) {
      // Allow seamless navigation or trigger login modal if desired
      navigate(route)
    } else {
      navigate(route)
    }
  }

  const handleKeyDown = (e, route) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardNavigate(route)
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--cc-warm-bg, #FFF9F0)',
        color: 'var(--text, #111827)',
        overflowX: 'clip',
        fontFamily: 'var(--font-heading)',
      }}
    >
      {/* ─── ATMOSPHERIC BACKGROUND ─────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Blurred Campus Photography Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/campus/campus_ambient_blur.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.18,
            filter: 'blur(8px)',
            transform: 'scale(1.05)',
          }}
        />

        {/* Warm Ivory Gradient Overlay to guarantee high card contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255, 249, 240, 0.82) 0%, rgba(255, 249, 240, 0.94) 60%, #FFF9F0 100%)',
          }}
        />

        {/* Ambient Warm Golden Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '12%',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(253, 186, 18, 0.16) 0%, rgba(249, 115, 22, 0.04) 65%, transparent 80%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: '8%',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.14) 0%, rgba(244, 81, 30, 0.03) 65%, transparent 80%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Soft Grid Matrix Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(249, 115, 22, 0.07) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            opacity: 0.7,
          }}
        />
      </div>

      {/* ─── GLOBAL REUSABLE NAVBAR (Dynamic isDark) ───────── */}
      <Navbar isDark={isDarkNav} />

      {/* ─── PRIMARY CINEMATIC LANDING (PDF PAGE 2) ────────── */}
      <CinematicHero onExploreClick={scrollToHome} />

      {/* ─── MAIN 4-MODULE CAMPUS CONNECT HOME (PDF PAGE 1) ── */}
      <div ref={homeRef} id="home-hub" style={{ position: 'relative', zIndex: 2 }}>
        <main
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '80px 24px 60px 24px',
          }}
        >
          {/* ─── HERO SECTION ─────────────────────────────────── */}
          <section
            style={{
              textAlign: 'center',
              paddingTop: '10px',
              paddingBottom: '44px',
              position: 'relative',
            }}
          >
            {/* Decorative Handwritten Annotation (Left) */}
            <motion.div
              initial={{ opacity: 0, rotate: -8, y: 10 }}
              animate={{ opacity: 1, rotate: -3, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hide-mobile"
              style={{
                position: 'absolute',
                top: '16px',
                left: 'clamp(10px, 5vw, 50px)',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-handwrite)',
                  color: 'var(--cc-deep-orange, #F4511E)',
                  fontSize: 'clamp(18px, 1.8vw, 24px)',
                  lineHeight: 1.1,
                  fontWeight: 600,
                  display: 'inline-block',
                  textShadow: '0 2px 8px rgba(249, 115, 22, 0.12)',
                }}
              >
                Same Students.<br />
                <span style={{ color: 'var(--cc-yellow, #FDBA12)' }}>Bigger Dreams.</span> ✦
              </span>
            </motion.div>

            {/* Decorative Handwritten Annotation (Right) */}
            <motion.div
              initial={{ opacity: 0, rotate: 6, y: 10 }}
              animate={{ opacity: 1, rotate: 2.5, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="hide-mobile"
              style={{
                position: 'absolute',
                top: '24px',
                right: 'clamp(10px, 5vw, 50px)',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-handwrite)',
                  color: 'var(--text-3, #4B5563)',
                  fontSize: 'clamp(17px, 1.6vw, 22px)',
                  fontWeight: 600,
                  display: 'inline-block',
                }}
              >
                Ideas • Skills • Opportunities • You ✍
              </span>
            </motion.div>

            {/* Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '100px',
                background: 'rgba(253, 186, 18, 0.16)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                color: 'var(--cc-deep-orange, #F4511E)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                marginBottom: '16px',
                boxShadow: '0 2px 10px rgba(249, 115, 22, 0.08)',
              }}
            >
              <span style={{ fontSize: '13px' }}>🎓</span>
              <span>WELCOME TO CAMPUS CONNECT</span>
            </motion.div>

            {/* Main 2-Line Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                margin: '0 auto 14px auto',
                maxWidth: '900px',
              }}
            >
              <span style={{ color: 'var(--cc-graphite, #111827)', display: 'block' }}>
                One Platform for a
              </span>
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 55%, #F4511E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  position: 'relative',
                }}
              >
                Brighter Tomorrow.
                <svg
                  viewBox="0 0 320 18"
                  fill="none"
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '-8px',
                    width: '100%',
                    height: '12px',
                    pointerEvents: 'none',
                  }}
                >
                  <path
                    d="M4 12C60 4 180 3 316 11"
                    stroke="#F97316"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(15px, 1.4vw, 19px)',
                fontWeight: 500,
                color: 'var(--text-3, #4B5563)',
                letterSpacing: '0.2px',
                maxWidth: '680px',
                margin: '18px auto 0 auto',
                lineHeight: 1.5,
              }}
            >
              Explore. Learn. Prepare. Grow. Get Placed.
            </motion.p>
          </section>

          {/* ─── FOUR CORE PILLAR CARDS (4-Column Grid matching PDF Page 1) ────── */}
          <section
            aria-label="Core Portals"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
          {/* ════ CARD 1: Student Resource Portal ════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            onMouseEnter={() => setHoveredCard('card1')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardNavigate('/student')}
            onKeyDown={(e) => handleKeyDown(e, '/student')}
            tabIndex={0}
            role="button"
            aria-label="Student Resource Portal — All your academic resources in one place."
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.86)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '28px',
              padding: '24px 22px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card1'
                ? '0 24px 48px rgba(253, 186, 18, 0.22), 0 8px 18px rgba(0, 0, 0, 0.04)'
                : '0 12px 32px rgba(0, 0, 0, 0.04)',
              transform: hoveredCard === 'card1' ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            <div>
              {/* Header: Rounded Icon Badge + Circular Arrow Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                  }}
                >
                  <BookOpen size={24} />
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transform: hoveredCard === 'card1' ? 'translateX(2px)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                }}
              >
                Student Resource Portal
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  color: '#6B7280',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  minHeight: '42px',
                }}
              >
                All your academic resources in one place. Notes, PDFs, syllabus, previous year papers and more.
              </p>
            </div>

            {/* Illustration */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '180px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #FFFDF8 0%, #FFF3DC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}
            >
              <img
                src="/assets/illustrations/card_academic_books.jpg"
                alt="Student Resource Portal"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card1' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.4s ease',
                }}
              />
            </div>

            {/* Full-width Solid Pill Button */}
            <button
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontSize: '14.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.28)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span>Explore Resources</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* ════ CARD 2: Placement Preparation ════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onMouseEnter={() => setHoveredCard('card2')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardNavigate('/placement')}
            onKeyDown={(e) => handleKeyDown(e, '/placement')}
            tabIndex={0}
            role="button"
            aria-label="Placement Preparation — Structured learning paths, roadmaps, DSA, aptitude, core subjects, certifications and interview preparation."
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.86)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '28px',
              padding: '24px 22px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card2'
                ? '0 24px 48px rgba(249, 115, 22, 0.22), 0 8px 18px rgba(0, 0, 0, 0.04)'
                : '0 12px 32px rgba(0, 0, 0, 0.04)',
              transform: hoveredCard === 'card2' ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            <div>
              {/* Header: Rounded Icon Badge + Circular Arrow Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                  }}
                >
                  <Target size={24} />
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transform: hoveredCard === 'card2' ? 'translateX(2px)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                }}
              >
                Placement Preparation
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  color: '#6B7280',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  minHeight: '42px',
                }}
              >
                Structured learning paths, roadmaps, DSA, aptitude, core subjects, certifications and interview preparation.
              </p>
            </div>

            {/* Illustration */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '180px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #FFFDF8 0%, #FEEDDC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}
            >
              <img
                src="/assets/illustrations/card_placement_growth.jpg"
                alt="Placement Preparation"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card2' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.4s ease',
                }}
              />
            </div>

            {/* Full-width Solid Pill Button */}
            <button
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontSize: '14.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.28)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span>Start Preparing</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* ════ CARD 3: Jobs & Internships ════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            onMouseEnter={() => setHoveredCard('card3')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardNavigate('/jobs')}
            onKeyDown={(e) => handleKeyDown(e, '/jobs')}
            tabIndex={0}
            role="button"
            aria-label="Jobs & Internships — Explore the latest job updates, internships, and company opportunities specially curated for students."
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.86)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '28px',
              padding: '24px 22px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card3'
                ? '0 24px 48px rgba(245, 158, 11, 0.22), 0 8px 18px rgba(0, 0, 0, 0.04)'
                : '0 12px 32px rgba(0, 0, 0, 0.04)',
              transform: hoveredCard === 'card3' ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            <div>
              {/* Header: Rounded Icon Badge + Circular Arrow Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
                  }}
                >
                  <Briefcase size={24} />
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transform: hoveredCard === 'card3' ? 'translateX(2px)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                }}
              >
                Jobs & Internships
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  color: '#6B7280',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  minHeight: '42px',
                }}
              >
                Explore the latest job updates, internships, and company opportunities specially curated for students.
              </p>
            </div>

            {/* Illustration */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '180px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #FFFDF8 0%, #EFF6FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}
            >
              <img
                src="/assets/illustrations/card_jobs_gateway.jpg"
                alt="Jobs & Internships"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card3' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.4s ease',
                }}
              />
            </div>

            {/* Full-width Solid Pill Button */}
            <button
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontSize: '14.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.28)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span>Browse Opportunities</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* ════ CARD 4: AI Career Assistant ════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onMouseEnter={() => setHoveredCard('card4')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardNavigate('/career')}
            onKeyDown={(e) => handleKeyDown(e, '/career')}
            tabIndex={0}
            role="button"
            aria-label="AI Career Assistant — Get your resume analyzed, check your placement readiness, find skill gaps, and get personalized recommendations."
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.86)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '28px',
              padding: '24px 22px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card4'
                ? '0 24px 48px rgba(249, 115, 22, 0.22), 0 8px 18px rgba(0, 0, 0, 0.04)'
                : '0 12px 32px rgba(0, 0, 0, 0.04)',
              transform: hoveredCard === 'card4' ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            <div>
              {/* Header: Rounded Icon Badge + Circular Arrow Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                  }}
                >
                  <Bot size={24} />
                </div>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111827',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transform: hoveredCard === 'card4' ? 'translateX(2px)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                }}
              >
                AI Career Assistant
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  color: '#6B7280',
                  lineHeight: 1.5,
                  marginBottom: '18px',
                  minHeight: '42px',
                }}
              >
                Get your resume analyzed, check your placement readiness, find skill gaps, and get personalized recommendations.
              </p>
            </div>

            {/* Illustration */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '180px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #FFFDF8 0%, #FEEDDC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}
            >
              <img
                src="/assets/illustrations/card_ai_assistant.jpg"
                alt="AI Career Assistant"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card4' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.4s ease',
                }}
              />
            </div>

            {/* Full-width Solid Pill Button */}
            <button
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading)',
                fontSize: '14.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.28)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <span>Try AI Assistant</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </section>

        {/* ─── BOTTOM HORIZONTAL STATS STRIP ────────────────── */}
        <div style={{ position: 'relative', marginTop: '20px', marginBottom: '40px' }}>
          {/* Handwritten Annotation on Left */}
          <div
            className="hide-mobile"
            style={{
              position: 'absolute',
              bottom: '-28px',
              left: '12px',
              fontFamily: 'var(--font-handwrite)',
              color: '#9CA3AF',
              fontSize: '20px',
              transform: 'rotate(-4deg)',
              pointerEvents: 'none',
            }}
          >
            A Brighter Tomorrow...
          </div>

          <section
            aria-label="Platform Benchmark Stats"
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              borderRadius: '24px',
              padding: '20px 32px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'clamp(20px, 3vw, 40px)',
              }}
            >
              {/* Stat 1: 10K+ Students */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.1,
                  }}
                >
                  10K+
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, marginTop: '2px' }}>
                  Students
                </div>
              </div>

              <div style={{ width: '1px', height: '36px', background: '#E5E7EB' }} className="hide-mobile" />

              {/* Stat 2: 50K+ Resources */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.1,
                  }}
                >
                  50K+
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, marginTop: '2px' }}>
                  Resources
                </div>
              </div>

              <div style={{ width: '1px', height: '36px', background: '#E5E7EB' }} className="hide-mobile" />

              {/* Stat 3: 5K+ Job Updates */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.1,
                  }}
                >
                  5K+
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, marginTop: '2px' }}>
                  Job Updates
                </div>
              </div>

              <div style={{ width: '1px', height: '36px', background: '#E5E7EB' }} className="hide-mobile" />

              {/* Stat 4: Higher Placement Readiness */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#111827',
                    lineHeight: 1.1,
                  }}
                >
                  Higher
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, marginTop: '2px' }}>
                  Placement Readiness
                </div>
              </div>
            </div>

            {/* Handwritten Signature on Right */}
            <div
              style={{
                fontFamily: 'var(--font-handwrite)',
                fontSize: '22px',
                color: '#6B7280',
                position: 'relative',
                display: 'inline-block',
                paddingRight: '12px',
              }}
            >
              <span>Build Your Tomorrow, Today.</span>
              <svg
                viewBox="0 0 160 12"
                fill="none"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-6px',
                  width: '100%',
                  height: '8px',
                  pointerEvents: 'none',
                }}
              >
                <path
                  d="M2 8C40 2 120 2 158 7"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </section>
        </div>
      </main>
      </div>

      {/* ─── FLOATING AI ASSISTANT WIDGET ───────────────────── */}
      <AIAssistant />

      {/* ─── AUTHENTICATION MODAL (REUSED) ──────────────────── */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          redirectTo={pendingRoute}
        />
      )}
    </div>
  )
}