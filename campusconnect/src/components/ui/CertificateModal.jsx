import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, CheckCircle, Download, Share2, X, ShieldCheck } from 'lucide-react'

export default function CertificateModal({ isOpen, onClose, trackTitle = 'Data Structures & Algorithms Masterclass', studentName = 'Vinay Kumar', date = 'October 2026', credentialId = 'CC-CERT-2026-94821' }) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '820px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
        >
          {/* Top Actions Bar */}
          <div
            style={{
              padding: '16px 24px',
              background: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#10B981' }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 700 }}>
                Verified Official Certificate
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handlePrint}
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
                  gap: '6px',
                }}
              >
                <Download size={13} />
                <span>Print / Download PDF</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Certificate Body Container */}
          <div
            style={{
              padding: '40px 48px',
              background: 'radial-gradient(circle at 50% 50%, #FFFDF8 0%, #F8FAFC 100%)',
              border: '12px solid #0F172A',
              margin: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: 'inset 0 0 40px rgba(16, 185, 129, 0.05)',
            }}
          >
            {/* Watermark Logo */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '140px',
                opacity: 0.03,
                pointerEvents: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
              }}
            >
              CAMPUS
            </div>

            {/* Header / Brand */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#059669',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
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
                  fontSize: '34px',
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
                  width: '80px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #10B981, #059669)',
                  margin: '10px auto 0',
                  borderRadius: '2px',
                }}
              />
            </div>

            {/* Recipient */}
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 12px 0', fontStyle: 'italic' }}>
              This is proudly and officially awarded to
            </p>

            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '30px',
                fontWeight: 900,
                color: '#0F172A',
                marginBottom: '16px',
                borderBottom: '2px dashed #CBD5E1',
                display: 'inline-block',
                paddingBottom: '6px',
                minWidth: '320px',
              }}
            >
              {studentName}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#475563',
                maxWidth: '560px',
                margin: '0 auto 28px',
              }}
            >
              For successfully completing all rigorous curriculum modules, algorithmic challenges, code reviews,
              and interview benchmarks in <strong>{trackTitle}</strong> with verified proficiency.
            </p>

            {/* Footer Verification Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '36px',
                paddingTop: '20px',
                borderTop: '1px solid #E2E8F0',
              }}
            >
              {/* Date */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Issue Date
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
                  {date}
                </div>
              </div>

              {/* Gold Seal */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 6px 18px rgba(245, 158, 11, 0.4)',
                  border: '3px solid #FFFFFF',
                }}
              >
                <Award size={32} />
              </div>

              {/* Credential ID */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Credential ID
                </div>
                <div style={{ fontSize: '12px', fontFamily: "'Courier New', monospace", fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                  {credentialId}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
