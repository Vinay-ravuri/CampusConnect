import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import api from '../api/axios'
import { JOBS_LIST } from '../api/jobsData'

export default function JobDetailsPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [job, setJob] = useState(() => JOBS_LIST.find(j => j.id === jobId) || JOBS_LIST[0])
  const [loading, setLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [submittingApply, setSubmittingApply] = useState(false)

  const [applyForm, setApplyForm] = useState({
    studentName: user?.name || '',
    studentEmail: user?.email || '',
    resumeUrl: '',
    coverNote: '',
  })

  useEffect(() => {
    fetchJobDetail()
    checkSavedAndApplied()
  }, [jobId])

  useEffect(() => {
    if (user) {
      setApplyForm(prev => ({
        ...prev,
        studentName: prev.studentName || user.name || '',
        studentEmail: prev.studentEmail || user.email || '',
      }))
    }
  }, [user])

  const fetchJobDetail = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/jobs/${jobId}`)
      if (res.data && res.data.id) {
        setJob(res.data)
      }
    } catch (err) {
      console.warn('Fallback to local job detail:', err)
      const fallback = JOBS_LIST.find(j => j.id === jobId)
      if (fallback) setJob(fallback)
    } finally {
      setLoading(false)
    }
  }

  const checkSavedAndApplied = () => {
    // Check saved status in local storage
    const saved = JSON.parse(localStorage.getItem('cc_saved_jobs') || '[]')
    setIsSaved(saved.includes(jobId))

    // Check applied status in local storage
    const apps = JSON.parse(localStorage.getItem('cc_user_applications') || '[]')
    setHasApplied(apps.some(a => a.jobId === jobId))
  }

  const handleToggleSave = async () => {
    const nextSaved = !isSaved
    setIsSaved(nextSaved)

    const localSaved = new Set(JSON.parse(localStorage.getItem('cc_saved_jobs') || '[]'))
    if (nextSaved) {
      localSaved.add(jobId)
      toast.success(`Saved "${job.title}" to bookmarks! ⭐`)
    } else {
      localSaved.delete(jobId)
      toast.info(`Removed "${job.title}" from bookmarks`)
    }
    localStorage.setItem('cc_saved_jobs', JSON.stringify(Array.from(localSaved)))

    const token = localStorage.getItem('cc_token')
    if (token && token !== 'mock_token_jwt') {
      try {
        await api.post(`/jobs/${jobId}/save`)
      } catch (err) {
        console.warn('Failed to sync save state to backend:', err)
      }
    }
  }

  const handleSubmitApplication = async (e) => {
    e.preventDefault()
    if (!applyForm.studentName.trim() || !applyForm.studentEmail.trim()) {
      toast.error('Please provide your name and email')
      return
    }

    setSubmittingApply(true)
    const newApplicationItem = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      logo: job.logo,
      color: job.color,
      bgColor: job.bgColor,
      location: job.location,
      workMode: job.workMode,
      type: job.type,
      salary: job.salary,
      status: 'APPLIED',
      appliedAt: new Date().toISOString(),
      coverNote: applyForm.coverNote,
      resumeUrl: applyForm.resumeUrl,
    }

    try {
      const token = localStorage.getItem('cc_token')
      if (token && token !== 'mock_token_jwt') {
        const res = await api.post(`/jobs/${job.id}/apply`, {
          studentName: applyForm.studentName,
          studentEmail: applyForm.studentEmail,
          resumeUrl: applyForm.resumeUrl,
          coverNote: applyForm.coverNote,
        })
        if (res.data) {
          newApplicationItem.id = res.data.id || newApplicationItem.id
          newApplicationItem.status = res.data.status || 'APPLIED'
        }
      }

      // Update local storage and state
      const apps = JSON.parse(localStorage.getItem('cc_user_applications') || '[]')
      const updatedList = [newApplicationItem, ...apps.filter(a => a.jobId !== job.id)]
      localStorage.setItem('cc_user_applications', JSON.stringify(updatedList))

      setHasApplied(true)
      setShowApplyModal(false)
      toast.success(`Application successfully sent to ${job.company}! 🚀`)
    } catch (err) {
      console.warn('Failed to post application to backend, saved locally:', err)
      const apps = JSON.parse(localStorage.getItem('cc_user_applications') || '[]')
      const updatedList = [newApplicationItem, ...apps.filter(a => a.jobId !== job.id)]
      localStorage.setItem('cc_user_applications', JSON.stringify(updatedList))

      setHasApplied(true)
      setShowApplyModal(false)
      toast.success(`Application recorded for ${job.company}! 🚀`)
    } finally {
      setSubmittingApply(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF9F0', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />

      {/* Decorative Grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(249, 115, 22, 0.04) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px', opacity: 0.85
      }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '100px 24px 80px', maxWidth: 1040, margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Jobs & Internships', href: '/jobs' },
          { label: job.title || 'Job Details' }
        ]} />

        {/* Back Link */}
        <button
          onClick={() => navigate('/jobs')}
          style={{
            background: 'none', border: 'none',
            color: '#6B7280', cursor: 'pointer',
            fontSize: 13, fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, marginBottom: 24,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Back to All Opportunities
        </button>

        {/* ════════ HERO CARD ════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            borderTop: `6px solid ${job.color || '#F97316'}`,
            borderRadius: 24,
            padding: '36px 36px',
            boxShadow: '0 16px 48px rgba(249, 115, 22, 0.06)',
            marginBottom: 32,
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: job.bgColor || '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}>
                {job.logo || '💼'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {job.company}
                  </span>
                  {job.verified && (
                    <span style={{
                      fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100,
                      background: 'rgba(16, 185, 129, 0.1)', color: '#047857',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}>
                      ✓ Verified Recruiter
                    </span>
                  )}
                </div>
                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800, fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)',
                  color: '#111827', margin: '4px 0 0', letterSpacing: '-0.02em',
                }}>
                  {job.title}
                </h1>
              </div>
            </div>

            {/* Right: Salary & Save */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                fontSize: 14, fontWeight: 800, padding: '6px 14px', borderRadius: 100,
                background: job.bgColor || '#FFF7ED', color: job.color || '#C2410C',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {job.salary}
              </div>

              <button
                onClick={handleToggleSave}
                title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
                style={{
                  background: isSaved ? '#FEF2F2' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${isSaved ? '#FCA5A5' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 12, width: 42, height: 42,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, cursor: 'pointer',
                  color: isSaved ? '#EF4444' : '#9CA3AF',
                }}
              >
                {isSaved ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            background: 'rgba(255, 247, 237, 0.6)',
            border: '1px solid rgba(249, 115, 22, 0.15)',
            borderRadius: 16, padding: '18px 20px',
            marginBottom: 28,
          }}>
            <div>
              <span style={specLabelStyle}>📍 Location / Mode</span>
              <span style={specValStyle}>{job.location} ({job.workMode})</span>
            </div>
            <div>
              <span style={specLabelStyle}>🎓 Target Batch</span>
              <span style={specValStyle}>{job.batch} Batch Graduates</span>
            </div>
            <div>
              <span style={specLabelStyle}>💼 Job Type</span>
              <span style={specValStyle}>{job.type}</span>
            </div>
            <div>
              <span style={specLabelStyle}>⏳ Experience</span>
              <span style={specValStyle}>{job.experience}</span>
            </div>
            <div>
              <span style={specLabelStyle}>📅 Application Deadline</span>
              <span style={{ ...specValStyle, color: '#DC2626' }}>{job.deadline}</span>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowApplyModal(true)}
              style={{
                background: hasApplied
                  ? '#10B981'
                  : 'linear-gradient(135deg, #EA580C, #F97316)',
                border: 'none', color: '#FFFFFF',
                borderRadius: 12, padding: '12px 28px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <span>{hasApplied ? 'Applied ✓' : 'Quick Apply Now'}</span>
              <span>🚀</span>
            </button>

            {job.externalUrl && (
              <a
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  color: '#EA580C',
                  borderRadius: 12, padding: '12px 24px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <span>Company Careers Portal</span>
                <span style={{ fontSize: 14 }}>↗</span>
              </a>
            )}
          </div>
        </motion.div>

        {/* ════════ BODY CONTENT ════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {/* Left Column: Description & Responsibilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* About Role */}
            <div style={cardSectionStyle}>
              <h2 style={sectionHeadingStyle}>About the Opportunity</h2>
              <p style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.7, margin: 0 }}>
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div style={cardSectionStyle}>
                <h2 style={sectionHeadingStyle}>Key Responsibilities</h2>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div style={cardSectionStyle}>
                <h2 style={sectionHeadingStyle}>Eligibility &amp; Requirements</h2>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {job.requirements.map((req, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Skills & Fast Facts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Required Skills */}
            <div style={cardSectionStyle}>
              <h2 style={sectionHeadingStyle}>Required Tech Stack &amp; Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(job.skills || []).map(skill => (
                  <span key={skill} style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 8,
                    background: 'rgba(249, 115, 22, 0.08)',
                    color: '#C2410C', fontWeight: 700,
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligible Branches */}
            <div style={cardSectionStyle}>
              <h2 style={sectionHeadingStyle}>Eligible Branches</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(job.branch || []).map(b => (
                  <span key={b} style={{
                    fontSize: 11.5, padding: '4px 10px', borderRadius: 6,
                    background: '#F3F4F6', color: '#374151', fontWeight: 600,
                  }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Handwritten Prep Tip */}
            <div style={{
              background: '#FFFBEB',
              border: '1.5px dashed #F59E0B',
              borderRadius: 16, padding: '20px',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#B45309', marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
                💡 Campus Connect Pro Tip
              </div>
              <p style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 19, color: '#92400E', lineHeight: 1.4, margin: 0,
              }}>
                Review the company's past questions in our Placement Prep portal before your interview round!
              </p>
              <button
                onClick={() => navigate('/placement')}
                style={{
                  marginTop: 12, background: 'none', border: 'none',
                  color: '#EA580C', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', textDecoration: 'underline',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                Go to Placement Practice Arena →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ QUICK APPLY MODAL ════════ */}
      <AnimatePresence>
        {showApplyModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                width: '100%', maxWidth: 540,
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                overflow: 'hidden',
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                borderBottom: '1px solid rgba(249, 115, 22, 0.15)',
                padding: '24px 28px 18px', position: 'relative',
              }}>
                <button
                  onClick={() => setShowApplyModal(false)}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'none', border: 'none', fontSize: 20,
                    color: '#6B7280', cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#C2410C', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {job.company}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: '#111827', margin: '4px 0 0' }}>
                  Apply for {job.title}
                </h3>
              </div>

              <form onSubmit={handleSubmitApplication} style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={modalLabelStyle}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applyForm.studentName}
                      onChange={e => setApplyForm({ ...applyForm, studentName: e.target.value })}
                      placeholder="e.g. Vinay Kumar"
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label style={modalLabelStyle}>Student Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applyForm.studentEmail}
                      onChange={e => setApplyForm({ ...applyForm, studentEmail: e.target.value })}
                      placeholder="e.g. student@campusconnect.com"
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label style={modalLabelStyle}>Resume Link (Drive / LinkedIn / GitHub)</label>
                    <input
                      type="url"
                      value={applyForm.resumeUrl}
                      onChange={e => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label style={modalLabelStyle}>Cover Pitch / Note</label>
                    <textarea
                      rows={3}
                      value={applyForm.coverNote}
                      onChange={e => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                      placeholder="Highlight your projects, relevant skills, and graduation batch..."
                      style={{ ...modalInputStyle, resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    style={{
                      background: 'none', border: '1px solid #E5E7EB',
                      borderRadius: 12, padding: '10px 18px',
                      color: '#4B5563', fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingApply}
                    style={{
                      background: 'linear-gradient(135deg, #EA580C, #F97316)',
                      border: 'none', borderRadius: 12, padding: '10px 24px',
                      color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    {submittingApply ? 'Submitting...' : 'Submit Application 🚀'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Campus AI Assistant */}
      <AIAssistant
        contextTitle={`${job.company} — ${job.title}`}
        contextPrompts={[
          `What interview questions does ${job.company} typically ask?`,
          `How can I improve my chances for ${job.title}?`,
          `Explain system design concepts needed for this role`,
          `What are the most tested coding algorithms at ${job.company}?`
        ]}
      />
    </div>
  )
}

/* ─── STYLES ───────────────────────────────────────────────────── */

const cardSectionStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(249, 115, 22, 0.16)',
  borderRadius: 20,
  padding: '24px 28px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
}

const sectionHeadingStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 17,
  fontWeight: 800,
  color: '#111827',
  marginBottom: 14,
  letterSpacing: '-0.2px',
}

const specLabelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: '#9A3412',
  marginBottom: 2,
  fontFamily: "'Space Grotesk', sans-serif",
}

const specValStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#111827',
  fontFamily: "'Space Grotesk', sans-serif",
}

const modalLabelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: '#374151',
  marginBottom: 6,
  fontFamily: "'Space Grotesk', sans-serif",
}

const modalInputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: 10,
  fontSize: 13.5,
  fontFamily: "'Inter', sans-serif",
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box',
}
