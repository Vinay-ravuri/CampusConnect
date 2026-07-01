import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginModal({ onClose, redirectTo }) {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode]     = useState('login')
  const [form, setForm]     = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handle = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields'); return }
    setLoading(true); setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.name) { setError('Please enter your name'); setLoading(false); return }
        await register(form.name, form.email, form.password)
      }
      setLoading(false)
      if (redirectTo) navigate(redirectTo)
      else if (onClose) onClose()
    } catch (err) {
      setLoading(false)
      const data = err.response?.data
      if (!err.response) {
        setError('Cannot reach server. Make sure Spring Boot is running on port 8081.')
      } else if (typeof data === 'string') {
        setError(data || `Error ${err.response.status}`)
      } else if (data?.message) {
        setError(data.message)
      } else if (data?.error) {
        setError(data.error)
      } else {
        setError(`Server error (${err.response?.status || 'unknown'}). Please try again.`)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(11,15,25,0.4)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          background: 'rgba(255,255,255,0.98)',
          border: '1px solid rgba(255,122,0,0.14)',
          borderRadius: 24,
          padding: '48px 44px',
          width: '100%', maxWidth: 440,
          position: 'relative',
          boxShadow: '0 32px 80px rgba(255,122,0,0.18), 0 0 0 1px rgba(255,122,0,0.06)',
        }}
      >
        {onClose && (
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, backgroundColor: '#f1f5f9' }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute', top: 18, right: 18,
              background: 'none', border: 'none', color: '#94a3b8',
              cursor: 'pointer', fontSize: 18, width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, transition: 'background 0.2s',
            }}
          >✕</motion.button>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg,#FF7A00,#FFB800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(255,122,0,0.32)',
          }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16, color: '#fff' }}>CC</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: '#0B0F19' }}>CampusConnect</div>
            <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 1 }}>Student Portal</div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {['login','register'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1, padding: '9px', borderRadius: 9,
                border: 'none', cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 600,
                background: mode === m ? '#ffffff' : 'transparent',
                color: mode === m ? '#FF7A00' : '#94a3b8',
                boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, marginBottom: 6, color: '#0B0F19' }}>
          {mode === 'login' ? 'Welcome back 👋' : 'Join CampusConnect'}
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, lineHeight: 1.6 }}>
          {mode === 'login'
            ? 'Sign in to access resources & placement prep'
            : 'Join thousands of engineering students across AP'}
        </p>

        {/* Fields */}
        {mode === 'register' && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Your full name" style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.12)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,122,0,0.15)'; e.target.style.boxShadow = 'none' }} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email Address</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="student@college.edu" style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.12)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,122,0,0.15)'; e.target.style.boxShadow = 'none' }} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••" style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && handle()}
            onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.12)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,122,0,0.15)'; e.target.style.boxShadow = 'none' }} />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontSize: 13, color: '#f43f5e', marginBottom: 16, padding: '10px 14px', background: '#fff1f2', borderRadius: 10, border: '1px solid rgba(244,63,94,0.2)' }}
            >{String(error)}</motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handle} disabled={loading}
          whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 24px rgba(255,122,0,0.38)' } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(255,122,0,0.45)' : 'linear-gradient(135deg, #FF7A00, #FFB800)',
            border: 'none', borderRadius: 12,
            color: '#fff', fontFamily: 'var(--font-heading)',
            fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 4px 16px rgba(255,122,0,0.26)',
          }}
        >
          {loading
            ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />{mode === 'login' ? 'Signing in…' : 'Creating…'}</>
            : mode === 'login' ? 'Sign In →' : 'Create Account →'
          }
        </motion.button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#cbd5e1' }}>
          🔒 Admin: admin@campusconnect.com / admin123
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </motion.div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 12, color: '#64748b',
  marginBottom: 7, fontWeight: 600, letterSpacing: 0.4,
}
const inputStyle = {
  width: '100%', background: '#FAF9F6',
  border: '1px solid rgba(255,122,0,0.15)', borderRadius: 10,
  padding: '12px 16px', color: '#0B0F19',
  fontSize: 14, outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}