import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import api from '../api/axios'
import { JOB_CATEGORIES, JOBS_LIST } from '../api/jobsData'

export default function JobsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  // Tab: 'all' | 'saved' | 'applications'
  const [activeTab, setActiveTab] = useState('all')

  // Backend & Fallback Jobs
  const [jobs, setJobs] = useState(JOBS_LIST)
  const [loading, setLoading] = useState(false)
  const [savedJobIds, setSavedJobIds] = useState(new Set())
  const [savedJobsList, setSavedJobsList] = useState([])
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)

  // 7-Dimension Filters
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [expFilter, setExpFilter] = useState('ALL')
  const [batchFilter, setBatchFilter] = useState('ALL')
  const [branchFilter, setBranchFilter] = useState('ALL')
  const [modeFilter, setModeFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('DEFAULT')

  // Apply Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState(null)
  const [applyForm, setApplyForm] = useState({
    studentName: user?.name || '',
    studentEmail: user?.email || '',
    resumeUrl: '',
    coverNote: '',
  })
  const [submittingApply, setSubmittingApply] = useState(false)

  // Initial Fetch & Sync
  useEffect(() => {
    fetchBackendJobs()
    fetchSavedJobs()
    fetchUserApplications()
  }, [])

  // Sync user profile when user logs in or changes
  useEffect(() => {
    if (user) {
      setApplyForm(prev => ({
        ...prev,
        studentName: prev.studentName || user.name || '',
        studentEmail: prev.studentEmail || user.email || '',
      }))
    }
  }, [user])

  const fetchBackendJobs = async () => {
    setLoading(true)
    try {
      const res = await api.get('/jobs?page=0&size=50')
      if (res.data && Array.isArray(res.data.content) && res.data.content.length > 0) {
        setJobs(res.data.content)
      } else {
        setJobs(JOBS_LIST)
      }
    } catch (err) {
      console.warn('Jobs API fallback to local data:', err)
      setJobs(JOBS_LIST)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedJobs = async () => {
    // Try local storage first for offline / guest resilience
    const localSaved = JSON.parse(localStorage.getItem('cc_saved_jobs') || '[]')
    setSavedJobIds(new Set(localSaved))

    const token = localStorage.getItem('cc_token')
    if (token && token !== 'mock_token_jwt') {
      try {
        const [idsRes, listRes] = await Promise.all([
          api.get('/jobs/saved/ids'),
          api.get('/jobs/saved')
        ])
        if (Array.isArray(idsRes.data)) {
          setSavedJobIds(new Set(idsRes.data))
          localStorage.setItem('cc_saved_jobs', JSON.stringify(idsRes.data))
        }
        if (Array.isArray(listRes.data)) {
          setSavedJobsList(listRes.data)
        }
      } catch (err) {
        console.warn('Could not fetch remote saved jobs:', err)
      }
    }
  }

  const fetchUserApplications = async () => {
    // Check local applications cache
    const localApps = JSON.parse(localStorage.getItem('cc_user_applications') || '[]')
    setApplications(localApps)

    const token = localStorage.getItem('cc_token')
    if (token && token !== 'mock_token_jwt') {
      setLoadingApps(true)
      try {
        const res = await api.get('/jobs/applications')
        if (Array.isArray(res.data)) {
          setApplications(res.data)
          localStorage.setItem('cc_user_applications', JSON.stringify(res.data))
        }
      } catch (err) {
        console.warn('Could not fetch user applications:', err)
      } finally {
        setLoadingApps(false)
      }
    }
  }

  const handleToggleSave = async (e, job) => {
    e.stopPropagation()
    const isCurrentlySaved = savedJobIds.has(job.id)
    const newSaved = new Set(savedJobIds)

    if (isCurrentlySaved) {
      newSaved.delete(job.id)
      toast.info(`Removed "${job.title}" from saved jobs`)
    } else {
      newSaved.add(job.id)
      toast.success(`Saved "${job.title}" to bookmarks! ⭐`)
    }

    setSavedJobIds(newSaved)
    localStorage.setItem('cc_saved_jobs', JSON.stringify(Array.from(newSaved)))

    // Also update saved jobs list for saved tab
    if (isCurrentlySaved) {
      setSavedJobsList(prev => prev.filter(j => j.id !== job.id))
    } else {
      setSavedJobsList(prev => [job, ...prev.filter(j => j.id !== job.id)])
    }

    const token = localStorage.getItem('cc_token')
    if (token && token !== 'mock_token_jwt') {
      try {
        await api.post(`/jobs/${job.id}/save`)
      } catch (err) {
        console.warn('Failed to sync saved job to server:', err)
      }
    }
  }

  const handleOpenApplyModal = (e, job) => {
    e.stopPropagation()
    setSelectedJobForApply(job)
  }

  const handleSubmitApplication = async (e) => {
    e.preventDefault()
    if (!selectedJobForApply) return

    if (!applyForm.studentName.trim() || !applyForm.studentEmail.trim()) {
      toast.error('Please provide your name and email')
      return
    }

    setSubmittingApply(true)
    const newApplicationItem = {
      id: Date.now(),
      jobId: selectedJobForApply.id,
      jobTitle: selectedJobForApply.title,
      company: selectedJobForApply.company,
      logo: selectedJobForApply.logo,
      color: selectedJobForApply.color,
      bgColor: selectedJobForApply.bgColor,
      location: selectedJobForApply.location,
      workMode: selectedJobForApply.workMode,
      type: selectedJobForApply.type,
      salary: selectedJobForApply.salary,
      status: 'APPLIED',
      appliedAt: new Date().toISOString(),
      coverNote: applyForm.coverNote,
      resumeUrl: applyForm.resumeUrl,
    }

    try {
      const token = localStorage.getItem('cc_token')
      if (token && token !== 'mock_token_jwt') {
        const res = await api.post(`/jobs/${selectedJobForApply.id}/apply`, {
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
      const existing = applications.filter(a => a.jobId !== selectedJobForApply.id)
      const updatedList = [newApplicationItem, ...existing]
      setApplications(updatedList)
      localStorage.setItem('cc_user_applications', JSON.stringify(updatedList))

      toast.success(`Application sent to ${selectedJobForApply.company}! 🚀`)
      setSelectedJobForApply(null)
      // Switch tab to applications so student can see it live
      setActiveTab('applications')
    } catch (err) {
      console.warn('API apply submission error, saving locally:', err)
      const existing = applications.filter(a => a.jobId !== selectedJobForApply.id)
      const updatedList = [newApplicationItem, ...existing]
      setApplications(updatedList)
      localStorage.setItem('cc_user_applications', JSON.stringify(updatedList))

      toast.success(`Application recorded for ${selectedJobForApply.company}! 🚀`)
      setSelectedJobForApply(null)
      setActiveTab('applications')
    } finally {
      setSubmittingApply(false)
    }
  }

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (search.trim()) count++
    if (activeCategory !== 'ALL') count++
    if (typeFilter !== 'ALL') count++
    if (expFilter !== 'ALL') count++
    if (batchFilter !== 'ALL') count++
    if (branchFilter !== 'ALL') count++
    if (modeFilter !== 'ALL') count++
    return count
  }, [search, activeCategory, typeFilter, expFilter, batchFilter, branchFilter, modeFilter])

  // Filter & Search Logic
  const filteredJobs = useMemo(() => {
    const listToFilter = activeTab === 'saved'
      ? jobs.filter(j => savedJobIds.has(j.id))
      : jobs

    return listToFilter.filter(job => {
      // Category match
      if (activeCategory !== 'ALL' && job.category !== activeCategory) {
        if (activeCategory === 'INTERNSHIP' && job.type !== 'Internship') return false
        if (activeCategory === 'FRESHER' && job.experience !== 'Fresher') return false
        if (activeCategory !== 'INTERNSHIP' && activeCategory !== 'FRESHER') return false
      }

      // Search match
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchTitle = (job.title || '').toLowerCase().includes(q)
        const matchCompany = (job.company || '').toLowerCase().includes(q)
        const matchDesc = (job.shortDesc || job.description || '').toLowerCase().includes(q)
        const matchSkills = (job.skills || []).some(s => s.toLowerCase().includes(q))
        const matchLocation = (job.location || '').toLowerCase().includes(q)
        if (!matchTitle && !matchCompany && !matchDesc && !matchSkills && !matchLocation) {
          return false
        }
      }

      // Type
      if (typeFilter !== 'ALL' && job.type !== typeFilter) return false

      // Exp
      if (expFilter !== 'ALL' && job.experience !== expFilter) return false

      // Batch
      if (batchFilter !== 'ALL' && job.batch !== batchFilter) return false

      // Branch
      if (branchFilter !== 'ALL' && !(job.branch || []).includes(branchFilter) && !(job.branch || []).includes('All B.Tech Branches')) {
        return false
      }

      // Mode
      if (modeFilter !== 'ALL' && job.workMode !== modeFilter) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') return (b.id || '').localeCompare(a.id || '')
      if (sortBy === 'SALARY') {
        const parseNum = s => {
          const m = (s || '').match(/\d+/)
          return m ? parseInt(m[0], 10) : 0
        }
        return parseNum(b.salary) - parseNum(a.salary)
      }
      return 0
    })
  }, [jobs, activeTab, savedJobIds, search, activeCategory, typeFilter, expFilter, batchFilter, branchFilter, modeFilter, sortBy])

  const resetFilters = () => {
    setSearch('')
    setActiveCategory('ALL')
    setTypeFilter('ALL')
    setExpFilter('ALL')
    setBatchFilter('ALL')
    setBranchFilter('ALL')
    setModeFilter('ALL')
    setSortBy('DEFAULT')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF9F0', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />

      {/* Decorative Grid & Watermark */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(249, 115, 22, 0.04) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px', opacity: 0.85
      }} />

      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        overflow: 'hidden', opacity: 0.015,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignContent: 'space-around', padding: '5vh 5vw',
      }}>
        {['OPPORTUNITIES', 'CAREERS', 'INTERNSHIPS', 'ENGINEERING', 'HIRING 2027', 'MICROSOFT', 'GOOGLE', 'APPLY'].map((n, i) => (
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

      {/* Main Container */}
      <div style={{ position: 'relative', zIndex: 2, padding: '100px 24px 80px', maxWidth: 1240, margin: '0 auto' }}>
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: 'Jobs & Internships' }]} />

        {/* ════════ HERO SECTION ════════ */}
        <section style={{ marginBottom: 40 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 247, 237, 0.85))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            borderRadius: 24,
            padding: '36px 36px 32px',
            boxShadow: '0 16px 48px rgba(249, 115, 22, 0.07)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top Badge & Verified Recruiters Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                padding: '6px 14px', borderRadius: 100,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316', boxShadow: '0 0 8px #F97316' }} />
                <span style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: '2px',
                  color: '#C2410C', textTransform: 'uppercase',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  CAMPUS CONNECT OPPORTUNITY GATEWAY
                </span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '5px 12px', borderRadius: 100,
                fontSize: 12, color: '#065F46', fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                <span style={{ color: '#10B981', fontSize: 14 }}>✓</span>
                <span>50+ Verified Tech Partners Hiring</span>
              </div>
            </div>

            {/* Main Headline & Handwritten Accent */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'center' }}>
              <div>
                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
                  letterSpacing: '-0.035em', lineHeight: 1.1,
                  color: '#111827', marginBottom: 14,
                }}>
                  Launch Your Career With{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #EA580C, #F97316, #FBBF24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Campus Hiring Openings
                  </span>
                </h1>

                <p style={{
                  fontSize: 15, color: '#4B5563',
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6, maxWidth: 620, marginBottom: 18,
                }}>
                  Hand-curated software engineering, backend, full-stack, data, and ML opportunities tailored for
                  engineering students graduating in <strong>2025, 2026, & 2027</strong>.
                </p>

                {/* Handwritten Motivational Callout */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px dashed #F97316',
                  borderRadius: 14, padding: '8px 16px',
                  transform: 'rotate(-0.8deg)',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.08)',
                }}>
                  <span style={{ fontSize: 16 }}>✍</span>
                  <span style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: 'clamp(18px, 2.2vw, 22px)',
                    fontWeight: 700, color: '#C2410C',
                    letterSpacing: '0.4px',
                  }}>
                    Your Next Chapter Begins Here. Prepare well, apply boldly!
                  </span>
                </div>
              </div>

              {/* Career Gateway Illustration / Stats Card */}
              <div style={{
                position: 'relative',
                borderRadius: 20,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(251, 191, 36, 0.1))',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#9A3412', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Space Grotesk', sans-serif" }}>
                    Campus Placement Radar
                  </div>
                  <span style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 6,
                    background: '#FEF3C7', color: '#B45309', fontWeight: 800
                  }}>
                    AUTUMN 2026 CYCLE
                  </span>
                </div>

                {/* Stat pills row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 14, padding: '12px 16px',
                    border: '1px solid rgba(249, 115, 22, 0.12)',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#EA580C', fontFamily: "'Space Grotesk', sans-serif" }}>
                      8+ Roles
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>
                      Active Tech Openings
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 14, padding: '12px 16px',
                    border: '1px solid rgba(249, 115, 22, 0.12)',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#10B981', fontFamily: "'Space Grotesk', sans-serif" }}>
                      ₹45k - ₹30 LPA
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>
                      Stipend &amp; CTC Range
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, color: '#4B5563', fontWeight: 500,
                  background: 'rgba(255, 255, 255, 0.7)', padding: '8px 12px', borderRadius: 10,
                }}>
                  <span style={{ fontSize: 16 }}>🎯</span>
                  <span>Target Batches: <strong>2027, 2026, and 2025</strong> Graduates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ TAB CONTROLLER: ALL / SAVED / APPLICATIONS ════════ */}
        <section style={{ marginBottom: 28 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: '2px solid rgba(249, 115, 22, 0.15)',
            paddingBottom: 4, flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: '12px 12px 0 0',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                border: 'none',
                background: activeTab === 'all' ? '#F97316' : 'transparent',
                color: activeTab === 'all' ? '#FFFFFF' : '#4B5563',
                boxShadow: activeTab === 'all' ? '0 -2px 10px rgba(249, 115, 22, 0.15)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span>💼 All Opportunities</span>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 100,
                background: activeTab === 'all' ? 'rgba(255,255,255,0.3)' : 'rgba(249, 115, 22, 0.15)',
                color: activeTab === 'all' ? '#fff' : '#C2410C',
                fontWeight: 800,
              }}>
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: '12px 12px 0 0',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                border: 'none',
                background: activeTab === 'saved' ? '#F97316' : 'transparent',
                color: activeTab === 'saved' ? '#FFFFFF' : '#4B5563',
                boxShadow: activeTab === 'saved' ? '0 -2px 10px rgba(249, 115, 22, 0.15)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span>⭐ Saved Jobs</span>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 100,
                background: activeTab === 'saved' ? 'rgba(255,255,255,0.3)' : 'rgba(249, 115, 22, 0.15)',
                color: activeTab === 'saved' ? '#fff' : '#C2410C',
                fontWeight: 800,
              }}>
                {savedJobIds.size}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: '12px 12px 0 0',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                border: 'none',
                background: activeTab === 'applications' ? '#F97316' : 'transparent',
                color: activeTab === 'applications' ? '#FFFFFF' : '#4B5563',
                boxShadow: activeTab === 'applications' ? '0 -2px 10px rgba(249, 115, 22, 0.15)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span>📄 My Applications</span>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 100,
                background: activeTab === 'applications' ? 'rgba(255,255,255,0.3)' : 'rgba(249, 115, 22, 0.15)',
                color: activeTab === 'applications' ? '#fff' : '#C2410C',
                fontWeight: 800,
              }}>
                {applications.length}
              </span>
            </button>
          </div>
        </section>

        {/* If on Applications Tab, show application tracker list */}
        {activeTab === 'applications' ? (
          <section style={{ marginBottom: 50 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: '#111827' }}>
                  Track Your Job Applications
                </h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                  Real-time status updates for listings you applied to through Campus Connect.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  background: 'rgba(249, 115, 22, 0.1)', color: '#EA580C',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  borderRadius: 10, padding: '8px 16px', cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13,
                }}
              >
                + Browse More Jobs
              </button>
            </div>

            {applications.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                background: 'rgba(255,255,255,0.85)',
                borderRadius: 20, border: '1px solid rgba(249, 115, 22, 0.15)'
              }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📬</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                  No Applications Submitted Yet
                </h3>
                <p style={{ fontSize: 13.5, color: '#6B7280', maxWidth: 440, margin: '0 auto 20px' }}>
                  Discover active campus openings across top tech brands, then use Quick Apply to submit your profile directly.
                </p>
                <button
                  onClick={() => setActiveTab('all')}
                  style={{
                    background: '#F97316', color: '#fff', border: 'none',
                    borderRadius: 12, padding: '10px 22px', cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13,
                  }}
                >
                  Explore Opportunities Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {applications.map(app => {
                  const statusColors = {
                    APPLIED: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'Applied' },
                    SCREENING: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'In Screening' },
                    INTERVIEW: { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF', label: 'Interview Round' },
                    OFFER: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', label: 'Offer Received 🎉' },
                  }
                  const badge = statusColors[app.status] || statusColors.APPLIED

                  return (
                    <motion.div
                      key={app.id || app.jobId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(249, 115, 22, 0.15)',
                        borderRadius: 16, padding: '20px 24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 20, flexWrap: 'wrap',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 12,
                          background: app.bgColor || '#F3F4F6',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}>
                          {app.logo || '💼'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#4B5563', fontFamily: "'Space Grotesk', sans-serif" }}>
                              {app.company}
                            </span>
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>•</span>
                            <span style={{ fontSize: 11, color: '#6B7280' }}>
                              Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                            </span>
                          </div>
                          <h4 style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 16, fontWeight: 800, color: '#111827', margin: 0
                          }}>
                            {app.jobTitle || 'Software Role'}
                          </h4>
                          <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 11, color: '#6B7280' }}>
                            <span>📍 {app.location || 'Pan-India'}</span>
                            <span>•</span>
                            <span>Mode: {app.workMode || 'Hybrid'}</span>
                            {app.salary && (
                              <>
                                <span>•</span>
                                <span style={{ fontWeight: 700, color: '#EA580C' }}>{app.salary}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{
                          padding: '6px 14px', borderRadius: 100,
                          background: badge.bg, color: badge.text,
                          border: `1px solid ${badge.border}`,
                          fontSize: 12, fontWeight: 800,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}>
                          {badge.label}
                        </span>

                        <button
                          onClick={() => navigate(`/jobs/${app.jobId}`)}
                          style={{
                            background: 'rgba(249, 115, 22, 0.08)',
                            border: '1px solid rgba(249, 115, 22, 0.2)',
                            color: '#EA580C', borderRadius: 10,
                            padding: '8px 14px', cursor: 'pointer',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 12, fontWeight: 700,
                          }}
                        >
                          View Job Details →
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </section>
        ) : null}

        {/* ════════ FILTERS & SEARCH (For All and Saved Tabs) ════════ */}
        {activeTab !== 'applications' && (
          <>
            <section style={{ marginBottom: 32 }}>
              {/* Search Bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(249, 115, 22, 0.25)',
                borderRadius: 16, padding: '12px 20px',
                marginBottom: 16,
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.06)',
              }}>
                <span style={{ fontSize: 18, opacity: 0.7 }}>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by role title, company, skills (e.g. React, Java, Microsoft, Python)..."
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: '#111827', fontSize: 14.5,
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      background: 'none', border: 'none', color: '#9CA3AF',
                      cursor: 'pointer', fontSize: 13, fontWeight: 700
                    }}
                  >
                    ✕ Clear
                  </button>
                )}
              </div>

              {/* Category Pills Slider */}
              <div style={{
                display: 'flex', gap: 8, overflowX: 'auto',
                paddingBottom: 10, marginBottom: 16,
                scrollbarWidth: 'none',
              }}>
                {JOB_CATEGORIES.map(cat => {
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 12,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 12.5, fontWeight: 700,
                        background: isActive ? '#F97316' : 'rgba(255, 255, 255, 0.85)',
                        color: isActive ? '#FFFFFF' : '#374151',
                        border: `1px solid ${isActive ? '#F97316' : 'rgba(249, 115, 22, 0.2)'}`,
                        boxShadow: isActive ? '0 4px 14px rgba(249, 115, 22, 0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* 6-Dimension Filter Controls Dropdown Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(249, 115, 22, 0.15)',
                borderRadius: 16, padding: '14px 18px',
              }}>
                {/* Job Type */}
                <div>
                  <label style={filterLabelStyle}>Job Type</label>
                  <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="ALL">All Types</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label style={filterLabelStyle}>Experience</label>
                  <select
                    value={expFilter}
                    onChange={e => setExpFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="ALL">All Levels</option>
                    <option value="Fresher">Fresher (Campus)</option>
                    <option value="0-1 years">0-1 Years</option>
                    <option value="1-2 years">1-2 Years</option>
                  </select>
                </div>

                {/* Batch */}
                <div>
                  <label style={filterLabelStyle}>Target Batch</label>
                  <select
                    value={batchFilter}
                    onChange={e => setBatchFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="ALL">All Batches</option>
                    <option value="2027">2027 Graduating</option>
                    <option value="2026">2026 Graduating</option>
                    <option value="2025">2025 Graduated</option>
                  </select>
                </div>

                {/* Branch */}
                <div>
                  <label style={filterLabelStyle}>Branch</label>
                  <select
                    value={branchFilter}
                    onChange={e => setBranchFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="ALL">All Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="Data Science">Data Science / AI</option>
                  </select>
                </div>

                {/* Work Mode */}
                <div>
                  <label style={filterLabelStyle}>Work Mode</label>
                  <select
                    value={modeFilter}
                    onChange={e => setModeFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="ALL">All Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label style={filterLabelStyle}>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="DEFAULT">Recommended</option>
                    <option value="NEWEST">Recently Added</option>
                    <option value="SALARY">Highest Package</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Pill Bar & Reset button */}
              {activeFiltersCount > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginTop: 12, padding: '0 4px', flexWrap: 'wrap', gap: 8
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#C2410C', fontWeight: 600 }}>
                    <span>⚡ {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''} applied</span>
                  </div>
                  <button
                    onClick={resetFilters}
                    style={{
                      background: 'none', border: 'none', color: '#F97316',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </section>

            {/* ════════ OPPORTUNITIES LIST / GRID ════════ */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{
                  fontSize: 14, color: '#4B5563', fontWeight: 600,
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  Showing <strong style={{ color: '#111827' }}>{filteredJobs.length}</strong>{' '}
                  {activeTab === 'saved' ? 'saved job bookmarks' : 'campus opportunities'}
                </div>

                {activeTab === 'saved' && (
                  <button
                    onClick={() => setActiveTab('all')}
                    style={{
                      background: 'none', border: 'none', color: '#EA580C',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    ← Browse all jobs
                  </button>
                )}
              </div>

              {/* Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: 24,
              }}>
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job, idx) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      idx={idx}
                      isSaved={savedJobIds.has(job.id)}
                      onToggleSave={(e) => handleToggleSave(e, job)}
                      onQuickApply={(e) => handleOpenApplyModal(e, job)}
                      onClickDetails={() => navigate(`/jobs/${job.id}`)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {filteredJobs.length === 0 && (
                <div style={{
                  textAlign: 'center', padding: '64px 24px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  borderRadius: 24, border: '1px solid rgba(249, 115, 22, 0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.03)',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>
                    {activeTab === 'saved' ? '⭐' : '🔍'}
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
                    {activeTab === 'saved' ? 'No Saved Jobs Yet' : 'No Opportunities Found'}
                  </h3>
                  <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 460, margin: '0 auto 20px' }}>
                    {activeTab === 'saved'
                      ? 'You haven\'t bookmarked any jobs yet. Click the heart icon on any job card to save it for quick review.'
                      : 'No roles match the selected filter combination. Try resetting filters or searching with broader keywords.'}
                  </p>
                  <button
                    onClick={activeTab === 'saved' ? () => setActiveTab('all') : resetFilters}
                    style={{
                      background: '#F97316', color: '#fff', border: 'none',
                      borderRadius: 12, padding: '10px 24px', cursor: 'pointer',
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13,
                      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
                    }}
                  >
                    {activeTab === 'saved' ? 'Explore Opportunities' : 'Reset All Filters'}
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* ════════ QUICK APPLY MODAL ════════ */}
      <AnimatePresence>
        {selectedJobForApply && (
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
              transition={{ duration: 0.22 }}
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                width: '100%', maxWidth: 560,
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                overflow: 'hidden',
              }}
            >
              {/* Modal Top Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                borderBottom: '1px solid rgba(249, 115, 22, 0.15)',
                padding: '24px 28px 20px',
                position: 'relative',
              }}>
                <button
                  onClick={() => setSelectedJobForApply(null)}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'none', border: 'none', fontSize: 20,
                    color: '#6B7280', cursor: 'pointer',
                  }}
                >
                  ✕
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: selectedJobForApply.bgColor || '#FEE2E2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    {selectedJobForApply.logo}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#C2410C', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {selectedJobForApply.company}
                    </div>
                    <h3 style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 18, fontWeight: 800, color: '#111827', margin: 0
                    }}>
                      {selectedJobForApply.title}
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#FFFFFF', color: '#EA580C', fontWeight: 700 }}>
                    {selectedJobForApply.salary}
                  </span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#FFFFFF', color: '#4B5563', fontWeight: 600 }}>
                    📍 {selectedJobForApply.location}
                  </span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#FFFFFF', color: '#047857', fontWeight: 700 }}>
                    {selectedJobForApply.workMode}
                  </span>
                </div>
              </div>

              {/* Form Body */}
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
                      placeholder="e.g. vinay@campusconnect.com"
                      style={modalInputStyle}
                    />
                  </div>

                  <div>
                    <label style={modalLabelStyle}>Resume Link (Google Drive / GitHub / LinkedIn)</label>
                    <input
                      type="url"
                      value={applyForm.resumeUrl}
                      onChange={e => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/... or GitHub link"
                      style={modalInputStyle}
                    />
                    <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block', marginTop: 4 }}>
                      Make sure your Drive share link permission is set to "Anyone with the link can view".
                    </span>
                  </div>

                  <div>
                    <label style={modalLabelStyle}>Why are you a strong match? (Cover Note)</label>
                    <textarea
                      rows={3}
                      value={applyForm.coverNote}
                      onChange={e => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                      placeholder="Mention your key projects, CGPA, graduation batch (2027/2026), and relevant skills..."
                      style={{ ...modalInputStyle, resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
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
                      opacity: submittingApply ? 0.7 : 1,
                    }}
                  >
                    {submittingApply ? 'Submitting Application...' : 'Confirm & Submit Application 🚀'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Campus AI Assistant */}
      <AIAssistant
        contextTitle="Jobs & Internships Portal"
        contextPrompts={[
          'How do I tailor my resume for Microsoft SDE?',
          'What are the best interview tips for Razorpay Java intern?',
          'What skills are needed for 2027 batch tech hiring?',
          'How to crack TCS Digital NQT test?'
        ]}
      />
    </div>
  )
}

/* ─── JOB CARD COMPONENT ───────────────────────────────────────── */

function JobCard({ job, idx, isSaved, onToggleSave, onQuickApply, onClickDetails }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClickDetails}
      style={{
        background: hovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.16)'}`,
        borderTop: `4px solid ${job.color || '#F97316'}`,
        borderRadius: 20,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered
          ? `0 20px 40px rgba(249, 115, 22, 0.12), 0 2px 8px rgba(0,0,0,0.04)`
          : '0 4px 18px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Top Bar: Logo + Company info + Save button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: job.bgColor || '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {job.logo || '💼'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontSize: 13.5, fontWeight: 700, color: '#374151',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                {job.company}
              </span>
              {job.verified && (
                <span title="Verified Recruiter" style={{ fontSize: 13, color: '#10B981' }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: '#6B7280', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>📍 {job.location}</span>
            </div>
          </div>
        </div>

        {/* Save / Bookmark Button */}
        <button
          onClick={onToggleSave}
          title={isSaved ? 'Remove from saved' : 'Save opportunity'}
          style={{
            background: isSaved ? '#FEF2F2' : 'rgba(0,0,0,0.03)',
            border: `1px solid ${isSaved ? '#FCA5A5' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 10, width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16,
            color: isSaved ? '#EF4444' : '#9CA3AF',
            transition: 'all 0.2s',
          }}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Salary & Type Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 100,
          background: job.bgColor || '#FFF7ED',
          color: job.color || '#C2410C',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {job.salary}
        </span>

        <span style={{
          fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
          background: job.workMode === 'Remote' ? '#ECFDF5' : (job.workMode === 'Hybrid' ? '#EFF6FF' : '#F3F4F6'),
          color: job.workMode === 'Remote' ? '#047857' : (job.workMode === 'Hybrid' ? '#1D4ED8' : '#374151'),
        }}>
          {job.workMode}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800, fontSize: 17, color: '#111827',
        marginBottom: 8, lineHeight: 1.3, letterSpacing: '-0.2px',
      }}>
        {job.title}
      </h3>

      {/* Short Description */}
      <p style={{
        fontSize: 12.5, color: '#4B5563', lineHeight: 1.6,
        marginBottom: 16, display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', flex: 1,
      }}>
        {job.shortDesc || job.description}
      </p>

      {/* Meta Pills (Batch, Type, Experience) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        <span style={{
          fontSize: 10.5, padding: '3px 8px', borderRadius: 6,
          background: 'rgba(249, 115, 22, 0.08)', color: '#C2410C', fontWeight: 700
        }}>
          🎓 {job.batch} Batch
        </span>
        <span style={{
          fontSize: 10.5, padding: '3px 8px', borderRadius: 6,
          background: 'rgba(99, 102, 241, 0.08)', color: '#4F46E5', fontWeight: 700
        }}>
          {job.type}
        </span>
        <span style={{
          fontSize: 10.5, padding: '3px 8px', borderRadius: 6,
          background: 'rgba(107, 114, 128, 0.08)', color: '#4B5563', fontWeight: 600
        }}>
          {job.experience}
        </span>
      </div>

      {/* Skills Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
        {(job.skills || []).slice(0, 4).map(skill => (
          <span key={skill} style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 6,
            background: 'rgba(17, 24, 39, 0.04)', color: '#374151',
            fontWeight: 600, border: '1px solid rgba(0,0,0,0.04)',
          }}>
            {skill}
          </span>
        ))}
        {(job.skills || []).length > 4 && (
          <span style={{ fontSize: 10, padding: '2px 5px', color: '#9CA3AF', fontWeight: 600 }}>
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.06)',
        marginTop: 'auto',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onClickDetails(); }}
          style={{
            flex: 1, padding: '9px 12px', borderRadius: 10,
            background: 'rgba(249, 115, 22, 0.08)',
            border: '1px solid rgba(249, 115, 22, 0.22)',
            color: '#EA580C', fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 12, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          View Details
        </button>

        <button
          onClick={onQuickApply}
          style={{
            flex: 1, padding: '9px 12px', borderRadius: 10,
            background: 'linear-gradient(135deg, #EA580C, #F97316)',
            border: 'none', color: '#FFFFFF',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 12, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.25)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <span>Quick Apply</span>
          <span style={{ fontSize: 13 }}>🚀</span>
        </button>
      </div>
    </motion.div>
  )
}

/* ─── STYLES ───────────────────────────────────────────────────── */

const filterLabelStyle = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: '#6B7280',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  marginBottom: 4,
  fontFamily: "'Space Grotesk', sans-serif",
}

const selectStyle = {
  width: '100%',
  padding: '7px 10px',
  background: '#FFFFFF',
  border: '1px solid rgba(249, 115, 22, 0.2)',
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 600,
  color: '#111827',
  outline: 'none',
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
