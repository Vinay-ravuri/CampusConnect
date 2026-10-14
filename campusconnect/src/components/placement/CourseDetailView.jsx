import React, { useState } from 'react'
import {
  ChevronRight,
  ArrowLeft,
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  ChevronDown,
  PlayCircle,
  Code,
  FileCode,
  Check,
  ShieldCheck,
  Briefcase
} from 'lucide-react'

export default function CourseDetailView({
  course,
  trackDetailData,
  loading = false,
  completedTopicIds = new Set(),
  onBack,
  onStartLesson,
  onToggleTopic,
  onViewCertificate,
}) {
  const [expandedModuleId, setExpandedModuleId] = useState(null)
  const [activeTab, setActiveTab] = useState('curriculum') // 'curriculum' | 'overview' | 'prerequisites'

  const title = trackDetailData?.title || course?.title || 'Course Details'
  const subtitle = trackDetailData?.subtitle || course?.subtitle || ''
  const description = trackDetailData?.description || course?.description || ''
  const difficulty = trackDetailData?.difficulty || course?.difficulty || 'Intermediate'
  const estimatedHours = trackDetailData?.estimatedHours || course?.estimatedHours || '40 hrs'
  const rating = course?.rating || '4.8'
  const reviewsCount = course?.reviewsCount || '2.4k'
  const targetCompanies = trackDetailData?.targetCompanies || course?.targetCompanies || ['Google', 'Amazon', 'Microsoft', 'TCS']

  const modules = trackDetailData?.modules || []
  const totalTopics = modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0)
  const completedCount = modules.reduce((acc, m) => {
    return acc + (m.topics?.filter((t) => completedTopicIds.has(t.id))?.length || 0)
  }, 0)
  const progressPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* ── Breadcrumb Navigation ── */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: '#64748B',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#059669')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          <ArrowLeft size={14} />
          <span>Placement Preparation</span>
        </button>
        <ChevronRight size={13} style={{ color: '#CBD5E1' }} />
        <span style={{ color: '#059669', fontWeight: 700 }}>{title}</span>
      </nav>

      {/* ── Hero / Header Card ── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          padding: 'clamp(24px, 4vw, 36px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          marginBottom: '28px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 540px' }}>
            {/* Badges Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                }}
              >
                {difficulty}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  border: '1px solid #FDE68A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Award size={12} />
                <span>Verified Certification Available</span>
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: 'clamp(24px, 3.2vw, 34px)',
                fontWeight: 800,
                color: '#0F172A',
                margin: '0 0 8px 0',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <div
                style={{
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#059669',
                  marginBottom: '12px',
                }}
              >
                {subtitle}
              </div>
            )}

            <p
              style={{
                fontSize: '14px',
                color: '#475569',
                lineHeight: 1.6,
                margin: '0 0 20px 0',
                maxWidth: '680px',
              }}
            >
              {description}
            </p>

            {/* Meta Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '13px',
                color: '#64748B',
                fontWeight: 600,
                marginBottom: '22px',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B45309' }}>
                <Star size={14} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                <span>{rating}</span>
                <span style={{ color: '#94A3B8', fontWeight: 500 }}>({reviewsCount})</span>
              </div>
              <span>•</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} style={{ color: '#94A3B8' }} />
                <span>{estimatedHours} Duration</span>
              </div>
              <span>•</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={14} style={{ color: '#94A3B8' }} />
                <span>{totalTopics || course?.lessonCount || '60'} Lessons</span>
              </div>
            </div>

            {/* Target Recruiters */}
            {targetCompanies.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                  Target Companies:
                </span>
                {targetCompanies.map((comp) => (
                  <span
                    key={comp}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#F1F5F9',
                      color: '#334155',
                    }}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Action / Progress Card */}
          <div
            style={{
              flex: '0 0 280px',
              background: '#F8FAFC',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Your Course Progress
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
                  {progressPct}%
                </span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  ({completedCount}/{totalTopics} completed)
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '20px' }}>
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    background: '#10B981',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  // Open first topic or first incomplete topic
                  let targetTopic = null
                  for (const m of modules) {
                    for (const t of m.topics || []) {
                      if (!completedTopicIds.has(t.id)) {
                        targetTopic = t
                        break
                      }
                    }
                    if (targetTopic) break
                  }
                  if (!targetTopic && modules[0]?.topics?.[0]) {
                    targetTopic = modules[0].topics[0]
                  }
                  if (targetTopic) {
                    onStartLesson(targetTopic, modules)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                }}
              >
                <PlayCircle size={16} />
                <span>{progressPct > 0 ? 'Continue Learning' : 'Start Learning'}</span>
              </button>

              {progressPct >= 100 && (
                <button
                  type="button"
                  onClick={onViewCertificate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: '1px solid #A7F3D0',
                    background: '#ECFDF5',
                    color: '#059669',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Award size={15} />
                  <span>View Certificate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '24px',
        }}
      >
        {[
          { id: 'curriculum', label: `Course Curriculum (${modules.length} Modules)` },
          { id: 'overview', label: "What You'll Learn" },
          { id: 'prerequisites', label: 'Prerequisites & Tools' },
        ].map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid #059669' : '3px solid transparent',
                padding: '10px 16px',
                marginBottom: '-2px',
                color: isActive ? '#059669' : '#64748B',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Tab Content: Curriculum ── */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              Loading curriculum modules...
            </div>
          )}

          {!loading && modules.length === 0 && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '32px',
                textAlign: 'center',
                color: '#64748B',
              }}
            >
              Curriculum is being prepared. Check back shortly!
            </div>
          )}

          {!loading &&
            modules.map((mod, mIdx) => {
              const isExpanded = expandedModuleId === mod.id || (expandedModuleId === null && mIdx === 0)
              const modTopics = mod.topics || []
              const completedInMod = modTopics.filter((t) => completedTopicIds.has(t.id)).length

              return (
                <div
                  key={mod.id || mIdx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  {/* Module Header Bar */}
                  <div
                    onClick={() => setExpandedModuleId(isExpanded ? -1 : mod.id)}
                    style={{
                      padding: '16px 20px',
                      background: isExpanded ? '#F8FAFC' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#059669',
                          background: '#ECFDF5',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {String(mIdx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                            fontSize: '15.5px',
                            fontWeight: 700,
                            color: '#0F172A',
                            margin: 0,
                          }}
                        >
                          {mod.title}
                        </h3>
                        {mod.description && (
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {mod.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                        {completedInMod}/{modTopics.length} Completed
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          color: '#94A3B8',
                          transform: isExpanded ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Module Topics List */}
                  {isExpanded && (
                    <div style={{ padding: '8px 16px' }}>
                      {modTopics.map((topic, tIdx) => {
                        const isDone = completedTopicIds.has(topic.id)

                        return (
                          <div
                            key={topic.id || tIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 8px',
                              borderBottom: tIdx < modTopics.length - 1 ? '1px solid #F1F5F9' : 'none',
                              gap: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                              {/* Checkmark Button */}
                              <button
                                type="button"
                                title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                                onClick={() => onToggleTopic && onToggleTopic(topic.id, trackDetailData?.slug)}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '6px',
                                  border: isDone ? 'none' : '2px solid #CBD5E1',
                                  background: isDone ? '#10B981' : 'transparent',
                                  color: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  marginTop: '2px',
                                  flexShrink: 0,
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {isDone && <Check size={13} />}
                              </button>

                              <div>
                                <div
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: isDone ? '#64748B' : '#0F172A',
                                    textDecoration: isDone ? 'line-through' : 'none',
                                    marginBottom: '2px',
                                  }}
                                >
                                  {topic.title}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                                  {topic.conceptSummary || topic.description}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                              {/* Topic Type Badge */}
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: '#F1F5F9',
                                  color: '#475569',
                                }}
                              >
                                {topic.practiceType || 'LESSON'}
                              </span>

                              {/* Start/Open Lesson CTA */}
                              <button
                                type="button"
                                onClick={() => onStartLesson(topic, modules)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #E2E8F0',
                                  background: '#FFFFFF',
                                  color: '#059669',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#ECFDF5'
                                  e.currentTarget.style.borderColor = '#A7F3D0'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#FFFFFF'
                                  e.currentTarget.style.borderColor = '#E2E8F0'
                                }}
                              >
                                <PlayCircle size={13} />
                                <span>{isDone ? 'Review' : 'Open'}</span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      )}

      {/* ── Tab Content: Overview ── */}
      {activeTab === 'overview' && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            padding: '28px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            What You'll Learn in This Course
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              'Understand core theoretical concepts and standard algorithmic blueprints.',
              'Solve top recurring technical interview and screening problems.',
              'Analyze time and space complexity with Big-O notation.',
              'Apply industry-standard clean coding practices and modular architecture.',
              'Present solutions clearly in one-on-one technical interviewer rounds.',
              'Earn an official verifiable CampusConnect Placement Preparation Certificate.',
            ].map((outcome, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab Content: Prerequisites ── */}
      {activeTab === 'prerequisites' && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            padding: '28px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
            Course Prerequisites
          </h3>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
            This course is structured from foundational principles to advanced concepts. Basic familiarity with standard programming concepts (variables, conditions, loops) is helpful.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Basic Programming Syntax', 'Basic Math & Logic', 'Laptop or PC with Modern Browser'].map((req, idx) => (
              <span
                key={idx}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                ✓ {req}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
