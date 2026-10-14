import React from 'react'
import { Monitor, Rocket, Laptop, Blocks, Target, ArrowRight } from 'lucide-react'

export const POPULAR_TRACKS = [
  {
    id: 'track-dsa',
    title: 'Complete DSA',
    description: 'From basics to advanced with 450+ problems',
    coursesCount: '12 Courses',
    certificatesCount: '3 Certificates',
    icon: Monitor,
    color: '#2563EB',
    bg: '#EFF6FF',
    accentBorder: '#BFDBFE',
    targetCategory: 'DSA',
    trackSlug: 'dsa',
  },
  {
    id: 'track-aptitude',
    title: 'Aptitude Mastery',
    description: 'Quant, Logical & Verbal Reasoning',
    coursesCount: '8 Courses',
    certificatesCount: '2 Certificates',
    icon: Rocket,
    color: '#E11D48',
    bg: '#FFF1F2',
    accentBorder: '#FECDD3',
    targetCategory: 'APTITUDE',
    trackSlug: 'aptitude',
  },
  {
    id: 'track-fullstack',
    title: 'Full Stack Development',
    description: 'Web + Backend + Projects',
    coursesCount: '10 Courses',
    certificatesCount: '3 Certificates',
    icon: Laptop,
    color: '#D97706',
    bg: '#FEF3C7',
    accentBorder: '#FDE68A',
    targetCategory: 'DEV',
    trackSlug: 'dev',
  },
  {
    id: 'track-systemdesign',
    title: 'System Design',
    description: 'Low to High Level Design',
    coursesCount: '6 Courses',
    certificatesCount: '1 Certificate',
    icon: Blocks,
    color: '#9333EA',
    bg: '#F3E8FF',
    accentBorder: '#E9D5FF',
    targetCategory: 'SYSTEM_DESIGN',
    trackSlug: 'oop',
  },
  {
    id: 'track-interview',
    title: 'Interview Preparation',
    description: 'Mock Tests, MCQ & System Design',
    coursesCount: '8 Courses',
    certificatesCount: '2 Certificates',
    icon: Target,
    color: '#059669',
    bg: '#ECFDF5',
    accentBorder: '#A7F3D0',
    targetCategory: 'INTERVIEW',
    trackSlug: 'interview-prep',
  },
]

export default function PopularTracks({ onSelectTrack, onViewAll }) {
  return (
    <section style={{ marginBottom: '32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
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
              Popular Learning Tracks
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
            Start with a structured path curated for placement success.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: '#059669',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#047857')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#059669')}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 5 Track Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
        }}
      >
        {POPULAR_TRACKS.map((track) => {
          const Icon = track.icon

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)'
                e.currentTarget.style.borderColor = track.accentBorder
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.02)'
                e.currentTarget.style.borderColor = '#E2E8F0'
              }}
            >
              <div>
                {/* Track Icon */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: track.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <Icon size={20} style={{ color: track.color }} />
                </div>

                {/* Track Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 4px 0',
                    lineHeight: 1.25,
                  }}
                >
                  {track.title}
                </h3>

                {/* Track Description */}
                <p
                  style={{
                    fontSize: '12px',
                    color: '#64748B',
                    lineHeight: 1.45,
                    margin: '0 0 14px 0',
                    minHeight: '34px',
                  }}
                >
                  {track.description}
                </p>
              </div>

              {/* Footer: Courses, Certificates & Arrow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid #F1F5F9',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: track.color,
                }}
              >
                <span>
                  {track.coursesCount} • {track.certificatesCount}
                </span>
                <ArrowRight size={13} style={{ color: track.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
