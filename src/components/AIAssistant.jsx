import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUGGESTED_PROMPTS = [
  '📘 Explain DBMS Normalization',
  '🧮 Tips for Aptitude Questions',
  '💼 How to prepare for TCS NQT?',
  '📊 Big O Notation for Arrays',
  '🌐 OSI Model explained',
]

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hi! 👋 I\'m **CampusConnect AI** — your personal academic assistant.\n\nAsk me about syllabus, exam topics, placement prep, DSA, DBMS, CN, OS, aptitude, or interview strategies!',
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
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are CampusConnect AI assistant for engineering students in Andhra Pradesh, India. Help with JNTU/AU syllabus, subjects, exam topics, placement preparation, aptitude, reasoning, technical subjects like DBMS, DSA, CN, OS. Keep answers short, clear and student-friendly. Use bullet points when helpful. Add emojis for clarity.`,
          messages: [
            ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMsg }
          ],
        }),
      })
      const data = await res.json()
      const aiText = data.content?.find(b => b.type === 'text')?.text || 'Sorry, try again!'
      setMessages(m => [...m, { role: 'ai', text: aiText }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Connection error. Please check your connection and try again.' }])
    }
    setLoading(false)
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
                  Always online · Powered by Claude Sonnet
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
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
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
      <motion.button
        onClick={() => setOpen(o => !o)}
        animate={{ scale: open ? 0.92 : 1 }}
        whileHover={{ scale: open ? 0.95 : 1.1 }}
        whileTap={{ scale: 0.92 }}
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
    </>
  )
}