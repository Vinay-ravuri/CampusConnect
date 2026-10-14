import React from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  FileCheck2,
  Mic,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  Volume2
} from 'lucide-react'

export default function CareerFeatureCards({
  onOpenSkillChecker,
  onOpenResumeAnalyzer,
  onOpenMockInterview
}) {
  const cards = [
    {
      id: 'skill-checker',
      category: 'SKILL INTELLIGENCE',
      title: 'AI Skill Checker',
      tagline: 'Know where you stand.',
      description: 'Evaluate your technical and professional skills, identify gaps, and discover what to learn next.',
      actionText: 'Check My Skills →',
      onAction: onOpenSkillChecker,
      accentType: 'purple',
      icon: Brain,
      decorIcon: Layers,
      theme: {
        pillBg: 'rgba(124, 58, 237, 0.08)',
        pillText: '#6D28D9',
        pillBorder: 'rgba(124, 58, 237, 0.2)',
        gradient: 'linear-gradient(145deg, #FFFFFF 0%, #FAF5FF 100%)',
        border: 'rgba(167, 139, 250, 0.35)',
        hoverBorder: '#7C3AED',
        glow: 'rgba(124, 58, 237, 0.12)',
        btnBg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        btnShadow: '0 6px 20px rgba(124, 58, 237, 0.28)',
        iconBg: 'linear-gradient(135deg, #EEF2FF 0%, #EDE9FE 100%)',
        iconColor: '#6D28D9',
      },
      benefits: [
        'Role-targeted 4-step skill assessment',
        'Visual skill gap matrix & readiness score',
        'Curated course recommendations & real job match',
      ],
    },
    {
      id: 'resume-score',
      category: 'ATS & RESUME AUDIT',
      title: 'AI Resume Score',
      tagline: 'Turn your resume into an opportunity.',
      description: 'Upload your resume and receive an AI-powered score, ATS analysis, strengths, weaknesses, and improvement suggestions.',
      actionText: 'Analyze My Resume →',
      onAction: onOpenResumeAnalyzer,
      accentType: 'orange',
      icon: FileCheck2,
      decorIcon: Award,
      theme: {
        pillBg: 'rgba(234, 88, 12, 0.08)',
        pillText: '#C2410C',
        pillBorder: 'rgba(234, 88, 12, 0.2)',
        gradient: 'linear-gradient(145deg, #FFFFFF 0%, #FFF7ED 100%)',
        border: 'rgba(251, 146, 60, 0.35)',
        hoverBorder: '#EA580C',
        glow: 'rgba(234, 88, 12, 0.12)',
        btnBg: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #EA580C 100%)',
        btnShadow: '0 6px 20px rgba(37, 99, 235, 0.25)',
        iconBg: 'linear-gradient(135deg, #EFF6FF 0%, #FFEDD5 100%)',
        iconColor: '#EA580C',
      },
      benefits: [
        '7-stage deep document intelligence',
        'Granular ATS compatibility & keyword gap audit',
        'Fact-preserving bullet point rewrites & suggestions',
      ],
    },
    {
      id: 'mock-interview',
      category: 'VOICE INTERVIEW LAB',
      title: 'AI Mock Interview',
      tagline: 'Practice before the real interview.',
      description: 'Have a real-time voice conversation with an AI interviewer based on your resume and target role.',
      subnote: 'NO CAMERA · VOICE ONLY',
      actionText: 'Start Mock Interview →',
      onAction: onOpenMockInterview,
      accentType: 'teal',
      icon: Mic,
      decorIcon: Volume2,
      theme: {
        pillBg: 'rgba(13, 148, 136, 0.08)',
        pillText: '#0F766E',
        pillBorder: 'rgba(13, 148, 136, 0.2)',
        gradient: 'linear-gradient(145deg, #FFFFFF 0%, #F0FDFA 100%)',
        border: 'rgba(45, 212, 191, 0.35)',
        hoverBorder: '#0D9488',
        glow: 'rgba(13, 148, 136, 0.12)',
        btnBg: 'linear-gradient(135deg, #0F766E 0%, #0D9488 60%, #2563EB 100%)',
        btnShadow: '0 6px 20px rgba(13, 148, 136, 0.28)',
        iconBg: 'linear-gradient(135deg, #E0F2FE 0%, #CCFBF1 100%)',
        iconColor: '#0F766E',
      },
      benefits: [
        'Real voice interaction with speech recognition & audio reply',
        'Dynamic questions generated directly from your resume',
        'Post-interview score & question-by-question coaching',
      ],
    },
  ]

  return (
    <section style={{ margin: '32px 0 48px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
      }}>
        {cards.map((card, idx) => {
          const IconComp = card.icon
          const DecorIcon = card.decorIcon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                position: 'relative',
                background: card.theme.gradient,
                border: `1.5px solid ${card.theme.border}`,
                borderRadius: 24,
                padding: '30px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: `0 12px 32px -8px ${card.theme.glow}, 0 2px 6px rgba(0,0,0,0.02)`,
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              {/* Subtle Decorative Background Element */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 140,
                  height: 140,
                  opacity: 0.06,
                  pointerEvents: 'none',
                  color: card.theme.pillText,
                }}
              >
                <DecorIcon size={140} strokeWidth={1.5} />
              </div>

              <div>
                {/* Top Row: Icon & Category Label */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 18,
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: card.theme.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.theme.iconColor,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  }}>
                    <IconComp size={24} />
                  </div>

                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.8px',
                    color: card.theme.pillText,
                    background: card.theme.pillBg,
                    border: `1px solid ${card.theme.pillBorder}`,
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {card.category}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h2 style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.02em',
                  margin: '0 0 6px 0',
                }}>
                  {card.title}
                </h2>

                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: card.theme.pillText,
                  marginBottom: 12,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  “{card.tagline}”
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: '#475569',
                  margin: '0 0 20px 0',
                  minHeight: 46,
                }}>
                  {card.description}
                </p>

                {card.subnote && (
                  <div style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    color: '#0F766E',
                    background: '#CCFBF1',
                    padding: '2px 8px',
                    borderRadius: 6,
                    marginBottom: 16,
                  }}>
                    {card.subnote}
                  </div>
                )}

                {/* Benefit Points */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  marginBottom: 26,
                  borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                  paddingTop: 16,
                }}>
                  {card.benefits.map((point, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      fontSize: '0.85rem',
                      lineHeight: 1.45,
                      color: '#334155',
                      fontWeight: 500,
                    }}>
                      <CheckCircle2
                        size={15}
                        color={card.theme.iconColor}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary CTA */}
              <button
                onClick={card.onAction}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: 14,
                  background: card.theme.btnBg,
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: card.theme.btnShadow,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.filter = 'brightness(1.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.filter = 'brightness(1)'
                }}
              >
                <span>{card.actionText}</span>
              </button>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
