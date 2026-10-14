import React from 'react'
import { TrendingUp, ArrowRight, Code2, Database, Bot, Cloud } from 'lucide-react'

export const TRENDING_ROLES = [
  {
    id: 'sde',
    roleName: 'Software Development Engineer',
    category: 'Software Engineering / SDE',
    icon: Code2,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    salary: '₹ 8 – 22 LPA',
    growth: '+34% YoY Hiring',
    topSkills: ['Java / C++', 'DSA', 'Spring Boot', 'AWS'],
    openings: '320+ Active',
  },
  {
    id: 'fullstack',
    roleName: 'Full Stack Web Developer',
    category: 'Frontend & Full Stack',
    icon: Database,
    color: '#059669',
    bgColor: '#ECFDF5',
    salary: '₹ 6 – 16 LPA',
    growth: '+28% YoY Hiring',
    topSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    openings: '210+ Active',
  },
  {
    id: 'aiml',
    roleName: 'AI & Machine Learning Engineer',
    category: 'Data Science & AI',
    icon: Bot,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    salary: '₹ 10 – 26 LPA',
    growth: '+48% YoY Hiring',
    topSkills: ['Python', 'PyTorch', 'LLMs & RAG', 'APIs'],
    openings: '145+ Active',
  },
  {
    id: 'cloud',
    roleName: 'Cloud & DevOps Engineer',
    category: 'DevOps & Infrastructure',
    icon: Cloud,
    color: '#0284C7',
    bgColor: '#F0F9FF',
    salary: '₹ 7 – 18 LPA',
    growth: '+31% YoY Hiring',
    topSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    openings: '115+ Active',
  },
]

export default function TrendingRolesSection({ onSelectRole }) {
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
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={16} />
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
              Trending Roles &amp; Salary Insights
            </h2>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#64748B',
              margin: '4px 0 0 0',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Placement market demand, fresher compensation benchmarks, and in-demand tech stacks.
          </p>
        </div>
      </div>

      {/* 4 Role Insight Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {TRENDING_ROLES.map((r) => {
          const IconComp = r.icon

          return (
            <div
              key={r.id}
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: r.bgColor,
                      color: r.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComp size={20} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#059669',
                      background: '#ECFDF5',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {r.growth}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                    fontSize: '15.5px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 4px 0',
                    lineHeight: 1.25,
                  }}
                >
                  {r.roleName}
                </h3>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
                  {r.openings}
                </div>

                {/* Salary Benchmark */}
                <div
                  style={{
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    AVG FRESHER CTC
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#0F172A',
                      fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                    }}
                  >
                    {r.salary}
                  </div>
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {r.topSkills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: '#F1F5F9',
                        color: '#475569',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectRole && onSelectRole(r.category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#2563EB',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF'
                  e.currentTarget.style.borderColor = '#2563EB'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = '#E2E8F0'
                }}
              >
                <span>Browse {r.roleName.split(' ')[0]} Jobs</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
