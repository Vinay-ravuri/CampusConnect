import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home as HomeIcon, BookOpen, Target, Briefcase, Sparkles, GraduationCap } from 'lucide-react'
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

  const baseLinks = [
    { label: 'Home', path: '/welcome', icon: HomeIcon, isHome: true },
    { 
      label: 'Student Resources', 
      path: '/student', 
      icon: BookOpen,
      hasDropdown: true,
      children: [
        { label: 'All Regulations', path: '/student', desc: 'Browse JNTUK, AU, JNTUH, Other' },
        { label: 'JNTUK Resource Hub', path: '/student/JNTUK', desc: 'Syllabus, notes, PYQs' },
        { label: 'Andhra University (AU)', path: '/student/AU', desc: 'Engineering curriculum' },
        { label: 'JNTU Hyderabad (JNTUH)', path: '/student/JNTUH', desc: 'Upcoming syllabus' },
        { label: 'Other Autonomous Colleges', path: '/student/UNI', desc: 'Deemed universities' },
      ]
    },
    { 
      label: 'Placement Preparation', 
      path: '/placement', 
      icon: Target,
      hasDropdown: true,
      children: [
        { label: '7-Stage Roadmap', path: '/placement', desc: 'Complete placement roadmap' },
        { label: 'Core CS (OS, DBMS, CN)', path: '/placement', desc: 'Core subject notes & interview questions' },
        { label: 'DSA & Coding Arena', path: '/placement', desc: 'Algorithms & coding patterns' },
        { label: 'Company Preparation', path: '/placement', desc: 'TCS, Infosys, Wipro, Amazon PYQs' },
      ]
    },
    { label: 'Jobs & Internships', path: '/jobs', icon: Briefcase },
    { label: 'AI Career Assistant', path: '/career', icon: Sparkles },
    { label: 'About', path: '#about', isAbout: true },
  ]
  const links = isAdmin ? [...baseLinks, { label: 'Admin Panel', path: '/admin' }] : baseLinks

  const handleLinkClick = (link) => {
    if (link.isAbout) { setShowAbout(true); return }
    if (link.label === 'Home') {
      if (location.pathname === '/welcome' || location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      navigate('/welcome')
    } else {
      navigate(link.path)
    }
  }

  const isActive = (link) => {
    if (link.label === 'Home') return location.pathname === '/welcome' || location.pathname === '/' || location.pathname === '/cinematic'
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
          height: '74px',
          zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(18px, 4.8vw, 68px)',
          background: isDark
            ? (scrolled ? 'rgba(5, 7, 11, 0.94)' : 'rgba(0, 0, 0, 0.92)')
            : (scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 249, 240, 0.88)'),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${
            isDark 
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(249, 115, 22, 0.12)'
          }`,
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* ── Left: Campus Connect Logo ── */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => {
            if (location.pathname === '/' || location.pathname === '/welcome') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              navigate('/welcome')
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
              flexShrink: 0,
            }}
          >
            <GraduationCap size={22} color="#000000" strokeWidth={2.4} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16.5,
              letterSpacing: '-0.2px', color: isDark ? '#FFFFFF' : 'var(--text, #111827)',
              textTransform: 'uppercase',
            }}>
              CAMPUS<span style={{ color: '#F97316' }}>CONNECT</span>
            </span>
            <span style={{
              fontSize: '10px', fontFamily: 'var(--font-body)', color: isDark ? 'rgba(255,255,255,0.65)' : 'var(--text-3, #4B5563)',
              fontWeight: 500, letterSpacing: '0.4px',
            }}>
              Learn. Prepare. Achieve.
            </span>
          </div>
        </motion.div>

        {/* ── Center: Desktop Nav Links ── */}
        <div
          className="hide-mobile"
          style={{ display: 'flex', gap: ' clamp(10px, 1.4vw, 24px)', alignItems: 'center', position: 'relative' }}
        >
          {links.map((link) => {
            const active = isActive(link)
            const isMenuOpen = activeDropdown === link.label
            const IconComp = link.icon

            return (
              <div
                key={link.label}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => {
                  if (link.hasDropdown) {
                    clearTimeout(dropdownTimerRef.current)
                    setActiveDropdown(link.label)
                  }
                }}
                onMouseLeave={() => {
                  if (link.hasDropdown) {
                    dropdownTimerRef.current = setTimeout(() => setActiveDropdown(null), 200)
                  }
                }}
              >
                {/* Separator before About */}
                {link.label === 'About' && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '1px',
                      height: '14px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      marginRight: 'clamp(10px, 1.4vw, 20px)',
                    }}
                  />
                )}

                {/* Link Button */}
                {(() => {
                  const isPlacement = link.path === '/placement'
                  const isJobs = link.path === '/jobs'
                  const activeBg = isDark
                    ? (isJobs ? 'rgba(37, 99, 235, 0.2)' : isPlacement ? 'rgba(16, 185, 129, 0.15)' : 'rgba(253, 186, 18, 0.12)')
                    : (isJobs ? '#EBF3FE' : isPlacement ? '#ECFDF5' : '#FEF3C7')
                  const activeBorder = isDark
                    ? (isJobs ? '1px solid rgba(37, 99, 235, 0.45)' : isPlacement ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(253, 186, 18, 0.4)')
                    : (isJobs ? '1px solid rgba(37, 99, 235, 0.35)' : isPlacement ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)')
                  const activeColor = isDark
                    ? (isJobs ? '#60A5FA' : isPlacement ? '#34D399' : '#FDBA12')
                    : (isJobs ? '#1D4ED8' : isPlacement ? '#047857' : '#1E293B')
                  const activeIconColor = isJobs ? '#2563EB' : isPlacement ? '#059669' : '#F97316'
                  const activeShadow = isJobs
                    ? '0 2px 8px rgba(37, 99, 235, 0.18)'
                    : isPlacement 
                    ? '0 2px 8px rgba(16, 185, 129, 0.15)' 
                    : '0 2px 8px rgba(245, 158, 11, 0.12)'

                  return (
                    <motion.button
                      onClick={() => handleLinkClick(link)}
                      style={{
                        position: 'relative',
                        border: active ? activeBorder : 'none',
                        cursor: 'pointer',
                        padding: active ? '7px 18px' : '7px 9px',
                        borderRadius: active ? '100px' : '6px',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '14px',
                        fontWeight: active ? 700 : 500,
                        color: active
                          ? activeColor
                          : (isDark ? 'rgba(255, 255, 255, 0.88)' : '#374151'),
                        background: active ? activeBg : 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        boxShadow: active ? activeShadow : 'none',
                        transition: 'all 0.2s ease',
                      }}
                      whileHover={!active ? {
                        color: isPlacement ? '#059669' : '#F97316',
                      } : undefined}
                      whileTap={{ scale: 0.97 }}
                    >
                      {IconComp && (
                        <IconComp
                          size={16}
                          color={active ? activeIconColor : (isDark ? '#FFFFFF' : '#4B5563')}
                          strokeWidth={active ? 2.4 : 1.9}
                        />
                      )}
                      <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
                    </motion.button>
                  )
                })()}

                {/* Dropdown Menu */}
                {link.hasDropdown && isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '8px',
                      minWidth: '240px',
                      background: isDark ? 'rgba(11, 15, 25, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(249, 115, 22, 0.18)'}`,
                      borderRadius: '16px',
                      padding: '8px',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
                      zIndex: 300,
                    }}
                  >
                    {link.children.map(child => (
                      <div
                        key={child.label}
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveDropdown(null)
                          navigate(child.path)
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(249, 115, 22, 0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#FFFFFF' : '#111827' }}>
                          {child.label}
                        </span>
                        {child.desc && (
                          <span style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.5)' : '#6B7280' }}>
                            {child.desc}
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
        {/* ── Desktop Actions ── */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                onClick={() => navigate('/dashboard')}
                title="Student Profile"
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: '#F97316',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#fff',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.4)',
                  }}
                >
                  {(user?.name && user.name.toLowerCase() !== 'rajesh kumar') ? user.name[0].toUpperCase() : 'V'}
                </div>
                <span style={{ fontSize: 13, color: isDark ? '#FFFFFF' : 'var(--text, #111827)', fontWeight: 500, fontFamily: 'var(--font-heading)' }}>
                  {(user?.name && user.name.toLowerCase() !== 'rajesh kumar') ? user.name.toLowerCase() : 'vinay'}
                </span>
              </div>
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(239, 68, 68, 0.12)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'none',
                  border: '1px solid rgba(239, 68, 68, 0.55)',
                  borderRadius: '6px',
                  padding: '4px 14px',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  transition: 'all 0.2s',
                }}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => setShowLogin(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #FDBA12 0%, #F97316 100%)',
                border: 'none', borderRadius: 8, padding: '7px 20px',
                color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-heading)',
                fontSize: 13, fontWeight: 700,
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.25)',
              }}
            >
              Login
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