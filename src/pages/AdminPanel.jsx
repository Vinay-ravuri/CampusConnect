import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const TABS = ['DASHBOARD', 'SUBJECTS', 'UNITS', 'RESOURCES', 'USERS']

const MOCK_STATS = [
  { label: 'Total Subjects', value: '37', icon: '📚', color: '#4f8aff' },
  { label: 'Total Resources', value: '124', icon: '📄', color: '#00e5c0' },
  { label: 'Total Students', value: '248', icon: '👥', color: '#a855f7' },
  { label: 'Active Today', value: '42', icon: '🟢', color: '#34d399' },
]

const MOCK_SUBJECTS = [
  { id: 1, name: 'Data Structures', regulation: 'JNTUK R23', year: '2nd Year', sem: 'Sem 1', units: 5, resources: 12 },
  { id: 2, name: 'DBMS', regulation: 'JNTUK R23', year: '2nd Year', sem: 'Sem 2', units: 5, resources: 8 },
  { id: 3, name: 'Computer Networks', regulation: 'JNTUK R23', year: '3rd Year', sem: 'Sem 1', units: 5, resources: 10 },
  { id: 4, name: 'Python Programming', regulation: 'AU', year: '1st Year', sem: 'Sem 2', units: 5, resources: 6 },
]

export default function AdminPanel() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('DASHBOARD')
  const [visible, setVisible] = useState(false)
  const [showAddSubject, setShowAddSubject] = useState(false)
  const [showAddResource, setShowAddResource] = useState(false)
  const [subjectForm, setSubjectForm] = useState({ name: '', regulation: 'JNTUK R23', year: '1st Year', sem: 'Sem 1', branch: 'CSE' })
  const [resourceForm, setResourceForm] = useState({ subjectId: '', unitNum: '1', type: 'PDF', title: '', url: '', desc: '' })
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS)
  const [toast, setToast] = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) navigate('/welcome')
  }, [user, isAdmin])

  const showToast = (msg, color = '#00e5c0') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddSubject = () => {
    if (!subjectForm.name) return
    const newSubject = {
      id: subjects.length + 1,
      name: subjectForm.name,
      regulation: subjectForm.regulation,
      year: subjectForm.year,
      sem: subjectForm.sem,
      units: 5,
      resources: 0,
    }
    setSubjects(s => [...s, newSubject])
    setShowAddSubject(false)
    setSubjectForm({ name: '', regulation: 'JNTUK R23', year: '1st Year', sem: 'Sem 1', branch: 'CSE' })
    showToast('✅ Subject added successfully!')
  }

  const handleDeleteSubject = (id) => {
    setSubjects(s => s.filter(sub => sub.id !== id))
    showToast('🗑️ Subject deleted', '#ff4444')
  }

  const handleAddResource = () => {
    if (!resourceForm.title || !resourceForm.url) return
    setShowAddResource(false)
    setResourceForm({ subjectId: '', unitNum: '1', type: 'PDF', title: '', url: '', desc: '' })
    showToast('✅ Resource added successfully!')
  }

  const inputStyle = {
    width: '100%', background: '#08080f',
    border: '1px solid #ffffff0f', borderRadius: 10,
    padding: '11px 14px', color: '#f0f0f5',
    fontSize: 14, outline: 'none',
    fontFamily: 'Inter,sans-serif',
    transition: 'border-color 0.2s',
    marginTop: 6,
  }

  const selectStyle = { ...inputStyle, cursor: 'pointer' }

  const labelStyle = {
    fontSize: 11, color: '#555566',
    letterSpacing: 1, textTransform: 'uppercase',
    fontWeight: 500,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#04040a' }}>
      <Navbar />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #4f8aff06 0%, transparent 70%)', top: 0, right: 0 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '90px 24px 80px' }}>

        {/* Header */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '4px', color: '#4f8aff', marginBottom: 8, textTransform: 'uppercase' }}>Admin Panel</div>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(28px,4vw,48px)', letterSpacing: 3, color: '#f0f0f5', lineHeight: 1 }}>
              CAMPUS DASHBOARD
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 12, padding: '10px 16px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4f8aff,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#f0f0f5', fontWeight: 500 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#4f8aff', letterSpacing: 1 }}>ADMINISTRATOR</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid #ffffff08', paddingBottom: 0, flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'Bebas Neue,sans-serif',
                fontSize: 13, letterSpacing: 2,
                color: activeTab === tab ? '#4f8aff' : '#555566',
                borderBottom: activeTab === tab ? '2px solid #4f8aff' : '2px solid transparent',
                transition: 'all 0.2s', marginBottom: -1,
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'DASHBOARD' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
              {MOCK_STATS.map((stat, i) => (
                <div key={stat.label} style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 16, padding: '24px', animation: `fadeUp 0.4s ${i * 0.1}s ease both`, borderLeft: `3px solid ${stat.color}` }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 36, letterSpacing: 2, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#555566', letterSpacing: 1 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 16, letterSpacing: 2, color: '#f0f0f5', marginBottom: 20 }}>QUICK ACTIONS</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { label: 'ADD SUBJECT', color: '#4f8aff', action: () => { setActiveTab('SUBJECTS'); setShowAddSubject(true) } },
                  { label: 'ADD RESOURCE', color: '#00e5c0', action: () => { setActiveTab('RESOURCES'); setShowAddResource(true) } },
                  { label: 'VIEW STUDENTS', color: '#a855f7', action: () => setActiveTab('USERS') },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action}
                    style={{ padding: '10px 20px', borderRadius: 10, background: btn.color + '22', color: btn.color, border: `1px solid ${btn.color}44`, cursor: 'pointer', fontFamily: 'Bebas Neue,sans-serif', fontSize: 12, letterSpacing: 2, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = btn.color; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = btn.color + '22'; e.currentTarget.style.color = btn.color }}>
                    + {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SUBJECTS TAB ── */}
        {activeTab === 'SUBJECTS' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 18, letterSpacing: 2, color: '#f0f0f5' }}>
                ALL SUBJECTS ({subjects.length})
              </div>
              <button onClick={() => setShowAddSubject(true)}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#4f8aff,#a855f7)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Bebas Neue,sans-serif', fontSize: 12, letterSpacing: 2 }}>
                + ADD SUBJECT
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {subjects.map((sub, i) => (
                <div key={sub.id} style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, animation: `fadeUp 0.3s ${i * 0.05}s ease both`, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 14, color: '#f0f0f5', marginBottom: 4 }}>{sub.name}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#4f8aff22', color: '#4f8aff', border: '1px solid #4f8aff33' }}>{sub.regulation}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#ffffff08', color: '#ffffff40', border: '1px solid #ffffff0f' }}>{sub.year}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#ffffff08', color: '#ffffff40', border: '1px solid #ffffff0f' }}>{sub.sem}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#555566' }}>
                    <span>📚 {sub.units} Units</span>
                    <span>📄 {sub.resources} Resources</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '6px 14px', borderRadius: 8, background: '#00e5c022', color: '#00e5c0', border: '1px solid #00e5c033', cursor: 'pointer', fontSize: 11, fontFamily: 'Bebas Neue,sans-serif', letterSpacing: 1 }}>
                      EDIT
                    </button>
                    <button onClick={() => handleDeleteSubject(sub.id)}
                      style={{ padding: '6px 14px', borderRadius: 8, background: '#ff444422', color: '#ff4444', border: '1px solid #ff444433', cursor: 'pointer', fontSize: 11, fontFamily: 'Bebas Neue,sans-serif', letterSpacing: 1 }}>
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESOURCES TAB ── */}
        {activeTab === 'RESOURCES' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 18, letterSpacing: 2, color: '#f0f0f5' }}>MANAGE RESOURCES</div>
              <button onClick={() => setShowAddResource(true)}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#00e5c0,#4f8aff)', color: '#04040a', border: 'none', cursor: 'pointer', fontFamily: 'Bebas Neue,sans-serif', fontSize: 12, letterSpacing: 2, fontWeight: 700 }}>
                + ADD RESOURCE
              </button>
            </div>

            <div style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 13, color: '#555566', lineHeight: 1.8 }}>
                To add resources for a subject unit:<br />
                1. Click <span style={{ color: '#00e5c0' }}>+ ADD RESOURCE</span> button above<br />
                2. Select the subject and unit number<br />
                3. Choose type: PDF or YouTube<br />
                4. Paste Google Drive link (for PDF) or YouTube link (for video)<br />
                5. Add important topics as text<br />
                6. Click Save — instantly live for students ✅
              </p>
            </div>
          </div>
        )}

        {/* ── UNITS TAB ── */}
        {activeTab === 'UNITS' && (
          <div style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 18, letterSpacing: 2, color: '#f0f0f5', marginBottom: 16 }}>UNIT MANAGEMENT</div>
            <p style={{ fontSize: 13, color: '#555566', lineHeight: 1.8 }}>
              Each subject automatically gets <span style={{ color: '#4f8aff' }}>5 units</span> when created.<br />
              You can add custom unit titles for each subject from here.<br />
              This feature will be fully active after backend is connected.
            </p>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'USERS' && (
          <div style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 18, letterSpacing: 2, color: '#f0f0f5', marginBottom: 16 }}>REGISTERED STUDENTS</div>
            <p style={{ fontSize: 13, color: '#555566', lineHeight: 1.8 }}>
              Student list will appear here after backend is connected.<br />
              You will be able to see: Name, Email, Registration date, Last active.
            </p>
          </div>
        )}
      </div>

      {/* ── Add Subject Modal ── */}
      {showAddSubject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 20, padding: 40, width: '100%', maxWidth: 480, animation: 'fadeUp 0.3s ease both', position: 'relative' }}>
            <button onClick={() => setShowAddSubject(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#555566', cursor: 'pointer', fontSize: 18 }}>✕</button>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, letterSpacing: 2, color: '#f0f0f5', marginBottom: 24 }}>ADD NEW SUBJECT</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Subject Name *</label>
                <input value={subjectForm.name} onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Data Structures" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4f8aff'}
                  onBlur={e => e.target.style.borderColor = '#ffffff0f'} />
              </div>
              <div>
                <label style={labelStyle}>Regulation</label>
                <select value={subjectForm.regulation} onChange={e => setSubjectForm(f => ({ ...f, regulation: e.target.value }))} style={selectStyle}>
                  <option>JNTUK R23</option>
                  <option>JNTUK R20</option>
                  <option>JNTUK R19</option>
                  <option>AU</option>
                  <option>University</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Year</label>
                  <select value={subjectForm.year} onChange={e => setSubjectForm(f => ({ ...f, year: e.target.value }))} style={selectStyle}>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Semester</label>
                  <select value={subjectForm.sem} onChange={e => setSubjectForm(f => ({ ...f, sem: e.target.value }))} style={selectStyle}>
                    <option>Sem 1</option>
                    <option>Sem 2</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Branch</label>
                <select value={subjectForm.branch} onChange={e => setSubjectForm(f => ({ ...f, branch: e.target.value }))} style={selectStyle}>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>EEE</option>
                  <option>MECH</option>
                  <option>CIVIL</option>
                  <option>Common</option>
                </select>
              </div>
            </div>

            <button onClick={handleAddSubject}
              style={{ width: '100%', marginTop: 24, padding: 14, background: 'linear-gradient(135deg,#4f8aff,#a855f7)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'Bebas Neue,sans-serif', fontSize: 15, letterSpacing: 3, cursor: 'pointer' }}>
              SAVE SUBJECT →
            </button>
          </div>
        </div>
      )}

      {/* ── Add Resource Modal ── */}
      {showAddResource && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#0e0e1c', border: '1px solid #ffffff0f', borderRadius: 20, padding: 40, width: '100%', maxWidth: 520, animation: 'fadeUp 0.3s ease both', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowAddResource(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#555566', cursor: 'pointer', fontSize: 18 }}>✕</button>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, letterSpacing: 2, color: '#f0f0f5', marginBottom: 24 }}>ADD RESOURCE</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Select Subject</label>
                <select value={resourceForm.subjectId} onChange={e => setResourceForm(f => ({ ...f, subjectId: e.target.value }))} style={selectStyle}>
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.regulation})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Unit Number</label>
                  <select value={resourceForm.unitNum} onChange={e => setResourceForm(f => ({ ...f, unitNum: e.target.value }))} style={selectStyle}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>Unit {n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Resource Type</label>
                  <select value={resourceForm.type} onChange={e => setResourceForm(f => ({ ...f, type: e.target.value }))} style={selectStyle}>
                    <option>PDF</option>
                    <option>YOUTUBE</option>
                    <option>IMPORTANT TOPIC</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Title *</label>
                <input value={resourceForm.title} onChange={e => setResourceForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={resourceForm.type === 'PDF' ? 'e.g. Unit 1 Complete Notes' : resourceForm.type === 'YOUTUBE' ? 'e.g. Data Structures Full Course' : 'e.g. Define and explain with example'}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00e5c0'}
                  onBlur={e => e.target.style.borderColor = '#ffffff0f'} />
              </div>
              {resourceForm.type !== 'IMPORTANT TOPIC' && (
                <div>
                  <label style={labelStyle}>{resourceForm.type === 'PDF' ? 'Google Drive Link *' : 'YouTube Link *'}</label>
                  <input value={resourceForm.url} onChange={e => setResourceForm(f => ({ ...f, url: e.target.value }))}
                    placeholder={resourceForm.type === 'PDF' ? 'https://drive.google.com/file/d/...' : 'https://youtube.com/watch?v=...'}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#00e5c0'}
                    onBlur={e => e.target.style.borderColor = '#ffffff0f'} />
                </div>
              )}
              <div>
                <label style={labelStyle}>Description (optional)</label>
                <input value={resourceForm.desc} onChange={e => setResourceForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="Brief description..."
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00e5c0'}
                  onBlur={e => e.target.style.borderColor = '#ffffff0f'} />
              </div>
            </div>

            <button onClick={handleAddResource}
              style={{ width: '100%', marginTop: 24, padding: 14, background: 'linear-gradient(135deg,#00e5c0,#4f8aff)', border: 'none', borderRadius: 10, color: '#04040a', fontFamily: 'Bebas Neue,sans-serif', fontSize: 15, letterSpacing: 3, cursor: 'pointer', fontWeight: 700 }}>
              SAVE RESOURCE →
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 500, background: '#0e0e1c', border: `1px solid ${toast.color}44`, borderRadius: 12, padding: '14px 24px', color: toast.color, fontFamily: 'Bebas Neue,sans-serif', fontSize: 13, letterSpacing: 2, boxShadow: `0 8px 32px ${toast.color}22`, animation: 'fadeUp 0.3s ease both' }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        select option { background: #0e0e1c; color: #f0f0f5; }
      `}</style>
    </div>
  )
}