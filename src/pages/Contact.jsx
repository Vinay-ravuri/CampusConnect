import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import PremiumBackground3D from '../components/PremiumBackground3D'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    }, 1200)
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* 3D background */}
      <PremiumBackground3D />

      {/* Navigation */}
      <Navbar />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '130px 24px 80px',
      }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-accent)',
            letterSpacing: '4px',
            color: '#FF7A00',
            textTransform: 'uppercase',
            marginBottom: '16px',
            fontWeight: 700,
            display: 'block',
          }}>
            — CONNECT WITH US —
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: 'clamp(32px, 6vw, 68px)',
            letterSpacing: '-2px',
            color: 'var(--text)',
            lineHeight: 1.05,
            marginBottom: '18px',
            textTransform: 'uppercase',
          }}>
            Get In{' '}
            <span className="luxury-gradient-text">Touch</span>
          </h1>
          <p style={{
            fontSize: '14px',
            fontFamily: 'var(--font-accent)',
            color: 'var(--text-2)',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: '1.75',
            fontWeight: 500,
          }}>
            Have inquiries, feedback, or suggestions? Send us a message and our support team will get back to you shortly.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}>
          {/* Left Column: Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Box 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 122, 0, 0.08)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>✉️</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                Email Correspondence
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '12px' }}>
                For general support queries, student portal questions, and placement details.
              </p>
              <a href="mailto:support@campusconnect.space" style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '14px',
                fontWeight: 700,
                color: '#FF7A00',
                textDecoration: 'none',
              }}>
                support@campusconnect.space
              </a>
            </div>

            {/* Box 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 122, 0, 0.08)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏛️</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                Headquarters
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '12px' }}>
                Engineering Portal Platform Office, Andhra Pradesh, India.
              </p>
              <span style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-2)',
              }}>
                Visakhapatnam / Vijayawada Gateway
              </span>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 122, 0, 0.12)',
            borderRadius: '24px',
            padding: '44px 36px',
            boxShadow: 'var(--shadow-md)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: '28px',
              letterSpacing: '-0.3px',
            }}>
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 122, 0, 0.15)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="student@college.edu"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 122, 0, 0.15)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="How can we help?"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 122, 0, 0.15)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Message</label>
                <textarea
                  required
                  rows="4"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what you need support with..."
                  style={{
                    ...inputStyle,
                    resize: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#FF7A00'; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 122, 0, 0.15)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '12px',
                      padding: '14px',
                      color: '#10B981',
                      fontSize: '13px',
                      fontWeight: 600,
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>✓</span> Message sent successfully! We'll reply soon.
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.025, boxShadow: '0 8px 24px rgba(255,122,0,0.35)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading ? 'rgba(255,122,0,0.45)' : 'linear-gradient(135deg, #FF7A00, #FFB800)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 122, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? 'Sending message...' : 'Send Message →'}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      <AIAssistant />
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--text-3)',
  marginBottom: '6px',
  fontWeight: 600,
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
}

const inputStyle = {
  width: '100%',
  background: '#FAF9F6',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: '#0B0F19',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}
