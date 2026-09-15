import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  GraduationCap, 
  ChevronRight, 
  Home as HomeIcon, 
  X 
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import { getRegulations } from '../api/subjects'

export default function StudentPortal() {
  const navigate = useNavigate()
  const [backendRegs, setBackendRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [comingSoonModal, setComingSoonModal] = useState(null)

  const fetchRegulationData = () => {
    setLoading(true)
    setError(null)
    getRegulations()
      .then((data) => {
        setBackendRegs(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Failed to fetch regulations:', err)
        setError('Unable to load regulations from academic service.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchRegulationData()
  }, [])

  // Map backend data to the 4 canonical Presentation Page 3 Cards
  const jntukBackend = backendRegs.find((r) => r.code === 'JNTUK')
  const auBackend = backendRegs.find((r) => r.code === 'AU')
  const jntuhBackend = backendRegs.find((r) => r.code === 'JNTUH') // Not in seeded backend
  const uniBackend = backendRegs.find((r) => r.code === 'UNI')

  const regulationCards = [
    {
      id: jntukBackend ? jntukBackend.id : 'jntuk-card',
      code: 'JNTUK',
      title: 'JNTUK',
      fullName: 'Jawaharlal Nehru Technological University Kakinada',
      subtitle: 'R23 · R20 · R19 Regulations',
      description: 'Access complete subject-wise syllabus, unit lecture notes, previous question papers, and lab manuals.',
      image: '/assets/universities/jntuk-campus.webp',
      alt: 'Jawaharlal Nehru Technological University Kakinada Campus Architecture',
      accentColor: '#FDBA12',
      glowColor: 'rgba(253, 186, 18, 0.22)',
      edgeText: 'JNTUK',
      isSupported: Boolean(jntukBackend),
      targetRoute: '/student/JNTUK',
    },
    {
      id: auBackend ? auBackend.id : 'au-card',
      code: 'AU',
      title: 'Andhra University',
      fullName: 'Andhra University Visakhapatnam',
      subtitle: 'AU Engineering Curriculum',
      description: 'Comprehensive course structure, unit-wise reference notes, and university examination blueprints.',
      image: '/assets/universities/andhra-university-campus.webp',
      alt: 'Andhra University Visakhapatnam Historic Campus Architecture',
      accentColor: '#F97316',
      glowColor: 'rgba(249, 115, 22, 0.22)',
      isSupported: Boolean(auBackend),
      targetRoute: '/student/AU',
    },
    {
      id: jntuhBackend ? jntuhBackend.id : 'jntuh-card',
      code: 'JNTUH',
      title: 'JNTUH',
      fullName: 'Jawaharlal Nehru Technological University Hyderabad',
      subtitle: 'Hyderabad Technical Regulation',
      description: 'Official JNTU Hyderabad engineering syllabus guides and curated study materials currently being prepared.',
      image: '/assets/universities/jntuh-campus.webp',
      alt: 'JNTU Hyderabad Engineering College Campus',
      accentColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.22)',
      isSupported: Boolean(jntuhBackend),
      statusBadge: 'Coming Soon',
      statusNote: 'Syllabus In Curation',
      targetRoute: '/student/JNTUH',
    },
    {
      id: uniBackend ? uniBackend.id : 'uni-card',
      code: 'UNI',
      title: 'Other Regulations',
      fullName: 'Other Universities & Autonomous Colleges',
      subtitle: 'Autonomous & Deemed Syllabus Hub',
      description: 'Unified academic repository for autonomous engineering institutions and universities across Andhra Pradesh.',
      image: '/assets/universities/other-university.webp',
      alt: 'Modern Autonomous Engineering College Campus Architecture',
      accentColor: '#EAB308',
      glowColor: 'rgba(234, 179, 8, 0.22)',
      isAutonomous: true,
      isSupported: Boolean(uniBackend),
      targetRoute: '/student/UNI',
    },
  ]

  const handleCardClick = (card) => {
    if (!card.isSupported && card.code === 'JNTUH') {
      setComingSoonModal(card)
      return
    }
    navigate(card.targetRoute)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFF9F0',
        color: '#111827',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: 'var(--font-body, "Inter", sans-serif)',
      }}
    >
      {/* ── Soft Blurred Campus Background Atmosphere ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url('/assets/campus/campus_ambient_blur.jpg')`,
          backgroundPosition: 'center 75%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.09,
          filter: 'blur(32px)',
          transform: 'scale(1.08)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Warm Ambient Radial Glows ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10%',
          right: '-5%',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(253, 186, 18, 0.18) 0%, rgba(249, 115, 22, 0.08) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '5%',
          left: '-5%',
          width: '580px',
          height: '580px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(244, 81, 30, 0.05) 50%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Campus Connect Light Navbar (Active Student Resources) ── */}
      <Navbar isDark={false} />

      {/* ── Main Container ── */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '104px clamp(16px, 4vw, 48px) 48px',
        }}
      >
        {/* ── Breadcrumb: Home > Student Resources ── */}
        <div style={{ marginBottom: '28px' }}>
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-heading, "Space Grotesk")',
              color: '#4B5563',
            }}
          >
            <Link
              to="/welcome"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#4B5563',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F97316')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
              aria-label="Back to Home"
            >
              <HomeIcon size={15} style={{ color: '#F97316' }} />
              <span>Home</span>
            </Link>

            <ChevronRight size={13} style={{ color: '#9CA3AF' }} />

            <span
              style={{
                color: '#F97316',
                fontWeight: 700,
                letterSpacing: '0.2px',
              }}
            >
              Student Resources
            </span>
          </nav>
        </div>

        {/* ── Page Header Area ── */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '44px',
          }}
        >
          {/* Left: Heading & Subtitle */}
          <div style={{ flex: '1 1 540px', minWidth: '290px' }}>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: 'clamp(32px, 4.4vw, 54px)',
                fontWeight: 800,
                letterSpacing: '-1.5px',
                lineHeight: 1.12,
                color: '#111827',
                margin: 0,
              }}
            >
              Student Resource{' '}
              <span
                style={{
                  color: '#F97316',
                  backgroundImage: 'linear-gradient(135deg, #F97316 0%, #F4511E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Portal
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                lineHeight: 1.65,
                color: '#4B5563',
                maxWidth: '560px',
                marginTop: '16px',
                marginBottom: 0,
              }}
            >
              Access subject-wise notes, syllabus, previous year papers, videos and more — based on your university regulation.
            </motion.p>
          </div>

          {/* Right: Handwritten Annotation + Glass Quote Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              alignSelf: 'flex-start',
            }}
          >
            {/* Handwritten Motivational Annotation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '4px 8px',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-handwritten, "Caveat", cursive)',
                  fontSize: 'clamp(24px, 2.3vw, 30px)',
                  fontWeight: 700,
                  color: '#1E293B',
                  lineHeight: 1.18,
                  textShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div>Knowledge</div>
                <div>Builds</div>
                <div>Brighter</div>
                <div>Futures.</div>
              </div>

              {/* Hand-drawn Orange Swoosh Underline */}
              <svg
                width="110"
                height="14"
                viewBox="0 0 110 14"
                fill="none"
                style={{ marginTop: '2px', marginLeft: '4px' }}
                aria-hidden="true"
              >
                <path
                  d="M3 9C28 3 75 2 107 10"
                  stroke="#F97316"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Glass Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.78)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                borderRadius: '20px',
                padding: '18px 24px',
                boxShadow: '0 12px 32px rgba(249, 115, 22, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9)',
                maxWidth: '240px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  color: '#F97316',
                  fontSize: '22px',
                  lineHeight: 1,
                  marginBottom: '6px',
                  fontWeight: 900,
                  fontFamily: 'serif',
                }}
              >
                “
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  fontSize: '13px',
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: '#1F2937',
                  margin: 0,
                  letterSpacing: '-0.2px',
                }}
              >
                Right Resources
                <br />
                at the Right Time
                <br />
                for a Better You.
              </p>
            </motion.div>
          </div>
        </header>

        {/* ── Section Title ── */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: 'clamp(22px, 2.4vw, 28px)',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            Select Your Regulation
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#6B7280',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            Choose your university or regulation to get started.
          </p>
        </div>

        {/* ── Loading Skeleton State ── */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '48px',
            }}
          >
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(249, 115, 22, 0.1)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Skeleton Image */}
                <div
                  style={{
                    height: '170px',
                    background: 'linear-gradient(90deg, #F3EFEA 25%, #E9E4DC 50%, #F3EFEA 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
                {/* Skeleton Content */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    style={{
                      height: '24px',
                      width: '60%',
                      background: '#EAE5DD',
                      borderRadius: '6px',
                    }}
                  />
                  <div
                    style={{
                      height: '14px',
                      width: '90%',
                      background: '#F0EBE3',
                      borderRadius: '4px',
                    }}
                  />
                  <div
                    style={{
                      height: '14px',
                      width: '80%',
                      background: '#F0EBE3',
                      borderRadius: '4px',
                    }}
                  />
                  <div
                    style={{
                      height: '42px',
                      width: '100%',
                      background: '#EAE5DD',
                      borderRadius: '12px',
                      marginTop: '12px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '40px 24px',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '32px auto 48px',
              boxShadow: '0 12px 32px rgba(239, 68, 68, 0.08)',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={28} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Unable to load regulations.
            </h3>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
              We could not connect to the academic regulation service. Please verify your connection or try again.
            </p>
            <button
              onClick={fetchRegulationData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
              }}
            >
              <RefreshCw size={15} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* ── Four Primary Regulation Cards Grid ── */}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '24px',
              marginBottom: '52px',
            }}
          >
            {regulationCards.map((card, index) => {
              const isHovered = hoveredCard === card.code

              return (
                <motion.article
                  key={card.code}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setHoveredCard(card.code)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{ y: -5 }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${card.title} - ${card.fullName}. ${card.statusBadge ? card.statusBadge : 'Explore Resources'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCardClick(card)
                    }
                  }}
                  onClick={() => handleCardClick(card)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.88)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRadius: '24px',
                    border: `1px solid ${isHovered ? card.accentColor + '70' : 'rgba(249, 115, 22, 0.14)'}`,
                    boxShadow: isHovered
                      ? `0 20px 42px ${card.glowColor}, 0 0 0 1px ${card.accentColor}30`
                      : '0 10px 30px rgba(17, 24, 39, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                    outline: 'none',
                  }}
                >
                  {/* Vertical Subtle Accent Watermark along edge for JNTUK */}
                  {card.edgeText && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        bottom: '70px',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '32px',
                        fontWeight: 900,
                        letterSpacing: '4px',
                        color: 'rgba(253, 186, 18, 0.08)',
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'right bottom',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: 2,
                      }}
                    >
                      {card.edgeText}
                    </div>
                  )}

                  {/* Card Campus Image Header */}
                  <div
                    style={{
                      height: '175px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#EAE5DD',
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                        transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(17, 24, 39, 0.45) 0%, rgba(17, 24, 39, 0.05) 50%, transparent 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Status / Code Pill on Image */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        background: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '9999px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {card.isAutonomous && <Building2 size={13} style={{ color: card.accentColor }} />}
                      {!card.isAutonomous && <GraduationCap size={13} style={{ color: card.accentColor }} />}
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#111827',
                          letterSpacing: '0.4px',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        {card.code}
                      </span>
                    </div>

                    {/* Coming Soon Indicator Badge if not supported */}
                    {card.statusBadge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '14px',
                          right: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          background: 'linear-gradient(135deg, #F59E0B, #FB7185)',
                          borderRadius: '9999px',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.3px',
                          boxShadow: '0 4px 10px rgba(245, 158, 11, 0.35)',
                        }}
                      >
                        <Clock size={11} />
                        <span>{card.statusBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div
                    style={{
                      padding: '22px 22px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    {/* University Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#111827',
                        margin: '0 0 6px 0',
                        letterSpacing: '-0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>{card.title}</span>
                    </h3>

                    {/* Subtitle / Full Name */}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: card.accentColor,
                        marginBottom: '10px',
                        lineHeight: 1.35,
                      }}
                    >
                      {card.fullName}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: 1.55,
                        color: '#4B5563',
                        margin: '0 0 20px 0',
                        flex: 1,
                      }}
                    >
                      {card.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      type="button"
                      tabIndex={-1}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 18px',
                        borderRadius: '14px',
                        border: 'none',
                        background: isHovered
                          ? 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)'
                          : 'linear-gradient(135deg, rgba(253, 186, 18, 0.15) 0%, rgba(249, 115, 22, 0.12) 100%)',
                        color: isHovered ? '#FFFFFF' : '#111827',
                        fontFamily: 'var(--font-heading, "Space Grotesk")',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isHovered ? '0 6px 18px rgba(249, 115, 22, 0.35)' : 'none',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <span>{card.statusBadge ? 'Check Regulation Hub' : 'Explore Resources'}</span>
                      <motion.span
                        animate={{ x: isHovered ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight size={15} />
                      </motion.span>
                    </button>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

        {/* ── Bottom Controls Bar: Back to Home + Ask Campus AI ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(249, 115, 22, 0.12)',
          }}
        >
          {/* Bottom-Left: Back to Home Button */}
          <motion.button
            onClick={() => navigate('/welcome')}
            whileHover={{ x: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Back to Home Page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(249, 115, 22, 0.22)',
              borderRadius: '9999px',
              color: '#111827',
              fontFamily: 'var(--font-heading, "Space Grotesk")',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(17, 24, 39, 0.05)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <span style={{ color: '#F97316', fontSize: '15px' }}>←</span>
            <span>Back to Home</span>
          </motion.button>
        </div>
      </main>

      {/* ── Floating Ask Campus AI Assistant Widget ── */}
      <AIAssistant
        variant="pill"
        contextTitle="Student Resource Portal"
        contextPrompts={[
          'Help me choose my regulation',
          'Find my subjects',
          'Explain my syllabus',
          'Find resources for DBMS',
        ]}
      />

      {/* ── Modal for JNTUH (Curating / Coming Soon Notice) ── */}
      <AnimatePresence>
        {comingSoonModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              background: 'rgba(17, 24, 39, 0.55)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setComingSoonModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '460px',
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px 28px',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setComingSoonModal(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
                aria-label="Close Dialog"
              >
                <X size={20} />
              </button>

              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(253, 186, 18, 0.2), rgba(249, 115, 22, 0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F97316',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}
              >
                🎓
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#111827',
                  margin: '0 0 10px 0',
                }}
              >
                JNTUH Syllabus In Curation
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#4B5563',
                  margin: '0 0 24px 0',
                }}
              >
                Official curriculum, unit-wise notes, and reference materials for <strong>JNTU Hyderabad</strong> are currently being curated by our academic faculty team.
                <br /><br />
                You can still view the regulation subject gateway or return to choose JNTUK / AU.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setComingSoonModal(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid rgba(17, 24, 39, 0.12)',
                    background: '#FFFFFF',
                    color: '#4B5563',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComingSoonModal(null)
                    navigate(comingSoonModal.targetRoute)
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
                  }}
                >
                  Open Preview Hub
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}