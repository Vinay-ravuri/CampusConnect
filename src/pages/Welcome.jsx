import AIAssistant from '../components/AIAssistant'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let animId

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.3,
      c: ['#4f8aff', '#00e5c0', '#a855f7'][~~(Math.random() * 3)],
    }))

    function tick() {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.c
        ctx.globalAlpha = 0.5
        ctx.fill()
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(tick)
    }
    tick()
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#04040a', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Orbs */}
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, #4f8aff0f 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #a855f70a 0%, transparent 70%)', bottom: 0, right: 0, zIndex: 1, pointerEvents: 'none' }} />

      {/* Horizontal line */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #ffffff08, transparent)', zIndex: 1 }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '0 24px', gap: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Top label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 1, background: '#4f8aff' }} />
          <span style={{ fontSize: 11, letterSpacing: '4px', color: '#4f8aff', textTransform: 'uppercase' }}>
            Engineering Portal · Andhra Pradesh
          </span>
          <div style={{ width: 32, height: 1, background: '#4f8aff' }} />
        </div>

        {/* Big title */}
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(56px, 12vw, 140px)',
          letterSpacing: '6px',
          lineHeight: 0.9,
          color: '#f0f0f5',
          marginBottom: 8,
        }}>
          WELCOME TO
        </div>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(56px, 12vw, 140px)',
          letterSpacing: '6px',
          lineHeight: 0.9,
          marginBottom: 40,
          background: 'linear-gradient(135deg, #4f8aff 0%, #00e5c0 50%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'gradShift 4s ease infinite',
        }}>
          CAMPUSCONNECT
        </div>

        {/* Subtitle */}
        <p style={{ fontSize: 16, color: '#555566', maxWidth: 480, lineHeight: 1.7, marginBottom: 52, fontWeight: 300 }}>
          Your complete academic & placement preparation portal.
          Built for engineering students across <span style={{ color: '#f0f0f5', fontWeight: 500 }}>JNTU, AU & University</span> regulations.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 48, marginBottom: 56, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['3', 'Regulations'], ['200+', 'Subjects'], ['1000+', 'Resources'], ['50+', 'Companies']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, background: 'linear-gradient(135deg,#4f8aff,#00e5c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#555566', letterSpacing: '2px', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/choose')}
          style={{
            position: 'relative', overflow: 'hidden',
            background: 'transparent',
            border: '1px solid #4f8aff44',
            borderRadius: 4,
            padding: '18px 56px',
            color: '#f0f0f5',
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 18, letterSpacing: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#4f8aff15'
            e.currentTarget.style.borderColor = '#4f8aff'
            e.currentTarget.style.boxShadow = '0 0 30px #4f8aff30'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = '#4f8aff44'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ENTER PORTAL →
        </button>

      </div>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, borderTop: '1px solid #ffffff06', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, letterSpacing: 2, color: '#ffffff20' }}>CAMPUSCONNECT</span>
        <span style={{ fontSize: 11, color: '#ffffff15', letterSpacing: 2 }}>V 1.0</span>
      </div>

      <style>{`
        @keyframes gradShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
      `}</style>
      <AIAssistant />
    </div>
    
  )
}