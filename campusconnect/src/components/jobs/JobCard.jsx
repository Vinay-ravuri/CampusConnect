import React from 'react'
import { Bookmark, Clock, ArrowRight } from 'lucide-react'
import CompanyLogo from '../ui/CompanyLogo'

export default function JobCard({
  job,
  isSaved = false,
  onToggleSave,
  onApply,
  onClick,
}) {
  const {
    id,
    title,
    company,
    location = 'Bangalore, India',
    type = 'Full Time',
    skills = [],
    salary = '₹8–12 LPA',
    postedDate = '2 days ago',
  } = job

  const isInternship = (type || '').toLowerCase().includes('intern')

  return (
    <article
      onClick={() => onClick && onClick(job)}
      style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '18px',
        flexWrap: 'wrap',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
      }}
      className="cc-job-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.08)'
        e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.35)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)'
        e.currentTarget.style.borderColor = '#E2E8F0'
      }}
    >
      {/* ── Left & Center Content: Logo + Info + Tags ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 400px', minWidth: '280px' }}>
        {/* Company Logo Box */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
          }}
        >
          <CompanyLogo name={company} size={32} />
        </div>

        {/* Job Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: '16px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 4px 0',
              lineHeight: 1.25,
            }}
          >
            {title}
          </h3>

          {/* Subtitle Row: Company | Location | Type */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              color: '#64748B',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 700, color: '#334155' }}>{company}</span>
            <span>|</span>
            <span>{location}</span>
            <span>|</span>
            <span
              style={{
                fontWeight: 700,
                color: isInternship ? '#2563EB' : '#059669',
              }}
            >
              {type}
            </span>
          </div>

          {/* Skills / Tags Row */}
          {skills && skills.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {skills.slice(0, 4).map((skill, sIdx) => (
                <span
                  key={sIdx}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: '6px',
                    background: '#F1F5F9',
                    color: '#334155',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Column: Time/Bookmark + Salary/Apply CTA ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          minHeight: '68px',
          flexShrink: 0,
        }}
      >
        {/* Top Right: Posted Time + Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#059669',
            }}
          >
            <Clock size={12} />
            <span>{postedDate}</span>
          </div>

          <button
            type="button"
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave && onToggleSave(e, job)
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isSaved ? '#2563EB' : '#94A3B8',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
            onMouseLeave={(e) => {
              if (!isSaved) e.currentTarget.style.color = '#94A3B8'
            }}
          >
            <Bookmark size={16} style={{ fill: isSaved ? '#2563EB' : 'none' }} />
          </button>
        </div>

        {/* Bottom Right: Salary + Apply Now CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px' }}>
          {salary && (
            <div
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: '14.5px',
                fontWeight: 800,
                color: '#0F172A',
                whiteSpace: 'nowrap',
              }}
            >
              {salary}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onApply && onApply(e, job)
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: '#2563EB',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1D4ED8'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563EB'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <span>Apply Now</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}
