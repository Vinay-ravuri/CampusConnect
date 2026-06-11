import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'

const SUBJECTS = {
  jntu: [
    { id: 1,  name: 'Mathematics – I' },
    { id: 2,  name: 'Engineering Physics' },
    { id: 3,  name: 'English for Engineers' },
    { id: 4,  name: 'Mathematics – II' },
    { id: 5,  name: 'C Programming & Problem Solving' },
    { id: 6,  name: 'Engineering Chemistry' },
    { id: 7,  name: 'Data Structures' },
    { id: 8,  name: 'Object Oriented Programming (Java)' },
    { id: 9,  name: 'Computer Organization' },
    { id: 10, name: 'Discrete Mathematics' },
    { id: 11, name: 'Database Management Systems' },
    { id: 12, name: 'Design & Analysis of Algorithms' },
    { id: 13, name: 'Operating Systems' },
    { id: 14, name: 'Computer Networks' },
    { id: 15, name: 'Software Engineering' },
    { id: 16, name: 'Web Technologies' },
    { id: 17, name: 'Compiler Design' },
    { id: 18, name: 'Theory of Computation' },
    { id: 19, name: 'Machine Learning' },
    { id: 20, name: 'Deep Learning' },
    { id: 21, name: 'Cloud Computing' },
    { id: 22, name: 'Big Data Analytics' },
    { id: 23, name: 'Cyber Security' },
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
  jntu: { label: 'JNTUK', color: '#4f8aff' },
  au:   { label: 'AU',    color: '#00e5c0' },
  uni:  { label: 'UNI',   color: '#a855f7' },
}

// Sample resources — admin will fill these via backend later
const SAMPLE_PDFS = [
  { id: 1, title: 'Complete Lecture Notes', desc: 'Full unit notes with diagrams', size: '3.4 MB', pages: '82 pages', link: 'https://drive.google.com/file/d/sample1' },
  { id: 2, title: 'Previous Year Questions (5 Yrs)', desc: 'Last 5 years exam questions', size: '1.8 MB', pages: '46 pages', link: 'https://drive.google.com/file/d/sample2' },
  { id: 3, title: 'Short Notes & Formulas', desc: 'Quick revision material', size: '0.9 MB', pages: '18 pages', link: 'https://drive.google.com/file/d/sample3' },
]

const SAMPLE_VIDEOS = [
  { id: 1, title: 'Complete Concept Overview', channel: 'NPTEL Official', duration: '42 min', thumb: '📺', link: 'https://youtube.com' },
  { id: 2, title: 'Problem Solving Session', channel: 'Gate Smashers', duration: '35 min', thumb: '📺', link: 'https://youtube.com' },
  { id: 3, title: 'Quick Revision & Tips', channel: 'Knowledge Gate', duration: '28 min', thumb: '📺', link: 'https://youtube.com' },
]

const SAMPLE_TOPICS = [
  'Define and explain the fundamental theorem with proof',
  'Derive the formula and apply to numerical problems',
  'Compare and contrast the two main approaches with examples',
  'Short notes on key terminology — frequently asked in exams',
  'Numerical problems — minimum 3 examples expected in exam',
  'Explain the algorithm with time & space complexity analysis',
  'Difference between important concepts — 2 marks question',
  'Real world applications — frequently asked in viva',
]

export default function ResourcePage() {
  const { regId, subjectId, unitNum } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pdfs')
  const [visible, setVisible] = useState(false)
  const [pdfViewer, setPdfViewer] = useState(null)
  const [hovered, setHovered] = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const reg = REG_INFO[regId] || REG_INFO.jntu
  const subjects = SUBJECTS[regId] || []
  const subject = subjects.find(s => s.id === parseInt(subjectId))

  const tabs = [
    { id: 'pdfs',      label: 'PDF Resources', icon: '📄', count: SAMPLE_PDFS.length },
    { id: 'videos',    label: 'YouTube Videos', icon: '🎥', count: SAMPLE_VIDEOS.length },
    { id: 'important', label: 'Important Topics', icon: '⭐', count: SAMPLE_TOPICS.length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#04040a' }}>
      <Navbar />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${reg.color}06 0%, transparent 70%)`, top: '10%', right: '5%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #a855f706 0%, transparent 70%)', bottom: '10%', left: '5%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* Back button */}
        <button onClick={() => navigate(`/student/${regId}/${subjectId}`)}
          style={{ background: 'none', border: 'none', color: '#555566', cursor: 'pointer', fontSize: 13, letterSpacing: 2, fontFamily: 'Bebas Neue,sans-serif', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0f0f5'}
          onMouseLeave={e => e.currentTarget.style.color = '#555566'}>
          ← BACK TO UNITS
        </button>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {[reg.label, subject?.name || 'Subject', `Unit ${unitNum}`].map((item, i, arr) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: i === arr.length - 1 ? reg.color : '#555566', letterSpacing: 1 }}>{item}</span>
              {i < arr.length - 1 && <span style={{ color: '#ffffff15' }}>›</span>}
            </span>
          ))}
        </div>

        {/* Header */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(28px,4vw,52px)', letterSpacing: 3, color: '#f0f0f5', lineHeight: 1, marginBottom: 8 }}>
            UNIT {unitNum} — RESOURCES
          </div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, color: '#555566', fontWeight: 400 }}>
            {subject?.name}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
                fontFamily: 'Bebas Neue,sans-serif', fontSize: 13, letterSpacing: 2,
                background: activeTab === tab.id ? reg.color : '#0e0e1c',
                color: activeTab === tab.id ? '#fff' : '#555566',
                border: `1px solid ${activeTab === tab.id ? reg.color : '#ffffff0f'}`,
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab.id ? `0 0 20px ${reg.color}40` : 'none',
              }}>
              {tab.icon} {tab.label}
              <span style={{ background: activeTab === tab.id ? '#ffffff30' : '#ffffff0f', borderRadius: 100, padding: '1px 8px', fontSize: 11 }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── PDF Tab ── */}
        {activeTab === 'pdfs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SAMPLE_PDFS.map((pdf, i) => (
              <div key={pdf.id}
                style={{
                  background: '#0e0e1c', border: '1px solid #ffffff0f',
                  borderRadius: 14, padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 18,
                  transition: 'all 0.3s ease',
                  animation: `fadeUp 0.4s ${i * 0.1}s ease both`,
                  borderLeft: `3px solid ${reg.color}`,
                }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: reg.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 4 }}>{pdf.title}</div>
                  <div style={{ fontSize: 12, color: '#555566' }}>{pdf.desc} · {pdf.pages} · {pdf.size}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setPdfViewer(pdf)}
                    style={{ padding: '8px 16px', borderRadius: 8, background: reg.color + '22', color: reg.color, border: `1px solid ${reg.color}44`, cursor: 'pointer', fontSize: 12, fontFamily: 'Bebas Neue,sans-serif', letterSpacing: 1, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = reg.color; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = reg.color + '22'; e.currentTarget.style.color = reg.color }}>
                    👁 VIEW
                  </button>
                  <button
                    style={{ padding: '8px 16px', borderRadius: 8, background: '#ffffff08', color: '#ffffff50', border: '1px solid #ffffff0f', cursor: 'pointer', fontSize: 12, fontFamily: 'Bebas Neue,sans-serif', letterSpacing: 1, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ffffff15'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#ffffff08'; e.currentTarget.style.color = '#ffffff50' }}>
                    ⬇ DOWNLOAD
                  </button>
                </div>
              </div>
            ))}

            {/* Note */}
            <div style={{ padding: '16px 20px', borderRadius: 12, background: '#0e0e1c', border: '1px solid #ffffff0f', marginTop: 8 }}>
              <p style={{ fontSize: 12, color: '#555566', lineHeight: 1.7 }}>
                📌 <span style={{ color: '#ffffff30' }}>Resources are updated by admin regularly. More PDFs will be added soon for this unit.</span>
              </p>
            </div>
          </div>
        )}

        {/* ── YouTube Tab ── */}
        {activeTab === 'videos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SAMPLE_VIDEOS.map((video, i) => (
              <div key={video.id}
                onMouseEnter={() => setHovered(video.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === video.id ? '#161628' : '#0e0e1c',
                  border: `1px solid ${hovered === video.id ? '#ff000044' : '#ffffff0f'}`,
                  borderRadius: 14, padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 18,
                  transition: 'all 0.3s ease',
                  animation: `fadeUp 0.4s ${i * 0.1}s ease both`,
                  cursor: 'pointer',
                  borderLeft: '3px solid #ff0000',
                }}
                onClick={() => window.open(video.link, '_blank')}
              >
                {/* Thumbnail */}
                <div style={{ width: 80, height: 52, borderRadius: 8, background: '#ff000022', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', border: '1px solid #ff000033' }}>
                  <div style={{ fontSize: 20 }}>▶️</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 600, color: '#f0f0f5', marginBottom: 4 }}>{video.title}</div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#ff4444' }}>▶ {video.channel}</span>
                    <span style={{ fontSize: 12, color: '#555566' }}>⏱ {video.duration}</span>
                  </div>
                </div>
                <div style={{ color: '#ff4444', fontSize: 20, transition: 'transform 0.3s', transform: hovered === video.id ? 'scale(1.2)' : 'scale(1)' }}>▶</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Important Topics Tab ── */}
        {activeTab === 'important' && (
          <div>
            {/* Header card */}
            <div style={{ background: '#0e0e1c', border: `1px solid ${reg.color}33`, borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 32 }}>⭐</div>
              <div>
                <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 16, letterSpacing: 2, color: reg.color, marginBottom: 4 }}>FOCUS THESE TOPICS</div>
                <div style={{ fontSize: 12, color: '#555566' }}>These topics are most frequently asked in exams. Study all of them carefully.</div>
              </div>
            </div>

            {/* Topics list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SAMPLE_TOPICS.map((topic, i) => (
                <div key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: hovered === i ? reg.color + '0a' : '#0e0e1c',
                    border: `1px solid ${hovered === i ? reg.color + '33' : '#ffffff0f'}`,
                    borderRadius: 12, padding: '16px 20px',
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    transition: 'all 0.2s ease',
                    animation: `fadeUp 0.4s ${i * 0.06}s ease both`,
                    cursor: 'default',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: reg.color + '22', flexShrink: 0, fontFamily: 'Bebas Neue,sans-serif', fontSize: 13, color: reg.color, letterSpacing: 1 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: '#c0c0d0', lineHeight: 1.6 }}>{topic}</span>
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: reg.color, flexShrink: 0, marginTop: 8, opacity: hovered === i ? 1 : 0.3, transition: 'opacity 0.2s' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {pdfViewer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(4,4,10,0.95)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column' }}>
          {/* Viewer header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #ffffff08', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0e0e1c' }}>
            <div>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 14, letterSpacing: 2, color: '#f0f0f5' }}>{pdfViewer.title}</div>
              <div style={{ fontSize: 11, color: '#555566' }}>{subject?.name} · Unit {unitNum}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ padding: '8px 18px', borderRadius: 8, background: reg.color + '22', color: reg.color, border: `1px solid ${reg.color}44`, cursor: 'pointer', fontSize: 12, fontFamily: 'Bebas Neue,sans-serif', letterSpacing: 1 }}>
                ⬇ DOWNLOAD
              </button>
              <button onClick={() => setPdfViewer(null)} style={{ padding: '8px 18px', borderRadius: 8, background: '#ffffff08', color: '#ffffff50', border: '1px solid #ffffff0f', cursor: 'pointer', fontSize: 12, fontFamily: 'Bebas Neue,sans-serif', letterSpacing: 1 }}>
                ✕ CLOSE
              </button>
            </div>
          </div>

          {/* PDF iframe */}
          <div style={{ flex: 1, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 900, height: '100%', background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 48 }}>📄</div>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 18, letterSpacing: 2, color: '#f0f0f5' }}>PDF VIEWER</div>
              <p style={{ fontSize: 13, color: '#555566', textAlign: 'center', maxWidth: 400, lineHeight: 1.7 }}>
                Once admin adds a Google Drive PDF link, it will display here inside the website. Students can view and download without leaving CampusConnect.
              </p>
              {/* Uncomment below when real PDF links are added */}
              {/* <iframe src={`https://drive.google.com/file/d/YOUR_FILE_ID/preview`} width="100%" height="100%" style={{ border: 'none', borderRadius: 12 }} /> */}
            </div>
          </div>
        </div>
      )}

      <AIAssistant />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}