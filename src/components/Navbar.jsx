import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import LoginModal from './LoginModal'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, logout, isAdmin } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  const baseLinks = [
    { label: 'HOME', path: '/welcome' },
    { label: 'RESOURCES', path: '/student' },
    { label: 'PLACEMENT', path: '/placement' },
    { label: 'AI ASSISTANT', path: '/assistant' },
  ]

  const links = isAdmin
    ? [...baseLinks, { label: '⚙ ADMIN', path: '/admin' }]
    : baseLinks

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(4,4,10,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #ffffff08',
      }}>

        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/welcome')}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg,#4f8aff,#a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px #4f8aff40',
          }}>
            <span style={{
              fontFamily: 'Bebas Neue,sans-serif',
              fontSize: 14, color: '#fff', letterSpacing: 1,
            }}>CC</span>
          </div>
          <span style={{
            fontFamily: 'Bebas Neue,sans-serif',
            fontSize: 15, letterSpacing: 3, color: '#ffffff80',
          }}>CAMPUSCONNECT</span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {links.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8,
                fontFamily: 'Bebas Neue,sans-serif',
                fontSize: 12, letterSpacing: 2,
                color: location.pathname === link.path ? '#4f8aff' : '#ffffff30',
                borderBottom: location.pathname === link.path
                  ? '1px solid #4f8aff'
                  : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff80'}
              onMouseLeave={e => {
                e.currentTarget.style.color =
                  location.pathname === link.path ? '#4f8aff' : '#ffffff30'
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Auth Section */}
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg,#4f8aff,#00e5c0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 12, color: '#ffffff50', fontWeight: 500 }}>
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: '1px solid #ffffff15',
                borderRadius: 8, padding: '6px 16px',
                color: '#ffffff30', cursor: 'pointer',
                fontSize: 11, letterSpacing: 1,
                fontFamily: 'Bebas Neue,sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#ff444440'
                e.currentTarget.style.color = '#ff4444'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#ffffff15'
                e.currentTarget.style.color = '#ffffff30'
              }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            style={{
              background: 'linear-gradient(135deg,#4f8aff,#a855f7)',
              border: 'none', borderRadius: 8, padding: '8px 24px',
              color: '#fff', cursor: 'pointer',
              fontFamily: 'Bebas Neue,sans-serif',
              fontSize: 13, letterSpacing: 2,
              boxShadow: '0 0 20px #4f8aff30',
              transition: 'all 0.3s ease',
            }}
          >
            SIGN IN
          </button>
        )}
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}