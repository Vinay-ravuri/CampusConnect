import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginModal({ onClose, redirectTo }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields'); return }
    setLoading(true)
    setError('')
    // Simulate API call — replace with real Spring Boot API later
    setTimeout(() => {
      login({
        name: form.name || form.email.split('@')[0],
        email: form.email,
        role: form.email.includes('admin') ? 'ADMIN' : 'STUDENT',
      })
      setLoading(false)
      if (redirectTo) navigate(redirectTo)
      else if (onClose) onClose()
    }, 1000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(4,4,10,0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#0e0e1c',
        border: '1px solid #ffffff0f',
        borderRadius: 20,
        padding: 48,
        width: '100%', maxWidth: 420,
        animation: 'fadeUp 0.4s ease both',
        position: 'relative',
      }}>

        {/* Close */}
        {onClose && (
          <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#555566', cursor: 'pointer', fontSize: 20 }}>✕</button>
        )}

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#4f8aff,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 16, color: '#fff' }}>CC</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 16, letterSpacing: 2, color: '#f0f0f5' }}>CAMPUSCONNECT</div>
            <div style={{ fontSize: 11, color: '#555566', letterSpacing: 1 }}>Student Portal</div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p style={{ fontSize: 13, color: '#555566', marginBottom: 32 }}>
          {mode === 'login' ? 'Sign in to access resources & placement prep' : 'Join thousands of engineering students'}
        </p>

        {mode === 'register' && (
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Your full name" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4f8aff'}
              onBlur={e => e.target.style.borderColor = '#ffffff0f'} />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email Address</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="student@college.edu" style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#4f8aff'}
            onBlur={e => e.target.style.borderColor = '#ffffff0f'} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••" style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && handle()}
            onFocus={e => e.target.style.borderColor = '#4f8aff'}
            onBlur={e => e.target.style.borderColor = '#ffffff0f'} />
        </div>

        {error && <p style={{ fontSize: 12, color: '#ff4444', marginBottom: 16 }}>{error}</p>}

        <button onClick={handle} disabled={loading} style={{
          width: '100%', padding: '14px',
          background: loading ? '#1a1a2e' : 'linear-gradient(135deg, #4f8aff, #a855f7)',
          border: 'none', borderRadius: 10,
          color: '#fff', fontFamily: 'Bebas Neue,sans-serif',
          fontSize: 16, letterSpacing: 3,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          {loading ? (
            <><div style={{ width: 16, height: 16, border: '2px solid #ffffff30', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> SIGNING IN...</>
          ) : (
            mode === 'login' ? 'SIGN IN →' : 'CREATE ACCOUNT →'
          )}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#555566' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: '#4f8aff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 12, color: '#555566',
  marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase',
}
const inputStyle = {
  width: '100%', background: '#08080f',
  border: '1px solid #ffffff0f', borderRadius: 10,
  padding: '12px 16px', color: '#f0f0f5',
  fontSize: 14, outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s ease',
}