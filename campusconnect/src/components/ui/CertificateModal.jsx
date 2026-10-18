import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  CheckCircle,
  Download,
  Share2,
  X,
  ShieldCheck,
  Edit3,
  Calendar,
  Check,
  Sparkles,
  QrCode
} from 'lucide-react'

export default function CertificateModal({
  isOpen,
  onClose,
  trackTitle = 'Data Structures & Algorithms Masterclass',
  studentName = 'Vinay Kumar',
  date = 'October 2026',
  credentialId = 'CC-CERT-2026-94821',
}) {
  const [currentName, setCurrentName] = useState(studentName)
  const [currentTrack, setCurrentTrack] = useState(trackTitle)
  const [isEditing, setIsEditing] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    if (studentName) setCurrentName(studentName)
  }, [studentName])

  useEffect(() => {
    if (trackTitle) setCurrentTrack(trackTitle)
  }, [trackTitle])

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    const fakeVerificationUrl = `https://campusconnect.edu/verify/${credentialId}`
    navigator.clipboard.writeText(fakeVerificationUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '860px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
            position: 'relative',
            maxHeight: '94vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Actions Bar (Hidden during Print) */}
          <div
            className="no-print"
            style={{
              padding: '14px 22px',
              background: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#10B981' }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 700 }}>
                Official Verified Certificate of Completion
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: isEditing ? '#2563EB' : 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Edit3 size={13} />
                <span>{isEditing ? 'Done Editing Name' : 'Edit Recipient Name'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
              >
                {copiedLink ? <Check size={13} style={{ color: '#10B981' }} /> : <Share2 size={13} />}
                <span>{copiedLink ? 'Link Copied!' : 'Share / Verify'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Download size={13} />
                <span>Print / Download PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Interactive Customization Banner (Visible when editing) */}
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="no-print"
              style={{
                background: '#F0FDF4',
                borderBottom: '1px solid #BBF7D0',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', whiteSpace: 'nowrap' }}>
                  Full Name on Certificate:
                </span>
                <input
                  type="text"
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  placeholder="Enter recipient's full legal name"
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #86EFAC',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', whiteSpace: 'nowrap' }}>
                  Course Track:
                </span>
                <input
                  type="text"
                  value={currentTrack}
                  onChange={(e) => setCurrentTrack(e.target.value)}
                  placeholder="Course Title"
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #86EFAC',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Certificate Body Container - Printable Area */}
          <div
            style={{
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="certificate-printable-area"
              style={{
                padding: '36px 44px',
                background: 'radial-gradient(circle at 50% 50%, #FFFDF8 0%, #F8FAFC 100%)',
                border: '10px double #0F172A',
                borderRadius: '16px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: 'inset 0 0 40px rgba(16, 185, 129, 0.05), 0 4px 20px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '780px',
                boxSizing: 'border-box',
              }}
            >
              {/* Corner Ornaments */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '24px', height: '24px', borderTop: '3px solid #10B981', borderLeft: '3px solid #10B981' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '24px', height: '24px', borderTop: '3px solid #10B981', borderRight: '3px solid #10B981' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '24px', height: '24px', borderBottom: '3px solid #10B981', borderLeft: '3px solid #10B981' }} />
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '24px', height: '24px', borderBottom: '3px solid #10B981', borderRight: '3px solid #10B981' }} />

              {/* Watermark Logo */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '120px',
                  opacity: 0.035,
                  pointerEvents: 'none',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900,
                  letterSpacing: '10px',
                }}
              >
                CAMPUS
              </div>

              {/* Header / Brand */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#059669',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  <ShieldCheck size={18} style={{ color: '#10B981' }} />
                  <span>CAMPUS CONNECT ACADEMIC &amp; PLACEMENT ACCELERATOR</span>
                </div>

                <h1
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '30px',
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '1px',
                    margin: '0 0 6px 0',
                  }}
                >
                  CERTIFICATE OF COMPLETION
                </h1>

                <div
                  style={{
                    width: '90px',
                    height: '3.5px',
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                    margin: '8px auto 0',
                    borderRadius: '2px',
                  }}
                />
              </div>

              {/* Recipient */}
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 10px 0', fontStyle: 'italic' }}>
                This is proudly and officially awarded to
              </p>

              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#0F172A',
                  marginBottom: '14px',
                  borderBottom: '2px dashed #94A3B8',
                  display: 'inline-block',
                  paddingBottom: '4px',
                  minWidth: '340px',
                  letterSpacing: '-0.01em',
                }}
              >
                {currentName || 'Candidate Name'}
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  color: '#475569',
                  maxWidth: '560px',
                  margin: '0 auto 24px',
                }}
              >
                For demonstrating verified mastery across all curriculum modules, live algorithmic coding assessments,
                and technical interview benchmarks in <strong>{currentTrack}</strong>.
              </p>

              {/* Footer Verification Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: '28px',
                  paddingTop: '18px',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                {/* Date & Academic Seal */}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Issue Date
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                    {date}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '8px', fontStyle: 'italic' }}>
                    Academic Director, CampusConnect
                  </div>
                </div>

                {/* Gold Seal Centerpiece */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                      border: '3px solid #FFFFFF',
                    }}
                  >
                    <Award size={32} />
                  </div>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#D97706', letterSpacing: '0.05em' }}>
                    OFFICIAL ACCREDITED
                  </span>
                </div>

                {/* Credential ID & Head Signature */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Credential ID
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: "'Courier New', monospace", fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                    {credentialId}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '8px', fontStyle: 'italic' }}>
                    Head of Placement Operations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
