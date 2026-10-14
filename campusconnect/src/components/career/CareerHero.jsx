import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ShieldCheck, Zap, Mic, FileText, CheckCircle2 } from 'lucide-react'

export default function CareerHero({ onExploreClick }) {
  return (
    <section style={{
      position: 'relative',
      padding: '48px 0 36px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
        gap: 48,
        alignItems: 'center',
      }}>
        {/* Left Column: Heading and Value Proposition */}
        <div>
          {/* Subtle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 30,
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
              border: '1px solid rgba(37, 99, 235, 0.18)',
              marginBottom: 20,
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: '#FFFFFF',
            }}>
              <Sparkles size={11} />
            </span>
            <span style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: '#1E3A8A',
              letterSpacing: '0.4px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              CAMPUS CONNECT · AI CAREER CENTER
            </span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.3rem, 4vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#0F172A',
              fontFamily: "'Space Grotesk', sans-serif",
              margin: '0 0 20px 0',
            }}
          >
            Build Your Skills.<br />
            <span style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #6366F1 50%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Improve Your Resume.
            </span><br />
            Ace Your Interview.
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.68,
              color: '#475569',
              margin: '0 0 28px 0',
              maxWidth: 580,
              fontWeight: 450,
            }}
          >
            Use AI-powered career tools to understand your strengths,
            improve your resume, discover skill gaps, and practice
            real interview conversations with Voice AI.
          </motion.p>

          {/* Key Value Points */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              marginBottom: 32,
            }}
          >
            {[
              { icon: Zap, label: 'Gemini 2.0 Career Model' },
              { icon: ShieldCheck, label: 'ATS Precision Audit' },
              { icon: Mic, label: 'Real-Time Voice Mock Interview' },
            ].map((pill, i) => (
              <div key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#334155',
                background: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}>
                <pill.icon size={14} color="#2563EB" />
                <span>{pill.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: 'flex', gap: 14, alignItems: 'center' }}
          >
            <button
              onClick={onExploreClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 26px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 14.5,
                fontFamily: "'Space Grotesk', sans-serif",
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25), 0 2px 4px rgba(37, 99, 235, 0.15)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 99, 235, 0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.25)'
              }}
            >
              <span>Explore AI Tools</span>
              <ArrowRight size={17} />
            </button>

            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
              Free for all CampusConnect students
            </span>
          </motion.div>
        </div>

        {/* Right Column: Premium AI Career Illustration Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background Ambient Glow */}
          <div style={{
            position: 'absolute',
            inset: '-10%',
            background: 'radial-gradient(circle at 60% 40%, rgba(99, 102, 241, 0.18) 0%, rgba(37, 99, 235, 0.12) 40%, rgba(249, 115, 22, 0.05) 70%, transparent 80%)',
            filter: 'blur(40px)',
            zIndex: 0,
            pointerEvents: 'none',
          }} />

          {/* Composite AI Career Visual Graphic */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 480,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.85) 100%)',
            borderRadius: 28,
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 48px -12px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(0, 0, 0, 0.04)',
            padding: '24px 28px',
            backdropFilter: 'blur(12px)',
          }}>
            {/* Visual Header bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 16,
              borderBottom: '1px solid #EEF2F6',
              marginBottom: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', fontFamily: "'Space Grotesk', sans-serif" }}>
                    Career Intelligence Core
                  </div>
                  <div style={{ fontSize: 11, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
                    AI Engine Ready
                  </div>
                </div>
              </div>

              {/* Pill Score */}
              <div style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
                border: '1px solid #BFDBFE',
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 700,
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                <CheckCircle2 size={13} color="#2563EB" />
                <span>94% Role Readiness</span>
              </div>
            </div>

            {/* Main Interactive Visual Schema */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
              
              {/* Mock Resume Card */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                padding: '14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <FileText size={15} color="#2563EB" />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1E293B' }}>
                    Resume Audit: Vinay.pdf
                  </span>
                </div>
                {/* Score bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#64748B', marginBottom: 2 }}>
                      <span>ATS Compatibility</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>88%</span>
                    </div>
                    <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg, #2563EB, #38BDF8)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#64748B', marginBottom: 2 }}>
                      <span>Technical Stack Match</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>92%</span>
                    </div>
                    <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #A855F7)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#64748B', marginBottom: 2 }}>
                      <span>Impact &amp; Metrics</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>74%</span>
                    </div>
                    <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: '74%', height: '100%', background: 'linear-gradient(90deg, #F97316, #FBBF24)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Mock Interview Card */}
              <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                borderRadius: 16,
                padding: '14px',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', color: '#38BDF8', textTransform: 'uppercase' }}>
                      Voice Lab
                    </span>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px #38BDF8' }} />
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>
                    AI Interviewer
                  </div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>
                    Listening to response...
                  </div>
                </div>

                {/* Animated Waveform Simulation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, margin: '8px 0' }}>
                  {[14, 26, 18, 32, 22, 12, 28, 20].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [h * 0.4, h, h * 0.4] }}
                      transition={{ duration: 1 + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: 3.5,
                        background: 'linear-gradient(180deg, #38BDF8, #818CF8)',
                        borderRadius: 3,
                      }}
                    />
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 10,
                  color: '#CBD5E1',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  alignSelf: 'flex-start',
                }}>
                  <Mic size={11} color="#38BDF8" />
                  <span>Audio Active</span>
                </div>
              </div>

            </div>

            {/* Bottom Target Role & Skill Badges */}
            <div style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 14,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>Target Role:</span>
                <span style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#1E40AF',
                  background: '#DBEAFE',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}>
                  Java Full Stack Developer
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['Java', 'Spring', 'React'].map((tag, i) => (
                  <span key={i} style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#64748B',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtle Floating Highlight Badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: -14,
                right: 20,
                background: '#FFFFFF',
                border: '1px solid #FED7AA',
                boxShadow: '0 8px 18px rgba(249, 115, 22, 0.12)',
                borderRadius: 20,
                padding: '5px 12px',
                fontSize: 11.5,
                fontWeight: 700,
                color: '#EA580C',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span style={{ color: '#F97316' }}>★</span>
              <span>+38% Placement Match</span>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
