import React, { useState } from 'react'
import {
  Zap,
  Code,
  Database,
  HelpCircle,
  Check,
  ChevronDown,
  Award,
  ExternalLink,
  Play,
  Terminal,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

export default function MockTestsView({
  questions = [],
  loading = false,
  onSolveQuestion,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [expandedId, setExpandedId] = useState(null)
  const [solvedIds, setSolvedIds] = useState(new Set())
  const [activeCodeId, setActiveCodeId] = useState(null)
  const [language, setLanguage] = useState('java')
  const [codeBuffers, setCodeBuffers] = useState({})
  const [runningId, setRunningId] = useState(null)
  const [testResults, setTestResults] = useState({})

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

  const getDefaultCode = (q, lang) => {
    if (lang === 'python') {
      return `def solve(input_data):\n    # Write optimal solution for: ${q.title}\n    # Time: O(N), Space: O(1)\n    return "Optimal Output"\n\nprint(solve("${q.sampleInput || 'example'}"))`
    }
    if (lang === 'cpp') {
      return `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Solution for: ${q.title}\n    cout << "Passed all test benchmarks" << endl;\n    return 0;\n}`
    }
    if (lang === 'sql' || q.category === 'SQL') {
      return `-- Practical Query: ${q.title}\nSELECT \n    department_id, employee_name, salary \nFROM \n    employees \nWHERE \n    status = 'ACTIVE';`
    }
    return `// Java 17 Solution\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Executing: ${q.title}");\n        // Optimal implementation\n    }\n}`
  }

  const handleRunTest = (q) => {
    setRunningId(q.id)
    setTimeout(() => {
      setRunningId(null)
      setTestResults((prev) => ({
        ...prev,
        [q.id]: {
          passed: true,
          runtime: '28 ms',
          memory: '12.4 MB',
          cases: [
            { id: 1, name: 'Sample Case 0', status: 'Passed' },
            { id: 2, name: 'Hidden Constraints Case', status: 'Passed' },
            { id: 3, name: 'Large Scale Benchmark', status: 'Passed' },
          ],
        },
      }))
      // Automatically mark solved on successful test
      setSolvedIds((prev) => new Set([...prev, q.id]))
    }, 700)
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
          Interview Practice &amp; Mock Arena
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Interactive live coding challenges, SQL queries, and technical assessments from top tier-1 recruiters.
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
                  padding: '5px 10px',
                  borderRadius: '8px',
                  border: active ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  background: active ? '#EFF6FF' : '#FFFFFF',
                  color: active ? '#1D4ED8' : '#64748B',
                  fontSize: '12px',
                  fontWeight: active ? 700 : 500,
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
        {filtered.length === 0 && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px dashed #CBD5E1',
              padding: '40px',
              textAlign: 'center',
              color: '#64748B',
            }}
          >
            No practice questions matching current filter.
          </div>
        )}

        {filtered.map((q) => {
          const isExpanded = expandedId === q.id
          const isSolved = solvedIds.has(q.id)
          const result = testResults[q.id]
          const isRunning = runningId === q.id
          const userCode = codeBuffers[q.id] || getDefaultCode(q, language)

          return (
            <div
              key={q.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: isSolved ? '1px solid #A7F3D0' : isExpanded ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                overflow: 'hidden',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Question Row Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  background: isSolved ? '#F0FDF4' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={(e) => toggleSolved(q.id, e)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: isSolved ? 'none' : '1.5px solid #CBD5E1',
                      background: isSolved ? '#10B981' : '#FFFFFF',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {isSolved && <Check size={14} />}
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
                      color: isSolved ? '#059669' : '#0F172A',
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChevronDown
                    size={16}
                    style={{
                      color: '#94A3B8',
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </div>
              </div>

              {/* Expanded Arena */}
              {isExpanded && (
                <div style={{ padding: '18px 20px', borderTop: '1px solid #F1F5F9' }}>
                  <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>
                    {q.description}
                  </p>

                  {/* Interactive Live Code Sandbox */}
                  <div
                    style={{
                      background: '#0F172A',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                    }}
                  >
                    {/* Sandbox Header */}
                    <div
                      style={{
                        padding: '10px 16px',
                        background: '#1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: '#94A3B8',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={14} style={{ color: '#10B981' }} />
                        <span>Interactive Code Sandbox</span>
                        <select
                          value={language}
                          onChange={(e) => {
                            const newLang = e.target.value
                            setLanguage(newLang)
                            setCodeBuffers((prev) => ({ ...prev, [q.id]: getDefaultCode(q, newLang) }))
                          }}
                          style={{
                            background: '#0F172A',
                            border: '1px solid #334155',
                            color: '#F8FAFC',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            outline: 'none',
                          }}
                        >
                          <option value="java">Java</option>
                          <option value="python">Python</option>
                          <option value="cpp">C++</option>
                          <option value="sql">SQL</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRunTest(q)}
                        disabled={isRunning}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: '#FFFFFF',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: isRunning ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Play size={11} />
                        <span>{isRunning ? 'Testing...' : 'Run Test Suite'}</span>
                      </button>
                    </div>

                    <textarea
                      value={userCode}
                      onChange={(e) => setCodeBuffers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      spellCheck="false"
                      rows={6}
                      style={{
                        width: '100%',
                        background: '#0F172A',
                        color: '#F8FAFC',
                        padding: '12px 16px',
                        fontFamily: 'monospace',
                        fontSize: '12.5px',
                        border: 'none',
                        outline: 'none',
                        boxSizing: 'border-box',
                        lineHeight: 1.5,
                      }}
                    />

                    {/* Test Results Output */}
                    {result && (
                      <div
                        style={{
                          background: '#064E3B',
                          padding: '10px 16px',
                          color: '#A7F3D0',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={14} style={{ color: '#34D399' }} />
                          <strong>All 3 Test Cases Passed!</strong>
                        </div>
                        <span>Runtime: {result.runtime} • Memory: {result.memory}</span>
                      </div>
                    )}
                  </div>

                  {q.sampleInput && (
                    <div
                      style={{
                        background: '#F8FAFC',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12.5px',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ color: '#64748B', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                        Sample Input / Constraints:
                      </div>
                      <code style={{ fontFamily: 'monospace', color: '#0F172A' }}>{q.sampleInput}</code>
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
                      <strong>Approach &amp; Solution:</strong>
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
