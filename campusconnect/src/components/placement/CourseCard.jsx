import React from 'react'
import { Star, Clock, BookOpen, ArrowRight, Bookmark, Lock, Award, Check } from 'lucide-react'

export default function CourseCard({
  course,
  progressPercentage = 0,
  isBookmarked = false,
  onToggleBookmark,
  onStartLearning,
}) {
  const {
    id,
    title,
    description,
    subtitle,
    difficulty = 'Intermediate',
    isCertified = false,
    rating = '4.8',
    reviewsCount = '2.1k',
    estimatedHours = '20 hrs',
    lessonCount = '60 Lessons',
    icon: IconComponent,
    iconEmoji,
    iconColor = '#059669',
    iconBg = '#ECFDF5',
  } = course

  const pct = Math.min(100, Math.max(0, Math.round(progressPercentage)))

  // Difficulty badge styling
  const getDifficultyStyle = (diff) => {
    const d = (diff || '').toLowerCase()
    if (d.includes('begin')) {
      return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' }
    }
    if (d.includes('adv')) {
      return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
    }
    return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' }
  }

  const diffStyle = getDifficultyStyle(difficulty)

  return (
    <article
      style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '350px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="cc-course-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.10)'
        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)'
        e.currentTarget.style.borderColor = '#E2E8F0'
      }}
    >
      {/* ── TOP SECTION: Header + Info ── */}
      <div>
        {/* Row 1: Icon, Level Pill, Access Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '14px',
          }}
        >
          {/* Course Icon Box */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            {IconComponent ? (
              <IconComponent size={20} style={{ color: iconColor }} />
            ) : (
              <span>{iconEmoji || '📚'}</span>
            )}
          </div>

          {/* Right Badges: Level & Free/Certified */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
            {/* Difficulty Pill */}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '9999px',
                background: diffStyle.bg,
                color: diffStyle.text,
                border: `1px solid ${diffStyle.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {difficulty.split(' ')[0]}
            </span>

            {/* Free or Certified Tag */}
            {isCertified ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  border: '1px solid #FDE68A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Lock size={10} />
                <span>Certified</span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Star size={10} style={{ fill: '#059669' }} />
                <span>Free</span>
              </span>
            )}
          </div>
        </div>

        {/* Course Title */}
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
            fontSize: '16.5px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
            lineHeight: 1.25,
            height: '42px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          title={title}
        >
          {title}
        </h3>

        {/* Short Description */}
        <p
          style={{
            fontSize: '12px',
            color: '#64748B',
            lineHeight: 1.45,
            margin: '0 0 14px 0',
            height: '35px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontFamily: 'Inter, sans-serif',
          }}
          title={description || subtitle}
        >
          {description || subtitle}
        </p>
      </div>

      {/* ── BOTTOM SECTION: Meta, Progress & CTAs ── */}
      <div>
        {/* Meta Row: Rating • Duration • Lessons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '11.5px',
            color: '#64748B',
            fontWeight: 500,
            marginBottom: '10px',
            whiteSpace: 'nowrap',
            gap: '6px',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#B45309', fontWeight: 700 }}>
            <Star size={12} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
            <span>{rating}</span>
            <span style={{ color: '#94A3B8', fontWeight: 500 }}>({reviewsCount})</span>
          </div>
          <span>•</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={11} style={{ color: '#94A3B8' }} />
            <span>{estimatedHours}</span>
          </div>
          <span>•</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <BookOpen size={11} style={{ color: '#94A3B8' }} />
            <span>{lessonCount}</span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div
            style={{
              flex: 1,
              height: '5px',
              borderRadius: '9999px',
              background: '#F1F5F9',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background: '#10B981',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: pct > 0 ? '#059669' : '#94A3B8',
              minWidth: '28px',
              textAlign: 'right',
            }}
          >
            {pct}%
          </span>
        </div>

        {/* Action Buttons: [ Start Learning → ] and [ Bookmark ] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onStartLearning(course)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: '#059669',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.2)',
              transition: 'background 0.15s ease, transform 0.15s ease',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#047857'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#059669'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <span>{pct > 0 ? 'Continue' : 'Start Learning'}</span>
            <ArrowRight size={13} />
          </button>

          <button
            type="button"
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Course'}
            onClick={() => onToggleBookmark && onToggleBookmark(id)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: isBookmarked ? '1px solid #10B981' : '1px solid #E2E8F0',
              background: isBookmarked ? '#ECFDF5' : '#FFFFFF',
              color: isBookmarked ? '#059669' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10B981'
              e.currentTarget.style.color = '#059669'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isBookmarked ? '#10B981' : '#E2E8F0'
              e.currentTarget.style.color = isBookmarked ? '#059669' : '#94A3B8'
            }}
          >
            <Bookmark size={15} style={{ fill: isBookmarked ? '#059669' : 'none' }} />
          </button>
        </div>
      </div>
    </article>
  )
}
