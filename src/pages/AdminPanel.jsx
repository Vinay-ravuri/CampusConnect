import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import { getRegulations, getSubjectsByRegulation, getUnitsBySubject } from '../api/subjects'

const TABS = ['DASHBOARD', 'SUBJECTS', 'RESOURCES', 'USERS']

export default function AdminPanel() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab]         = useState('DASHBOARD')
  const [visible, setVisible]             = useState(false)
  const [showAddSubject, setShowAddSubject]   = useState(false)
  const [showAddResource, setShowAddResource] = useState(false)

  const [regulations, setRegulations] = useState([])
  const [subjects, setSubjects]       = useState([])
  const [units, setUnits]             = useState([])
  const [users, setUsers]             = useState([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)

  const [subjectForm, setSubjectForm] = useState({
    name: '', regulationCode: 'JNTUK', year: '1st Year', semester: 'Sem 1', branch: 'CSE', regulationTag: 'R23',
  })
  const [resourceForm, setResourceForm] = useState({
    subjectId: '', unitId: '', type: 'PDF', title: '', url: '', description: '',
  })
  const [toast, setToast] = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])
  useEffect(() => { if (user && !isAdmin) navigate('/welcome') }, [user, isAdmin])

  useEffect(() => {
    loadAllSubjects()
    getRegulations().then(setRegulations).catch(() => {})
  }, [])

  const loadAllSubjects = async () => {
    setLoadingSubjects(true)
    try {
      const regs = await getRegulations()
      const allSubjects = []
      for (const reg of regs) {
        const subs = await getSubjectsByRegulation(reg.code)
        subs.forEach(s => allSubjects.push({ ...s, regulationCode: reg.code, regulationLabel: reg.displayName }))
      }
      setSubjects(allSubjects)
    } catch (err) { console.error('Failed to load subjects', err) }
    setLoadingSubjects(false)
  }

  const loadUnitsForSubject = async (subjectId) => {
    if (!subjectId) { setUnits([]); return }
    try {
      const data = await getUnitsBySubject(subjectId)
      setUnits(data)
    } catch (err) { console.error('Failed to load units', err); setUnits([]) }
  }

  const showToast = (msg, color = '#22c55e') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddSubject = async () => {
    if (!subjectForm.name) { showToast('Please enter subject name', '#f43f5e'); return }
    try {
      await api.post('/admin/subjects', subjectForm)
      setShowAddSubject(false)
      setSubjectForm({ name: '', regulationCode: 'JNTUK', year: '1st Year', semester: 'Sem 1', branch: 'CSE', regulationTag: 'R23' })
      showToast('✅ Subject added successfully!')
      loadAllSubjects()
    } catch (err) { showToast('❌ Failed to add subject', '#f43f5e'); console.error(err) }
  }

  const handleDeleteSubject = async (id) => {
    try {
      await api.delete(`/admin/subjects/${id}`)
      showToast('🗑️ Subject deleted', '#f43f5e')
      loadAllSubjects()
    } catch { showToast('❌ Failed to delete', '#f43f5e') }
  }

  const handleAddResource = async () => {
    if (!resourceForm.title || !resourceForm.unitId) { showToast('Please fill subject, unit and title', '#f43f5e'); return }
    if (resourceForm.type !== 'IMPORTANT_TOPIC' && !resourceForm.url) { showToast('Please add a link', '#f43f5e'); return }
    try {
      await api.post('/admin/resources', {
        title: resourceForm.title,
        description: resourceForm.description,
        type: resourceForm.type,
        url: resourceForm.url || 'N/A',
        unitId: Number(resourceForm.unitId),
      })
      setShowAddResource(false)
      setResourceForm({ subjectId: '', unitId: '', type: 'PDF', title: '', url: '', description: '' })
      showToast('✅ Resource added successfully!')
    } catch (err) { showToast('❌ Failed to add resource', '#f43f5e'); console.error(err) }
  }

  const stats = [
    { label: 'Total Subjects',    value: subjects.length,    icon: '📚', color: '#6366f1' },
    { label: 'Regulations',       value: regulations.length, icon: '📐', color: '#14b8a6' },
    { label: 'Registered Users',  value: users.length || '—', icon: '👥', color: '#8b5cf6' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#eef2ff 0%,#f8faff 55%,#f0fdf4 100%)', backgroundAttachment: 'fixed' }}>
      <Navbar />

      {/* Orb */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', top: 0, right: 0, animation: 'orbMove 14s ease-in-out infinite' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1120, margin: '0 auto', padding: '96px 24px 80px' }}>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
          style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <div style={{ fontSize: 11, letterSpacing: '4px', color: '#6366f1', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(26px,4vw,44px)', letterSpacing: -0.5, color: '#1e293b', lineHeight: 1 }}>
              Campus Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 14, padding: '10px 16px', boxShadow: '0 4px 16px rgba(99,102,241,0.08)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', boxShadow: '0 2px 10px rgba(99,102,241,0.3)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, letterSpacing: 0.8 }}>ADMINISTRATOR</div>
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '1px solid rgba(99,102,241,0.1)', flexWrap: 'wrap' }}
        >
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 22px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1,
                color: activeTab === tab ? '#6366f1' : '#94a3b8',
                borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.2s', marginBottom: -1,
              }}
            >{tab}</button>
          ))}
        </motion.div>

        {/* ── DASHBOARD ── */}
        {activeTab === 'DASHBOARD' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(99,102,241,0.1)',
                    borderLeft: `4px solid ${stat.color}`,
                    borderRadius: 16, padding: '24px',
                    boxShadow: '0 4px 16px rgba(99,102,241,0.07)',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 34, fontWeight: 800, letterSpacing: -1, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 18, padding: 24, boxShadow: '0 4px 16px rgba(99,102,241,0.07)' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 18, letterSpacing: 0.5 }}>Quick Actions</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { label: '+ Add Subject',  color: '#6366f1', action: () => { setActiveTab('SUBJECTS');  setShowAddSubject(true)  } },
                  { label: '+ Add Resource', color: '#14b8a6', action: () => { setActiveTab('RESOURCES'); setShowAddResource(true) } },
                ].map(btn => (
                  <motion.button
                    key={btn.label}
                    onClick={btn.action}
                    whileHover={{ scale: 1.04, boxShadow: `0 6px 20px ${btn.color}30` }}
                    whileTap={{ scale: 0.96 }}
                    style={{ padding: '10px 22px', borderRadius: 11, background: btn.color + '14', color: btn.color, border: `1px solid ${btn.color}30`, cursor: 'pointer', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 0.5, transition: 'all 0.2s' }}
                  >{btn.label}</motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SUBJECTS ── */}
        {activeTab === 'SUBJECTS' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                All Subjects <span style={{ color: '#94a3b8', fontSize: 15 }}>({subjects.length})</span>
              </div>
              <motion.button
                onClick={() => setShowAddSubject(true)}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}
                whileTap={{ scale: 0.96 }}
                style={{ padding: '10px 22px', borderRadius: 11, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(99,102,241,0.25)' }}
              >+ Add Subject</motion.button>
            </div>

            {loadingSubjects && <div style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>Loading subjects…</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {subjects.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: '0 2px 10px rgba(99,102,241,0.06)' }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 6 }}>{sub.name}</div>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 100, background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 600 }}>{sub.regulationLabel}</span>
                      <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 100, background: 'rgba(99,102,241,0.05)', color: '#94a3b8', border: '1px solid rgba(99,102,241,0.08)' }}>{sub.year}</span>
                      <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 100, background: 'rgba(99,102,241,0.05)', color: '#94a3b8', border: '1px solid rgba(99,102,241,0.08)' }}>{sub.semester}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleDeleteSubject(sub.id)}
                    whileHover={{ scale: 1.05, backgroundColor: '#fff1f2' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(244,63,94,0.08)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer', fontSize: 12, fontFamily: 'Syne,sans-serif', fontWeight: 700, transition: 'background 0.2s' }}
                  >Delete</motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESOURCES ── */}
        {activeTab === 'RESOURCES' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Manage Resources</div>
              <motion.button
                onClick={() => setShowAddResource(true)}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(20,184,166,0.3)' }}
                whileTap={{ scale: 0.96 }}
                style={{ padding: '10px 22px', borderRadius: 11, background: 'linear-gradient(135deg,#14b8a6,#6366f1)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 16px rgba(20,184,166,0.22)' }}
              >+ Add Resource</motion.button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(99,102,241,0.07)' }}>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
                Click <span style={{ color: '#14b8a6', fontWeight: 600 }}>+ Add Resource</span> — select a subject, then a unit,
                then add a PDF link, YouTube link, or an important topic. It saves directly into MySQL and shows up instantly on the student-facing Resource page.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'USERS' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(99,102,241,0.07)' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Registered Students</div>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
                Full user list view can be wired to <code style={{ background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: 6, fontSize: 13, color: '#6366f1' }}>GET /api/admin/users</code> next if you want it displayed here.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Add Subject Modal ── */}
      <AnimatePresence>
        {showAddSubject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,23,80,0.4)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={e => e.target === e.currentTarget && setShowAddSubject(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 22, padding: '40px 40px', width: '100%', maxWidth: 500, position: 'relative', boxShadow: '0 32px 80px rgba(99,102,241,0.16)' }}
            >
              <motion.button onClick={() => setShowAddSubject(false)} whileHover={{ scale: 1.1 }} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>✕</motion.button>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 24 }}>Add New Subject</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={labelStyle}>Subject Name *</label><input value={subjectForm.name} onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Data Structures" style={inputStyle} onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.1)' }} onBlur={e => { e.target.style.borderColor='rgba(99,102,241,0.15)'; e.target.style.boxShadow='none' }} /></div>
                <div><label style={labelStyle}>Regulation</label>
                  <select value={subjectForm.regulationCode} onChange={e => setSubjectForm(f => ({ ...f, regulationCode: e.target.value }))} style={selectStyle}>
                    <option value="JNTUK">JNTUK</option><option value="AU">AU</option><option value="UNI">University</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={labelStyle}>Year</label>
                    <select value={subjectForm.year} onChange={e => setSubjectForm(f => ({ ...f, year: e.target.value }))} style={selectStyle}>
                      <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Semester</label>
                    <select value={subjectForm.semester} onChange={e => setSubjectForm(f => ({ ...f, semester: e.target.value }))} style={selectStyle}>
                      <option>Sem 1</option><option>Sem 2</option>
                    </select>
                  </div>
                </div>
                <div><label style={labelStyle}>Branch</label>
                  <select value={subjectForm.branch} onChange={e => setSubjectForm(f => ({ ...f, branch: e.target.value }))} style={selectStyle}>
                    <option>CSE</option><option>ECE</option><option>EEE</option><option>MECH</option><option>CIVIL</option><option>Common</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Regulation Tag (e.g. R23)</label><input value={subjectForm.regulationTag} onChange={e => setSubjectForm(f => ({ ...f, regulationTag: e.target.value }))} placeholder="R23" style={inputStyle} onFocus={e => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.1)' }} onBlur={e => { e.target.style.borderColor='rgba(99,102,241,0.15)'; e.target.style.boxShadow='none' }} /></div>
              </div>

              <motion.button
                onClick={handleAddSubject}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', marginTop: 24, padding: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.26)' }}
              >Save Subject →</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Resource Modal ── */}
      <AnimatePresence>
        {showAddResource && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,23,80,0.4)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={e => e.target === e.currentTarget && setShowAddResource(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ background: 'rgba(255,255,255,0.98)', border: '1px solid rgba(99,102,241,0.14)', borderRadius: 22, padding: '40px 40px', width: '100%', maxWidth: 540, position: 'relative', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(99,102,241,0.16)' }}
            >
              <motion.button onClick={() => setShowAddResource(false)} whileHover={{ scale: 1.1 }} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>✕</motion.button>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 24 }}>Add Resource</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={labelStyle}>Select Subject</label>
                  <select value={resourceForm.subjectId} onChange={e => { const subjectId = e.target.value; setResourceForm(f => ({ ...f, subjectId, unitId: '' })); loadUnitsForSubject(subjectId) }} style={selectStyle}>
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.regulationLabel})</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Select Unit</label>
                  <select value={resourceForm.unitId} onChange={e => setResourceForm(f => ({ ...f, unitId: e.target.value }))} style={selectStyle}>
                    <option value="">-- Select Unit --</option>
                    {units.map(u => <option key={u.id} value={u.id}>{u.title}</option>)}
                  </select>
                </div>
                <div><label style={labelStyle}>Resource Type</label>
                  <select value={resourceForm.type} onChange={e => setResourceForm(f => ({ ...f, type: e.target.value }))} style={selectStyle}>
                    <option value="PDF">PDF</option><option value="YOUTUBE">YouTube</option><option value="IMPORTANT_TOPIC">Important Topic</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Title *</label>
                  <input value={resourceForm.title} onChange={e => setResourceForm(f => ({ ...f, title: e.target.value }))} placeholder={resourceForm.type === 'PDF' ? 'e.g. Unit 1 Complete Notes' : resourceForm.type === 'YOUTUBE' ? 'e.g. Data Structures Full Course' : 'e.g. Define and explain with example'} style={inputStyle} onFocus={e => { e.target.style.borderColor='#14b8a6'; e.target.style.boxShadow='0 0 0 3px rgba(20,184,166,0.1)' }} onBlur={e => { e.target.style.borderColor='rgba(99,102,241,0.15)'; e.target.style.boxShadow='none' }} />
                </div>
                {resourceForm.type !== 'IMPORTANT_TOPIC' && (
                  <div><label style={labelStyle}>{resourceForm.type === 'PDF' ? 'Google Drive Link *' : 'YouTube Link *'}</label>
                    <input value={resourceForm.url} onChange={e => setResourceForm(f => ({ ...f, url: e.target.value }))} placeholder={resourceForm.type === 'PDF' ? 'https://drive.google.com/file/d/.../view' : 'https://youtube.com/watch?v=...'} style={inputStyle} onFocus={e => { e.target.style.borderColor='#14b8a6'; e.target.style.boxShadow='0 0 0 3px rgba(20,184,166,0.1)' }} onBlur={e => { e.target.style.borderColor='rgba(99,102,241,0.15)'; e.target.style.boxShadow='none' }} />
                  </div>
                )}
                <div><label style={labelStyle}>Description (optional)</label>
                  <input value={resourceForm.description} onChange={e => setResourceForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description…" style={inputStyle} onFocus={e => { e.target.style.borderColor='#14b8a6'; e.target.style.boxShadow='0 0 0 3px rgba(20,184,166,0.1)' }} onBlur={e => { e.target.style.borderColor='rgba(99,102,241,0.15)'; e.target.style.boxShadow='none' }} />
                </div>
              </div>

              <motion.button
                onClick={handleAddResource}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(20,184,166,0.35)' }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', marginTop: 24, padding: 14, background: 'linear-gradient(135deg,#14b8a6,#6366f1)', border: 'none', borderRadius: 12, color: '#fff', fontFamily: 'Syne,sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(20,184,166,0.26)' }}
              >Save Resource →</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.9 }}
            style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 500, background: 'rgba(255,255,255,0.97)', border: `1px solid ${toast.color}30`, borderRadius: 14, padding: '14px 24px', color: toast.color, fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, boxShadow: `0 8px 32px ${toast.color}22, 0 2px 8px rgba(0,0,0,0.08)`, backdropFilter: 'blur(16px)', whiteSpace: 'nowrap' }}
          >{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      <style>{`select option { background: #ffffff; color: #1e293b; }`}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 12, color: '#64748b',
  marginBottom: 7, fontWeight: 600, letterSpacing: 0.4,
}
const inputStyle = {
  width: '100%', background: '#f8faff',
  border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10,
  padding: '11px 14px', color: '#1e293b',
  fontSize: 14, outline: 'none',
  fontFamily: 'Inter,sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  marginTop: 6,
}
const selectStyle = { ...inputStyle, cursor: 'pointer' }