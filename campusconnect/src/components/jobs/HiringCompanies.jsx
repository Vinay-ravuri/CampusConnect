import React from 'react'
import { ArrowRight } from 'lucide-react'
import CompanyLogo from '../ui/CompanyLogo'

export const TOP_COMPANIES = [
  { name: 'Amazon', id: 'amazon' },
  { name: 'Google', id: 'google' },
  { name: 'Microsoft', id: 'microsoft' },
  { name: 'Adobe', id: 'adobe' },
  { name: 'TCS', id: 'tcs' },
  { name: 'Infosys', id: 'infosys' },
  { name: 'Accenture', id: 'accenture' },
  { name: 'IBM', id: 'ibm' },
]

export default function HiringCompanies({ onSelectCompany, onViewAll }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '18px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        marginBottom: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '14.5px',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
          }}
        >
          Top Hiring Companies
        </h3>

        <button
          type="button"
          onClick={onViewAll}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#2563EB',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            padding: 0,
          }}
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* 4x2 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {TOP_COMPANIES.map((comp) => (
          <button
            key={comp.id}
            type="button"
            title={`Filter by ${comp.name}`}
            onClick={() => onSelectCompany && onSelectCompany(comp.name)}
            style={{
              height: '46px',
              borderRadius: '10px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#93C5FD'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <CompanyLogo name={comp.name} size={28} />
          </button>
        ))}
      </div>
    </div>
  )
}
