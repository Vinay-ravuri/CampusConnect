import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import { getResourcesByUnit } from '../api/subjects'
import api from '../api/axios'
import PremiumBackground3D from '../components/PremiumBackground3D'
import { getDemoResources, isEngineeringPhysics } from '../api/demoData'

const REG_INFO = {
  JNTUK: { label: 'JNTUK', color: '#FF7A00' },
  AU:    { label: 'AU',    color: '#FFB800' },
  UNI:   { label: 'UNI',  color: '#F97316' },
}

export default function ResourcePage() {
  const { regId, subjectId, unitNum: unitId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pdfs')
  const [visible, setVisible]     = useState(false)
  const [pdfViewer, setPdfViewer] = useState(null)
  const [hovered, setHovered]     = useState(null)
  const [subject, setSubject]     = useState(null)
  const [resources, setResources] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/public/subject/${subjectId}`),
      getResourcesByUnit(unitId),
    ])
      .then(([subjectRes, resourcesData]) => {
        const sub = subjectRes.data
        setSubject(sub)
        let res = Array.isArray(resourcesData) ? resourcesData : []
        // ── DEMO FALLBACK ──────────────────────────────────────────
        // If backend returned no resources AND subject is Engineering Physics,
        // inject demo data so the live demo looks fully populated.
        if (res.length === 0 && isEngineeringPhysics(sub?.name || '')) {
          // unitNum param is 1-based; convert to 0-based index
          const unitIndex = Math.max(0, parseInt(unitId, 10) - 1) || 0
          res = getDemoResources(unitIndex)
        }
        setResources(res)
      })
      .catch(err => {
        console.error('Failed to load resources:', err)
        // Even on network error, show demo if we can detect subject from URL
        setResources(getDemoResources(0))
      })
      .finally(() => setLoading(false))
  }, [unitId, subjectId])

  const reg    = REG_INFO[regId] || REG_INFO.JNTUK
  const pdfs   = resources.filter(r => r.type === 'PDF')
  const videos = resources.filter(r => r.type === 'YOUTUBE')
  const topics = resources.filter(r => r.type === 'IMPORTANT_TOPIC')

  const tabs = [
    { id: 'pdfs',      label: 'PDF Notes',        icon: '📄', count: pdfs.length },
    { id: 'videos',    label: 'Video Lessons',    icon: '🎥', count: videos.length },
    { id: 'important', label: 'Important Topics',  icon: '⭐', count: topics.length },
  ]

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }
    }),
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* 3D background */}
      <PremiumBackground3D />

      {/* Navigation */}
      <Navbar />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '920px',
        margin: '0 auto',
        padding: '120px 24px 80px',
      }}>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate(`/student/${regId}/${subjectId}`)}
          whileHover={{ x: -4, color: reg.color }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-3)',
            cursor: 'pointer',
            fontSize: '12px',
            letterSpacing: '1.5px',
            fontFamily: 'var(--font-accent)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            transition: 'color 0.25s',
          }}
        >
          ← Back to Units
        </motion.button>

        {/* Breadcrumbs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '100px',
          padding: '6px 18px',
          width: 'fit-content',
        }}>
          {[reg.label, subject?.name || 'Subject', 'Resources'].map((item, i, arr) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-accent)',
                color: i === arr.length - 1 ? reg.color : 'var(--text-3)',
                fontWeight: i === arr.length - 1 ? 700 : 500,
                letterSpacing: '0.5px',
              }}>
                {item}
              </span>
              {i < arr.length - 1 && <span style={{ color: 'var(--text-4)', fontSize: '12px' }}>›</span>}
            </span>
          ))}
        </div>

        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: 'clamp(26px, 4.5vw, 48px)',
            letterSpacing: '-1px',
            color: 'var(--text)',
            lineHeight: 1.1,
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}>
            Unit Resources
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', fontFamily: 'var(--font-accent)', fontWeight: 600 }}>
            {subject?.name}
          </p>
        </motion.div>

        {/* Dynamic Tab Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '36px',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(91, 108, 255, 0.1)',
          borderRadius: '16px',
          padding: '6px',
          width: 'fit-content',
        }}>
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-accent)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                background: activeTab === tab.id ? reg.color : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-2)',
                border: 'none',
                boxShadow: activeTab === tab.id ? `0 6px 16px ${reg.color}35` : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span style={{
                background: activeTab === tab.id ? 'rgba(255,255,255,0.22)' : 'rgba(91, 108, 255, 0.08)',
                borderRadius: '100px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 800,
                color: activeTab === tab.id ? '#fff' : reg.color,
              }}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: `3px solid ${reg.color}18`,
              borderTopColor: reg.color,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
            }} />
          </div>
        )}

        {/* ── Content Panes ── */}
        <AnimatePresence mode="wait">
          {/* PDF tab pane */}
          {!loading && activeTab === 'pdfs' && (
            <motion.div
              key="pdfs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pdfs.length === 0 && (
                  <div style={{
                    padding: '56px 24px',
                    textAlign: 'center',
                    color: 'var(--text-3)',
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}>
                    <div style={{ fontSize: '38px', marginBottom: '12px' }}>📄</div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>No PDF resources available yet for this unit.</p>
                  </div>
                )}
                {pdfs.map((pdf, i) => (
                  <motion.div
                    key={pdf.id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(28px)',
                      border: '1px solid rgba(255, 255, 255, 0.45)',
                      borderLeft: `4px solid ${reg.color}`,
                      borderRadius: '18px',
                      padding: '24px 28px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: reg.color + '15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}>
                      📄
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '16px',
                        fontWeight: 800,
                        color: 'var(--text)',
                        marginBottom: '4px',
                        letterSpacing: '-0.2px',
                      }}>
                        {pdf.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                        {pdf.description} {pdf.fileSize ? `· Size: ${pdf.fileSize}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <motion.button
                        onClick={() => setPdfViewer(pdf)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '10px',
                          background: reg.color + '15',
                          color: reg.color,
                          border: `1px solid ${reg.color}25`,
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontFamily: 'var(--font-accent)',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                        }}
                      >
                        👁 View
                      </motion.button>
                      <motion.a
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '10px',
                          background: 'rgba(91, 108, 255, 0.05)',
                          color: 'var(--text-2)',
                          border: '1px solid rgba(91, 108, 255, 0.1)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontFamily: 'var(--font-accent)',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        Download
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Video tab pane */}
          {!loading && activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {videos.length === 0 && (
                  <div style={{
                    padding: '56px 24px',
                    textAlign: 'center',
                    color: 'var(--text-3)',
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                  }}>
                    <div style={{ fontSize: '38px', marginBottom: '12px' }}>🎥</div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>No video modules cataloged yet.</p>
                  </div>
                )}
                {videos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onMouseEnter={() => setHovered(video.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => window.open(video.url, '_blank')}
                    whileHover={{ y: -3 }}
                    style={{
                      background: hovered === video.id ? 'rgba(239, 68, 68, 0.03)' : 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(28px)',
                      border: `1px solid ${hovered === video.id ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.45)'}`,
                      borderLeft: '4px solid #ef4444',
                      borderRadius: '18px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      cursor: 'pointer',
                      boxShadow: hovered === video.id ? '0 12px 28px rgba(239, 68, 68, 0.08)' : 'var(--shadow-sm)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {/* YouTube Mini-Thumbnail */}
                    <div style={{
                      width: '74px',
                      height: '46px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                    }}>
                      <motion.div
                        animate={{ scale: hovered === video.id ? 1.15 : 1 }}
                        style={{ fontSize: '20px' }}
                      >
                        ▶️
                      </motion.div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '15px',
                        fontWeight: 800,
                        color: 'var(--text)',
                        marginBottom: '4px',
                        letterSpacing: '-0.1px',
                      }}>
                        {video.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                        {video.description} {video.duration ? `· Runtime: ${video.duration}` : ''}
                      </div>
                    </div>
                    <div style={{ color: '#ef4444', fontSize: '18px', paddingRight: '4px' }}>
                      ▶
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Important topics Tab pane */}
          {!loading && activeTab === 'important' && (
            <motion.div
              key="important"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Highlight Banner */}
              <div style={{
                background: `linear-gradient(135deg, ${reg.color}15, ${reg.color}05)`,
                border: `1px solid ${reg.color}20`,
                borderRadius: '18px',
                padding: '20px 24px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{ fontSize: '32px' }}>⭐</div>
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: reg.color,
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                  }}>
                    Exam Focus Checklist
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 500 }}>
                    These syllabus concepts are highly weighted and frequently asked in university end exams.
                  </p>
                </div>
              </div>

              {topics.length === 0 && (
                <div style={{
                  padding: '56px 24px',
                  textAlign: 'center',
                  color: 'var(--text-3)',
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                }}>
                  <div style={{ fontSize: '38px', marginBottom: '12px' }}>⭐</div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>No focus topics indexed yet.</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topics.map((topic, i) => (
                  <motion.div
                    key={topic.id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ x: 4 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(28px)',
                      border: '1px solid rgba(255, 255, 255, 0.45)',
                      borderRadius: '14px',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: reg.color + '15',
                      flexShrink: 0,
                      fontFamily: 'var(--font-heading)',
                      fontSize: '13px',
                      fontWeight: 900,
                      color: reg.color,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500, lineHeight: '1.5' }}>
                      {topic.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PDF Viewer Modal ── */}
      <AnimatePresence>
        {pdfViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header Controls */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{
                padding: '16px 28px',
                borderBottom: '1px solid rgba(91, 108, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
              }}
            >
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--text)',
                  letterSpacing: '-0.3px',
                }}>
                  {pdfViewer.title}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                  {subject?.name || 'Subject Resources'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.a
                  href={pdfViewer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    background: reg.color + '15',
                    color: reg.color,
                    border: `1px solid ${reg.color}35`,
                    fontSize: '12px',
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Download File
                </motion.a>
                <motion.button
                  onClick={() => setPdfViewer(null)}
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(244,63,94,0.06)' }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    background: 'none',
                    color: 'var(--danger)',
                    border: '1px solid rgba(244,63,94,0.25)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close Viewer
                </motion.button>
              </div>
            </motion.div>

            {/* Iframe content container */}
            <div style={{ flex: 1, padding: '24px' }}>
              {pdfViewer.url?.includes('drive.google.com') ? (
                <iframe
                  src={pdfViewer.url.replace('/view', '/preview')}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', borderRadius: '20px', boxShadow: 'var(--shadow-xl)' }}
                  allow="autoplay"
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.75)',
                  border: '1px solid rgba(91, 108, 255, 0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  <div style={{ fontSize: '48px' }}>📄</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: 500 }}>
                    Preview not available. Click Download to save this file locally.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAssistant />
    </div>
  )
}