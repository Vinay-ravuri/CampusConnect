import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import Breadcrumb from '../components/ui/Breadcrumb'
import CareerHero from '../components/career/CareerHero'
import CareerFeatureCards from '../components/career/CareerFeatureCards'
import SkillCheckerModal from '../components/career/SkillCheckerModal'
import ResumeAnalyzerModal from '../components/career/ResumeAnalyzerModal'
import MockInterviewModal from '../components/career/MockInterviewModal'
import MyReportsSection from '../components/career/MyReportsSection'
import { useAuth } from '../context/AuthContext'
import {
  Sparkles,
  LayoutDashboard,
  Brain,
  FileCheck2,
  Mic,
  FileSpreadsheet,
  History,
  BookmarkCheck,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react'

export default function CareerAssistant() {
  const { user } = useAuth()

  // Navigation sidebar selection
  const [activeSection, setActiveSection] = useState('overview') // 'overview' | 'skills' | 'resume' | 'interview' | 'reports' | 'history'

  // Modal Triggers
  const [isSkillCheckerOpen, setIsSkillCheckerOpen] = useState(false)
  const [isResumeAnalyzerOpen, setIsResumeAnalyzerOpen] = useState(false)
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(false)

  const cardsRef = useRef(null)

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, action: () => setActiveSection('overview') },
    { id: 'skills', label: 'AI Skill Checker', icon: Brain, action: () => { setActiveSection('skills'); setIsSkillCheckerOpen(true); } },
    { id: 'resume', label: 'Resume Score', icon: FileCheck2, action: () => { setActiveSection('resume'); setIsResumeAnalyzerOpen(true); } },
    { id: 'interview', label: 'Mock Interview', icon: Mic, action: () => { setActiveSection('interview'); setIsMockInterviewOpen(true); } },
    { id: 'reports', label: 'My AI Reports', icon: FileSpreadsheet, action: () => setActiveSection('reports') },
    { id: 'history', label: 'Interview History', icon: History, action: () => setActiveSection('reports') },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <Navbar />

      {/* Atmospheric Soft Gradient Aura */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-15%',
          right: '-5%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.06) 40%, rgba(249, 115, 22, 0.02) 70%, transparent 80%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '92px 24px 80px',
        maxWidth: 1380,
        margin: '0 auto',
      }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Campus Connect', path: '/' },
            { label: 'AI Career Center' }
          ]}
        />

        {/* 2-Column Responsive Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 28,
          alignItems: 'start',
          marginTop: 8,
        }}>

          {/* ════════ LEFT SIDEBAR ════════ */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 96 }}>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 22,
              padding: '22px 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '1px',
                color: '#1E40AF',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: 14,
                paddingLeft: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Sparkles size={13} color="#2563EB" />
                <span>AI Career Center</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {sidebarItems.map((item) => {
                  const isActive = activeSection === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        fontSize: '0.88rem',
                        fontWeight: isActive ? 700 : 500,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        background: isActive ? '#EFF6FF' : 'transparent',
                        color: isActive ? '#1D4ED8' : '#475569',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = '#F8FAFC'
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <Icon
                        size={18}
                        color={isActive ? '#2563EB' : '#64748B'}
                      />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {isActive && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* User Profile Mini Snapshot */}
              <div style={{
                marginTop: 24,
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                border: '1px solid #E2E8F0',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>
                  Active Student
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
                  {user?.fullName || user?.email?.split('@')[0] || 'Vinay Ravuri'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#2563EB', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={13} />
                  <span>Resume Linked</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ════════ MAIN CONTENT AREA ════════ */}
          <main style={{ minWidth: 0 }}>
            {/* HERO SECTION */}
            <CareerHero onExploreClick={scrollToCards} />

            {/* THREE LARGE FEATURE CARDS */}
            <div ref={cardsRef}>
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  color: '#2563EB',
                  textTransform: 'uppercase',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  THREE DEDICATED AI MODULES
                </span>
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  fontFamily: "'Space Grotesk', sans-serif",
                  margin: '4px 0 0 0',
                }}>
                  Targeted Career Acceleration
                </h2>
              </div>

              <CareerFeatureCards
                onOpenSkillChecker={() => setIsSkillCheckerOpen(true)}
                onOpenResumeAnalyzer={() => setIsResumeAnalyzerOpen(true)}
                onOpenMockInterview={() => setIsMockInterviewOpen(true)}
              />
            </div>

            {/* AI REPORTS & INTERVIEW HISTORY */}
            <MyReportsSection
              onOpenSkillChecker={() => setIsSkillCheckerOpen(true)}
              onOpenResumeAnalyzer={() => setIsResumeAnalyzerOpen(true)}
              onOpenMockInterview={() => setIsMockInterviewOpen(true)}
            />
          </main>
        </div>
      </div>

      {/* ── MODALS ── */}
      <SkillCheckerModal
        isOpen={isSkillCheckerOpen}
        onClose={() => setIsSkillCheckerOpen(false)}
        savedResumeName="vinay_resume.pdf"
      />

      <ResumeAnalyzerModal
        isOpen={isResumeAnalyzerOpen}
        onClose={() => setIsResumeAnalyzerOpen(false)}
        savedResumeName="vinay_resume.pdf"
      />

      <MockInterviewModal
        isOpen={isMockInterviewOpen}
        onClose={() => setIsMockInterviewOpen(false)}
        savedResumeName="vinay_resume.pdf"
      />

      {/* Floating Global AI Assistant */}
      <AIAssistant
        contextTitle="AI Career Center"
        subtitle="Resume & Interview Companion"
        contextPrompts={[
          'How do I improve my resume ATS score?',
          'What are top questions for Java Full Stack?',
          'Explain Spring Boot vs Microservices',
          'Give me mock interview tips for TCS NQT',
        ]}
      />
    </div>
  )
}
