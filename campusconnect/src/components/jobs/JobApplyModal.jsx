import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Send,
  FileText,
  CheckCircle2,
  Upload,
  Globe,
  Sparkles,
  Phone,
  GraduationCap,
  Briefcase,
  AlertCircle
} from 'lucide-react'
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
  const [phone, setPhone] = useState('+91 98765 43210')
  const [batch, setBatch] = useState('2026 Batch')
  const [degree, setDegree] = useState('B.Tech - Computer Science')
  const [resumeMode, setResumeMode] = useState('upload') // 'upload' | 'link'
  const [resumeFileName, setResumeFileName] = useState('Vinay_Kumar_Resume_2026.pdf')
  const [resumeUrl, setResumeUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/vinay-dev')
  const [availability, setAvailability] = useState('Immediate / Flexible')
  const [coverNote, setCoverNote] = useState('')
  const [activeCoverPreset, setActiveCoverPreset] = useState(null)
  const [submittedAppId, setSubmittedAppId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  if (!isOpen || !job) return null

  const coverPresets = [
    {
      id: 'fullstack',
      label: '🚀 Full-Stack Focus',
      text: `Dear Hiring Team at ${job.company},\n\nI am thrilled to apply for the ${job.title} role. Having built full-stack applications with Spring Boot and React, along with solved 200+ algorithm challenges, I am confident I can contribute to your engineering milestones immediately.`,
    },
    {
      id: 'problem_solving',
      label: '🧠 DSA & Problem Solving',
      text: `Dear ${job.company} Team,\n\nI am eager to contribute to the ${job.title} opening. My strong foundations in algorithmic problem solving, clean system design, and database optimization make me well-suited for your high-scale systems.`,
    },
    {
      id: 'campus_ready',
      label: '🎓 Fresh Graduate Drive',
      text: `Hello ${job.company} Recruitment Team,\n\nAs an upcoming ${batch} graduate passionate about cutting-edge tech, I am excited about the work ${job.company} is doing. I look forward to demonstrating my dedication and technical aptitude in the interview rounds.`,
    },
  ]

  const handleApplyPreset = (preset) => {
    setActiveCoverPreset(preset.id)
    setCoverNote(preset.text)
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFileName(e.dataTransfer.files[0].name)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFileName(e.target.files[0].name)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const generatedId = `CC-APP-${Math.floor(100000 + Math.random() * 900000)}`
    setSubmittedAppId(generatedId)

    if (onSubmit) {
      onSubmit({
        studentName: name,
        studentEmail: email,
        studentPhone: phone,
        batch,
        degree,
        resumeType: resumeMode,
        resumeUrl: resumeMode === 'link' ? resumeUrl : resumeFileName,
        portfolioUrl,
        availability,
        coverNote,
        applicationId: generatedId,
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
          background: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '640px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <CompanyLogo name={job.company} size={38} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                      fontSize: '17px',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: 0,
                    }}
                  >
                    Apply to {job.company}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: '#ECFDF5',
                      color: '#059669',
                    }}
                  >
                    Verified Opening
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  {job.title} • {job.location || 'Hybrid / Remote'} • {job.salary || 'Best in Industry'}
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

          {/* Form Body - Scrollable */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
            }}
          >
            {/* Quick Autofill Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#1E40AF',
                fontSize: '12.5px',
              }}
            >
              <Sparkles size={16} style={{ color: '#2563EB', flexShrink: 0 }} />
              <span>
                CampusConnect Smart Profile Autofill applied. Review and confirm details below before submission.
              </span>
            </div>

            {/* Candidate Details 2-Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Graduation Batch *
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                >
                  <option value="2025 Batch">2025 Batch (Final Year)</option>
                  <option value="2026 Batch">2026 Batch (Current Junior)</option>
                  <option value="2027 Batch">2027 Batch (Sophomore)</option>
                  <option value="2024 Batch">2024 Batch (Immediate Joinee)</option>
                </select>
              </div>
            </div>

            {/* Degree & Portfolio URL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Degree & Branch
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Portfolio / GitHub Link
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Resume Upload Box */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Resume Document *
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setResumeMode('upload')}
                    style={{
                      border: 'none',
                      background: resumeMode === 'upload' ? '#2563EB' : '#F1F5F9',
                      color: resumeMode === 'upload' ? '#FFFFFF' : '#475569',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode('link')}
                    style={{
                      border: 'none',
                      background: resumeMode === 'link' ? '#2563EB' : '#F1F5F9',
                      color: resumeMode === 'link' ? '#FFFFFF' : '#475569',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Google Drive Link
                  </button>
                </div>
              </div>

              {resumeMode === 'upload' ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  style={{
                    border: isDragging ? '2px dashed #2563EB' : '1.5px dashed #CBD5E1',
                    background: isDragging ? '#EFF6FF' : '#F8FAFC',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="file"
                    id="resume-file-input"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="resume-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2563EB', marginBottom: '4px' }}>
                      <Upload size={18} />
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>
                        {resumeFileName ? resumeFileName : 'Upload your resume PDF'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Drag and drop your file here, or click to browse (PDF, DOCX up to 5MB)
                    </div>
                  </label>
                </div>
              ) : (
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/your-resume-link"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              )}
            </div>

            {/* Quick Cover Note & Presets */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Cover Note to Recruiter
                </label>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Click preset to auto-write:</span>
              </div>

              {/* Preset Buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {coverPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    style={{
                      border: activeCoverPreset === preset.id ? '1px solid #2563EB' : '1px solid #E2E8F0',
                      background: activeCoverPreset === preset.id ? '#EFF6FF' : '#FFFFFF',
                      color: activeCoverPreset === preset.id ? '#1D4ED8' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Briefly highlight your core strengths, notable achievements, or why you're enthusiastic about this role..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                ⚡ Fast-track review via CampusConnect Partner Network
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Send size={15} />
                <span>{loading ? 'Transmitting Application...' : `Submit Application to ${job.company}`}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
