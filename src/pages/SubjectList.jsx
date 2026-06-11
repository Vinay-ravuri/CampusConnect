import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'

const SUBJECTS = {
  jntu: [
  { id: 1,  name: 'Mathematics – I',                    year: '1st Year', sem: 'Sem 1', branch: 'Common', reg: 'R23' },
  { id: 2,  name: 'Engineering Physics',                year: '1st Year', sem: 'Sem 1', branch: 'Common', reg: 'R23' },
  { id: 3,  name: 'English for Engineers',              year: '1st Year', sem: 'Sem 1', branch: 'Common', reg: 'R23' },
  { id: 4,  name: 'Mathematics – II',                   year: '1st Year', sem: 'Sem 2', branch: 'Common', reg: 'R23' },
  { id: 5,  name: 'C Programming & Problem Solving',    year: '1st Year', sem: 'Sem 2', branch: 'Common', reg: 'R23' },
  { id: 6,  name: 'Engineering Chemistry',              year: '1st Year', sem: 'Sem 2', branch: 'Common', reg: 'R23' },
  { id: 7,  name: 'Data Structures',                    year: '2nd Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 8,  name: 'Object Oriented Programming (Java)', year: '2nd Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 9,  name: 'Computer Organization',              year: '2nd Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 10, name: 'Discrete Mathematics',               year: '2nd Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
  { id: 11, name: 'Database Management Systems',        year: '2nd Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
  { id: 12, name: 'Design & Analysis of Algorithms',    year: '2nd Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
  { id: 13, name: 'Operating Systems',                  year: '3rd Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 14, name: 'Computer Networks',                  year: '3rd Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 15, name: 'Software Engineering',               year: '3rd Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 16, name: 'Web Technologies',                   year: '3rd Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
  { id: 17, name: 'Compiler Design',                    year: '3rd Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
  { id: 18, name: 'Theory of Computation',              year: '3rd Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
  { id: 19, name: 'Machine Learning',                   year: '4th Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 20, name: 'Deep Learning',                      year: '4th Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 21, name: 'Cloud Computing',                    year: '4th Year', sem: 'Sem 1', branch: 'CSE',    reg: 'R23' },
  { id: 22, name: 'Big Data Analytics',                 year: '4th Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
  { id: 23, name: 'Cyber Security',                     year: '4th Year', sem: 'Sem 2', branch: 'CSE',    reg: 'R23' },
],
  au: [
    { id: 1, name: 'Linear Algebra & Calculus', year: '1st Year', sem: 'Sem 1', branch: 'Common' },
    { id: 2, name: 'Engineering Chemistry', year: '1st Year', sem: 'Sem 1', branch: 'Common' },
    { id: 3, name: 'Python Programming', year: '1st Year', sem: 'Sem 2', branch: 'Common' },
    { id: 4, name: 'Data Structures Using C', year: '2nd Year', sem: 'Sem 1', branch: 'CSE' },
    { id: 5, name: 'DBMS', year: '2nd Year', sem: 'Sem 2', branch: 'CSE' },
    { id: 6, name: 'Computer Architecture', year: '3rd Year', sem: 'Sem 1', branch: 'CSE' },
    { id: 7, name: 'Software Engineering', year: '3rd Year', sem: 'Sem 2', branch: 'CSE' },
    { id: 8, name: 'Deep Learning', year: '4th Year', sem: 'Sem 1', branch: 'CSE' },
  ],
  uni: [
    { id: 1, name: 'Discrete Mathematics', year: '1st Year', sem: 'Sem 2', branch: 'CSE' },
    { id: 2, name: 'Digital Logic Design', year: '1st Year', sem: 'Sem 2', branch: 'CSE' },
    { id: 3, name: 'Cloud Computing', year: '4th Year', sem: 'Sem 1', branch: 'CSE' },
    { id: 4, name: 'Big Data Analytics', year: '4th Year', sem: 'Sem 2', branch: 'CSE' },
    { id: 5, name: 'Compiler Design', year: '3rd Year', sem: 'Sem 2', branch: 'CSE' },
    { id: 6, name: 'Computer Graphics', year: '3rd Year', sem: 'Sem 2', branch: 'CSE' },
  ],
}

const REG_INFO = {
  jntu: { label: 'JNTU Regulation', color: '#4f8aff' },
  au:   { label: 'Andhra University', color: '#00e5c0' },
  uni:  { label: 'University Syllabus', color: '#a855f7' },
}

const YEARS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year']

export default function SubjectList() {
  const { regId } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const reg = REG_INFO[regId] || REG_INFO.jntu
  const subjects = SUBJECTS[regId] || []

  const filtered = subjects.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchYear = yearFilter === 'All' || s.year === yearFilter
    return matchSearch && matchYear
  })

  return (
    <div style={{ minHeight: '100vh', background: '#04040a' }}>
      <Navbar />

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${reg.color}08 0%, transparent 70%)`, top: '10%', right: '10%' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Back */}
        <button onClick={() => navigate('/student')} style={{ background: 'none', border: 'none', color: '#555566', cursor: 'pointer', fontSize: 13, letterSpacing: 2, fontFamily: 'Bebas Neue,sans-serif', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0f0f5'}
          onMouseLeave={e => e.currentTarget.style.color = '#555566'}>
          ← BACK TO REGULATIONS
        </button>

        {/* Header */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 6, background: reg.color + '22', border: `1px solid ${reg.color}44`, marginBottom: 16 }}>
            <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 12, letterSpacing: 3, color: reg.color }}>{reg.label}</span>
          </div>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(32px,5vw,56px)', letterSpacing: 3, color: '#f0f0f5', lineHeight: 1, marginBottom: 8 }}>
            SELECT SUBJECT
          </div>
          <p style={{ fontSize: 13, color: '#555566' }}>{filtered.length} subjects available</p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 12, background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 12, padding: '12px 18px' }}>
            <span style={{ fontSize: 16, opacity: 0.4 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subjects..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f0f0f5', fontSize: 14, fontFamily: 'Inter,sans-serif' }}
            />
          </div>

          {/* Year filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYearFilter(y)}
                style={{
                  padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'Bebas Neue,sans-serif', fontSize: 12, letterSpacing: 2,
                  background: yearFilter === y ? reg.color : '#0e0e1c',
                  color: yearFilter === y ? '#fff' : '#555566',
                  border: `1px solid ${yearFilter === y ? reg.color : '#ffffff0f'}`,
                  transition: 'all 0.2s ease',
                }}>
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 14 }}>
          {filtered.map((s, i) => (
            <div
              key={s.id}
              onClick={() => navigate(`/student/${regId}/${s.id}`)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === s.id ? reg.color + '11' : '#0e0e1c',
                border: `1px solid ${hovered === s.id ? reg.color + '44' : '#ffffff0f'}`,
                borderRadius: 14, padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === s.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === s.id ? `0 12px 30px ${reg.color}15` : 'none',
                animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
              }}
            >
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, color: '#f0f0f5', marginBottom: 8, lineHeight: 1.4 }}>
                {s.name}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: reg.color + '22', color: reg.color, border: `1px solid ${reg.color}33` }}>{s.year}</span>
<span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#ffffff08', color: '#ffffff40', border: '1px solid #ffffff0f' }}>{s.sem}</span>
{s.reg && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#00e5c011', color: '#00e5c0', border: '1px solid #00e5c033' }}>{s.reg}</span>}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#555566' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 20, letterSpacing: 2 }}>NO SUBJECTS FOUND</div>
            <p style={{ fontSize: 13, marginTop: 8 }}>Try a different search term</p>
          </div>
        )}
      </div>

      <AIAssistant />
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}