import React from 'react'
import { Briefcase, Building2, Users, Zap } from 'lucide-react'

export default function JobsStats({
  activeOpenings = '500+',
  hiringCompanies = '120+',
  placedRate = '85%',
  newDaily = 'New',
}) {
  const STATS = [
    {
      id: 'openings',
      value: activeOpenings,
      label: 'Active Job Openings',
      icon: Briefcase,
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      id: 'companies',
      value: hiringCompanies,
      label: 'Hiring Companies',
      icon: Building2,
      color: '#E11D48',
      bg: '#FFF1F2',
    },
    {
      id: 'placed',
      value: placedRate,
      label: 'Students Placed',
      icon: Users,
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      id: 'daily',
      value: newDaily,
      label: 'Opportunities Daily',
      icon: Zap,
      color: '#9333EA',
      bg: '#F3E8FF',
    },
  ]

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '26px',
      }}
    >
      {STATS.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: stat.bg,
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={20} />
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#0F172A',
                  lineHeight: 1.15,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  color: '#64748B',
                  fontWeight: 500,
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
