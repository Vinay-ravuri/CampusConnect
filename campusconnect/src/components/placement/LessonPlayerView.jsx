import React, { useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Copy,
  CheckCheck,
  Code,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react'

export default function LessonPlayerView({
  course,
  topic,
  modules = [],
  completedTopicIds = new Set(),
  onBackToCourse,
  onSelectTopic,
  onToggleCompletion,
  onCompleteCourse,
}) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  // Flatten all topics for Next / Prev navigation
  const allTopics = []
  modules.forEach((mod) => {
    (mod.topics || []).forEach((t) => {
      allTopics.push({ ...t, moduleTitle: mod.title })
    })
  })

  const currentIndex = allTopics.findIndex((t) => t.id === topic?.id)
  const currentTopic = allTopics[currentIndex] || topic
  const isCompleted = completedTopicIds.has(currentTopic?.id)

  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null

  const completedCount = allTopics.filter((t) => completedTopicIds.has(t.id)).length
  const progressPct = allTopics.length > 0 ? Math.round((completedCount / allTopics.length) * 100) : 0

  // Code snippet generator based on topic type
  const getCodeSnippet = () => {
    if (currentTopic?.practiceType === 'SQL') {
      return `-- Practical SQL Query: ${currentTopic?.title || 'Example'}
SELECT 
    department_id,
    employee_name,
    salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_in_dept
FROM 
    employees
WHERE 
    status = 'ACTIVE';`
    }
    if (currentTopic?.practiceType === 'CODING') {
      return `// Algorithmic Implementation: ${currentTopic?.title || 'Solution'}
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Executing ${currentTopic?.title}...");
        // Fast pointer & two-pointer technique
        int[] arr = {1, 2, 3, 4, 5};
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        System.out.println("Result: " + Arrays.toString(arr));
    }
}`
    }
    return `// Conceptual Representation: ${currentTopic?.title || 'Concept'}
class SystemArchitecture {
    private String principle = "${currentTopic?.title}";
    
    public void demonstrate() {
        // Core design invariant
        System.out.println("Applying: " + principle);
    }
}`
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet())
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCompleteAndNext = async () => {
    if (!isCompleted) {
      await onToggleCompletion(currentTopic.id)
    }
    if (nextTopic) {
      onSelectTopic(nextTopic)
    } else {
      // Finished all lessons!
      if (onCompleteCourse) onCompleteCourse()
    }
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* ── Top Navigation Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          padding: '14px 20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={onBackToCourse}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F1F5F9',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#E2E8F0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#F1F5F9')}
          >
            <ArrowLeft size={14} />
            <span>Course Menu</span>
          </button>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
              {course?.title || 'Placement Track'} • {currentTopic?.moduleTitle}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: '15.5px',
                fontWeight: 700,
                color: '#0F172A',
              }}
            >
              {currentTopic?.title}
            </div>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              Lesson {currentIndex + 1} of {allTopics.length}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#059669' }}>
              {progressPct}% Completed
            </div>
          </div>
          <div style={{ width: '80px', height: '6px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: '#10B981', borderRadius: '9999px' }} />
          </div>
        </div>
      </div>

      {/* ── 2-Column Split: Curriculum Drawer (Left) & Reader (Right) ── */}
      <div style={{ display: 'flex', gap: '22px', alignItems: 'flex-start' }}>
        {/* Left Curriculum List */}
        <aside
          style={{
            flex: '0 0 280px',
            background: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            maxHeight: 'calc(100vh - 180px)',
            overflowY: 'auto',
          }}
          className="hidden md:block"
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Course Curriculum
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {allTopics.map((t, idx) => {
              const isSelected = t.id === currentTopic?.id
              const isDone = completedTopicIds.has(t.id)

              return (
                <button
                  key={t.id || idx}
                  type="button"
                  onClick={() => onSelectTopic(t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #A7F3D0' : '1px solid transparent',
                    background: isSelected ? '#ECFDF5' : 'transparent',
                    color: isSelected ? '#047857' : isDone ? '#64748B' : '#0F172A',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#F8FAFC'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: isDone ? '#10B981' : isSelected ? '#ECFDF5' : '#E2E8F0',
                        color: isDone ? '#FFFFFF' : isSelected ? '#059669' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {isDone ? <Check size={11} /> : idx + 1}
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.title}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Right Reader Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: 'clamp(24px, 4vw, 36px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              marginBottom: '20px',
            }}
          >
            {/* Topic Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: '#ECFDF5',
                  color: '#059669',
                }}
              >
                {currentTopic?.practiceType || 'CONCEPT'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: '#EFF6FF',
                  color: '#2563EB',
                }}
              >
                {currentTopic?.difficulty || 'Medium'}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: '24px',
                fontWeight: 800,
                color: '#0F172A',
                margin: '0 0 12px 0',
              }}
            >
              {currentTopic?.title}
            </h2>

            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, marginBottom: '24px' }}>
              {currentTopic?.conceptSummary || currentTopic?.description}
            </p>

            {/* Structured Explanation Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} style={{ color: '#059669' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    Core Technical Concept
                  </span>
                </div>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  In campus recruitment assessments and technical interviews, understanding this mechanism allows you to reason about optimal time complexity, edge cases, and memory allocation trade-offs. Always analyze asymptotic bounds before writing production code.
                </p>
              </div>

              {/* Code Snippet Box */}
              <div
                style={{
                  background: '#0F172A',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    background: '#1E293B',
                    color: '#94A3B8',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code size={14} style={{ color: '#10B981' }} />
                    <span>{currentTopic?.practiceType === 'SQL' ? 'query.sql' : 'Solution.java'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'transparent',
                      border: 'none',
                      color: copiedCode ? '#34D399' : '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {copiedCode ? <CheckCheck size={14} /> : <Copy size={14} />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre
                  style={{
                    padding: '16px',
                    margin: 0,
                    color: '#F8FAFC',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    fontFamily: 'Consolas, Monaco, monospace',
                    overflowX: 'auto',
                  }}
                >
                  {getCodeSnippet()}
                </pre>
              </div>

              {/* Interactive Practice Check */}
              <div
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '18px',
                  background: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <HelpCircle size={16} style={{ color: '#D97706' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    Quick Knowledge Check
                  </span>
                </div>
                <p style={{ fontSize: '13.5px', color: '#475569', marginBottom: '12px' }}>
                  What is the average time complexity and primary pitfall associated with this pattern?
                </p>
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  {showSolution ? 'Hide Explanation' : 'Reveal Solution & Trade-offs'}
                </button>
                {showSolution && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#ECFDF5',
                      borderRadius: '8px',
                      border: '1px solid #A7F3D0',
                      fontSize: '13px',
                      color: '#065F46',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Solution:</strong> The optimal time complexity is <strong>O(N)</strong> or <strong>O(log N)</strong> with <strong>O(1)</strong> auxiliary space. Common pitfalls include off-by-one boundary checks and null reference pointers.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom Control / Navigation Bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              disabled={!prevTopic}
              onClick={() => prevTopic && onSelectTopic(prevTopic)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: prevTopic ? '#334155' : '#94A3B8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: prevTopic ? 'pointer' : 'not-allowed',
                opacity: prevTopic ? 1 : 0.6,
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous Lesson</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteAndNext}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isCompleted ? 'Next Lesson' : 'Mark Complete & Next'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
