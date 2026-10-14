import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight, 
  Home as HomeIcon, 
  X 
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import { getRegulations } from '../api/subjects'

// ── Reusable Precision Regulation Card Component ──
function RegulationCard({ card, index, onExplore }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onExplore(card)}
      tabIndex={0}
      role="button"
      aria-label={`${card.title} - ${card.fullName}. Explore Resources`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onExplore(card)
        }
      }}
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: `1px solid ${isHovered ? 'rgba(249, 115, 22, 0.45)' : 'rgba(243, 235, 222, 0.95)'}`,
        boxShadow: isHovered
          ? '0 16px 36px rgba(249, 115, 22, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
          : '0 8px 24px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        outline: 'none',
      }}
    >
      {/* ── Card Campus Image Header ── */}
      <div
        style={{
          height: '135px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#EAE5DD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background Campus Photo */}
        <img
          src={card.image}
          alt={card.alt}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        {/* Soft Contrast Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(17, 24, 39, 0.35) 0%, rgba(17, 24, 39, 0.05) 50%, rgba(255, 255, 255, 0.15) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Vertical Subtle Accent Watermark along right edge matching Target Image 1 */}
        {card.edgeText && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '9px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-heading, "Space Grotesk")',
              fontSize: '13.5px',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#FDE68A',
              opacity: 0.75,
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 2,
              lineHeight: 1.15,
            }}
          >
            {card.edgeText.split('').map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>
        )}

        {/* Centered Circular University Seal/Emblem */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '7px',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img
            src={card.logo}
            alt={`${card.title} logo`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      {/* ── Card Body Info & CTA ── */}
      <div
        style={{
          padding: '14px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
        }}
      >
        {/* University Name */}
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '17.5px',
            fontWeight: 800,
            color: '#111827',
            margin: '0 0 3px 0',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}
        >
          {card.title}
        </h3>

        {/* Subtitle / University Full Name */}
        <div
          style={{
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '12px',
            fontWeight: 500,
            color: '#4B5563',
            lineHeight: 1.35,
            minHeight: '33px',
            marginBottom: '14px',
          }}
        >
          {card.fullName}
        </div>

        {/* Explore Resources CTA Button */}
        <button
          type="button"
          tabIndex={-1}
          style={{
            width: '100%',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '0 16px',
            borderRadius: '10px',
            border: 'none',
            background: isHovered
              ? 'linear-gradient(90deg, #F59E0B 0%, #EA580C 100%)'
              : 'linear-gradient(90deg, #FBBF24 0%, #F97316 100%)',
            color: '#1E293B',
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isHovered
              ? '0 6px 16px rgba(249, 115, 22, 0.35)'
              : '0 3px 10px rgba(249, 115, 22, 0.22)',
            transition: 'all 0.25s ease',
          }}
        >
          <span>Explore Resources</span>
          <motion.span
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <ArrowRight size={14} color="#1E293B" strokeWidth={2.4} />
          </motion.span>
        </button>
      </div>
    </motion.article>
  )
}

export default function StudentPortal() {
  const navigate = useNavigate()
  const [backendRegs, setBackendRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  // Map backend data to the 4 canonical Presentation Cards
  const jntukBackend = backendRegs.find((r) => r.code === 'JNTUK')
  const auBackend = backendRegs.find((r) => r.code === 'AU')
  const jntuhBackend = backendRegs.find((r) => r.code === 'JNTUH')
  const uniBackend = backendRegs.find((r) => r.code === 'UNI')

  const regulationCards = [
    {
      id: jntukBackend ? jntukBackend.id : 'jntuk-card',
      code: 'JNTUK',
      title: 'JNTUK',
      fullName: 'Jawaharlal Nehru Technological University Kakinada',
      image: '/assets/universities/jntuk-campus.webp',
      logo: '/assets/universities/jntuk-logo.svg',
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
      image: '/assets/universities/andhra-university-campus.webp',
      logo: '/assets/universities/au-logo.svg',
      alt: 'Andhra University Visakhapatnam Historic Campus Architecture',
      accentColor: '#F97316',
      glowColor: 'rgba(249, 115, 22, 0.22)',
      edgeText: 'AU',
      isSupported: Boolean(auBackend),
      targetRoute: '/student/AU',
    },
    {
      id: jntuhBackend ? jntuhBackend.id : 'jntuh-card',
      code: 'JNTUH',
      title: 'JNTUH',
      fullName: 'Jawaharlal Nehru Technological University Hyderabad',
      image: '/assets/universities/jntuh-campus.webp',
      logo: '/assets/universities/jntuh-logo.svg',
      alt: 'JNTU Hyderabad Engineering College Campus',
      accentColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.22)',
      edgeText: 'JNTUH',
      isSupported: true, // Seamless navigation supported by SubjectList
      targetRoute: '/student/JNTUH',
    },
    {
      id: uniBackend ? uniBackend.id : 'uni-card',
      code: 'UNI',
      title: 'Other Regulations',
      fullName: 'Other Universities & Autonomous Colleges',
      image: '/assets/universities/other-university.webp',
      logo: '/assets/universities/other-logo.svg',
      alt: 'Modern Autonomous Engineering College Campus Architecture',
      accentColor: '#EAB308',
      glowColor: 'rgba(234, 179, 8, 0.22)',
      edgeText: 'OTHER',
      isAutonomous: true,
      isSupported: Boolean(uniBackend),
      targetRoute: '/student/UNI',
    },
  ]

  const handleCardClick = (card) => {
    navigate(card.targetRoute)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAF7F0',
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
          backgroundPosition: 'center 50%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.14,
          filter: 'blur(28px)',
          transform: 'scale(1.06)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Upper-Right Warm Ambient Radial Glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10%',
          right: '-5%',
          width: '580px',
          height: '580px',
          background: 'radial-gradient(circle, rgba(254, 215, 170, 0.4) 0%, rgba(253, 186, 18, 0.12) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Mid-Left Decorative Amber Watermark Circle ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '38%',
          left: 0,
          width: '50px',
          height: '100px',
          borderRadius: '0 50px 50px 0',
          background: 'radial-gradient(circle at 0% 50%, #FDE68A 0%, rgba(253, 224, 71, 0.6) 60%, transparent 100%)',
          opacity: 0.55,
          filter: 'blur(5px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Bottom Ambient Golden Light ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: '15%',
          right: '15%',
          height: '200px',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(253, 186, 18, 0.14) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 80%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Bottom-Left Soft Blurred Green Foliage Accent ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '-30px',
          left: '-30px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.08) 50%, transparent 75%)',
          filter: 'blur(16px)',
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
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '76px clamp(16px, 3.5vw, 40px) 24px',
        }}
      >
        {/* ── Breadcrumb: Home > Student Resources ── */}
        <div style={{ marginBottom: '12px' }}>
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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
                color: '#F97316',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'opacity 0.2s ease',
              }}
              aria-label="Back to Home"
            >
              <HomeIcon size={14} style={{ color: '#F97316' }} />
              <span>Home</span>
            </Link>

            <span style={{ color: '#9CA3AF', margin: '0 2px' }}>&gt;</span>

            <span
              style={{
                color: '#6B7280',
                fontWeight: 500,
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
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {/* Left: Heading & Subtitle */}
          <div style={{ flex: '1 1 500px', minWidth: '280px' }}>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: 'clamp(32px, 3.6vw, 48px)',
                fontWeight: 800,
                letterSpacing: '-1.2px',
                lineHeight: 1.12,
                color: '#111827',
                margin: 0,
              }}
            >
              Student Resource{' '}
              <span
                style={{
                  color: '#F97316',
                }}
              >
                Portal
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '14.5px',
                lineHeight: 1.55,
                color: '#4B5563',
                maxWidth: '520px',
                marginTop: '12px',
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
              gap: '20px',
              flexWrap: 'wrap',
              alignSelf: 'flex-start',
            }}
          >
            {/* Handwritten Motivational Annotation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '2px 4px',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-handwritten, "Caveat", cursive)',
                  fontSize: 'clamp(23px, 2.1vw, 27px)',
                  fontWeight: 700,
                  color: '#1E293B',
                  lineHeight: 1.15,
                  textShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div>Knowledge</div>
                <div>Builds</div>
                <div>Brighter</div>
                <div>Futures.</div>
              </div>

              {/* Hand-drawn Orange Swoosh Underline */}
              <svg
                width="100"
                height="12"
                viewBox="0 0 100 12"
                fill="none"
                style={{ marginTop: '2px', marginLeft: '6px' }}
                aria-hidden="true"
              >
                <path
                  d="M2 7C24 2 68 2 98 8"
                  stroke="#F97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Glass Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                background: 'rgba(255, 252, 245, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '18px',
                padding: '16px 20px',
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                maxWidth: '220px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  color: '#F59E0B',
                  fontSize: '24px',
                  lineHeight: 1,
                  marginBottom: '4px',
                  fontWeight: 900,
                  fontFamily: 'serif',
                }}
              >
                “
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color: '#374151',
                  margin: 0,
                  letterSpacing: '-0.1px',
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
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 4px 0',
              letterSpacing: '-0.4px',
            }}
          >
            Select Your Regulation
          </h2>
          <p
            style={{
              fontSize: '13.5px',
              color: '#6B7280',
              margin: 0,
            }}
          >
            Choose your university or regulation to get started.
          </p>
        </div>

        {/* ── Loading Skeleton State ── */}
        {loading && (
          <div className="cc-regulation-grid" style={{ marginBottom: '36px' }}>
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid rgba(243, 235, 222, 0.95)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    height: '135px',
                    background: 'linear-gradient(90deg, #F3EFEA 25%, #E9E4DC 50%, #F3EFEA 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ height: '20px', width: '55%', background: '#EAE5DD', borderRadius: '6px' }} />
                  <div style={{ height: '14px', width: '85%', background: '#F0EBE3', borderRadius: '4px' }} />
                  <div style={{ height: '38px', width: '100%', background: '#EAE5DD', borderRadius: '10px', marginTop: '10px' }} />
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
              padding: '36px 24px',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '24px auto 36px',
              boxShadow: '0 12px 32px rgba(239, 68, 68, 0.08)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                marginBottom: '14px',
              }}
            >
              <AlertCircle size={26} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '17px',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '6px',
              }}
            >
              Unable to load regulations.
            </h3>
            <p style={{ fontSize: '13.5px', color: '#6B7280', marginBottom: '18px' }}>
              We could not connect to the academic regulation service. Please verify your connection or try again.
            </p>
            <button
              onClick={fetchRegulationData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                background: 'linear-gradient(135deg, #FDBA12, #F97316)',
                border: 'none',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
              }}
            >
              <RefreshCw size={14} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* ── Four Primary Regulation Cards Grid (Desktop: 4 in 1 Row) ── */}
        {!loading && !error && (
          <div className="cc-regulation-grid" style={{ marginBottom: '20px' }}>
            {regulationCards.map((card, index) => (
              <RegulationCard
                key={card.code}
                card={card}
                index={index}
                onExplore={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* ── Bottom Controls Bar: Back to Home ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '6px',
          }}
        >
          {/* Bottom-Left: Back to Home Button */}
          <motion.button
            onClick={() => navigate('/welcome')}
            whileHover={{ x: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Back to Home Page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(229, 231, 235, 0.9)',
              borderRadius: '9999px',
              color: '#1E293B',
              fontFamily: 'var(--font-heading, "Space Grotesk")',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <span style={{ color: '#F97316', fontSize: '14px', fontWeight: 700 }}>←</span>
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

      {/* ── Modal for JNTUH (Preserved for compatibility) ── */}
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
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(253, 186, 18, 0.2), rgba(249, 115, 22, 0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '18px',
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
                JNTUH Syllabus Hub
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#4B5563',
                  margin: '0 0 24px 0',
                }}
              >
                Official curriculum, unit-wise notes, and reference materials for <strong>JNTU Hyderabad</strong> are ready for preview.
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
                  Open Hub
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}