import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import CareerChatbot from '../components/career/CareerChatbot'
import { analyzeCareer } from '../services/careerAI'

// Import Dashboard Cards
import CareerOptionsCard from '../components/career/CareerOptionsCard'
import SkillGapCard from '../components/career/SkillGapCard'
import RoadmapCard from '../components/career/RoadmapCard'
import OpportunitiesCard from '../components/career/OpportunitiesCard'
import TrendingSkillsCard from '../components/career/TrendingSkillsCard'
import ResumeIntelCard from '../components/career/ResumeIntelCard'
import PlacementReadinessCard from '../components/career/PlacementReadinessCard'
import CertificationCard from '../components/career/CertificationCard'
import MentorChat from '../components/career/MentorChat'

// Additional AI Assessment Cards
import JobFitCard from '../components/career/JobFitCard'
import ProjectRecommendationsCard from '../components/career/ProjectRecommendationsCard'
import PrioritizedSkillsCard from '../components/career/PrioritizedSkillsCard'

const ACCENT = '#FF7A00'

const DOMAIN_OPTIONS = [
  'Software Development',
  'Data Science & Analytics',
  'Cybersecurity',
  'Cloud Engineering & DevOps',
  'AI & Machine Learning',
  'Embedded Systems & IoT',
  'Product Management'
]

const LOADING_STEPS = [
  'Parsing profile details and preferences...',
  'Extracting core tech stack and soft skills...',
  'Evaluating ATS score and resume content...',
  'Aligning skills with market demand in India...',
  'Simulating mock placement parameters...',
  'Constructing custom 6-month roadmap & resources...',
  'Configuring interactive workspace modules...'
]

export default function CareerAssistant() {
  // Load initial results from localStorage
  const [results, setResults] = useState(() => {
    try {
      const stored = localStorage.getItem('campusconnect_career_report')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [activeTab, setActiveTab] = useState('resume') // 'resume' | 'form'

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedFileSize, setUploadedFileSize] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [parseSuccess, setParseSuccess] = useState(false)

  // Form Inputs State
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [interests, setInterests] = useState([])
  const [interestInput, setInterestInput] = useState('')
  const [cgpa, setCgpa] = useState('')
  const [domain, setDomain] = useState(DOMAIN_OPTIONS[0])
  const [workType, setWorkType] = useState('Any') // 'Remote' | 'On-site' | 'Hybrid' | 'Any'

  // Text Mode Input State
  const [resumeText, setResumeText] = useState('')

  // Control loading text step changes
  useEffect(() => {
    let interval
    if (isLoading) {
      setLoadingStep(0)
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < LOADING_STEPS.length - 1) {
            return prev + 1
          }
          return prev
        })
      }, 900)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  // Form helpers
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault()
      const cleaned = skillInput.trim()
      if (cleaned && !skills.includes(cleaned)) {
        setSkills([...skills, cleaned])
        setSkillInput('')
      }
    }
  }

  const handleRemoveSkill = (idxToRemove) => {
    setSkills(skills.filter((_, idx) => idx !== idxToRemove))
  }

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault()
      const cleaned = interestInput.trim()
      if (cleaned && !interests.includes(cleaned)) {
        setInterests([...interests, cleaned])
        setInterestInput('')
      }
    }
  }

  const handleRemoveInterest = (idxToRemove) => {
    setInterests(interests.filter((_, idx) => idx !== idxToRemove))
  }

  // Validate inputs
  const isFormValid = () => {
    if (activeTab === 'form') {
      const cgpaFloat = parseFloat(cgpa)
      return skills.length > 0 && cgpa && !isNaN(cgpaFloat) && cgpaFloat >= 0 && cgpaFloat <= 10
    } else {
      return resumeText.trim().length >= 20 || !!uploadedFileName
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadedFileName(file.name)
    setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB')
    setIsParsing(true)
    setParseSuccess(false)

    setTimeout(() => {
      setIsParsing(false)
      setParseSuccess(true)

      if (file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setResumeText(event.target.result)
        }
        reader.readAsText(file)
      } else {
        setResumeText(`[Uploaded Document: ${file.name}]\n` +
          `Size: ${(file.size / 1024).toFixed(1)} KB\n` +
          `Type: ${file.type || 'Document'}\n\n` +
          `Please analyze the details of this candidate based on their uploaded resume: ${file.name}.`
        )
      }
    }, 1200)
  }

  // Submit trigger
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!isFormValid()) return

    setIsLoading(true)
    let payload = {}
    if (activeTab === 'form') {
      payload = {
        skills,
        interests,
        cgpa: parseFloat(cgpa).toFixed(2),
        domain,
        workType
      }
    } else {
      payload = {
        resumeText
      }
    }

    try {
      const report = await analyzeCareer(payload)
      setResults(report)
      localStorage.setItem('campusconnect_career_report', JSON.stringify(report))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to build a new career assessment? This will reset the current dashboard.')) {
      setResults(null)
      localStorage.removeItem('campusconnect_career_report')
      setSkills([])
      setInterests([])
      setCgpa('')
      setResumeText('')
      setDomain(DOMAIN_OPTIONS[0])
    }
  }

  // Inline styles for input tags and elements
  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    background: '#FAF9F6',
    border: '1px solid rgba(255,122,0,0.18)',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    outline: 'none',
    color: '#111827',
    transition: 'all 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    color: '#6B7280',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: "'Space Grotesk', sans-serif",
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF8', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />

      {/* Watermark backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        overflow: 'hidden', opacity: 0.02,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignContent: 'space-around', padding: '5vh 5vw',
      }}>
        {['AI ASSISTANT', 'JOB FIT', 'ROADMAP', 'PROJECTS', 'RESUME', 'ATS SCORE', 'PLACEMENT'].map((n, i) => (
          <div key={n} style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
            fontSize: 'clamp(40px, 8vw, 130px)', letterSpacing: '-0.04em',
            color: '#111827', transform: `rotate(${(i % 3 - 1) * 8}deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {n}
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '100px 24px 64px' }}>
        
        {/* State 1: LOADING SCREEN */}
        {isLoading && (
          <div style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: '6px solid rgba(255,122,0,0.12)',
                borderTopColor: ACCENT,
                marginBottom: 36,
                boxShadow: '0 8px 24px rgba(255,122,0,0.15)'
              }}
            />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: '#111827',
              marginBottom: 12
            }}>
              Consulting Campus AI...
            </h2>
            
            <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    fontSize: 15,
                    color: '#6B7280',
                    fontWeight: 500,
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                >
                  {LOADING_STEPS[loadingStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Simulated progress indicators */}
            <div style={{
              width: '100%',
              maxWidth: 320,
              height: 6,
              background: 'rgba(255,122,0,0.12)',
              borderRadius: 10,
              marginTop: 20,
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${ACCENT}, #FFB800)`,
                  borderRadius: 10
                }}
              />
            </div>
          </div>
        )}

        {/* State 2: INPUT MODE (Form/Resume submission) */}
        {!isLoading && !results && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '2.5px',
                  color: '#92400E', textTransform: 'uppercase',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  Smart Career Guidance Engine
                </span>
              </div>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                color: '#111827',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: 16
              }}>
                AI Skill Assessment <span style={{ color: ACCENT }}>Assistant</span>
              </h1>
              <p style={{
                fontSize: 15, color: '#4B5563',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, lineHeight: 1.6,
                maxWidth: 580, margin: '0 auto'
              }}>
                Analyze your resume, test job fit match %, discover missing skill gaps, get prioritized learning roadmaps, and view recruiter-ready project recommendations.
              </p>
            </div>

            {/* Toggle Modes */}
            <div style={{
              display: 'flex',
              background: 'rgba(255,122,0,0.06)',
              border: '1px solid rgba(255,122,0,0.15)',
              borderRadius: 16,
              padding: 6,
              maxWidth: 440,
              margin: '0 auto 36px',
            }}>
              <button
                onClick={() => setActiveTab('resume')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  background: activeTab === 'resume' ? '#ffffff' : 'transparent',
                  color: activeTab === 'resume' ? ACCENT : '#6B7280',
                  boxShadow: activeTab === 'resume' ? '0 4px 16px rgba(255,122,0,0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                📄 Resume ATS Analysis
              </button>
              <button
                onClick={() => setActiveTab('form')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  background: activeTab === 'form' ? '#ffffff' : 'transparent',
                  color: activeTab === 'form' ? ACCENT : '#6B7280',
                  boxShadow: activeTab === 'form' ? '0 4px 16px rgba(255,122,0,0.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                📝 Skill Assessment
              </button>
            </div>

            {/* Inputs Wrapper */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255,255,255,0.76)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,122,0,0.15)',
                borderRadius: 24,
                padding: '40px 36px',
                boxShadow: '0 12px 48px rgba(255,122,0,0.06)'
              }}
            >
              {activeTab === 'form' ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Skills input */}
                  <div>
                    <label style={labelStyle}>Skills (Type and press Enter)</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <input
                        type="text"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="e.g. React, Python, Java, SQL, Git..."
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,122,0,0.18)'; e.target.style.boxShadow = 'none' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        style={{
                          background: ACCENT,
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '0 20px',
                          cursor: 'pointer',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: 13,
                          boxShadow: '0 4px 12px rgba(255,122,0,0.25)'
                        }}
                      >
                        Add
                      </button>
                    </div>
                    {/* Tags list */}
                    {skills.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', background: '#FFFDF8', border: '1px solid rgba(255,122,0,0.08)', borderRadius: 12, padding: '12px' }}>
                        {skills.map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              padding: '5px 12px',
                              background: 'rgba(255,122,0,0.08)',
                              color: ACCENT,
                              borderRadius: 100,
                              fontWeight: 700,
                              fontFamily: "'Space Grotesk', sans-serif"
                            }}
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: ACCENT,
                                padding: 0,
                                fontSize: 11,
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Interests Input */}
                  <div>
                    <label style={labelStyle}>Interests &amp; Target Goals</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <input
                        type="text"
                        value={interestInput}
                        onChange={e => setInterestInput(e.target.value)}
                        onKeyDown={handleAddInterest}
                        placeholder="e.g. AI systems, Backend Developer, Fintech, Full Stack..."
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,122,0,0.18)'; e.target.style.boxShadow = 'none' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        style={{
                          background: ACCENT,
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '0 20px',
                          cursor: 'pointer',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          fontSize: 13,
                          boxShadow: '0 4px 12px rgba(255,122,0,0.25)'
                        }}
                      >
                        Add
                      </button>
                    </div>
                    {interests.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', background: '#FFFDF8', border: '1px solid rgba(255,122,0,0.08)', borderRadius: 12, padding: '12px' }}>
                        {interests.map((i, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              padding: '5px 12px',
                              background: 'rgba(99,102,241,0.08)',
                              color: '#6366F1',
                              borderRadius: 100,
                              fontWeight: 700,
                              fontFamily: "'Space Grotesk', sans-serif"
                            }}
                          >
                            {i}
                            <button
                              type="button"
                              onClick={() => handleRemoveInterest(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6366F1',
                                padding: 0,
                                fontSize: 11,
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* CGPA */}
                    <div>
                      <label style={labelStyle}>Current CGPA (0.0 - 10.0)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={cgpa}
                        onChange={e => setCgpa(e.target.value)}
                        placeholder="e.g. 8.45"
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,122,0,0.18)'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>

                    {/* Domain Option */}
                    <div>
                      <label style={labelStyle}>Target Engineering Domain</label>
                      <select
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'none\'%3E%3Cpath d=\'M7 9l3 3 3-3\' stroke=\'%236b7280\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
                      >
                        {DOMAIN_OPTIONS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Work Type Options */}
                  <div>
                    <label style={labelStyle}>Preferred Placement Work Mode</label>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {['Any', 'Remote', 'On-site', 'Hybrid'].map(modeOpt => (
                        <button
                          key={modeOpt}
                          type="button"
                          onClick={() => setWorkType(modeOpt)}
                          style={{
                            padding: '9px 18px',
                            borderRadius: 10,
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: workType === modeOpt ? 'rgba(255,122,0,0.12)' : '#FAF9F6',
                            color: workType === modeOpt ? ACCENT : '#4B5563',
                            border: `1px solid ${workType === modeOpt ? ACCENT : 'rgba(255,122,0,0.12)'}`,
                            transition: 'all 0.15s'
                          }}
                        >
                          {modeOpt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!isFormValid()}
                    whileHover={isFormValid() ? { scale: 1.02 } : {}}
                    whileTap={isFormValid() ? { scale: 0.98 } : {}}
                    style={{
                      background: isFormValid() ? 'linear-gradient(135deg,#FF7A00,#FFB800)' : 'rgba(255,122,0,0.18)',
                      color: isFormValid() ? '#fff' : '#9CA3AF',
                      border: 'none',
                      borderRadius: 14,
                      padding: '16px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: isFormValid() ? 'pointer' : 'not-allowed',
                      boxShadow: isFormValid() ? '0 8px 24px rgba(255,122,0,0.3)' : 'none',
                      marginTop: 10,
                      transition: 'all 0.25s'
                    }}
                  >
                    Generate AI Skill Assessment Report →
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* File Upload Zone */}
                  <div style={{
                    border: '2px dashed rgba(255,122,0,0.25)',
                    borderRadius: 16,
                    padding: '24px',
                    textAlign: 'center',
                    background: 'rgba(255,122,0,0.02)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault()
                      const file = e.dataTransfer.files[0]
                      if (file) handleFileUpload({ target: { files: [file] } })
                    }}
                    onClick={() => document.getElementById('file-upload-input').click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#111827' }}>
                      Drag &amp; Drop Resume or Click to Upload
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>
                      Supports PDF, DOC, DOCX, TXT (Max 5MB)
                    </div>

                    {uploadedFileName && (
                      <div style={{
                        marginTop: 16,
                        background: '#ffffff',
                        border: '1px solid rgba(255,122,0,0.15)',
                        borderRadius: 12,
                        padding: '10px 14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        boxShadow: '0 4px 12px rgba(255,122,0,0.04)',
                      }}
                        onClick={e => e.stopPropagation()}
                      >
                        <span style={{ fontSize: 18 }}>📄</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {uploadedFileName}
                          </div>
                          <div style={{ fontSize: 10, color: '#6B7280' }}>{uploadedFileSize}</div>
                        </div>
                        {isParsing && (
                          <span style={{ fontSize: 11, color: '#FF7A00', fontWeight: 600 }}>Parsing...</span>
                        )}
                        {parseSuccess && (
                          <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>✓ Ready</span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadedFileName('')
                            setUploadedFileSize('')
                            setParseSuccess(false)
                            setResumeText('')
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 700,
                            padding: '4px',
                          }}
                        >✕</button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>OR Paste Resume Text</label>
                    <textarea
                      value={resumeText}
                      onChange={e => setResumeText(e.target.value)}
                      placeholder="Paste your raw resume text here, or write a summary of your skills and goals. E.g. 'I am a 3rd year engineering student in CSE. Good with Java, Python, SQL, and React. Built 2 projects. Looking for Java Developer or Backend roles.'"
                      style={{
                        ...inputStyle,
                        height: 200,
                        resize: 'none',
                        lineHeight: 1.6
                      }}
                      onFocus={e => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(255,122,0,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,122,0,0.18)'; e.target.style.boxShadow = 'none' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
                      <span>Min 20 characters required (unless file uploaded)</span>
                      <span>{resumeText.trim().length} chars</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!isFormValid()}
                    whileHover={isFormValid() ? { scale: 1.02 } : {}}
                    whileTap={isFormValid() ? { scale: 0.98 } : {}}
                    style={{
                      background: isFormValid() ? 'linear-gradient(135deg,#FF7A00,#FFB800)' : 'rgba(255,122,0,0.18)',
                      color: isFormValid() ? '#fff' : '#9CA3AF',
                      border: 'none',
                      borderRadius: 14,
                      padding: '16px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: isFormValid() ? 'pointer' : 'not-allowed',
                      boxShadow: isFormValid() ? '0 8px 24px rgba(255,122,0,0.3)' : 'none',
                      transition: 'all 0.25s'
                    }}
                  >
                    Analyze Resume &amp; Generate Report →
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* State 3: RESULTS DASHBOARD VIEW */}
        {!isLoading && results && (
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            
            {/* Dashboard Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
              marginBottom: 40,
              borderBottom: '1px solid rgba(255,122,0,0.12)',
              paddingBottom: 24
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '2px',
                    color: '#92400E', textTransform: 'uppercase',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    AI Skill Assessment Workspace
                  </span>
                </div>
                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  color: '#111827',
                  letterSpacing: '-0.5px'
                }}>
                  AI Career <span style={{ color: ACCENT }}>Assessment Workspace</span>
                </h1>
                <p style={{
                  fontSize: 13,
                  color: '#6B7280',
                  fontWeight: 500,
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginTop: 4
                }}>
                  Personalized Job Fit, ATS Resume Intelligence, Skill Gaps, Roadmap, and Portfolio Recommendations
                </p>
              </div>

              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(255,122,0,0.25)',
                  color: ACCENT,
                  borderRadius: 12,
                  padding: '10px 18px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: '0 2px 8px rgba(255,122,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                🔄 New Assessment
              </motion.button>
            </div>

            {/* Top Row: Job Fit & ATS Resume Analysis */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 24 }}>
              <JobFitCard skills={skills} />
            </div>

            {/* Grid of core cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))',
              gap: 24,
              marginBottom: 24
            }}>
              <CareerOptionsCard data={results.careerPaths} />
              <SkillGapCard skillGaps={results.skillGaps} scores={results.scores} />
              <RoadmapCard data={results.roadmap} />
              <OpportunitiesCard data={results.opportunities} />
              <TrendingSkillsCard data={results.trendingSkills} />
              <ResumeIntelCard data={results.resumeIntelligence} />
              <PlacementReadinessCard data={results.placementReadiness} />
              <CertificationCard data={results.certifications} />
              <MentorChat profileContext={results} />
            </div>

            {/* Bottom Row: Project Recommendations & Prioritized Skills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
              <ProjectRecommendationsCard />
              <PrioritizedSkillsCard />
            </div>
          </div>
        )}

      </div>

      <CareerChatbot profileContext={results} />
    </div>
  )
}
