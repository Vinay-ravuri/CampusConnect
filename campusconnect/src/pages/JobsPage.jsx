import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  ChevronRight,
  Flame,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  Inbox,
  FilterX
} from 'lucide-react'

import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import api from '../api/axios'
import { JOBS_LIST } from '../api/jobsData'

// Modular Jobs Components
import JobsHero from '../components/jobs/JobsHero'
import JobsSearchFilters from '../components/jobs/JobsSearchFilters'
import JobsStats from '../components/jobs/JobsStats'
import BrowseSidebar from '../components/jobs/BrowseSidebar'
import JobCard from '../components/jobs/JobCard'
import HiringCompanies from '../components/jobs/HiringCompanies'
import CareerSuggestionCard from '../components/jobs/CareerSuggestionCard'
import JobDetailModal from '../components/jobs/JobDetailModal'
import JobApplyModal from '../components/jobs/JobApplyModal'
import CampusDrivesSection from '../components/jobs/CampusDrivesSection'
import TrendingRolesSection from '../components/jobs/TrendingRolesSection'
import PlacementPrepBanner from '../components/jobs/PlacementPrepBanner'

export default function JobsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  // Browse Selection in Left Sidebar
  const [browseType, setBrowseType] = useState('ALL')

  // Search & 5 Filter Dropdowns
  const [searchQuery, setSearchQuery] = useState('')
  const [experience, setExperience] = useState('All Years')
  const [role, setRole] = useState('All Roles')
  const [education, setEducation] = useState('Undergraduate (B.Tech / B.E)')
  const [location, setLocation] = useState('All Locations')
  const [jobType, setJobType] = useState('All Types')
  const [selectedCompany, setSelectedCompany] = useState('ALL')

  // Data & State
  const [jobs, setJobs] = useState(JOBS_LIST)
  const [loading, setLoading] = useState(false)
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saved_jobs')
      return saved ? new Set(JSON.parse(saved)) : new Set(['job-1', 'job-3'])
    } catch {
      return new Set(['job-1', 'job-3'])
    }
  })
  const [applications, setApplications] = useState(() => {
    try {
      const apps = localStorage.getItem('cc_user_applications')
      return apps ? JSON.parse(apps) : []
    } catch {
      return []
    }
  })

  // Modals State
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null)
  const [selectedJobForApply, setSelectedJobForApply] = useState(null)
  const [submittingApply, setSubmittingApply] = useState(false)

  // Fetch initial data from backend if available
  useEffect(() => {
    fetchBackendJobs()
    fetchSavedJobs()
    fetchUserApplications()
  }, [])

  const fetchBackendJobs = async () => {
    setLoading(true)
    try {
      const res = await api.get('/jobs?page=0&size=50')
      if (res.data && Array.isArray(res.data.content) && res.data.content.length > 0) {
        // Merge so target reference jobs (Amazon, Google, Microsoft) lead at the top,
        // followed by all backend jobs, deduplicated by id and title+company
        const targetIds = new Set(JOBS_LIST.map((j) => j.id))
        const backendFiltered = res.data.content.filter(
          (b) =>
            !targetIds.has(b.id) &&
            !JOBS_LIST.some(
              (j) =>
                j.company.toLowerCase() === (b.company || '').toLowerCase() &&
                j.title.toLowerCase() === (b.title || '').toLowerCase()
            )
        )
        setJobs([...JOBS_LIST, ...backendFiltered])
      } else {
        setJobs(JOBS_LIST)
      }
    } catch (err) {
      console.warn('Jobs API fallback to local curated data:', err)
      setJobs(JOBS_LIST)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedJobs = async () => {
    const token = localStorage.getItem('cc_token')
    if (token && token !== 'mock_token_jwt') {
      try {
        const idsRes = await api.get('/jobs/saved/ids')
        if (Array.isArray(idsRes.data)) {
          setSavedJobIds(new Set(idsRes.data))
          localStorage.setItem('cc_saved_jobs', JSON.stringify(idsRes.data))
        }
      } catch (err) {
        console.warn('Could not fetch saved jobs from server:', err)
      }
    }
  }

  const fetchUserApplications = async () => {
    const token = localStorage.getItem('cc_token')
    if (token && token !== 'mock_token_jwt') {
      try {
        const res = await api.get('/jobs/applications')
        if (Array.isArray(res.data) && res.data.length > 0) {
          setApplications(res.data)
          localStorage.setItem('cc_user_applications', JSON.stringify(res.data))
        }
      } catch (err) {
        console.warn('Could not fetch user applications:', err)
      }
    }
  }

  // Handle Save / Bookmark
  const handleToggleSave = async (e, job) => {
    if (e) e.stopPropagation()
    const isCurrentlySaved = savedJobIds.has(job.id)
    const newSaved = new Set(savedJobIds)

    if (isCurrentlySaved) {
      newSaved.delete(job.id)
      showToast(`Removed "${job.title}" from saved jobs`, 'info')
    } else {
      newSaved.add(job.id)
      showToast(`Saved "${job.title}" to bookmarks! ⭐`, 'success')
    }

    setSavedJobIds(newSaved)
    localStorage.setItem('cc_saved_jobs', JSON.stringify(Array.from(newSaved)))

    const token = localStorage.getItem('cc_token')
    if (token && token !== 'mock_token_jwt') {
      try {
        await api.post(`/jobs/${job.id}/save`)
      } catch (err) {
        console.warn('Failed to sync saved job to server:', err)
      }
    }
  }

  // Handle Application Submit
  const handleSubmitApplication = async (formData) => {
    if (!selectedJobForApply) return
    setSubmittingApply(true)

    const newApp = {
      id: Date.now(),
      jobId: selectedJobForApply.id,
      jobTitle: selectedJobForApply.title,
      company: selectedJobForApply.company,
      location: selectedJobForApply.location,
      salary: selectedJobForApply.salary,
      status: 'APPLIED',
      appliedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...formData,
    }

    try {
      const token = localStorage.getItem('cc_token')
      if (token && token !== 'mock_token_jwt') {
        await api.post(`/jobs/${selectedJobForApply.id}/apply`, formData)
      }
      const updated = [newApp, ...applications.filter((a) => a.jobId !== selectedJobForApply.id)]
      setApplications(updated)
      localStorage.setItem('cc_user_applications', JSON.stringify(updated))
      showToast(`Application successfully sent to ${selectedJobForApply.company}! 🚀`, 'success')
      setSelectedJobForApply(null)
      setBrowseType('APPLICATIONS')
    } catch (err) {
      console.warn('Application submit cached locally:', err)
      const updated = [newApp, ...applications.filter((a) => a.jobId !== selectedJobForApply.id)]
      setApplications(updated)
      localStorage.setItem('cc_user_applications', JSON.stringify(updated))
      showToast(`Application saved for ${selectedJobForApply.company}! 🚀`, 'success')
      setSelectedJobForApply(null)
      setBrowseType('APPLICATIONS')
    } finally {
      setSubmittingApply(false)
    }
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setExperience('All Years')
    setRole('All Roles')
    setEducation('Undergraduate (B.Tech / B.E)')
    setLocation('All Locations')
    setJobType('All Types')
    setSelectedCompany('ALL')
    setBrowseType('ALL')
  }

  // ── FILTERED JOBS COMPUTATION ──
  const filteredJobs = useMemo(() => {
    let list = jobs

    // Filter by Browse Sidebar selection
    if (browseType === 'SAVED') {
      list = list.filter((j) => savedJobIds.has(j.id))
    } else if (browseType === 'FULL_TIME') {
      list = list.filter((j) => (j.type || '').toLowerCase().includes('full'))
    } else if (browseType === 'INTERNSHIP') {
      list = list.filter((j) => (j.type || '').toLowerCase().includes('intern'))
    } else if (browseType === 'PART_TIME') {
      list = list.filter((j) => (j.type || '').toLowerCase().includes('part'))
    } else if (browseType === 'REMOTE') {
      list = list.filter((j) => (j.location || '').toLowerCase().includes('remote') || (j.workMode || '').toLowerCase().includes('remote'))
    } else if (browseType === 'ON_CAMPUS') {
      list = list.filter((j) => (j.title || '').toLowerCase().includes('campus') || (j.category || '').includes('ON_CAMPUS'))
    } else if (browseType === 'GOVT') {
      list = list.filter((j) => (j.company || '').toLowerCase().includes('isro') || (j.company || '').toLowerCase().includes('drdo') || (j.category || '').includes('GOVT'))
    }

    return list.filter((job) => {
      // Search Keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inTitle = (job.title || '').toLowerCase().includes(q)
        const inCompany = (job.company || '').toLowerCase().includes(q)
        const inLocation = (job.location || '').toLowerCase().includes(q)
        const inSkills = (job.skills || []).some((s) => s.toLowerCase().includes(q))
        if (!inTitle && !inCompany && !inLocation && !inSkills) return false
      }

      // Experience Filter
      if (experience !== 'All Years') {
        const expLower = experience.toLowerCase()
        const jExp = (job.experience || '').toLowerCase()
        if (expLower.includes('fresher') && !jExp.includes('fresher') && !jExp.includes('0')) return false
        if (expLower.includes('0-1') && !jExp.includes('0') && !jExp.includes('1')) return false
        if (expLower.includes('1-3') && !jExp.includes('1') && !jExp.includes('2') && !jExp.includes('3')) return false
      }

      // Role Filter
      if (role !== 'All Roles') {
        const t = (job.title || '').toLowerCase()
        if (role.includes('SDE') && !t.includes('software') && !t.includes('sde') && !t.includes('engineer')) return false
        if (role.includes('Frontend') && !t.includes('frontend') && !t.includes('ui') && !t.includes('web')) return false
        if (role.includes('Backend') && !t.includes('backend') && !t.includes('java') && !t.includes('python')) return false
        if (role.includes('Full Stack') && !t.includes('full stack') && !t.includes('fullstack') && !t.includes('developer')) return false
        if (role.includes('Data Science') && !t.includes('data') && !t.includes('ai') && !t.includes('ml')) return false
      }

      // Location Filter
      if (location !== 'All Locations') {
        const l = (job.location || '').toLowerCase()
        if (!l.includes(location.toLowerCase())) return false
      }

      // Job Type Filter
      if (jobType !== 'All Types') {
        const jt = (job.type || '').toLowerCase()
        if (!jt.includes(jobType.toLowerCase())) return false
      }

      // Company Filter (e.g. from Right Column Click)
      if (selectedCompany !== 'ALL') {
        if ((job.company || '').toLowerCase() !== selectedCompany.toLowerCase()) return false
      }

      return true
    })
  }, [jobs, browseType, savedJobIds, searchQuery, experience, role, location, jobType, selectedCompany])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#F8FAFC',
        color: '#0F172A',
        fontFamily: 'Inter, sans-serif',
        overflowX: 'clip',
      }}
    >
      {/* ── Soft Cobalt Blue Background Atmospheric Glows ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-12%',
          right: '-5%',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: '-10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Global CampusConnect Navbar ── */}
      <Navbar isDark={false} />

      {/* ── Main Content Container ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '92px clamp(14px, 2.5vw, 36px) 60px',
        }}
      >
        {/* ── Breadcrumb Navigation ── */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#64748B',
            marginBottom: '18px',
          }}
        >
          <Link
            to="/welcome"
            style={{
              color: '#475569',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Home
          </Link>
          <ChevronRight size={13} style={{ color: '#CBD5E1' }} />
          <span style={{ color: '#2563EB', fontWeight: 700 }}>Jobs &amp; Internships</span>
        </nav>

        {/* ── 1. HERO SECTION (Compact & Fully Interactive) ── */}
        <JobsHero
          onExploreClick={() => {
            const el = document.getElementById('jobs-feed-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          onSelectCategory={(catId) => {
            setBrowseType(catId)
            const el = document.getElementById('jobs-feed-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          onNavigateCareer={() => navigate('/career')}
        />

        {/* ── 2. SEARCH & 5 COMPACT FILTER DROPDOWNS ── */}
        <JobsSearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={(q) => console.log('Searching jobs:', q)}
          experience={experience}
          onExperienceChange={setExperience}
          role={role}
          onRoleChange={setRole}
          education={education}
          onEducationChange={setEducation}
          location={location}
          onLocationChange={setLocation}
          jobType={jobType}
          onJobTypeChange={setJobType}
          onResetFilters={handleResetFilters}
        />

        {/* ── 3. STATISTICS SECTION (4 Cards in a Row) ── */}
        <JobsStats
          activeOpenings="500+"
          hiringCompanies="120+"
          placedRate="85%"
          newDaily="New"
        />

        {/* ── 4. MAIN 3-COLUMN JOBS CONTENT AREA ── */}
        <div className="cc-jobs-layout">
          {/* ── LEFT COLUMN: Browse Opportunities Sidebar ── */}
          <BrowseSidebar
            activeItem={browseType}
            onSelectItem={(id) => {
              setBrowseType(id)
              if (id !== 'ALL' && selectedCompany !== 'ALL') setSelectedCompany('ALL')
            }}
            savedCount={savedJobIds.size}
            applicationsCount={applications.length}
          />

          {/* ── CENTER COLUMN: Latest Opportunities Listings ── */}
          <main id="jobs-feed-section" style={{ flex: 1, minWidth: 0 }}>
            {/* View Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🔥</span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {browseType === 'SAVED'
                      ? 'Saved Opportunities'
                      : browseType === 'APPLICATIONS'
                      ? 'My Applications'
                      : selectedCompany !== 'ALL'
                      ? `Opportunities at ${selectedCompany}`
                      : 'Latest Opportunities'}
                  </h2>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748B',
                    margin: '3px 0 0 0',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {browseType === 'APPLICATIONS'
                    ? 'Track real-time status of your submitted job applications.'
                    : 'Handpicked opportunities from top companies for you.'}
                </p>
              </div>

              {/* View All Jobs link */}
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                  transition: 'opacity 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span>View All Jobs</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Application History View */}
            {browseType === 'APPLICATIONS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                {applications.length === 0 ? (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px dashed #CBD5E1',
                      padding: '40px 24px',
                      textAlign: 'center',
                      color: '#64748B',
                    }}
                  >
                    <Inbox size={36} style={{ color: '#94A3B8', margin: '0 auto 10px auto' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>
                      No Applications Yet
                    </h3>
                    <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>
                      Explore open job and internship listings and submit your resume to start tracking.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBrowseType('ALL')}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#2563EB',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Browse Opportunities
                    </button>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px' }}>
                          Applied on {app.appliedAt}
                        </div>
                        <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                          {app.jobTitle}
                        </h4>
                        <div style={{ fontSize: '12.5px', color: '#475569' }}>
                          {app.company} • {app.location}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            background:
                              app.status === 'SELECTED'
                                ? '#ECFDF5'
                                : app.status === 'SHORTLISTED'
                                ? '#EFF6FF'
                                : '#FEF3C7',
                            color:
                              app.status === 'SELECTED'
                                ? '#059669'
                                : app.status === 'SHORTLISTED'
                                ? '#2563EB'
                                : '#D97706',
                          }}
                        >
                          {app.status || 'UNDER REVIEW'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Standard Opportunities Listings */}
            {browseType !== 'APPLICATIONS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                    Loading verified opportunities...
                  </div>
                )}

                {!loading && filteredJobs.length === 0 && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px dashed #CBD5E1',
                      padding: '48px 24px',
                      textAlign: 'center',
                      color: '#64748B',
                    }}
                  >
                    <FilterX size={36} style={{ color: '#94A3B8', margin: '0 auto 12px auto' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
                      No Opportunities Found
                    </h3>
                    <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>
                      Try adjusting your keywords, locations, or clear filters to see all available roles.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#2563EB',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {!loading &&
                  filteredJobs.map((job) => {
                    const isSaved = savedJobIds.has(job.id)

                    return (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={isSaved}
                        onToggleSave={(e) => handleToggleSave(e, job)}
                        onApply={(e) => {
                          e.stopPropagation()
                          setSelectedJobForApply(job)
                        }}
                        onClick={() => setSelectedJobForDetails(job)}
                      />
                    )
                  })}
              </div>
            )}
          </main>

          {/* ── RIGHT COLUMN: Top Hiring Companies & Career Suggestion (Sticky) ── */}
          <aside
            style={{
              width: '280px',
              flexShrink: 0,
              position: 'sticky',
              top: '90px',
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 105px)',
              overflowY: 'auto',
              zIndex: 10,
            }}
            className="cc-jobs-right-col cc-sticky-sidebar"
          >
            {/* Top Hiring Companies Grid */}
            <HiringCompanies
              onSelectCompany={(compName) => {
                setSelectedCompany(compName)
                setBrowseType('ALL')
              }}
              onViewAll={() => setSelectedCompany('ALL')}
            />

            {/* Career Suggestion Card */}
            <CareerSuggestionCard onGetSuggestions={() => navigate('/career')} />
          </aside>
        </div>

        {/* ── 5. FAST-TRACK CAMPUS HIRING DRIVES (2026 Batch) ── */}
        <CampusDrivesSection
          onApplyDrive={(drive) => {
            setSelectedJobForApply({
              id: drive.id,
              title: drive.title,
              company: drive.company,
              location: drive.mode,
              type: 'Campus Drive',
              salary: drive.stipend,
            })
          }}
        />

        {/* ── 6. TRENDING ROLES & SALARY INSIGHTS ── */}
        <TrendingRolesSection
          onSelectRole={(roleCategory) => {
            setRole(roleCategory)
            const el = document.getElementById('jobs-feed-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* ── 7. PLACEMENT PREPARATION ECOSYSTEM BRIDGE ── */}
        <PlacementPrepBanner />
      </div>

      {/* ── Contextual Campus AI Widget ── */}
      <AIAssistant
        context="JOBS_INTERNSHIPS"
        contextTitle="Jobs & Internships"
        subtitle="Your Career Companion"
        customPrompts={[
          'What are the best fresher software engineer jobs?',
          'Help me prepare a resume for Google internship',
          'What skills are most in demand for 2026 batch?',
          'How do I crack off-campus interviews at Amazon?',
          'Suggest entry-level remote developer roles',
        ]}
      />

      {/* ── Job Detail Modal ── */}
      <JobDetailModal
        job={selectedJobForDetails}
        isOpen={Boolean(selectedJobForDetails)}
        onClose={() => setSelectedJobForDetails(null)}
        isSaved={selectedJobForDetails ? savedJobIds.has(selectedJobForDetails.id) : false}
        onToggleSave={(e, j) => handleToggleSave(e, j)}
        onApply={(e, j) => {
          setSelectedJobForApply(j)
          setSelectedJobForDetails(null)
        }}
      />

      {/* ── Job Apply Modal ── */}
      <JobApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        initialUser={user}
        onSubmit={handleSubmitApplication}
        loading={submittingApply}
      />
    </div>
  )
}
