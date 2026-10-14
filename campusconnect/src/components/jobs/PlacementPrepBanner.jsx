import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Code2, BookOpen, Building, Sparkles, ArrowRight } from 'lucide-react'

export default function PlacementPrepBanner() {
  const navigate = useNavigate()

  return (
    <section
      style={{
        marginTop: '36px',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '24px',
        padding: 'clamp(20px, 3vw, 32px)',
        color: '#FFFFFF',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '520px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#60A5FA',
              marginBottom: '8px',
            }}
          >
            <Target size={13} />
            <span>PLACEMENT PREPARATION ECOSYSTEM</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              fontSize: 'clamp(22px, 2.5vw, 30px)',
              fontWeight: 900,
              lineHeight: 1.2,
              margin: '0 0 10px 0',
              letterSpacing: '-0.01em',
            }}
          >
            Prepare to Crack Your Dream Offer
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#94A3B8',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Access 7-stage placement roadmaps, DSA pattern cheatsheets, core CS interview notes, and real company archives for JNTUK &amp; AU students.
          </p>
        </div>

        {/* 4 Quick Access Pills */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: '260px',
          }}
        >
          <div
            onClick={() => navigate('/placement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code2 size={16} style={{ color: '#60A5FA' }} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>DSA &amp; Coding Arena</span>
            </div>
            <ArrowRight size={14} style={{ color: '#94A3B8' }} />
          </div>

          <div
            onClick={() => navigate('/placement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={16} style={{ color: '#34D399' }} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Core CS (OS, DBMS, CN)</span>
            </div>
            <ArrowRight size={14} style={{ color: '#94A3B8' }} />
          </div>

          <div
            onClick={() => navigate('/placement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={16} style={{ color: '#FBBF24' }} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Company Specific PYQs</span>
            </div>
            <ArrowRight size={14} style={{ color: '#94A3B8' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
