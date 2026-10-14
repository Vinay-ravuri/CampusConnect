import React from 'react'
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Zap,
  Target,
  Sparkles
} from 'lucide-react'

export default function MyProgressView({
  readinessScore = 35,
  completedTopicsCount = 12,
  totalTopicsCount = 34,
  tracks = [],
  completedTopicIds = new Set(),
  onSelectTrack,
  onViewCertificates,
}) {
  const percentage = Math.min(100, Math.max(0, readinessScore))

  // Calculate track progress breakdowns
  const tracksWithProgress = tracks.map((track) => {
    const total = track.topicCount || 6
    let completed = 0
    if (track.modules) {
      track.modules.forEach((m) => {
        (m.topics || []).forEach((t) => {
          if (completedTopicIds.has(t.id)) completed++
        })
      })
    } else {
      // Approximation if shallow
      completed = Math.round((percentage / 100) * total)
    }
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { ...track, completed, total, pct }
  })

  const inProgressTracks = tracksWithProgress.filter((t) => t.pct > 0 && t.pct < 100)
  const completedTracks = tracksWithProgress.filter((t) => t.pct === 100)

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '26px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
          }}
        >
          My Placement Progress
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Real-time tracking of your placement readiness across algorithms, system design, and core computer science.
        </p>
      </div>

      {/* ── Top Hero Stats Bar: Readiness Radial & Counters ── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          padding: 'clamp(20px, 3.5vw, 32px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Readiness Radial Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', width: '84px', height: '84px' }}>
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r="36" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={2 * Math.PI * 36 * (1 - percentage / 100)}
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: '20px',
                fontWeight: 900,
                color: '#0F172A',
              }}
            >
              {percentage}%
            </div>
          </div>

          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#059669',
                background: '#ECFDF5',
                padding: '2px 8px',
                borderRadius: '6px',
                marginBottom: '4px',
              }}
            >
              <TrendingUp size={13} />
              <span>OVERALL READINESS</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              {completedTopicsCount} of {totalTopicsCount} Topics Completed
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
              {percentage >= 70
                ? 'Excellent! You are ready for campus technical rounds.'
                : 'Keep practicing to unlock tier-1 company mock rounds.'}
            </div>
          </div>
        </div>

        {/* 4 Stat Badges */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {[
            { label: 'Courses Started', value: inProgressTracks.length || '3', icon: BookOpen, color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Topics Solved', value: completedTopicsCount, icon: CheckCircle2, color: '#059669', bg: '#ECFDF5' },
            { label: 'Mock Drills', value: '18', icon: Zap, color: '#D97706', bg: '#FEF3C7' },
            { label: 'Certificates', value: completedTracks.length || '1', icon: Award, color: '#9333EA', bg: '#F3E8FF' },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '12px 18px',
                  minWidth: '120px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Icon size={14} style={{ color: stat.color }} />
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{stat.value}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Active / In Progress Courses ── */}
      <section style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '18px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '14px',
          }}
        >
          Continue Learning
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {(inProgressTracks.length > 0 ? inProgressTracks : tracks.slice(0, 3)).map((t) => (
            <div
              key={t.id || t.slug}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: '#ECFDF5', color: '#059669' }}>
                    {t.difficulty || 'Intermediate'}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                    {t.pct || 30}% Completed
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.45, margin: '0 0 14px 0' }}>
                  {t.description || t.subtitle}
                </p>
              </div>

              <div>
                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ width: `${t.pct || 30}%`, height: '100%', background: '#10B981', borderRadius: '9999px' }} />
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTrack(t)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#059669',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span>Resume Course</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recommended Next Track ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
          borderRadius: '20px',
          border: '1px solid #A7F3D0',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
            <Sparkles size={14} />
            <span>AI RECOMMENDED NEXT STEP</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064E3B', margin: '0 0 4px 0' }}>
            Master Low-Level System Design & Multithreading
          </h3>
          <p style={{ fontSize: '13px', color: '#047857', margin: 0, maxWidth: '600px' }}>
            Based on your DSA progress, top recruiters (Amazon, Google, Microsoft) frequently test Concurrency, LLD and Thread Synchronization next.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const sysTrack = tracks.find((t) => t.slug === 'oop' || t.slug === 'dev') || tracks[0]
            if (sysTrack) onSelectTrack(sysTrack)
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            background: '#059669',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
          }}
        >
          <span>Begin Recommended Track</span>
          <ArrowRight size={14} />
        </button>
      </section>
    </div>
  )
}
