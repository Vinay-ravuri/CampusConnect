import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'

const DEFAULT_PROMPTS = [
  '📘 Explain DBMS Normalization',
  '🧮 Tips for Aptitude Questions',
  '💼 How to prepare for TCS NQT?',
  '📊 Big O Notation for Arrays',
  '🌐 OSI Model explained',
]

export default function AIAssistant({
  variant = 'pill',
  contextTitle = 'Student Resource Portal',
  subtitle = '',
  contextPrompts = [
    'Help me choose my regulation',
    'Find my subjects',
    'Explain my syllabus',
    'Find resources for DBMS'
  ]
}) {
  const suggestedList = contextPrompts && contextPrompts.length > 0 ? contextPrompts : DEFAULT_PROMPTS
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Hi! 👋 I'm **CampusConnect AI** — your career and study companion for **${contextTitle}**.\n\nAsk me about technical topics, syllabus, interview preparation, resume questions, or career guidance!`,
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

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const send = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg) return
    const updatedMessages = [...messages, { role: 'user', text: userMsg }]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      const response = await api.post('/ai/chat', {
        message: userMsg,
        context: contextTitle,
        history: updatedMessages.slice(-6).map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          text: m.text
        }))
      })

      const reply = response.data?.reply || response.data?.text || 'Here is what you need to know.'
      setMessages(m => [...m, { role: 'ai', text: reply }])
    } catch (err) {
      console.error('AI chat error:', err)
      setMessages(m => [
        ...m,
        {
          role: 'ai',
          text: 'AI service is temporarily unavailable. Please try again in a moment.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{
              position: 'fixed', bottom: 96, right: 24, zIndex: 999,
              width: 'min(380px, calc(100vw - 40px))',
              height: 'min(520px, calc(100vh - 140px))',
              background: 'rgba(255, 253, 248, 0.97)',
              border: '1px solid rgba(255, 154, 61, 0.18)',
              borderRadius: 24,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 28px 80px rgba(255, 122, 0, 0.18), 0 0 0 1px rgba(255,255,255,0.8)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255, 154, 61, 0.1)',
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(135deg, #FF7A00 0%, #FFB800 100%)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Header background shimmer */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                animation: 'shimmer 3s linear infinite',
                backgroundSize: '200% 100%',
              }} />

              {/* Online indicator */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#86efac', boxShadow: '0 0 10px rgba(134,239,172,0.8)',
                  }}
                />
              </div>

              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: 0.3 }}>
                  Campus AI
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px' }}>
                  Always online · Powered by Gemini 2.0 AI
                </div>
              </div>

              <motion.button
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: 15,
                  width: 28, height: 28, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 1,
                }}
              >✕</motion.button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
              display: 'flex', flexDirection: 'column', gap: 10,
              background: '#FAF9F6',
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
                      background: 'linear-gradient(135deg, #FF7A00, #FFB800)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, alignSelf: 'flex-end',
                    }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: 13, lineHeight: 1.65,
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, #FF7A00, #FFB800)'
                      : '#ffffff',
                    color: m.role === 'user' ? '#fff' : '#111827',
                    border: m.role === 'ai' ? '1px solid rgba(255, 154, 61, 0.1)' : 'none',
                    boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.05)' : '0 2px 8px rgba(255,122,0,0.2)',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #FF7A00, #FFB800)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                  }}>🤖</div>
                  <div style={{
                    display: 'flex', gap: 4, padding: '12px 16px',
                    background: '#ffffff', borderRadius: '16px 16px 16px 4px',
                    border: '1px solid rgba(255, 154, 61, 0.1)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'var(--accent)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Prompts */}
              {showSuggestions && messages.length === 1 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '1px', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-accent)' }}>
                    SUGGESTED QUESTIONS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {suggestedList.map((prompt, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => send(prompt.replace(/^[^\s]+\s/, ''))}
                        whileHover={{ backgroundColor: 'rgba(255,154,61,0.08)', x: 3 }}
                        style={{
                          background: '#fff', border: '1px solid rgba(255, 154, 61, 0.15)',
                          borderRadius: 10, padding: '8px 12px',
                          textAlign: 'left', cursor: 'pointer',
                          fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-body)',
                          transition: 'all 0.15s',
                        }}
                      >{prompt}</motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '10px 12px 12px',
              borderTop: '1px solid rgba(255, 154, 61, 0.08)',
              background: '#fff', display: 'flex', gap: 8, alignItems: 'flex-end',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about syllabus, placement, DSA…"
                rows={1}
                style={{
                  flex: 1, background: '#FAF9F6',
                  border: '1px solid rgba(255, 154, 61, 0.15)',
                  borderRadius: 12, padding: '10px 14px',
                  color: 'var(--text)', fontSize: 13, outline: 'none',
                  fontFamily: 'var(--font-body)', resize: 'none',
                  maxHeight: 80, lineHeight: 1.5,
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FF7A00'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,154,61,0.15)'}
              />
              <motion.button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                whileHover={input.trim() && !loading ? { scale: 1.1 } : {}}
                whileTap={input.trim() && !loading ? { scale: 0.9 } : {}}
                style={{
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #FF7A00, #FFB800)'
                    : 'rgba(255,154,61,0.2)',
                  border: 'none', borderRadius: 12,
                  width: 40, height: 40, flexShrink: 0,
                  color: '#fff', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: input.trim() && !loading ? '0 4px 12px rgba(255,122,0,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? '⏳' : '→'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ── */}
      {variant === 'pill' ? (
        <motion.button
          onClick={() => setOpen(o => !o)}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          aria-label={open ? 'Close Campus AI Assistant' : 'Ask Campus AI - Your Study Companion'}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 999,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 18px 8px 8px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(249, 115, 22, 0.24)',
            borderRadius: '9999px',
            boxShadow: '0 12px 32px rgba(17, 24, 39, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: '#F97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)',
              flexShrink: 0,
            }}
          >
            {open ? (
              <span style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>✕</span>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="13" rx="4" fill="#111827" />
                <circle cx="8.5" cy="11.5" r="2" fill="#FFFFFF" />
                <circle cx="15.5" cy="11.5" r="2" fill="#FFFFFF" />
                <line x1="12" y1="2" x2="12" y2="6" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="2" r="1.5" fill="#FDBA12" />
                <rect x="2" y="10" width="2" height="5" rx="1" fill="#111827" />
                <rect x="20" y="10" width="2" height="5" rx="1" fill="#111827" />
              </svg>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-heading, "Space Grotesk")',
              fontSize: '13px', fontWeight: 700, color: '#111827',
              lineHeight: 1.2,
            }}>
              Ask Campus AI
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 500, color: '#6B7280',
              letterSpacing: '0.2px',
            }}>
              {subtitle || (contextTitle.includes('Jobs') || contextTitle.includes('Career') ? 'Your Career Companion' : 'Your Study Companion')}
            </span>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#111827', marginLeft: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.div>
        </motion.button>
      ) : (
        <motion.button
          onClick={() => setOpen(o => !o)}
          animate={{ scale: open ? 0.92 : 1 }}
          whileHover={{ scale: open ? 0.95 : 1.1 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Ask Campus AI"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 999,
            width: 58, height: 58, borderRadius: '50%',
            background: open
              ? 'linear-gradient(135deg, #FF7A00, #FF9A3D)'
              : 'linear-gradient(135deg, #FF7A00, #FFB800)',
            border: 'none', cursor: 'pointer',
            boxShadow: open
              ? '0 8px 28px rgba(255,122,0,0.35)'
              : '0 8px 28px rgba(255,122,0,0.45), 0 0 0 6px rgba(255,122,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: open ? 18 : 24,
            animation: open ? 'none' : 'glowPulse 3s ease infinite',
            transition: 'all 0.3s ease',
          }}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            style={{ display: 'inline-block' }}
          >
            {open ? '✕' : '🤖'}
          </motion.span>
        </motion.button>
      )}
    </>
  )
}