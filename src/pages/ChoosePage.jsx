import AIAssistant from '../components/AIAssistant'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginModal from '../components/LoginModal'

export default function ChoosePage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [visible, setVisible] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [target, setTarget] = useState('')
  const [hovered, setHovered] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let animId
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.3,
      c: ['#4f8aff', '#00e5c0', '#a855f7'][~~(Math.random() * 3)],
    }))
    function tick() {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.c; ctx.globalAlpha = 0.4; ctx.fill()
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(tick)
    }
    tick()
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  const handleClick = (path) => {
    if (!isLoggedIn) { setTarget(path); setShowLogin(true) }
    else navigate(path)
  }

  const cards = [
    {
      id: 'student',
      path: '/student',
      emoji: '📚',
      label: 'STUDENT',
      sub: 'RESOURCES PORTAL',
      desc: 'JNTU · AU · University Regulations',
      detail: 'Access syllabus-based PDFs, YouTube lectures, and important exam topics unit by unit.',
      color: '#4f8aff',
      gradient: 'linear-gradient(135deg, #4f8aff22 0%, #4f8aff05 100%)',
      glow: '#4f8aff',
      items: ['JNTU Regulation', 'AU Regulation', 'University Syllabus'],
    },
    {
      id: 'placement',
      path: '/placement',
      emoji: '💼',
      label: 'PLACEMENT',
      sub: 'PREPARATION PORTAL',
      desc: 'Aptitude · Reasoning · Technical · Companies',
      detail: 'Company-wise questions, interview roadmaps, aptitude & reasoning prep all in one place.',
      color: '#00e5c0',
      gradient: 'linear-gradient(135deg, #00e5c022 0%, #00e5c005 100%)',
      glow: '#00e5c0',
      items: ['Aptitude & Reasoning', 'Core Technical Subjects', 'Company-Wise Prep'],
    },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#04040a', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Orbs */}
      <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, #4f8aff08 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Top nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ffffff06' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/welcome')}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#4f8aff,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 13, color: '#fff' }}>CC</span>
          </div>
          <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 14, letterSpacing: 3, color: '#ffffff40' }}>CAMPUSCONNECT</span>
        </div>
        <span style={{ fontSize: 11, color: '#ffffff20', letterSpacing: 2 }}>SELECT YOUR PORTAL</span>
      </div>

      {/* Main */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 48,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)',
        padding: '0 24px', width: '100%', maxWidth: 1000,
      }}>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '4px', color: '#4f8aff', textTransform: 'uppercase', marginBottom: 16 }}>
            — Choose Your Path —
          </div>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(36px,6vw,72px)', letterSpacing: 4, color: '#f0f0f5', lineHeight: 1 }}>
            WHERE DO YOU WANT TO GO?
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, width: '100%' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleClick(card.path)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === card.id ? card.gradient : '#0e0e1c',
                border: `1px solid ${hovered === card.id ? card.color + '44' : '#ffffff0f'}`,
                borderRadius: 20,
                padding: '40px 36px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === card.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hovered === card.id ? `0 24px 60px ${card.glow}20, 0 0 0 1px ${card.glow}22` : '0 8px 32px #00000040',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Top glow line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`, opacity: hovered === card.id ? 1 : 0, transition: 'opacity 0.3s ease' }} />

              {/* Corner decoration */}
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`, transition: 'all 0.4s ease', transform: hovered === card.id ? 'scale(1.5)' : 'scale(1)' }} />

              {/* Emoji icon */}
              <div style={{ fontSize: 48, marginBottom: 24, display: 'block',
                filter: hovered === card.id ? `drop-shadow(0 0 16px ${card.color})` : 'none',
                transition: 'filter 0.3s ease',
                transform: hovered === card.id ? 'scale(1.1)' : 'scale(1)',
              }}>
                {card.emoji}
              </div>

              {/* Label */}
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 42, letterSpacing: 4, color: card.color, lineHeight: 1, marginBottom: 4 }}>
                {card.label}
              </div>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 16, letterSpacing: 4, color: '#ffffff40', marginBottom: 20 }}>
                {card.sub}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${card.color}44, transparent)`, marginBottom: 20 }} />

              {/* Detail */}
              <p style={{ fontSize: 13, color: '#555566', lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
                {card.detail}
              </p>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                {card.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: card.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#ffffff50', letterSpacing: 1 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, letterSpacing: 3, color: card.color, textTransform: 'uppercase', fontWeight: 500 }}>
                  {isLoggedIn ? 'Enter Portal' : 'Sign in to Access'}
                </span>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: `1px solid ${card.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: card.color, fontSize: 16,
                  transform: hovered === card.id ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease',
                }}>→</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom hint */}
        <p style={{ fontSize: 11, color: '#ffffff15', letterSpacing: 2, textAlign: 'center' }}>
          {isLoggedIn ? 'CLICK ANY CARD TO ENTER' : '🔒  SIGN IN REQUIRED TO ACCESS PORTALS'}
        </p>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          redirectTo={target}
        />
      )}
      <AIAssistant />
    </div>
  )
}