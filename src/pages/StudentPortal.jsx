import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'

const REGULATIONS = [
  {
    id: 'jntu',
    code: 'JNTUK',
    full: 'JNTUK Regulation',
    desc: 'Jawaharlal Nehru Technological University Kakinada — R23, R20, R19, R18 syllabuses for all branches.',
    color: '#4f8aff',
    gradient: 'linear-gradient(135deg, #4f8aff22, #4f8aff05)',
    icon: '🎓',
    tags: ['R23', 'R20', 'R19', 'R18'],
    count: '80+ Subjects',
  },
  {
    id: 'au',
    code: 'AU',
    full: 'Andhra University',
    desc: 'Andhra University regulation syllabus covering all engineering branches and semesters.',
    color: '#00e5c0',
    gradient: 'linear-gradient(135deg, #00e5c022, #00e5c005)',
    icon: '📘',
    tags: ['CSE', 'ECE', 'EEE', 'MECH'],
    count: '70+ Subjects',
  },
  {
    id: 'uni',
    code: 'UNI',
    full: 'University Syllabus',
    desc: 'Other university syllabuses including SVEC, VITU, KLU and all AP engineering colleges.',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f722, #a855f705)',
    icon: '🏛️',
    tags: ['SVEC', 'VITU', 'KLU', 'Others'],
    count: '60+ Subjects',
  },
]

export default function StudentPortal() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#04040a' }}>
      <Navbar />

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #4f8aff08 0%, transparent 70%)', top: '20%', left: '10%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #a855f708 0%, transparent 70%)', bottom: '10%', right: '10%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Header */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
          marginBottom: 60, textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '4px', color: '#4f8aff', textTransform: 'uppercase', marginBottom: 16 }}>
            — Student Resources Portal —
          </div>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(40px,7vw,80px)', letterSpacing: 4, color: '#f0f0f5', lineHeight: 1, marginBottom: 16 }}>
            SELECT YOUR<br />
            <span style={{ background: 'linear-gradient(135deg,#4f8aff,#00e5c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              REGULATION
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#555566', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
            Choose your university regulation to access syllabus-based PDFs, video lectures, and important exam topics.
          </p>
        </div>

        {/* Regulation Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 20 }}>
          {REGULATIONS.map((reg, i) => (
            <div
              key={reg.id}
              onClick={() => navigate(`/student/${reg.id}`)}
              onMouseEnter={() => setHovered(reg.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === reg.id ? reg.gradient : '#0e0e1c',
                border: `1px solid ${hovered === reg.id ? reg.color + '44' : '#ffffff0f'}`,
                borderRadius: 20, padding: '36px 32px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === reg.id ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hovered === reg.id ? `0 24px 60px ${reg.color}20` : 'none',
                position: 'relative', overflow: 'hidden',
                opacity: visible ? 1 : 0,
                animation: `fadeUp 0.6s ${i * 0.15}s ease both`,
              }}
            >
              {/* Top line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${reg.color}, transparent)`, opacity: hovered === reg.id ? 1 : 0, transition: 'opacity 0.3s' }} />

              {/* Glow orb */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${reg.color}18 0%, transparent 70%)`, transform: hovered === reg.id ? 'scale(1.4)' : 'scale(1)', transition: 'transform 0.4s ease' }} />

              {/* Icon */}
              <div style={{ fontSize: 44, marginBottom: 20, display: 'block', filter: hovered === reg.id ? `drop-shadow(0 0 12px ${reg.color})` : 'none', transition: 'filter 0.3s ease' }}>
                {reg.icon}
              </div>

              {/* Code badge */}
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 6, background: reg.color + '22', border: `1px solid ${reg.color}44`, marginBottom: 12 }}>
                <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 13, letterSpacing: 3, color: reg.color }}>{reg.code}</span>
              </div>

              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 28, letterSpacing: 2, color: '#f0f0f5', marginBottom: 10, lineHeight: 1 }}>
                {reg.full}
              </div>

              <p style={{ fontSize: 13, color: '#555566', lineHeight: 1.7, marginBottom: 20, fontWeight: 300 }}>
                {reg.desc}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {reg.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: '#ffffff08', color: '#ffffff40', border: '1px solid #ffffff0f', letterSpacing: 1 }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: reg.color, letterSpacing: 2 }}>{reg.count}</span>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${reg.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: reg.color, transition: 'transform 0.3s', transform: hovered === reg.id ? 'translateX(4px)' : 'translateX(0)' }}>→</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistant />
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}