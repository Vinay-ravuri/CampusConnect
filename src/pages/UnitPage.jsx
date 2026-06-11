import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'

const SUBJECTS = {
  jntu: [
    { id: 1, name: 'Mathematics – I' },
    { id: 2, name: 'Engineering Physics' },
    { id: 3, name: 'C Programming' },
    { id: 4, name: 'Data Structures' },
    { id: 5, name: 'Database Management Systems' },
    { id: 6, name: 'Computer Networks' },
    { id: 7, name: 'Operating Systems' },
    { id: 8, name: 'Software Engineering' },
    { id: 9, name: 'Machine Learning' },
    { id: 10, name: 'Design & Analysis of Algorithms' },
    { id: 11, name: 'Object Oriented Programming' },
    { id: 12, name: 'Theory of Computation' },
  ],
  au: [
    { id: 1, name: 'Linear Algebra & Calculus' },
    { id: 2, name: 'Engineering Chemistry' },
    { id: 3, name: 'Python Programming' },
    { id: 4, name: 'Data Structures Using C' },
    { id: 5, name: 'DBMS' },
    { id: 6, name: 'Computer Architecture' },
    { id: 7, name: 'Software Engineering' },
    { id: 8, name: 'Deep Learning' },
  ],
  uni: [
    { id: 1, name: 'Discrete Mathematics' },
    { id: 2, name: 'Digital Logic Design' },
    { id: 3, name: 'Cloud Computing' },
    { id: 4, name: 'Big Data Analytics' },
    { id: 5, name: 'Compiler Design' },
    { id: 6, name: 'Computer Graphics' },
  ],
}

const REG_INFO = {
  jntu: { label: 'JNTU', color: '#4f8aff' },
  au:   { label: 'AU', color: '#00e5c0' },
  uni:  { label: 'UNI', color: '#a855f7' },
}

const UNITS = [
  { num: 1, title: 'Unit 1 — Fundamentals & Introduction' },
  { num: 2, title: 'Unit 2 — Core Concepts' },
  { num: 3, title: 'Unit 3 — Advanced Topics' },
  { num: 4, title: 'Unit 4 — Applications' },
  { num: 5, title: 'Unit 5 — Recent Trends & Case Studies' },
]

export default function UnitPage() {
  const { regId, subjectId } = useParams()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const reg = REG_INFO[regId] || REG_INFO.jntu
  const subjects = SUBJECTS[regId] || []
  const subject = subjects.find(s => s.id === parseInt(subjectId))

  return (
    <div style={{ minHeight: '100vh', background: '#04040a' }}>
      <Navbar />

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${reg.color}06 0%, transparent 70%)`, top: '20%', left: '50%', transform: 'translateX(-50%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Back */}
        <button onClick={() => navigate(`/student/${regId}`)}
          style={{ background: 'none', border: 'none', color: '#555566', cursor: 'pointer', fontSize: 13, letterSpacing: 2, fontFamily: 'Bebas Neue,sans-serif', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8 }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0f0f5'}
          onMouseLeave={e => e.currentTarget.style.color = '#555566'}>
          ← BACK TO SUBJECTS
        </button>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {[reg.label, subject?.name || 'Subject', 'Select Unit'].map((item, i, arr) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: i === arr.length - 1 ? '#f0f0f5' : '#555566', letterSpacing: 1 }}>{item}</span>
              {i < arr.length - 1 && <span style={{ color: '#ffffff15' }}>›</span>}
            </span>
          ))}
        </div>

        {/* Header */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: 3, color: '#f0f0f5', lineHeight: 1, marginBottom: 8 }}>
            {subject?.name || 'Subject'}
          </div>
          <p style={{ fontSize: 13, color: '#555566' }}>Select a unit to view PDFs, videos and important topics</p>
        </div>

        {/* Unit Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {UNITS.map((unit, i) => (
            <div
              key={unit.num}
              onClick={() => navigate(`/student/${regId}/${subjectId}/${unit.num}`)}
              onMouseEnter={() => setHovered(unit.num)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === unit.num ? reg.color + '11' : '#0e0e1c',
                border: `1px solid ${hovered === unit.num ? reg.color + '44' : '#ffffff0f'}`,
                borderRadius: 14, padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                animation: `fadeUp 0.4s ${i * 0.08}s ease both`,
                transform: hovered === unit.num ? 'translateX(6px)' : 'translateX(0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: hovered === unit.num ? reg.color + '33' : '#ffffff08', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 16, color: hovered === unit.num ? reg.color : '#555566', letterSpacing: 1 }}>{unit.num}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 3 }}>{unit.title}</div>
                  <div style={{ fontSize: 11, color: '#555566', letterSpacing: 1 }}>PDF • YouTube • Important Topics</div>
                </div>
              </div>
              <div style={{ color: hovered === unit.num ? reg.color : '#555566', fontSize: 18, transition: 'all 0.3s', transform: hovered === unit.num ? 'translateX(4px)' : 'translateX(0)' }}>→</div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistant />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}