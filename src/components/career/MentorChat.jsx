import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askMentor } from '../../services/careerAI'

const SUGGESTED = [
  '💡 What should I learn next?',
  '🎯 Which certification should I take first?',
  '💼 Can I get a software job with my current skills?',
  '📈 How do I improve my ATS score?',
  '🚀 What projects should I build for placement?',
]

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

export default function MentorChat({ profileContext }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi! 👋 I'm your **AI Career Mentor**. I've analyzed your profile and I'm ready to answer your questions about career paths, skills, certifications, and placement strategy. What would you like to know?",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setMessages(m => [...m, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)
    setShowSuggestions(false)
    try {
      const reply = await askMentor(msg, profileContext)
      setMessages(m => [...m, { role: 'ai', text: reply }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Great question! Focus on building practical skills and a strong GitHub portfolio — that is what recruiters look for most. 🚀' }])
    }
    setLoading(false)
  }

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#FF7A00,#FFB800)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(255,122,0,0.3)',
        }}>🤖</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Personal AI Career Mentor
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}
            />
            <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Online · Context-aware · Powered by Gemini</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        height: 360, overflowY: 'auto', padding: '12px',
        background: '#FAF9F6', borderRadius: 16,
        border: '1px solid rgba(255,122,0,0.08)',
        display: 'flex', flexDirection: 'column', gap: 10,
        marginBottom: 14,
      }}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}
          >
            {m.role === 'ai' && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg,#FF7A00,#FFB800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, alignSelf: 'flex-end',
              }}>🤖</div>
            )}
            <div style={{
              maxWidth: '82%', padding: '10px 14px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              fontSize: 13, lineHeight: 1.65,
              background: m.role === 'user' ? 'linear-gradient(135deg,#FF7A00,#FFB800)' : '#ffffff',
              color: m.role === 'user' ? '#fff' : '#111827',
              border: m.role === 'ai' ? '1px solid rgba(255,154,61,0.1)' : 'none',
              boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.05)' : '0 2px 8px rgba(255,122,0,0.18)',
              whiteSpace: 'pre-wrap',
              fontFamily: "'Inter',sans-serif",
            }}>
              {m.text}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg,#FF7A00,#FFB800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            }}>🤖</div>
            <div style={{
              display: 'flex', gap: 4, padding: '12px 16px',
              background: '#fff', borderRadius: '16px 16px 16px 4px',
              border: '1px solid rgba(255,154,61,0.1)',
            }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7A00' }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested prompts */}
        {showSuggestions && messages.length === 1 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', letterSpacing: '1px', fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk',sans-serif" }}>
              QUICK QUESTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {SUGGESTED.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => send(s.replace(/^[^\s]+\s/, ''))}
                  whileHover={{ backgroundColor: 'rgba(255,154,61,0.08)', x: 3 }}
                  style={{
                    background: '#fff', border: '1px solid rgba(255,154,61,0.15)',
                    borderRadius: 10, padding: '8px 12px', textAlign: 'left',
                    cursor: 'pointer', fontSize: 12, color: '#374151',
                    fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
                  }}
                >{s}</motion.button>
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask your AI mentor anything about your career…"
          style={{
            flex: 1, background: '#FAF9F6',
            border: '1px solid rgba(255,154,61,0.2)',
            borderRadius: 12, padding: '12px 16px',
            color: '#111827', fontSize: 13, outline: 'none',
            fontFamily: "'Inter',sans-serif",
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#FF7A00'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,154,61,0.2)'}
        />
        <motion.button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          whileHover={input.trim() && !loading ? { scale: 1.08 } : {}}
          whileTap={input.trim() && !loading ? { scale: 0.92 } : {}}
          style={{
            background: input.trim() && !loading ? 'linear-gradient(135deg,#FF7A00,#FFB800)' : 'rgba(255,154,61,0.2)',
            border: 'none', borderRadius: 12,
            width: 46, height: 46, flexShrink: 0,
            color: '#fff', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: input.trim() && !loading ? '0 4px 12px rgba(255,122,0,0.3)' : 'none',
          }}
        >
          {loading ? '⏳' : '→'}
        </motion.button>
      </div>
    </div>
  )
}
