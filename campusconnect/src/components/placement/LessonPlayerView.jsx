import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  FileText,
  Download,
  Terminal,
  PlayCircle,
  Clock,
  Layers,
  Lightbulb,
  ExternalLink
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
  // Navigation active tab: 'video' | 'code' | 'notes'
  const [activeTab, setActiveTab] = useState('video')

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

  // ── Video Player State ──
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState('1x')
  const [videoTimestamp, setVideoTimestamp] = useState('04:15 / 24:30')
  const [videoProgress, setVideoProgress] = useState(25)

  // ── Code Editor State ──
  const [selectedLanguage, setSelectedLanguage] = useState('java')
  const [userCode, setUserCode] = useState('')
  const [isCompiling, setIsCompiling] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedNotes, setCopiedNotes] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showAiHint, setShowAiHint] = useState(false)

  // Multi-Language Code Templates
  const codeTemplates = {
    java: `// Solution in Java (JDK 17)
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Executing: ${currentTopic?.title || 'Optimal Algorithm'}");
        
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = solve(nums, target);
        System.out.println("Result Indices: " + Arrays.toString(result));
    }
    
    public static int[] solve(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    python: `# Solution in Python 3.11
def solve(nums, target):
    """
    Optimal Hash Map Lookup - O(N) Time, O(N) Space
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = solve(nums, target)
    print(f"Executing: ${currentTopic?.title || 'Algorithm'}")
    print(f"Optimal Result: {result}")`,
    cpp: `// Solution in C++20
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> solve(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    cout << "Executing: ${currentTopic?.title || 'Algorithm'} in C++" << endl;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> ans = solve(nums, target);
    cout << "Success: [" << ans[0] << ", " << ans[1] << "]" << endl;
    return 0;
}`,
    javascript: `// Solution in JavaScript (Node.js)
function solve(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

console.log("Executing: ${currentTopic?.title || 'Algorithm'}");
const result = solve([2, 7, 11, 15], 9);
console.log("Result Indices:", result);`,
    sql: `-- Practical Query for ${currentTopic?.title || 'Database Module'}
SELECT 
    department_id,
    employee_name,
    salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_in_dept
FROM 
    employees
WHERE 
    status = 'ACTIVE'
LIMIT 10;`,
  }

  // Update code when topic or language changes
  useEffect(() => {
    setUserCode(codeTemplates[selectedLanguage] || codeTemplates.java)
    setConsoleOutput(null)
    setShowAiHint(false)
  }, [currentTopic?.id, selectedLanguage])

  // Run Code Simulation
  const handleRunCode = () => {
    setIsCompiling(true)
    setConsoleOutput(null)

    setTimeout(() => {
      setIsCompiling(false)
      setConsoleOutput({
        status: 'SUCCESS',
        stdout: `Executing: ${currentTopic?.title || 'Optimal Algorithm'}\nResult Indices: [0, 1]\nAll Assertions Passed!`,
        time: '34 ms',
        memory: '14.8 MB',
        testCases: [
          { name: 'Test Case 1 (Standard Array)', passed: true, input: '[2, 7, 11, 15], target=9', expected: '[0, 1]' },
          { name: 'Test Case 2 (Duplicates & Zeroes)', passed: true, input: '[3, 3], target=6', expected: '[0, 1]' },
          { name: 'Test Case 3 (Large Bound Limits)', passed: true, input: '[10^5 elements]', expected: 'Matched in <50ms' },
        ],
      })
    }, 900)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyNotes = () => {
    const notesContent = `CampusConnect Placement Prep Notes
Topic: ${currentTopic?.title}
Course: ${course?.title || 'Engineering Accelerator'}

SUMMARY:
${currentTopic?.conceptSummary || currentTopic?.description || 'Core foundational concepts tested across top engineering assessments.'}

TIME & SPACE COMPLEXITY:
- Optimal Time Complexity: O(N)
- Auxiliary Space: O(1) or O(N) depending on storage technique.

RECURRING INTERVIEW PATTERNS:
1. Always clarify input edge cases (empty arrays, boundary integers, negative numbers).
2. Start with a brute force approach O(N^2) before deriving the optimal O(N) or O(log N) technique.
3. Defend your data structure selection (why HashMap vs Two-Pointers).`

    navigator.clipboard.writeText(notesContent)
    setCopiedNotes(true)
    setTimeout(() => setCopiedNotes(false), 2000)
  }

  const handleCompleteAndNext = async () => {
    if (!isCompleted) {
      await onToggleCompletion(currentTopic.id)
    }
    if (nextTopic) {
      onSelectTopic(nextTopic)
    } else {
      if (onCompleteCourse) onCompleteCourse()
    }
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
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
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B' }}>
              {course?.title || 'Placement Track'} • {currentTopic?.moduleTitle || 'Core Module'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                fontSize: '16px',
                fontWeight: 800,
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
              Lesson {currentIndex + 1} of {allTopics.length || 1}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>
              {progressPct}% Completed
            </div>
          </div>
          <div style={{ width: '84px', height: '6px', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: '#10B981', borderRadius: '9999px' }} />
          </div>
        </div>
      </div>

      {/* ── 2-Column Split: Curriculum Drawer (Left) & Main Workspace (Right) ── */}
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
          className="hidden md:block cc-sticky-sidebar"
        >
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#64748B',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Course Curriculum</span>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
              {completedCount}/{allTopics.length} Done
            </span>
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
                        width: '20px',
                        height: '20px',
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

        {/* Right Workspace with 3 Modes */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* View Tab Selector */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '6px',
              marginBottom: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'video' ? '#0F172A' : 'transparent',
                color: activeTab === 'video' ? '#FFFFFF' : '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <PlayCircle size={16} style={{ color: activeTab === 'video' ? '#10B981' : '#64748B' }} />
              <span>Video Masterclass</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'code' ? '#0F172A' : 'transparent',
                color: activeTab === 'code' ? '#FFFFFF' : '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Code size={16} style={{ color: activeTab === 'code' ? '#38BDF8' : '#64748B' }} />
              <span>Live Coding IDE</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'notes' ? '#0F172A' : 'transparent',
                color: activeTab === 'notes' ? '#FFFFFF' : '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <BookOpen size={16} style={{ color: activeTab === 'notes' ? '#F59E0B' : '#64748B' }} />
              <span>Notes &amp; Cheatsheet</span>
            </button>
          </div>

          {/* ══════ TAB 1: VIDEO MASTERCLASS ══════ */}
          {activeTab === 'video' && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                marginBottom: '20px',
              }}
            >
              {/* Responsive Video Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#090D16',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                  marginBottom: '18px',
                }}
              >
                {/* Visual Backdrop with Tech Ambient Glow */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.2) 0%, rgba(5, 150, 105, 0.1) 40%, transparent 80%)',
                  }}
                />

                {/* Big Center Play Button Overlay */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0F172A',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                    zIndex: 2,
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                </button>

                {/* Watermark Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(6px)',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 700,
                  }}
                >
                  <span className="live-pulse-dot" />
                  <span>HD 1080p Masterclass • CampusConnect Lecture</span>
                </div>

                {/* Bottom Video Controls Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px 20px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex' }}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <span>{videoTimestamp}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const speeds = ['1x', '1.25x', '1.5x', '2x']
                        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length
                        setPlaybackSpeed(speeds[nextIdx])
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: 'none',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {playbackSpeed}
                    </button>
                    <Volume2 size={18} style={{ cursor: 'pointer' }} />
                    <Maximize2 size={18} style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              </div>

              {/* Video Chapters / Key Timestamps */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                  Lecture Key Timestamps &amp; Chapters
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { time: '00:00', title: 'Problem Statement & Naive Approach' },
                    { time: '05:40', title: 'Optimizing with Hash Lookup' },
                    { time: '12:15', title: 'Live Code Walkthrough & Memory Tracing' },
                    { time: '18:50', title: 'Common Mistakes in Technical Screening' },
                  ].map((ch) => (
                    <button
                      key={ch.time}
                      type="button"
                      onClick={() => setVideoTimestamp(`${ch.time} / 24:30`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        background: '#F8FAFC',
                        color: '#334155',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <Clock size={12} style={{ color: '#2563EB' }} />
                      <strong>{ch.time}</strong>
                      <span>{ch.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════ TAB 2: LIVE CODING IDE ══════ */}
          {activeTab === 'code' && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                marginBottom: '20px',
              }}
            >
              {/* Code Playground Toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  background: '#0F172A',
                  padding: '10px 16px',
                  borderRadius: '12px 12px 0 0',
                  color: '#FFFFFF',
                }}
              >
                {/* Language Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={15} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>Language:</span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{
                      background: '#1E293B',
                      border: '1px solid #334155',
                      color: '#F8FAFC',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="java">Java 17 (Recommended)</option>
                    <option value="python">Python 3.11</option>
                    <option value="cpp">C++ 20</option>
                    <option value="javascript">JavaScript (Node.js)</option>
                    <option value="sql">SQL Query Arena</option>
                  </select>
                </div>

                {/* Code Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAiHint(!showAiHint)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#FDE047',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Lightbulb size={13} />
                    <span>AI Hint</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedCode ? <CheckCheck size={13} style={{ color: '#10B981' }} /> : <Copy size={13} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isCompiling}
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: isCompiling ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    <Play size={13} />
                    <span>{isCompiling ? 'Compiling...' : 'Run Code'}</span>
                  </button>
                </div>
              </div>

              {/* AI Hint Box if active */}
              {showAiHint && (
                <div
                  style={{
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    padding: '10px 16px',
                    fontSize: '12.5px',
                    color: '#92400E',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <Sparkles size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Campus AI Code Guidance:</strong> Instead of checking all pairs with a nested loop (which takes O(N²)), maintain a lookup table (HashMap/Dictionary) of elements you have already inspected. You can look up the complement in O(1) time.
                  </div>
                </div>
              )}

              {/* Editable Code Editor Area */}
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck="false"
                rows={16}
                style={{
                  width: '100%',
                  background: '#0B1120',
                  color: '#F8FAFC',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  padding: '16px',
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />

              {/* Console / Test Cases Results Window */}
              {consoleOutput && (
                <div
                  style={{
                    background: '#090D16',
                    borderTop: '1px solid #1E293B',
                    borderRadius: '0 0 12px 12px',
                    padding: '14px 18px',
                    color: '#E2E8F0',
                    fontFamily: 'monospace',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>
                        All 3 Test Cases Passed!
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                      Runtime: <strong>{consoleOutput.time}</strong> • Memory: <strong>{consoleOutput.memory}</strong>
                    </div>
                  </div>

                  <pre style={{ margin: 0, fontSize: '12px', color: '#38BDF8', lineHeight: 1.5, background: '#0F172A', padding: '10px', borderRadius: '6px' }}>
                    {consoleOutput.stdout}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ══════ TAB 3: NOTES & CHEATSHEET ══════ */}
          {activeTab === 'notes' && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    Master Lecture Notes: {currentTopic?.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    Official interview revision notes formulated for campus hiring technical assessments.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleCopyNotes}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#334155',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedNotes ? <CheckCheck size={13} style={{ color: '#10B981' }} /> : <Copy size={13} />}
                    <span>{copiedNotes ? 'Notes Copied!' : 'Copy Notes'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={13} />
                    <span>Download Notes (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Core Concept Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                    📌 Conceptual Foundation
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {currentTopic?.conceptSummary || currentTopic?.description || 'This algorithmic concept is frequently tested across Tier-1 recruiters including Google, Amazon, and Microsoft to gauge candidate proficiency in asymptotic reasoning and state manipulation.'}
                  </p>
                </div>

                {/* Asymptotic Analysis Table */}
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#0F172A', color: '#FFFFFF' }}>
                        <th style={{ padding: '10px 14px' }}>Approach</th>
                        <th style={{ padding: '10px 14px' }}>Time Complexity</th>
                        <th style={{ padding: '10px 14px' }}>Space Complexity</th>
                        <th style={{ padding: '10px 14px' }}>Best Suited For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>Brute Force</td>
                        <td style={{ padding: '10px 14px', color: '#DC2626' }}>O(N²)</td>
                        <td style={{ padding: '10px 14px', color: '#059669' }}>O(1)</td>
                        <td style={{ padding: '10px 14px', color: '#64748B' }}>Tiny inputs (N &lt; 100)</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#ECFDF5' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#065F46' }}>Optimal (Hash Table)</td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#059669' }}>O(N)</td>
                        <td style={{ padding: '10px 14px', color: '#2563EB' }}>O(N)</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#065F46' }}>Standard Technical Interviews</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>Two-Pointers (Sorted)</td>
                        <td style={{ padding: '10px 14px', color: '#059669' }}>O(N log N)</td>
                        <td style={{ padding: '10px 14px', color: '#059669' }}>O(1)</td>
                        <td style={{ padding: '10px 14px', color: '#64748B' }}>In-place memory constraints</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Common Interview Questions & Edge Cases */}
                <div style={{ background: '#EFF6FF', padding: '16px', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', margin: '0 0 8px 0' }}>
                    💡 Top 3 Questions Asked by Recruiters
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#1E3A8A', lineHeight: 1.6 }}>
                    <li>How does your algorithm behave when array elements contain negative values or zeroes?</li>
                    <li>Can this problem be solved with O(1) auxiliary space if the input is pre-sorted?</li>
                    <li>What is the average vs worst-case lookup time in the underlying hash map bucket implementation?</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── Quick Knowledge Check Card ── */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '16px',
              padding: '18px 24px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <HelpCircle size={16} style={{ color: '#D97706' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Quick Technical Knowledge Check
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
