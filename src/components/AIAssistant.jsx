import { useState, useRef, useEffect } from 'react'

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! 👋 I am CampusConnect AI. Ask me anything about your syllabus, subjects, placement prep or exam tips!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const send = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are CampusConnect AI assistant for engineering students in Andhra Pradesh, India. Help with JNTU/AU syllabus, subjects, exam topics, placement preparation, aptitude, reasoning, technical subjects like DBMS, DSA, CN, OS. Keep answers short, clear and student-friendly.`,
          messages: [
            ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMsg }
          ],
        }),
      })
      const data = await res.json()
      const text = data.content?.find(b => b.type === 'text')?.text || 'Sorry, try again!'
      setMessages(m => [...m, { role: 'ai', text }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 999,
          width: 340, height: 480,
          background: '#0e0e1c',
          border: '1px solid #ffffff0f',
          borderRadius: 20,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 60px #00000080, 0 0 0 1px #4f8aff22',
          animation: 'popUp 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #ffffff08', display: 'flex', alignItems: 'center', gap: 10, background: '#08080f' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5c0', boxShadow: '0 0 8px #00e5c0', animation: 'pulse 2s infinite' }} />
            <div>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 13, letterSpacing: 2, color: '#f0f0f5' }}>CAMPUS AI</div>
              <div style={{ fontSize: 10, color: '#555566' }}>Always online · Powered by Claude</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555566', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px', borderRadius: 12,
                  fontSize: 13, lineHeight: 1.6,
                  background: m.role === 'user' ? 'linear-gradient(135deg,#4f8aff,#a855f7)' : '#161628',
                  color: m.role === 'user' ? '#fff' : '#c0c0d0',
                  border: m.role === 'ai' ? '1px solid #ffffff08' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: '#161628', borderRadius: 12, width: 'fit-content', border: '1px solid #ffffff08' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8aff', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: '1px solid #ffffff08', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
              style={{
                flex: 1, background: '#08080f',
                border: '1px solid #ffffff0f', borderRadius: 10,
                padding: '10px 14px', color: '#f0f0f5',
                fontSize: 13, outline: 'none',
                fontFamily: 'Inter,sans-serif',
              }}
            />
            <button onClick={send} style={{
              background: 'linear-gradient(135deg,#4f8aff,#a855f7)',
              border: 'none', borderRadius: 10,
              width: 40, height: 40,
              color: '#fff', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>→</button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#4f8aff,#a855f7)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 32px #4f8aff50, 0 0 0 1px #4f8aff33',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
          animation: 'glowPulse 3s ease infinite',
          transition: 'transform 0.3s ease',
          transform: open ? 'rotate(45deg) scale(0.9)' : 'rotate(0) scale(1)',
        }}
      >
        {open ? '✕' : '🤖'}
      </button>

      <style>{`
        @keyframes popUp {
          from { opacity:0; transform: scale(0.9) translateY(20px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.8); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 8px 32px #4f8aff50, 0 0 0 1px #4f8aff33; }
          50%      { box-shadow: 0 8px 48px #4f8aff80, 0 0 0 1px #4f8aff55; }
        }
      `}</style>
    </>
  )
}