import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'

const MODULES = [
  {
    id: 'aptitude',
    icon: '🧮',
    title: 'Aptitude',
    subtitle: 'QUANTITATIVE',
    desc: 'Number systems, percentages, ratios, time & work, time-speed-distance, profit & loss.',
    color: '#4f8aff',
    topics: ['Number Systems', 'Percentages', 'Time & Work', 'Time Speed Distance'],
    companies: 'TCS · Infosys · Wipro',
  },
  {
    id: 'reasoning',
    icon: '🧩',
    title: 'Logical Reasoning',
    subtitle: 'VERBAL & NON-VERBAL',
    desc: 'Syllogisms, blood relations, puzzles, series, coding-decoding, directions.',
    color: '#00e5c0',
    topics: ['Syllogisms', 'Blood Relations', 'Puzzles', 'Coding-Decoding'],
    companies: 'Accenture · Capgemini · CTS',
  },
  {
    id: 'cn',
    icon: '🌐',
    title: 'Computer Networks',
    subtitle: 'TECHNICAL',
    desc: 'OSI model, TCP/IP, routing algorithms, subnetting, DNS, HTTP protocols.',
    color: '#a855f7',
    topics: ['OSI Model', 'TCP/IP', 'Subnetting', 'Routing'],
    companies: 'Amazon · Google · Microsoft',
  },
  {
    id: 'dbms',
    icon: '🗄️',
    title: 'DBMS',
    subtitle: 'TECHNICAL',
    desc: 'SQL queries, normalization, transactions, indexing, ER diagrams, joins.',
    color: '#f59e0b',
    topics: ['SQL Queries', 'Normalization', 'Transactions', 'ER Diagrams'],
    companies: 'Oracle · IBM · TCS',
  },
  {
    id: 'dsa',
    icon: '📊',
    title: 'Data Structures',
    subtitle: 'TECHNICAL',
    desc: 'Arrays, linked lists, trees, graphs, heaps, hash tables — interview focused.',
    color: '#34d399',
    topics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'Sorting'],
    companies: 'Amazon · Flipkart · Zoho',
  },
  {
    id: 'os',
    icon: '💻',
    title: 'Operating Systems',
    subtitle: 'TECHNICAL',
    desc: 'Process scheduling, memory management, deadlocks, file systems, semaphores.',
    color: '#fb7185',
    topics: ['Process Scheduling', 'Memory Management', 'Deadlocks', 'File Systems'],
    companies: 'Infosys · Wipro · HCL',
  },
  {
    id: 'roadmap',
    icon: '🗺️',
    title: 'Interview Roadmaps',
    subtitle: 'STRATEGY',
    desc: 'Step-by-step preparation guides for on-campus and off-campus placements.',
    color: '#60a5fa',
    topics: ['Resume Building', 'HR Interview Tips', 'Aptitude Strategy', 'Technical Round'],
    companies: 'All Companies',
  },
  {
    id: 'companies',
    icon: '🏢',
    title: 'Company-Wise Prep',
    subtitle: 'COMPANY SPECIFIC',
    desc: 'TCS NQT, Infosys Instep, Wipro Elite, Cognizant, Amazon, Google preparation.',
    color: '#e879f9',
    topics: ['TCS NQT', 'Infosys', 'Wipro Elite', 'Amazon SDE'],
    companies: 'TCS · Infosys · Amazon · Google',
  },
]

export default function PlacementPortal() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const filters = ['ALL', 'TECHNICAL', 'APTITUDE', 'STRATEGY']

  const filtered = MODULES.filter(m => {
    if (filter === 'ALL') return true
    if (filter === 'TECHNICAL') return m.subtitle === 'TECHNICAL'
    if (filter === 'APTITUDE') return ['QUANTITATIVE', 'VERBAL & NON-VERBAL'].includes(m.subtitle)
    if (filter === 'STRATEGY') return ['STRATEGY', 'COMPANY SPECIFIC'].includes(m.subtitle)
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: '#04040a' }}>
      <Navbar />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #00e5c008 0%, transparent 70%)', top: '10%', right: '0%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #4f8aff06 0%, transparent 70%)', bottom: '10%', left: '0%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* Header */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease', marginBottom: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '4px', color: '#00e5c0', textTransform: 'uppercase', marginBottom: 16 }}>
            — Placement Preparation Portal —
          </div>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(40px,7vw,80px)', letterSpacing: 4, color: '#f0f0f5', lineHeight: 1, marginBottom: 16 }}>
            CRACK YOUR<br />
            <span style={{ background: 'linear-gradient(135deg,#00e5c0,#4f8aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DREAM JOB
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#555566', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
            Everything you need — aptitude, reasoning, technical subjects, company-wise questions and interview roadmaps.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['50+', 'Companies'], ['500+', 'Questions'], ['8', 'Modules'], ['100%', 'Free']].map(([n, l], i) => (
            <div key={l} style={{ textAlign: 'center', padding: '20px 32px', borderRight: i < 3 ? '1px solid #ffffff08' : 'none' }}>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 36, letterSpacing: 2, background: 'linear-gradient(135deg,#00e5c0,#4f8aff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#555566', letterSpacing: '2px', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '9px 20px', borderRadius: 10, cursor: 'pointer',
                fontFamily: 'Bebas Neue,sans-serif', fontSize: 12, letterSpacing: 2,
                background: filter === f ? '#00e5c0' : '#0e0e1c',
                color: filter === f ? '#04040a' : '#555566',
                border: `1px solid ${filter === f ? '#00e5c0' : '#ffffff0f'}`,
                transition: 'all 0.2s ease',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Module Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 18 }}>
          {filtered.map((mod, i) => (
            <div
              key={mod.id}
              onMouseEnter={() => setHovered(mod.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === mod.id ? mod.color + '0f' : '#0e0e1c',
                border: `1px solid ${hovered === mod.id ? mod.color + '44' : '#ffffff0f'}`,
                borderRadius: 18, padding: '28px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === mod.id ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered === mod.id ? `0 20px 50px ${mod.color}18` : 'none',
                position: 'relative', overflow: 'hidden',
                animation: `fadeUp 0.5s ${i * 0.07}s ease both`,
              }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`, opacity: hovered === mod.id ? 1 : 0, transition: 'opacity 0.3s' }} />

              {/* Corner glow */}
              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${mod.color}18 0%, transparent 70%)`, transform: hovered === mod.id ? 'scale(2)' : 'scale(1)', transition: 'transform 0.4s ease' }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 36, filter: hovered === mod.id ? `drop-shadow(0 0 10px ${mod.color})` : 'none', transition: 'filter 0.3s' }}>{mod.icon}</div>
                <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: mod.color + '22', color: mod.color, border: `1px solid ${mod.color}33`, letterSpacing: 1, fontWeight: 600 }}>{mod.subtitle}</span>
              </div>

              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 26, letterSpacing: 2, color: '#f0f0f5', marginBottom: 4 }}>{mod.title}</div>
              <p style={{ fontSize: 13, color: '#555566', lineHeight: 1.6, marginBottom: 18, fontWeight: 300 }}>{mod.desc}</p>

              {/* Topics */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                {mod.topics.map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: '#ffffff06', color: '#ffffff30', border: '1px solid #ffffff0f' }}>{t}</span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #ffffff06' }}>
                <span style={{ fontSize: 11, color: '#555566' }}>{mod.companies}</span>
                <div style={{ width: 30, height: 30, borderRadius: '50%', border: `1px solid ${mod.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: mod.color, transition: 'transform 0.3s', transform: hovered === mod.id ? 'translateX(4px)' : 'translateX(0)' }}>→</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIAssistant />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}