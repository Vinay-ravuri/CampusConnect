import React, { useState } from 'react'
import { Zap, Code, Database, HelpCircle, Check, ChevronDown, Award, ExternalLink } from 'lucide-react'

export default function MockTestsView({
  questions = [],
  loading = false,
  onSolveQuestion,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [expandedId, setExpandedId] = useState(null)
  const [solvedIds, setSolvedIds] = useState(new Set())

  const categories = [
    { id: 'ALL', label: 'All Challenges' },
    { id: 'CODING', label: 'Coding' },
    { id: 'SQL', label: 'SQL Queries' },
    { id: 'CORE_CS', label: 'Core CS' },
    { id: 'APTITUDE', label: 'Aptitude' },
  ]

  const filtered = questions.filter((q) => {
    const matchCat = selectedCategory === 'ALL' || q.category === selectedCategory
    const matchDiff = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty
    return matchCat && matchDiff
  })

  const toggleSolved = (id, e) => {
    e.stopPropagation()
    setSolvedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    if (onSolveQuestion) onSolveQuestion(id)
  }

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
          Interview Practice & Mock Arena
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Simulate coding rounds and technical assessments from top tier-1 recruiters.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '22px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const active = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: active ? '1px solid #059669' : '1px solid #E2E8F0',
                  background: active ? '#059669' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#475569',
                  fontSize: '12.5px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'Easy', 'Medium', 'Hard'].map((diff) => {
            const active = selectedDifficulty === diff
            return (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: active ? '1px solid #334155' : '1px solid #E2E8F0',
                  background: active ? '#1E293B' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#64748B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {diff}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Questions List ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            Loading practice questions...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '36px',
              textAlign: 'center',
              color: '#64748B',
            }}
          >
            No questions match this filter combination.
          </div>
        )}

        {!loading &&
          filtered.map((q) => {
            const isExpanded = expandedId === q.id
            const isSolved = solvedIds.has(q.id)

            return (
              <div
                key={q.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                  transition: 'border-color 0.15s',
                }}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '12px',
                    background: isExpanded ? '#F8FAFC' : '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                      onClick={(e) => toggleSolved(q.id, e)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: isSolved ? 'none' : '2px solid #CBD5E1',
                        background: isSolved ? '#10B981' : 'transparent',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {isSolved && <Check size={13} />}
                    </button>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background:
                          q.difficulty === 'Easy'
                            ? '#ECFDF5'
                            : q.difficulty === 'Hard'
                            ? '#FEF2F2'
                            : '#EFF6FF',
                        color:
                          q.difficulty === 'Easy'
                            ? '#059669'
                            : q.difficulty === 'Hard'
                            ? '#DC2626'
                            : '#2563EB',
                      }}
                    >
                      {q.difficulty}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: isSolved ? '#64748B' : '#0F172A',
                        textDecoration: isSolved ? 'line-through' : 'none',
                      }}
                    >
                      {q.title}
                    </span>

                    {/* Company tags */}
                    {q.companies &&
                      q.companies.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: '#F1F5F9',
                            color: '#475569',
                          }}
                        >
                          {c}
                        </span>
                      ))}
                  </div>

                  <ChevronDown
                    size={16}
                    style={{
                      color: '#94A3B8',
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </div>

                {isExpanded && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9' }}>
                    <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, marginBottom: '14px' }}>
                      {q.description}
                    </p>

                    {q.sampleInput && (
                      <div
                        style={{
                          background: '#0F172A',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          color: '#F8FAFC',
                          fontFamily: 'monospace',
                          fontSize: '12.5px',
                          marginBottom: '14px',
                        }}
                      >
                        <div style={{ color: '#94A3B8', fontSize: '11px', marginBottom: '4px' }}>Sample Input / Query:</div>
                        <code>{q.sampleInput}</code>
                      </div>
                    )}

                    {q.solution && (
                      <div
                        style={{
                          background: '#ECFDF5',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          border: '1px solid #A7F3D0',
                          color: '#065F46',
                          fontSize: '13px',
                          lineHeight: 1.5,
                        }}
                      >
                        <strong>Approach & Solution:</strong>
                        <div style={{ marginTop: '4px' }}>{q.solution}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
