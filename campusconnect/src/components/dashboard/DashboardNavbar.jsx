import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function DashboardNavbar({ studentName, studentEmail }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const displayName = studentName || user?.name || (user?.email ? user.email.split('@')[0] : 'Student')
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'S'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'HOME', path: '/welcome', external: false },
    { label: 'STUDENT PORTAL', path: '/student', external: false },
    { label: 'PLACEMENT', path: '/placement', external: false },
    { label: 'JOBS', path: '/jobs', external: false },
    { label: 'AI CAREER', path: '/career', external: false },
    { label: 'RESUME', path: '/career', external: false },
  ]

  const handleLogout = () => {
    logout()
    navigate('/welcome')
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1360px, calc(100% - 32px))',
          height: '66px',
          zIndex: 900,
          borderRadius: '18px',
          background: scrolled
            ? 'rgba(11, 15, 25, 0.88)'
            : 'rgba(15, 20, 32, 0.72)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(253, 186, 18, 0.22)',
          boxShadow: scrolled
            ? '0 16px 48px -8px rgba(0, 0, 0, 0.8), 0 0 24px rgba(253, 186, 18, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
            : '0 12px 36px -8px rgba(0, 0, 0, 0.65), 0 0 16px rgba(253, 186, 18, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 2.5vw, 28px)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              background: 'radial-gradient(circle at 30% 30%, #FDBA12 0%, #F97316 65%, #EA580C 100%)',
              boxShadow: '0 0 18px rgba(249, 115, 22, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#FFFFFF',
              fontWeight: 800,
            }}
          >
            🎓
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: '15.5px',
                fontWeight: 800,
                letterSpacing: '0.8px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              CAMPUS<span style={{ color: '#F97316' }}>CONNECT</span>
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1.4px',
                color: 'rgba(253, 186, 18, 0.85)',
                textTransform: 'uppercase',
              }}
            >
              COMMAND CENTER
            </span>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav
          className="cc-dash-desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '5px',
            borderRadius: '100px',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          {navLinks.map((link) => {
            const isDashActive = link.label === 'COMMAND CENTER'
            return (
              <motion.button
                key={link.label}
                onClick={() => navigate(link.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  border: 'none',
                  background: isDashActive
                    ? 'linear-gradient(135deg, rgba(253, 186, 18, 0.22) 0%, rgba(249, 115, 22, 0.16) 100%)'
                    : 'transparent',
                  color: isDashActive ? '#FDBA12' : 'rgba(255, 255, 255, 0.72)',
                  padding: '7px 14px',
                  borderRadius: '100px',
                  fontSize: '11.5px',
                  fontWeight: isDashActive ? 800 : 600,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  cursor: 'pointer',
                  borderBottom: isDashActive ? '1.5px solid #FDBA12' : '1.5px solid transparent',
                  boxShadow: isDashActive ? '0 0 14px rgba(253, 186, 18, 0.25)' : 'none',
                  transition: 'color 0.2s, background 0.2s, border 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isDashActive) {
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDashActive) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {link.label}
              </motion.button>
            )
          })}
        </nav>

        {/* Right User Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Student Profile Chip */}
          <div
            className="cc-dash-user-chip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '5px 12px 5px 6px',
              borderRadius: '100px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(253, 186, 18, 0.25)',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '13px',
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              }}
            >
              {initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </span>
              <span style={{ fontSize: '9.5px', color: '#10B981', fontWeight: 600 }}>Active Student</span>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '7px 14px',
              borderRadius: '100px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#F87171',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              letterSpacing: '0.6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)'
              e.currentTarget.style.color = '#FFFFFF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'
              e.currentTarget.style.color = '#F87171'
            }}
          >
            <span>LOGOUT</span>
          </motion.button>

          {/* Mobile Toggle Button */}
          <button
            className="cc-dash-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(253, 186, 18, 0.3)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '90px',
              left: '16px',
              right: '16px',
              zIndex: 890,
              background: 'rgba(11, 15, 25, 0.96)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(253, 186, 18, 0.25)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate(link.path)
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  fontSize: '13px',
                  fontWeight: 700,
                  textAlign: 'left',
                  letterSpacing: '0.8px',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 980px) {
          .cc-dash-desktop-nav {
            display: none !important;
          }
          .cc-dash-mobile-toggle {
            display: block !important;
          }
          .cc-dash-user-chip {
            padding: 4px 8px !important;
          }
        }
      `}</style>
    </>
  )
}
