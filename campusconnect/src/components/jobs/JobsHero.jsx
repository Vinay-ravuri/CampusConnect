import React from 'react'
import {
  ShieldCheck,
  Building2,
  Users,
  Rocket,
  Briefcase,
  GraduationCap,
  BarChart3,
  ChevronRight
} from 'lucide-react'

export default function JobsHero({
  onExploreClick,
  onSelectCategory,
  onNavigateCareer,
}) {
  return (
    <section
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F9FF 45%, #FFFFFF 100%)',
        border: '1px solid rgba(37, 99, 235, 0.16)',
        borderRadius: '24px',
        padding: 'clamp(16px, 2.2vw, 22px) clamp(18px, 2.6vw, 32px)',
        boxShadow: '0 8px 28px rgba(37, 99, 235, 0.05)',
        marginBottom: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Background Soft Atmospheric Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-30px',
          right: '25%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          filter: 'blur(36px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── LEFT COLUMN: Text, Value Prop & 4 Benefits ── */}
        <div style={{ flex: '1 1 440px', minWidth: '280px' }}>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#2563EB',
              marginBottom: '8px',
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            }}
          >
            JOBS &amp; INTERNSHIPS
          </div>

          {/* Large Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: 'clamp(24px, 2.6vw, 34px)',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1.16,
              letterSpacing: '-0.02em',
              margin: '0 0 8px 0',
            }}
          >
            Your Future Career<br />
            <span style={{ color: '#2563EB' }}>
              is Just a Search Away.
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: '13.5px',
              color: '#475569',
              lineHeight: 1.5,
              maxWidth: '480px',
              margin: '0 0 16px 0',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Explore verified job and internship opportunities from top companies, curated specially for engineering students.
          </p>

          {/* 4 Compact Benefits in a row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
              gap: '12px',
              maxWidth: '540px',
            }}
          >
            {/* Benefit 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                  Verified Listings
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', lineHeight: 1.2 }}>
                  100% Genuine
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                  Top Companies
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', lineHeight: 1.2 }}>
                  MNCs &amp; Startups
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                  Student Friendly
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', lineHeight: 1.2 }}>
                  Entry Level Roles
                </div>
              </div>
            </div>

            {/* Benefit 4 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Rocket size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                  Career Growth
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748B', lineHeight: 1.2 }}>
                  Build Your Future
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Student Image + Editorial Badges & Quote Card ── */}
        <div
          style={{
            flex: '1 1 440px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px',
          }}
        >
          {/* Handwritten Annotation in Caveat */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              zIndex: 3,
              transform: 'rotate(-4deg)',
            }}
          >
            <div
              style={{
                fontFamily: 'Caveat, cursive, sans-serif',
                fontSize: '22px',
                fontWeight: 700,
                color: '#1E293B',
                lineHeight: 1.05,
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            >
              Same Students.<br />
              <span style={{ color: '#2563EB', textDecoration: 'underline wavy #60A5FA' }}>
                Brighter Futures.
              </span>
            </div>
          </div>

          {/* Student Photo Vignette with soft edge atmospheric blending (compact size) */}
          <div
            style={{
              position: 'relative',
              width: '220px',
              height: '195px',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.09)',
              border: '2px solid rgba(255, 255, 255, 0.95)',
              WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 80%, rgba(0,0,0,0.5) 95%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 80%, rgba(0,0,0,0.5) 95%, transparent 100%)',
            }}
          >
            <img
              src="/assets/jobs/hero_student.jpg"
              alt="CampusConnect Engineering Student Job Search"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
              }}
            />
            {/* Subtle light sky-blue atmospheric tint */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(239, 246, 255, 0) 65%, rgba(239, 246, 255, 0.25) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Floating Pill Badges Stack (Right of Student) - Interactive & Clickable */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginLeft: '14px',
              zIndex: 2,
            }}
          >
            {/* Badge 1: Jobs */}
            <div
              role="button"
              tabIndex={0}
              title="Click to view Full-time Jobs"
              onClick={() => onSelectCategory && onSelectCategory('FULL_TIME')}
              onKeyDown={(e) => e.key === 'Enter' && onSelectCategory && onSelectCategory('FULL_TIME')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '6px 12px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                border: '1px solid #E2E8F0',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = '#EF4444'
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(239, 68, 68, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: '#FEE2E2',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Briefcase size={13} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>Jobs</div>
                <div style={{ fontSize: '9.5px', color: '#64748B' }}>From Top Companies</div>
              </div>
            </div>

            {/* Badge 2: Internships */}
            <div
              role="button"
              tabIndex={0}
              title="Click to view Internships"
              onClick={() => onSelectCategory && onSelectCategory('INTERNSHIP')}
              onKeyDown={(e) => e.key === 'Enter' && onSelectCategory && onSelectCategory('INTERNSHIP')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '6px 12px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                border: '1px solid #E2E8F0',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = '#2563EB'
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={13} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>Internships</div>
                <div style={{ fontSize: '9.5px', color: '#64748B' }}>Gain Real Experience</div>
              </div>
            </div>

            {/* Badge 3: Career Growth */}
            <div
              role="button"
              tabIndex={0}
              title="Click for AI Career Assistant"
              onClick={() => onNavigateCareer && onNavigateCareer()}
              onKeyDown={(e) => e.key === 'Enter' && onNavigateCareer && onNavigateCareer()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '6px 12px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                border: '1px solid #E2E8F0',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = '#2563EB'
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart3 size={13} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>Career Growth</div>
                <div style={{ fontSize: '9.5px', color: '#64748B' }}>Start Your Journey</div>
              </div>
            </div>
          </div>

          {/* Far Right Editorial Quote Card - Interactive & Clickable */}
          <div
            role="button"
            tabIndex={0}
            title="Explore all opportunities"
            onClick={() => onExploreClick && onExploreClick()}
            onKeyDown={(e) => e.key === 'Enter' && onExploreClick && onExploreClick()}
            style={{
              marginLeft: '14px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              width: '145px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="hidden xl:flex"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.12)'
              e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)'
              e.currentTarget.style.borderColor = '#E2E8F0'
            }}
          >
            <div>
              <span style={{ fontSize: '26px', color: '#3B82F6', fontFamily: 'serif', lineHeight: 0.8, display: 'block' }}>
                “
              </span>
              <p style={{ fontSize: '11px', color: '#334155', fontWeight: 600, lineHeight: 1.4, margin: '4px 0 0 0' }}>
                Explore Opportunities. Apply Confidently. Grow Your Career.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#2563EB' }}>
              <ChevronRight size={15} />
              <ChevronRight size={15} style={{ marginLeft: '-9px' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
