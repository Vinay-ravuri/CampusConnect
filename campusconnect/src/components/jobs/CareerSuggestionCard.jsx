import React from 'react'
import { Lightbulb, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CareerSuggestionCard({ onGetSuggestions }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onGetSuggestions) {
      onGetSuggestions()
    } else {
      navigate('/career')
    }
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Lightbulb size={16} />
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '14.5px',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
          }}
        >
          Not Sure Where to Start?
        </h3>
      </div>

      <p
        style={{
          fontSize: '12px',
          color: '#64748B',
          lineHeight: 1.5,
          margin: '0 0 16px 0',
        }}
      >
        Get personalized job recommendations based on your skills, profile and interests.
      </p>

      <button
        type="button"
        onClick={handleClick}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px 14px',
          borderRadius: '10px',
          border: 'none',
          background: '#2563EB',
          color: '#FFFFFF',
          fontSize: '12.5px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          transition: 'all 0.15s ease',
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
        <span>Get Career Suggestions</span>
        <ArrowRight size={13} />
      </button>
    </div>
  )
}
