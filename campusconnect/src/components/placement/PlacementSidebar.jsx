import React from 'react'
import {
  BookOpen,
  Compass,
  Code,
  Target,
  Database,
  Monitor,
  Cpu,
  Briefcase,
  Zap,
  FileCheck,
  Award,
  BarChart2,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'

export const SIDEBAR_ITEMS = [
  { id: 'all-courses', label: 'All Courses', icon: BookOpen, category: 'ALL' },
  { id: 'learning-paths', label: 'Learning Paths', icon: Compass, category: 'PATHS' },
  { id: 'dsa', label: 'DSA & Algorithms', icon: Code, category: 'DSA' },
  { id: 'aptitude', label: 'Aptitude & Reasoning', icon: Target, category: 'APTITUDE' },
  { id: 'core-cs', label: 'Core CS (DBMS, OS, CN)', icon: Database, category: 'CORE_CS' },
  { id: 'web-dev', label: 'Web Development', icon: Monitor, category: 'DEV' },
  { id: 'system-design', label: 'System Design', icon: Cpu, category: 'SYSTEM_DESIGN' },
  { id: 'interview-prep', label: 'Interview Preparation', icon: Briefcase, category: 'INTERVIEW' },
  { id: 'mock-tests', label: 'Mock Tests', icon: Zap, category: 'TESTS' },
  { id: 'resume-builder', label: 'Resume Builder', icon: FileCheck, category: 'RESUME' },
  { id: 'certifications', label: 'Certifications', icon: Award, category: 'CERTIFICATIONS' },
  { id: 'my-progress', label: 'My Progress', icon: BarChart2, category: 'PROGRESS' },
]

export default function PlacementSidebar({
  activeItem = 'all-courses',
  onSelectItem,
  completedTopicsCount = 12,
  totalTopicsCount = 34,
  readinessPercentage = 35,
  onContinueLearning,
  isMobileOpen = false,
  onCloseMobile,
}) {
  const percentage = Math.min(100, Math.max(0, readinessPercentage))
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '20px 14px',
      }}
    >
      <div>
        {/* Sidebar Header Title */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#64748B',
            padding: '4px 12px 14px 12px',
            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
          }}
        >
          PLACEMENT PREPARATION
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectItem(item.id)
                  if (onCloseMobile) onCloseMobile()
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? '#ECFDF5' : 'transparent',
                  color: isActive ? '#047857' : '#334155',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease-in-out',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F8FAFC'
                    e.currentTarget.style.color = '#0F172A'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#334155'
                  }
                }}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '6px',
                      bottom: '6px',
                      width: '3.5px',
                      borderRadius: '0 4px 4px 0',
                      background: '#10B981',
                    }}
                  />
                )}

                <Icon
                  size={17}
                  style={{
                    color: isActive ? '#059669' : '#64748B',
                    flexShrink: 0,
                    transition: 'color 0.15s',
                  }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Bottom "Your Progress" Card ── */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: '16px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#1E293B',
            marginBottom: '12px',
          }}
        >
          Your Progress
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          {/* Radial Progress Gauge */}
          <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4.5"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke="#10B981"
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 800,
                color: '#0F172A',
              }}
            >
              {percentage}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
              {completedTopicsCount} of {totalTopicsCount} Topics
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              {percentage >= 70 ? 'Interview Ready' : 'In Progress'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinueLearning}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 12px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.25)'
          }}
        >
          <span>Continue Learning</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        style={{
          width: '248px',
          minWidth: '248px',
          maxWidth: '248px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '88px',
          height: 'calc(100vh - 108px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
        }}
        className="hidden lg:block placement-desktop-sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
          }}
          onClick={onCloseMobile}
        >
          <div
            style={{
              width: '280px',
              maxWidth: '85vw',
              height: '100%',
              background: '#FFFFFF',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '14px 16px 0',
              }}
            >
              <button
                type="button"
                onClick={onCloseMobile}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
