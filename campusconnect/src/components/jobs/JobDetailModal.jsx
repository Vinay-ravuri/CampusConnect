import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Briefcase, Clock, Bookmark, ArrowRight, CheckCircle2, Building2 } from 'lucide-react'
import CompanyLogo from '../ui/CompanyLogo'

export default function JobDetailModal({
  job,
  isOpen = false,
  onClose,
  isSaved = false,
  onToggleSave,
  onApply,
}) {
  if (!isOpen || !job) return null

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '720px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Bar with Close Button */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              borderRadius: '24px 24px 0 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CompanyLogo name={job.company} size={30} />
              </div>

              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                  }}
                >
                  {job.title}
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  <strong style={{ color: '#334155' }}>{job.company}</strong> • {job.location || 'Bangalore, India'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            {/* Quick Details Badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: '#ECFDF5', color: '#059669' }}>
                {job.type || 'Full Time'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB' }}>
                {job.salary || '₹8–12 LPA'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', background: '#F1F5F9', color: '#475569' }}>
                Posted {job.postedDate || 'Recent'}
              </span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                Job Overview
              </h4>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {job.description || job.shortDesc || `Join ${job.company}'s engineering teams to design and build scalable services and high-performance applications.`}
              </p>
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Required Skills & Technologies
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {job.skills.map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Responsibilities */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Key Responsibilities
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Design, write, and deploy production-grade software adhering to clean code standards.',
                  'Collaborate with product designers, frontend and backend engineers on feature delivery.',
                  'Perform code reviews, optimize database queries, and participate in sprint planning.',
                ].map((resp, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              borderRadius: '0 0 24px 24px',
            }}
          >
            <button
              type="button"
              onClick={(e) => onToggleSave && onToggleSave(e, job)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '10px',
                border: isSaved ? '1px solid #2563EB' : '1px solid #CBD5E1',
                background: isSaved ? '#EFF6FF' : '#FFFFFF',
                color: isSaved ? '#2563EB' : '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Bookmark size={15} style={{ fill: isSaved ? '#2563EB' : 'none' }} />
              <span>{isSaved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                onClose()
                if (onApply) onApply(e, job)
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              }}
            >
              <span>Apply for this Position</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
