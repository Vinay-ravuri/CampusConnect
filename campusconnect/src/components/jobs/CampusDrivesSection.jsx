import React from 'react'
import { Zap, Calendar, Award, ArrowRight, ShieldCheck } from 'lucide-react'
import CompanyLogo from '../ui/CompanyLogo'

export const CAMPUS_DRIVES = [
  {
    id: 'drive-amazon-wow',
    company: 'Amazon',
    title: 'Amazon WOW 2026',
    role: 'SDE Mentorship & Internship Drive',
    badge: 'Top Tech MNC',
    batch: '2026 & 2027 Batches',
    stipend: '₹ 1.1 Lakh / Month',
    deadline: '30 Oct 2026',
    mode: 'Virtual / Bangalore',
    perks: ['Direct Tech Interview Round', '1:1 Mentorship by Amazon SWEs'],
  },
  {
    id: 'drive-google-swe',
    company: 'Google',
    title: 'Google Summer SWE 2026',
    role: 'Software Engineering Internship',
    badge: 'Tier-1 AI & Cloud',
    batch: '2026 & 2027 Batches',
    stipend: '₹ 1.25 Lakh / Month',
    deadline: '15 Nov 2026',
    mode: 'Hybrid / Hyderabad',
    perks: ['Distributed Systems Track', 'Pre-Placement Offer (PPO) Potential'],
  },
  {
    id: 'drive-msft-engage',
    company: 'Microsoft',
    title: 'Microsoft Engage 2026',
    role: 'Pre-Placement Mentorship & Interview',
    badge: 'Direct PPO Track',
    batch: 'B.Tech 3rd / 4th Year',
    stipend: '₹ 16 – 24 LPA (Full-time CTC)',
    deadline: '10 Nov 2026',
    mode: 'Virtual / Noida & Bangalore',
    perks: ['Build Real-World AI Project', 'Direct Interview with Engineering Leads'],
  },
  {
    id: 'drive-tcs-nqt',
    company: 'TCS',
    title: 'TCS NQT 2026 National Qualifier',
    role: 'Digital & Prime Cadre Hiring',
    badge: 'Pan-India Drive',
    batch: 'All Engineering Streams',
    stipend: '₹ 3.6 – 9.2 LPA',
    deadline: '25 Oct 2026',
    mode: 'On-Campus & Test Centers',
    perks: ['Aptitude + Advanced Coding', 'Highest Placement Conversion in AP'],
  },
]

export default function CampusDrivesSection({ onApplyDrive }) {
  return (
    <section style={{ marginTop: '36px', marginBottom: '32px' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#FEF3C7',
                color: '#D97706',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
              }}
            >
              <Zap size={16} />
            </span>
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
              Fast-Track Campus Hiring Drives
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: '#EFF6FF',
                color: '#2563EB',
                padding: '3px 9px',
                borderRadius: '9999px',
                border: '1px solid rgba(37, 99, 235, 0.2)',
              }}
            >
              2026 Batch Active
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#64748B',
              margin: '4px 0 0 0',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Direct corporate recruitment drives, mentorship pipelines, and national qualifier exams open now.
          </p>
        </div>
      </div>

      {/* 4 Drive Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {CAMPUS_DRIVES.map((drive) => (
          <div
            key={drive.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              padding: '18px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(37, 99, 235, 0.09)'
              e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)'
              e.currentTarget.style.borderColor = '#E2E8F0'
            }}
          >
            <div>
              {/* Header: Logo + Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <CompanyLogo name={drive.company} size={28} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#F1F5F9',
                    color: '#475569',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {drive.badge}
                </span>
              </div>

              {/* Title & Role */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 3px 0',
                  lineHeight: 1.25,
                }}
              >
                {drive.title}
              </h3>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
                {drive.role} • <span style={{ color: '#2563EB', fontWeight: 600 }}>{drive.batch}</span>
              </div>

              {/* Compensation & Mode */}
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  border: '1px solid #F1F5F9',
                }}
              >
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  PACKAGE / STIPEND
                </div>
                <div
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 800,
                    color: '#0F172A',
                    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  }}
                >
                  {drive.stipend}
                </div>
              </div>

              {/* Key Perks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px' }}>
                {drive.perks.map((perk, pIdx) => (
                  <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#475569' }}>
                    <ShieldCheck size={13} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: Deadline & Apply Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>
                <Calendar size={12} />
                <span>Ends {drive.deadline}</span>
              </div>

              <button
                type="button"
                onClick={() => onApplyDrive && onApplyDrive(drive)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1D4ED8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2563EB')}
              >
                <span>Register</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
