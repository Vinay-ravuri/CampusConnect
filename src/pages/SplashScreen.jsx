import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing...')
  const [fadeOut, setFadeOut] = useState(false)
  const canvasRef = useRef(null)

  // Particle Network
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let animId

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      c: ['#4f8aff','#00e5c0','#a855f7'][~~(Math.random()*3)],
    }))

    function tick() {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.c
        ctx.globalAlpha = 0.7
        ctx.fill()
      })
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = '#4f8aff'
            ctx.globalAlpha = (1 - d / 120) * 0.12
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  // Progress
  useEffect(() => {
    const steps = [
      { pct: 20, text: 'Loading Resources...', t: 600 },
      { pct: 45, text: 'Preparing Modules...', t: 700 },
      { pct: 70, text: 'Setting Up Portal...', t: 600 },
      { pct: 90, text: 'Almost There...', t: 500 },
      { pct: 100, text: 'Ready!', t: 400 },
    ]
    let delay = 300
    steps.forEach(({ pct, text, t }) => {
      setTimeout(() => { setProgress(pct); setStatusText(text) }, delay)
      delay += t
    })
  }, [])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setFadeOut(true), 500)
      setTimeout(() => navigate('/welcome'), 1200)
    }
  }, [progress])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#04040a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.7s ease',
    }}>
      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Orbs */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(circle, #4f8aff18 0%, transparent 65%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        animation: 'orbMove 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(circle, #a855f715 0%, transparent 65%)',
        bottom: '-100px', right: '-100px',
        animation: 'orbMove 10s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(circle, #00e5c015 0%, transparent 65%)',
        top: '-50px', left: '-50px',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 28,
        animation: 'fadeUp 1s ease both',
      }}>

        {/* Logo mark */}
        <div style={{ position: 'relative', width: 110, height: 110,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer ring */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid transparent',
            borderTopColor: '#4f8aff',
            borderRightColor: '#4f8aff44',
            animation: 'spinSlow 2.5s linear infinite',
          }} />
          {/* Middle ring */}
          <div style={{
            position: 'absolute', inset: 12, borderRadius: '50%',
            border: '1.5px solid transparent',
            borderBottomColor: '#00e5c0',
            borderLeftColor: '#00e5c044',
            animation: 'spinReverse 1.8s linear infinite',
          }} />
          {/* Inner box */}
          <div style={{
            width: 68, height: 68, borderRadius: 18,
            background: 'linear-gradient(135deg, #4f8aff 0%, #a855f7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'glowPulse 2.5s ease infinite',
          }}>
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 26, color: '#fff', letterSpacing: 1,
            }}>CC</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(48px, 8vw, 88px)',
            letterSpacing: '4px',
            lineHeight: 1,
            color: '#f0f0f5',
            animation: 'pulse 4s ease infinite',
          }}>
            CAMPUS
            <span style={{
              background: 'linear-gradient(135deg, #4f8aff, #00e5c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>CONNECT</span>
          </div>
          <div style={{
            fontSize: 12, letterSpacing: '4px',
            color: '#555566', marginTop: 8,
            textTransform: 'uppercase',
            fontWeight: 400,
          }}>
            Academic & Placement Portal
          </div>
        </div>

        {/* Loading bar */}
        <div style={{ width: 'min(320px, 80vw)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            width: '100%', height: 3,
            background: '#ffffff08',
            borderRadius: 10, overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #4f8aff, #00e5c0, #a855f7)',
              backgroundSize: '200% 100%',
              borderRadius: 10,
              transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
              animation: 'barFlow 2s linear infinite',
            }} />
            {/* Glow dot */}
            <div style={{
              position: 'absolute', top: '50%',
              left: `${progress}%`,
              transform: 'translate(-50%,-50%)',
              width: 8, height: 8, borderRadius: '50%',
              background: '#00e5c0',
              boxShadow: '0 0 8px #00e5c0, 0 0 16px #00e5c088',
              transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
              opacity: progress < 100 ? 1 : 0,
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#4f8aff', letterSpacing: 1 }}>
              {statusText}
            </span>
            <span style={{ fontSize: 11, color: '#555566', fontFamily: 'monospace' }}>
              {progress}%
            </span>
          </div>
        </div>

      </div>

      {/* Bottom marquee */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 2, overflow: 'hidden',
        borderTop: '1px solid #ffffff06',
        padding: '10px 0',
      }}>
        <div style={{
          display: 'flex', gap: 60,
          animation: 'marquee 18s linear infinite',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}>
          {['JNTU REGULATION', 'AU REGULATION', 'PLACEMENT PREP',
            'APTITUDE', 'REASONING', 'COMPANY WISE', 'AI ASSISTANT',
            'JNTU REGULATION', 'AU REGULATION', 'PLACEMENT PREP',
            'APTITUDE', 'REASONING', 'COMPANY WISE', 'AI ASSISTANT',
          ].map((t, i) => (
            <span key={i} style={{ fontSize: 11, color: '#ffffff15', letterSpacing: '3px' }}>
              {t} <span style={{ color: '#4f8aff44' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes spinReverse { to { transform: rotate(-360deg); } }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 30px #4f8aff40, 0 0 60px #4f8aff15; }
          50%      { box-shadow: 0 0 50px #4f8aff70, 0 0 100px #4f8aff30; }
        }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.85; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes barFlow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes orbMove {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.08); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}