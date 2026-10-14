import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, FileText, CheckCircle2 } from 'lucide-react'
import CompanyLogo from '../ui/CompanyLogo'

export default function JobApplyModal({
  job,
  isOpen = false,
  onClose,
  initialUser,
  onSubmit,
  loading = false,
}) {
  const [name, setName] = useState(initialUser?.name || 'Vinay Kumar')
  const [email, setEmail] = useState(initialUser?.email || 'vinay@campusconnect.edu')
  const [resumeUrl, setResumeUrl] = useState('')
  const [coverNote, setCoverNote] = useState('')

  if (!isOpen || !job) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        studentName: name,
        studentEmail: email,
        resumeUrl,
        coverNote,
      })
    }
  }

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CompanyLogo name={job.company} size={34} />
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                    fontSize: '16.5px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                  }}
                >
                  Apply to {job.company}
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  {job.title}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                College / Contact Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Resume URL (Google Drive / GitHub / LinkedIn) *
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/d/your-resume"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Short Note to Recruiter (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Briefly highlight your relevant projects, hackathons, or core technical strengths..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Send size={15} />
              <span>{loading ? 'Submitting Application...' : 'Confirm & Submit Application'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
