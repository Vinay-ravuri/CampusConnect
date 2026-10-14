import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  ArrowRight,
  Briefcase,
  User,
  GraduationCap,
  MapPin,
  FolderKanban,
  ChevronDown,
  X
} from 'lucide-react'

export const EXPERIENCE_OPTIONS = ['All Years', 'Fresher (0 Years)', '0-1 Years', '1-3 Years', '3+ Years']
export const ROLE_OPTIONS = ['All Roles', 'Software Engineer / SDE', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Science & AI', 'DevOps & Cloud']
export const EDUCATION_OPTIONS = ['All Degrees', 'Undergraduate (B.Tech / B.E)', 'Postgraduate (M.Tech / MCA)', 'Diploma']
export const LOCATION_OPTIONS = ['All Locations', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai', 'Delhi NCR', 'Remote']
export const JOB_TYPE_OPTIONS = ['All Types', 'Full-time', 'Internship', 'Part-time', 'Remote']

export default function JobsSearchFilters({
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  experience = 'All Years',
  onExperienceChange,
  role = 'All Roles',
  onRoleChange,
  education = 'Undergraduate (B.Tech / B.E)',
  onEducationChange,
  location = 'All Locations',
  onLocationChange,
  jobType = 'Full-time',
  onJobTypeChange,
  onResetFilters,
}) {
  const [openDropdown, setOpenDropdown] = useState(null) // 'exp' | 'role' | 'edu' | 'loc' | 'type' | null
  const containerRef = useRef(null)

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} style={{ marginBottom: '22px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* ── Search Input Container ── */}
        <div
          style={{
            flex: '1 1 340px',
            minWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            borderRadius: '9999px',
            border: '1px solid #E2E8F0',
            padding: '4px 6px 4px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        >
          <Search size={16} style={{ color: '#94A3B8', marginRight: '10px', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearchSubmit) {
                onSearchSubmit(searchQuery)
              }
            }}
            placeholder="Search by job title, company, skills (e.g. Software Engineer, Java, React...)"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '13px',
              color: '#0F172A',
              fontFamily: 'Inter, sans-serif',
            }}
          />

          <button
            type="button"
            onClick={() => onSearchSubmit && onSearchSubmit(searchQuery)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '7px 18px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1D4ED8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2563EB')}
          >
            <span>Search</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* ── 5 Filter Dropdowns in a Row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Filter 1: Experience */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'exp' ? null : 'exp')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: openDropdown === 'exp' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                padding: '7px 12px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                textAlign: 'left',
              }}
            >
              <Briefcase size={14} style={{ color: '#2563EB' }} />
              <div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>EXPERIENCE</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {experience.replace(/\(.*?\)/g, '').trim()}
                </div>
              </div>
              <ChevronDown size={13} style={{ color: '#94A3B8', marginLeft: '4px' }} />
            </button>

            {openDropdown === 'exp' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  minWidth: '170px',
                  overflow: 'hidden',
                  padding: '4px',
                }}
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onExperienceChange(opt)
                      setOpenDropdown(null)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 10px',
                      fontSize: '12px',
                      fontWeight: experience === opt ? 700 : 500,
                      background: experience === opt ? '#EFF6FF' : 'transparent',
                      color: experience === opt ? '#2563EB' : '#334155',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter 2: Role */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'role' ? null : 'role')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: openDropdown === 'role' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                padding: '7px 12px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                textAlign: 'left',
              }}
            >
              <User size={14} style={{ color: '#2563EB' }} />
              <div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>ROLE</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {role.split('/')[0].trim()}
                </div>
              </div>
              <ChevronDown size={13} style={{ color: '#94A3B8', marginLeft: '4px' }} />
            </button>

            {openDropdown === 'role' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  minWidth: '200px',
                  overflow: 'hidden',
                  padding: '4px',
                }}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onRoleChange(opt)
                      setOpenDropdown(null)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 10px',
                      fontSize: '12px',
                      fontWeight: role === opt ? 700 : 500,
                      background: role === opt ? '#EFF6FF' : 'transparent',
                      color: role === opt ? '#2563EB' : '#334155',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter 3: Education */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'edu' ? null : 'edu')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: openDropdown === 'edu' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                padding: '7px 12px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                textAlign: 'left',
              }}
            >
              <GraduationCap size={14} style={{ color: '#2563EB' }} />
              <div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>EDUCATION</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {education.split('(')[0].trim()}
                </div>
              </div>
              <ChevronDown size={13} style={{ color: '#94A3B8', marginLeft: '4px' }} />
            </button>

            {openDropdown === 'edu' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  minWidth: '210px',
                  overflow: 'hidden',
                  padding: '4px',
                }}
              >
                {EDUCATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onEducationChange(opt)
                      setOpenDropdown(null)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 10px',
                      fontSize: '12px',
                      fontWeight: education === opt ? 700 : 500,
                      background: education === opt ? '#EFF6FF' : 'transparent',
                      color: education === opt ? '#2563EB' : '#334155',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter 4: Location (Highlighted) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'loc' ? null : 'loc')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: location !== 'All Locations' ? '#FEF2F2' : '#FFFFFF',
                borderRadius: '12px',
                border: openDropdown === 'loc'
                  ? '1.5px solid #EF4444'
                  : location !== 'All Locations'
                  ? '1.5px solid #EF4444'
                  : '1.5px solid rgba(239, 68, 68, 0.45)',
                padding: '7px 12px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)',
                textAlign: 'left',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#EF4444'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.16)'
              }}
              onMouseLeave={(e) => {
                if (openDropdown !== 'loc') {
                  e.currentTarget.style.borderColor = location !== 'All Locations' ? '#EF4444' : 'rgba(239, 68, 68, 0.45)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.08)'
                }
              }}
            >
              <MapPin size={14} style={{ color: '#EF4444' }} />
              <div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#DC2626', letterSpacing: '0.04em' }}>LOCATION</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {location}
                </div>
              </div>
              <ChevronDown size={13} style={{ color: '#EF4444', marginLeft: '4px' }} />
            </button>

            {openDropdown === 'loc' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  minWidth: '160px',
                  overflow: 'hidden',
                  padding: '4px',
                }}
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onLocationChange(opt)
                      setOpenDropdown(null)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 10px',
                      fontSize: '12px',
                      fontWeight: location === opt ? 700 : 500,
                      background: location === opt ? '#EFF6FF' : 'transparent',
                      color: location === opt ? '#2563EB' : '#334155',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter 5: Job Type (Highlighted) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: jobType !== 'All Types' ? '#EFF6FF' : '#FFFFFF',
                borderRadius: '12px',
                border: openDropdown === 'type'
                  ? '1.5px solid #2563EB'
                  : jobType !== 'All Types'
                  ? '1.5px solid #2563EB'
                  : '1.5px solid rgba(37, 99, 235, 0.45)',
                padding: '7px 12px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)',
                textAlign: 'left',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563EB'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.16)'
              }}
              onMouseLeave={(e) => {
                if (openDropdown !== 'type') {
                  e.currentTarget.style.borderColor = jobType !== 'All Types' ? '#2563EB' : 'rgba(37, 99, 235, 0.45)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.08)'
                }
              }}
            >
              <FolderKanban size={14} style={{ color: '#2563EB' }} />
              <div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#2563EB', letterSpacing: '0.04em' }}>JOB TYPE</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                  {jobType}
                </div>
              </div>
              <ChevronDown size={13} style={{ color: '#2563EB', marginLeft: '4px' }} />
            </button>

            {openDropdown === 'type' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  zIndex: 50,
                  minWidth: '150px',
                  overflow: 'hidden',
                  padding: '4px',
                }}
              >
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onJobTypeChange(opt)
                      setOpenDropdown(null)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 10px',
                      fontSize: '12px',
                      fontWeight: jobType === opt ? 700 : 500,
                      background: jobType === opt ? '#EFF6FF' : 'transparent',
                      color: jobType === opt ? '#2563EB' : '#334155',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Filters button if any active */}
          {Boolean(
            searchQuery.trim() ||
            experience !== 'All Years' ||
            role !== 'All Roles' ||
            location !== 'All Locations' ||
            jobType !== 'All Types'
          ) && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              <X size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
