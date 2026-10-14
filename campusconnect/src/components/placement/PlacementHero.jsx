import React from 'react'
import { BookOpen, Code, BarChart3, Award, Sparkles, Target } from 'lucide-react'

export default function PlacementHero({
  courseCount = '50+',
  problemCount = '1000+',
  syllabusBadge = 'Industry',
  certificateBadge = 'Completion',
}) {
  return (
    <section
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #E6F7EF 0%, #EDFAF2 45%, #F8FAF7 100%)',
        border: '1px solid rgba(16, 185, 129, 0.22)',
        borderRadius: '26px',
        padding: 'clamp(24px, 3.5vw, 36px) clamp(20px, 3.5vw, 40px)',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.05)',
        marginBottom: '26px',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Soft Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '20%',
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '28px',
        }}
      >
        {/* Left Column: Headline, Description & Stat Cards */}
        <div style={{ flex: '1 1 520px', minWidth: '300px', zIndex: 1 }}>
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: '#ECFDF5',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#059669',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '14px',
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            }}
          >
            <Target size={13} style={{ color: '#059669' }} />
            <span>PLACEMENT PREPARATION</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: 'clamp(26px, 3.2vw, 38px)',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              margin: '0 0 12px 0',
            }}
          >
            Your Dream Placement<br />
            <span style={{ color: '#059669' }}>
              Starts With the Right Learning.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '14.5px',
              color: '#475569',
              lineHeight: 1.55,
              maxWidth: '520px',
              margin: '0 0 24px 0',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Structured courses, hands-on practice, mock tests and certifications to make you industry ready.
          </p>

          {/* 4 Compact Stat Cards in a row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
              gap: '10px',
              maxWidth: '560px',
            }}
          >
            {/* Stat 1: Expert Courses */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BookOpen size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {courseCount}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.2 }}>
                  Expert Courses
                </div>
              </div>
            </div>

            {/* Stat 2: Practice Problems */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Code size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {problemCount}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.2 }}>
                  Practice Problems
                </div>
              </div>
            </div>

            {/* Stat 3: Industry Aligned */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BarChart3 size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {syllabusBadge}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.2 }}>
                  Aligned Syllabus
                </div>
              </div>
            </div>

            {/* Stat 4: Certificates */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {certificateBadge}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.2 }}>
                  Certificates
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Illustration & Handwritten Quote */}
        <div
          style={{
            flex: '0 1 360px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          {/* Handwritten Quote in Caveat font */}
          <div
            style={{
              position: 'absolute',
              top: '-14px',
              right: '-8px',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              transform: 'rotate(2deg)',
            }}
          >
            <div
              style={{
                fontFamily: 'Caveat, cursive, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: '#047857',
                lineHeight: 1.1,
                textAlign: 'right',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            >
              Skills Today<br />
              <span style={{ color: '#059669' }}>Opportunities Tomorrow.</span>
            </div>
            {/* Curved Arrow vector */}
            <svg width="44" height="24" viewBox="0 0 44 24" fill="none" style={{ marginTop: '2px', marginRight: '10px' }}>
              <path
                d="M40 4C32 18 16 20 4 18M4 18L10 12M4 18L11 22"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 3D Student Illustration with Glow */}
          <div
            style={{
              position: 'relative',
              width: '280px',
              height: '210px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(16, 185, 129, 0.12)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            <img
              src="/assets/placement/hero_character.jpg"
              alt="CampusConnect Student Placement Learning & Career Growth"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
