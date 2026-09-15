import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginModal from './LoginModal'

export default function Navbar({ isDark }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, logout, isAdmin } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownTimerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  const studentLinks = isLoggedIn 
    ? [{ label: 'Dashboard', path: '/dashboard', icon: '⚡' }] 
    : []

  const baseLinks = [
    { label: 'Home', path: '/welcome', icon: '🏠' },
    ...studentLinks,
    { label: 'Student Resources', path: '/student', icon: '📚' },
    { label: 'Placement Preparation', path: '/placement', icon: '💼' },
    { label: 'Jobs & Internships', path: '/jobs', icon: '🎯' },
    { label: 'AI Career Assistant', path: '/career', icon: '✨' },
    { label: 'About', path: '#about', isAbout: true, icon: '✦' },
  ]
  const links = isAdmin ? [...baseLinks, { label: 'Admin Panel', path: '/admin', icon: '⚙' }] : baseLinks

  const handleLinkClick = (link) => {
    if (link.isAbout) { setShowAbout(true); return }
    if (link.label === 'Home') {
      if (location.pathname === '/welcome') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
      navigate('/welcome')
    } else {
      navigate(link.path)
    }
  }

  const isActive = (link) => {
    if (link.label === 'Home') return location.pathname === '/welcome'
    return link.path && location.pathname.startsWith(link.path) && link.path !== '/welcome'
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          width: '100%',
          height: scrolled ? '64px' : '76px',
          zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(16px, 4%, 48px)',
          background: scrolled
            ? (isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.82)')
            : (isDark ? 'rgba(17, 24, 39, 0.50)' : 'rgba(255, 249, 240, 0.65)'),
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: `1px solid ${
            isDark 
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(249, 115, 22, 0.12)'
          }`,
          boxShadow: scrolled 
            ? '0 10px 30px rgba(17, 24, 39, 0.05)'
            : 'none',
          transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* ── Left: Campus Connect Logo ── */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => navigate('/welcome')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #F4511E 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
              fontSize: 19, color: '#fff', flexShrink: 0,
            }}
          >🎓</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 17,
              letterSpacing: '-0.3px', color: isDark ? '#FFFFFF' : 'var(--text, #111827)',
              textTransform: 'uppercase',
            }}>
              CAMPUS<span style={{ color: 'var(--cc-orange, #F97316)' }}>CONNECT</span>
            </span>
            <span style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: isDark ? 'rgba(255,255,255,0.65)' : 'var(--text-3, #4B5563)',
              fontWeight: 500, letterSpacing: '0.4px',
            }}>
              Learn. Prepare. Achieve.
            </span>
          </div>
        </motion.div>

        {/* ── Center: Desktop Nav Links with soft highlighted pill ── */}
        <div
          className="hide-mobile"
          style={{ display: 'flex', gap: 4, alignItems: 'center' }}
        >
          {links.map(link => {
            const active = isActive(link)
            return (
              <motion.button
                key={link.label}
                onClick={() => handleLinkClick(link)}
                style={{
                  position: 'relative',
                  border: active
                    ? '1px solid rgba(249, 115, 22, 0.28)'
                    : '1px solid transparent',
                  cursor: 'pointer',
                  padding: '7px 15px',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13.5px',
                  fontWeight: active ? 700 : 500,
                  color: active
                    ? 'var(--cc-deep-orange, #F4511E)'
                    : (isDark ? 'rgba(255, 255, 255, 0.85)' : 'var(--text-2, #374151)'),
                  background: active
                    ? 'linear-gradient(135deg, rgba(253, 186, 18, 0.18) 0%, rgba(249, 115, 22, 0.12) 100%)'
                    : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: active ? '0 2px 8px rgba(249, 115, 22, 0.12)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                whileHover={!active ? {
                  backgroundColor: 'rgba(249, 115, 22, 0.06)',
                  color: 'var(--cc-orange, #F97316)',
                } : undefined}
                whileTap={{ scale: 0.97 }}
              >
                <span>{link.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* ── Desktop Actions ── */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {scrolled && (
            <motion.button
              onClick={() => navigate('/choose')}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(255,122,0,0.25)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: 'linear-gradient(135deg, #FF7A00, #FFB800)',
                border: 'none', borderRadius: 100, padding: '7px 20px',
                color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-accent)',
                fontSize: 12, fontWeight: 700,
                boxShadow: '0 4px 12px rgba(255,122,0,0.18)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <span>ENTER PORTAL</span>
              <span style={{ fontSize: 13 }}>→</span>
            </motion.button>
          )}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                onClick={() => navigate('/dashboard')}
                title="Go to Student Command Center"
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#fff',
                    boxShadow: '0 2px 10px rgba(249, 115, 22, 0.35)',
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </motion.div>
                <span style={{ fontSize: 13, color: isDark ? '#FFFFFF' : 'var(--text, #111827)', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                  {user?.name}
                </span>
              </div>
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'none', border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '100px', padding: '6px 14px', color: 'var(--danger, #EF4444)',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  fontFamily: 'var(--font-heading)', transition: 'all 0.2s',
                }}
              >Logout</motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => setShowLogin(true)}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: 'var(--grad-main, linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #F4511E 100%))',
                border: 'none', borderRadius: 100, padding: '9px 24px',
                color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-heading)',
                fontSize: 13, fontWeight: 700,
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.25)',
                display: 'inline-flex', alignItems: 'center', gap: 7,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <span>Login</span>
            </motion.button>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <motion.button
          className="show-mobile"
          onClick={() => setMobileOpen(o => !o)}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'none',
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,154,61,0.2)'}`,
            borderRadius: 10, width: 40, height: 40,
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 5, cursor: 'pointer', flexShrink: 0,
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={
                mobileOpen
                  ? i === 0
                    ? { rotate: 45, y: 7 }
                    : i === 1
                    ? { opacity: 0, scaleX: 0 }
                    : { rotate: -45, y: -7 }
                  : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
              }
              style={{
                display: 'block', width: 18, height: 1.5, borderRadius: 2,
                background: mobileOpen ? '#FF7A00' : (isDark ? '#FFFFFF' : 'var(--text-2)'),
                transformOrigin: 'center',
              }}
            />
          ))}
        </motion.button>
      </motion.nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 190,
                background: 'rgba(15,23,42,0.25)', backdropFilter: 'blur(8px)',
              }}
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(320px, 85vw)', zIndex: 195,
                background: 'rgba(255,253,248,0.97)',
                backdropFilter: 'blur(32px)',
                borderLeft: '1px solid rgba(255,154,61,0.15)',
                boxShadow: '-20px 0 60px rgba(255,122,0,0.08)',
                display: 'flex', flexDirection: 'column',
                padding: '80px 24px 32px',
                overflowY: 'auto',
              }}
            >
              {/* Mobile Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {links.map((link, i) => {
                  const active = isActive(link)
                  return (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      onClick={() => { handleLinkClick(link); setMobileOpen(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', borderRadius: 14,
                        background: active ? 'rgba(255,154,61,0.08)' : 'transparent',
                        border: active ? '1px solid rgba(255,154,61,0.2)' : '1px solid transparent',
                        cursor: 'pointer', textAlign: 'left',
                        fontFamily: 'var(--font-accent)', fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        color: active ? '#FF9A3D' : 'var(--text-2)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{link.icon}</span>
                      <span>{link.label}</span>
                      {active && (
                        <span style={{
                          marginLeft: 'auto', fontSize: 10, padding: '2px 8px',
                          borderRadius: 100, background: '#FF9A3D', color: '#fff', fontWeight: 800,
                        }}>ACTIVE</span>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Mobile Auth */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  borderTop: '1px solid rgba(255,154,61,0.12)',
                  paddingTop: 20, marginTop: 20,
                }}
              >
                {isLoggedIn ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF7A00, #FFB800)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 800, color: '#fff',
                      }}>
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.5px' }}>Logged In</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false) }}
                      style={{
                        padding: '12px', borderRadius: 12,
                        background: 'rgba(244,63,94,0.06)',
                        border: '1px solid rgba(244,63,94,0.2)',
                        color: 'var(--danger)', cursor: 'pointer',
                        fontFamily: 'var(--font-accent)', fontSize: 13, fontWeight: 700,
                      }}
                    >Logout</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setShowLogin(true); setMobileOpen(false) }}
                    style={{
                      width: '100%', padding: '13px',
                      background: 'linear-gradient(135deg, #FF7A00, #FFB800)',
                      border: 'none', borderRadius: 12, color: '#fff',
                      fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700,
                      cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,122,0,0.28)',
                    }}
                  >Login to Campus Connect →</button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Login Modal ── */}
      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>

      {/* ── About Modal ── */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setShowAbout(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15,23,42,0.2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 1000, display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.6)',
                borderRadius: 28, padding: '44px 40px',
                maxWidth: 540, width: '100%',
                boxShadow: '0 40px 100px rgba(255,154,61,0.12), 0 1px 0 rgba(255,255,255,0.8)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(244,63,94,0.08)' }}
                onClick={() => setShowAbout(false)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 32, height: 32, borderRadius: 8,
                  background: 'none', border: '1px solid rgba(244,63,94,0.2)',
                  color: 'var(--danger)', cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</motion.button>

              {/* Logo */}
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'linear-gradient(135deg, #FF7A00, #FFB800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, marginBottom: 20,
                boxShadow: '0 8px 24px rgba(255,122,0,0.3)',
              }}>🎓</div>

              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800,
                color: 'var(--text)', marginBottom: 12, letterSpacing: '-0.5px',
              }}>About CampusConnect</h3>
              <p style={{
                fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 28,
              }}>
                CampusConnect is a premium modern educational platform built for engineering students across Andhra Pradesh. We integrate University regulations, organized academic directories, code roadmap trackers, and AI interactive assistance — guiding students from curriculum to career.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
                {[
                  { icon: '🎓', label: 'University Portal', color: 'rgba(255,122,0,0.08)', border: 'rgba(255,122,0,0.15)' },
                  { icon: '💼', label: 'Placement Portal', color: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.15)' },
                  { icon: '🤖', label: 'AI Assistant', color: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.12)' },
                  { icon: '📊', label: 'Study Roadmaps', color: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.12)' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: item.color, border: `1px solid ${item.border}`,
                    borderRadius: 14, padding: '16px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 700 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(255,122,0,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setShowAbout(false); navigate('/choose') }}
                  style={{
                    flex: 1, padding: '13px', background: 'linear-gradient(135deg, #FF7A00, #FFB800)',
                    border: 'none', borderRadius: 12, color: '#fff',
                    fontFamily: 'var(--font-accent)', fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,122,0,0.22)',
                  }}
                >Enter Portal →</motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAbout(false)}
                  style={{
                    padding: '13px 20px',
                    background: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(255,154,61,0.2)',
                    borderRadius: 12, color: 'var(--text-2)',
                    fontFamily: 'var(--font-accent)', fontWeight: 600, fontSize: 13,
                    cursor: 'pointer',
                  }}
                >Close</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hide-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}