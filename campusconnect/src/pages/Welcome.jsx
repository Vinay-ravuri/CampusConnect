import { useState, useRef } from 'react'
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
import { useAuth } from '../context/AuthContext'
import LoginModal from '../components/LoginModal'
import AIAssistant from '../components/AIAssistant'

export default function Welcome() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [pendingRoute, setPendingRoute] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

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
        overflowX: 'hidden',
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

      {/* ─── GLOBAL REUSABLE NAVBAR ─────────────────────────── */}
      <Navbar />

      {/* ─── MAIN CONTENT CONTAINER ─────────────────────────── */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '110px 24px 60px 24px',
        }}
      >
        {/* ─── HERO SECTION ─────────────────────────────────── */}
        <section
          style={{
            textAlign: 'center',
            paddingTop: '20px',
            paddingBottom: '48px',
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
              left: 'clamp(10px, 6vw, 60px)',
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
              right: 'clamp(10px, 6vw, 60px)',
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
              Ideas • Skills • Opportunities ✍
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
              marginBottom: '20px',
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
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              margin: '0 auto 16px auto',
              maxWidth: '900px',
            }}
          >
            <span
              style={{
                color: 'var(--cc-graphite, #111827)',
                display: 'block',
              }}
            >
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
              {/* Handwritten subtle underline squiggle */}
              <svg
                viewBox="0 0 320 18"
                fill="none"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-10px',
                  width: '100%',
                  height: '14px',
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
              margin: '22px auto 0 auto',
              lineHeight: 1.5,
            }}
          >
            Explore. Learn. Prepare. Grow. Get Placed.
          </motion.p>
        </section>

        {/* ─── FOUR CORE PILLAR CARDS (2x2 Desktop Grid) ────── */}
        <section
          aria-label="Core Portals"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))',
            gap: '28px',
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
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: hoveredCard === 'card1'
                ? '1px solid rgba(253, 186, 18, 0.45)'
                : '1px solid rgba(249, 115, 22, 0.14)',
              borderRadius: 'var(--r-xl, 28px)',
              padding: '36px 32px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card1'
                ? '0 24px 56px rgba(253, 186, 18, 0.20), 0 8px 24px rgba(17, 24, 39, 0.05)'
                : '0 12px 36px rgba(17, 24, 39, 0.04)',
              transform: hoveredCard === 'card1' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            {/* Top Accent Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #FDBA12, #F97316)',
                opacity: hoveredCard === 'card1' ? 1 : 0.6,
                transition: 'opacity 0.3s ease',
              }}
            />

            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(253, 186, 18, 0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#B45309',
                    }}
                  >
                    <BookOpen size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#B45309',
                    }}
                  >
                    PILLAR 01 • ACADEMICS
                  </span>
                </div>
              </div>

              {/* Card Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 2.3vw, 30px)',
                  fontWeight: 800,
                  color: 'var(--text, #111827)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                }}
              >
                Student Resource Portal
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  color: 'var(--text-3, #4B5563)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                  maxWidth: '460px',
                }}
              >
                All your academic resources in one place. Access university-aligned syllabi, subject modules, and verified exam materials.
              </p>

              {/* Tag Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['Notes', 'PDFs', 'Syllabus', 'Previous Year Papers', 'Videos', 'Questions'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: 'rgba(253, 186, 18, 0.12)',
                      border: '1px solid rgba(253, 186, 18, 0.28)',
                      color: '#92400E',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration Canvas / Image Card */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #FFFDF8 0%, #FFF3DC 100%)',
                border: '1px solid rgba(253, 186, 18, 0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '22px',
              }}
            >
              <img
                src="/assets/illustrations/card_academic_books.jpg"
                alt="Realistic 3D stack of academic textbooks with graduation cap"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card1' ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />

              {/* Visual Labels: LEARN • PRACTICE • EXCEL */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {['LEARN', 'PRACTICE', 'EXCEL'].map((word, wIdx) => (
                  <span
                    key={wIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(253, 186, 18, 0.35)',
                      borderRadius: '100px',
                      padding: '3px 12px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      color: 'var(--cc-deep-orange, #F4511E)',
                      boxShadow: '0 2px 8px rgba(17, 24, 39, 0.05)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--cc-deep-orange, #F4511E)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Explore Resources</span>
                <motion.span
                  animate={{ x: hoveredCard === 'card1' ? 6 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={17} />
                </motion.span>
              </span>

              <span style={{ fontSize: '12px', color: 'var(--text-4, #9CA3AF)', fontWeight: 600 }}>
                200+ Subjects
              </span>
            </div>
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
            aria-label="Placement Preparation — Structured learning paths, roadmaps, DSA, aptitude, core subjects and interview preparation."
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: hoveredCard === 'card2'
                ? '1px solid rgba(249, 115, 22, 0.45)'
                : '1px solid rgba(249, 115, 22, 0.14)',
              borderRadius: 'var(--r-xl, 28px)',
              padding: '36px 32px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card2'
                ? '0 24px 56px rgba(249, 115, 22, 0.20), 0 8px 24px rgba(17, 24, 39, 0.05)'
                : '0 12px 36px rgba(17, 24, 39, 0.04)',
              transform: hoveredCard === 'card2' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            {/* Top Accent Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #F97316, #F4511E)',
                opacity: hoveredCard === 'card2' ? 1 : 0.6,
                transition: 'opacity 0.3s ease',
              }}
            />

            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(249, 115, 22, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cc-orange, #F97316)',
                    }}
                  >
                    <Target size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--cc-deep-orange, #F4511E)',
                    }}
                  >
                    PILLAR 02 • CAREER PREP
                  </span>
                </div>
              </div>

              {/* Card Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 2.3vw, 30px)',
                  fontWeight: 800,
                  color: 'var(--text, #111827)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                }}
              >
                Placement Preparation
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  color: 'var(--text-3, #4B5563)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                  maxWidth: '460px',
                }}
              >
                Structured learning paths, roadmaps, DSA, aptitude, core subjects and interview preparation tailored to top IT recruiters.
              </p>

              {/* Tag Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['TCS NQT', 'Wipro & Accenture', 'Aptitude & Reasoning', 'Core CS (DBMS, OS)', 'DSA Roadmaps'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: 'rgba(249, 115, 22, 0.10)',
                      border: '1px solid rgba(249, 115, 22, 0.25)',
                      color: '#C2410C',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration Canvas / Image Card */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #FFFDF8 0%, #FEEDDC 100%)',
                border: '1px solid rgba(249, 115, 22, 0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '22px',
              }}
            >
              <img
                src="/assets/illustrations/card_placement_growth.jpg"
                alt="Realistic 3D ascending career ladder with upward golden progression arrow"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card2' ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />

              {/* Visual Labels: LEARN • PRACTICE • GROW */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {['LEARN', 'PRACTICE', 'GROW'].map((word, wIdx) => (
                  <span
                    key={wIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(249, 115, 22, 0.35)',
                      borderRadius: '100px',
                      padding: '3px 12px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      color: 'var(--cc-deep-orange, #F4511E)',
                      boxShadow: '0 2px 8px rgba(17, 24, 39, 0.05)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--cc-deep-orange, #F4511E)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Start Preparing</span>
                <motion.span
                  animate={{ x: hoveredCard === 'card2' ? 6 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={17} />
                </motion.span>
              </span>

              <span style={{ fontSize: '12px', color: 'var(--text-4, #9CA3AF)', fontWeight: 600 }}>
                Company PYQs Ready
              </span>
            </div>
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
            aria-label="Jobs & Internships — Explore the latest internships, full-time opportunities and student-friendly career opportunities."
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: hoveredCard === 'card3'
                ? '1px solid rgba(37, 99, 235, 0.40)'
                : '1px solid rgba(249, 115, 22, 0.14)',
              borderRadius: 'var(--r-xl, 28px)',
              padding: '36px 32px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card3'
                ? '0 24px 56px rgba(37, 99, 235, 0.14), 0 8px 24px rgba(17, 24, 39, 0.05)'
                : '0 12px 36px rgba(17, 24, 39, 0.04)',
              transform: hoveredCard === 'card3' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            {/* Top Accent Line with subtle blue touch */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #FDBA12, #2563EB)',
                opacity: hoveredCard === 'card3' ? 1 : 0.6,
                transition: 'opacity 0.3s ease',
              }}
            />

            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cc-blue, #2563EB)',
                    }}
                  >
                    <Briefcase size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--cc-blue, #2563EB)',
                    }}
                  >
                    PILLAR 03 • OPPORTUNITIES
                  </span>
                </div>
              </div>

              {/* Card Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 2.3vw, 30px)',
                  fontWeight: 800,
                  color: 'var(--text, #111827)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                }}
              >
                Jobs & Internships
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  color: 'var(--text-3, #4B5563)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                  maxWidth: '460px',
                }}
              >
                Explore the latest internships, full-time opportunities and student-friendly career openings with direct recruiter connections.
              </p>

              {/* Tag Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['Software Engineer', 'Frontend Intern', 'Full-Time', '2026/2027 Batches', 'Verified Listings'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: tag.includes('Verified') ? 'rgba(37, 99, 235, 0.10)' : 'rgba(253, 186, 18, 0.12)',
                      border: tag.includes('Verified') ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid rgba(253, 186, 18, 0.25)',
                      color: tag.includes('Verified') ? '#1D4ED8' : '#92400E',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration Canvas / Image Card */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #F8FAFC 0%, #EFF6FF 100%)',
                border: '1px solid rgba(37, 99, 235, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '22px',
              }}
            >
              <img
                src="/assets/illustrations/card_jobs_gateway.jpg"
                alt="Realistic 3D modern briefcase and employment offer with verified company badges"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card3' ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />

              {/* Visual Labels: DISCOVER • APPLY • HIRED */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {['DISCOVER', 'APPLY', 'GET HIRED'].map((word, wIdx) => (
                  <span
                    key={wIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.90)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(37, 99, 235, 0.28)',
                      borderRadius: '100px',
                      padding: '3px 12px',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      letterSpacing: '0.8px',
                      color: '#1D4ED8',
                      boxShadow: '0 2px 8px rgba(17, 24, 39, 0.05)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--cc-blue, #2563EB)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Browse Opportunities</span>
                <motion.span
                  animate={{ x: hoveredCard === 'card3' ? 6 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={17} />
                </motion.span>
              </span>

              <span style={{ fontSize: '12px', color: 'var(--text-4, #9CA3AF)', fontWeight: 600 }}>
                Verified Openings
              </span>
            </div>
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
            aria-label="AI Career Assistant — Get your resume analyzed, check your placement readiness, find skill gaps and get personalized career recommendations."
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: hoveredCard === 'card4'
                ? '1px solid rgba(244, 81, 30, 0.45)'
                : '1px solid rgba(249, 115, 22, 0.14)',
              borderRadius: 'var(--r-xl, 28px)',
              padding: '36px 32px',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'card4'
                ? '0 24px 56px rgba(244, 81, 30, 0.20), 0 8px 24px rgba(17, 24, 39, 0.05)'
                : '0 12px 36px rgba(17, 24, 39, 0.04)',
              transform: hoveredCard === 'card4' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            {/* Top Accent Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #F97316, #F4511E)',
                opacity: hoveredCard === 'card4' ? 1 : 0.6,
                transition: 'opacity 0.3s ease',
              }}
            />

            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(244, 81, 30, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cc-deep-orange, #F4511E)',
                    }}
                  >
                    <Sparkles size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--cc-deep-orange, #F4511E)',
                    }}
                  >
                    PILLAR 04 • AI INTELLIGENCE
                  </span>
                </div>
              </div>

              {/* Card Title & Description */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 2.3vw, 30px)',
                  fontWeight: 800,
                  color: 'var(--text, #111827)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                }}
              >
                AI Career Assistant
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  color: 'var(--text-3, #4B5563)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                  maxWidth: '460px',
                }}
              >
                Get your resume analyzed, check your placement readiness, find skill gaps and get personalized career recommendations.
              </p>

              {/* Tag Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['ATS Resume Score', 'Placement Readiness', 'Skill Gap Radar', '6-Month Roadmap', 'AI Mentor Chat'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: 'rgba(244, 81, 30, 0.10)',
                      border: '1px solid rgba(244, 81, 30, 0.25)',
                      color: '#C2410C',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration Canvas / Image Card */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                borderRadius: '18px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #FFFDF8 0%, #FEE2E2 100%)',
                border: '1px solid rgba(244, 81, 30, 0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '22px',
              }}
            >
              <img
                src="/assets/illustrations/card_ai_assistant.jpg"
                alt="Realistic 3D friendly miniature humanoid AI robot mascot in clean studio lighting"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: hoveredCard === 'card4' ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />

              {/* Visual Labels: Analyze • Guide • Improve • Get Placed */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {['Analyze', 'Guide', 'Improve', 'Get Placed'].map((word, wIdx) => (
                  <span
                    key={wIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.90)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(244, 81, 30, 0.30)',
                      borderRadius: '100px',
                      padding: '3px 10px',
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.6px',
                      color: 'var(--cc-deep-orange, #F4511E)',
                      boxShadow: '0 2px 8px rgba(17, 24, 39, 0.05)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--cc-deep-orange, #F4511E)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Try AI Assistant</span>
                <motion.span
                  animate={{ x: hoveredCard === 'card4' ? 6 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={17} />
                </motion.span>
              </span>

              <span style={{ fontSize: '12px', color: 'var(--text-4, #9CA3AF)', fontWeight: 600 }}>
                Instant Feedback
              </span>
            </div>
          </motion.div>
        </section>

        {/* ─── BOTTOM HORIZONTAL STATS STRIP ────────────────── */}
        <section
          aria-label="Platform Benchmark Stats"
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(249, 115, 22, 0.16)',
            borderRadius: 'var(--r-xl, 28px)',
            padding: '32px 36px',
            boxShadow: '0 12px 32px rgba(17, 24, 39, 0.04)',
            marginBottom: '40px',
          }}
        >
          {/* Decorative Handwritten Annotation at bottom */}
          <div
            style={{
              position: 'absolute',
              top: '-18px',
              right: '28px',
              fontFamily: 'var(--font-handwrite)',
              color: 'var(--cc-orange, #F97316)',
              fontSize: '18px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFF9F0',
              padding: '0 10px',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(249, 115, 22, 0.08)',
            }}
          >
            <span>Build Your Tomorrow. Today.</span> ✎
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '28px',
              alignItems: 'center',
            }}
          >
            {/* Stat 1: 10K+ Students */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'rgba(253, 186, 18, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309',
                  flexShrink: 0,
                }}
              >
                <Users size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'var(--text, #111827)',
                    lineHeight: 1.1,
                  }}
                >
                  10K+
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-3, #4B5563)', fontWeight: 600, marginTop: '2px' }}>
                  Enrolled Students
                </div>
              </div>
            </div>

            {/* Stat 2: 50K+ Resources */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'rgba(249, 115, 22, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cc-orange, #F97316)',
                  flexShrink: 0,
                }}
              >
                <FolderCheck size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'var(--text, #111827)',
                    lineHeight: 1.1,
                  }}
                >
                  50K+
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-3, #4B5563)', fontWeight: 600, marginTop: '2px' }}>
                  Academic Resources
                </div>
              </div>
            </div>

            {/* Stat 3: 5K+ Job Updates */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'rgba(37, 99, 235, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cc-blue, #2563EB)',
                  flexShrink: 0,
                }}
              >
                <Building2 size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'var(--text, #111827)',
                    lineHeight: 1.1,
                  }}
                >
                  5K+
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-3, #4B5563)', fontWeight: 600, marginTop: '2px' }}>
                  Verified Job Updates
                </div>
              </div>
            </div>

            {/* Stat 4: Higher Placement Readiness */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success, #10B981)',
                  flexShrink: 0,
                }}
              >
                <TrendingUp size={22} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: 'var(--text, #111827)',
                    lineHeight: 1.1,
                  }}
                >
                  Higher
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-3, #4B5563)', fontWeight: 600, marginTop: '2px' }}>
                  Placement Readiness
                </div>
              </div>
            </div>
          </div>

          {/* Data Principle Footnote */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(249, 115, 22, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--text-4, #9CA3AF)',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span>* Representative presentation benchmark metrics across JNTUK &amp; AU affiliated engineering colleges.</span>
            <span style={{ fontWeight: 600, color: 'var(--cc-orange)' }}>Learn. Prepare. Achieve.</span>
          </div>
        </section>
      </main>

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