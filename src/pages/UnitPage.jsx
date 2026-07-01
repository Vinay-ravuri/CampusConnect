import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import AIAssistant from '../components/AIAssistant'
import api from '../api/axios'
import { getUnitsBySubject } from '../api/subjects'
import PremiumBackground3D from '../components/PremiumBackground3D'
import { getDemoUnits, isEngineeringPhysics } from '../api/demoData'

const REG_INFO = {
  JNTUK: { label: 'JNTUK', color: '#FF7A00' },
  AU:    { label: 'AU',    color: '#FFB800' },
  UNI:   { label: 'UNI',  color: '#F97316' },
}

export default function UnitPage() {
  const { regId, subjectId } = useParams()
  const navigate  = useNavigate()
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [subject, setSubject] = useState(null)
  const [units, setUnits]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/public/subject/${subjectId}`),
      getUnitsBySubject(subjectId),
    ])
      .then(([subjectRes, unitsData]) => {
        const sub = subjectRes.data
        setSubject(sub)
        let units = Array.isArray(unitsData) ? unitsData : []
        // ── DEMO FALLBACK ─────────────────────────────────
        if (units.length === 0 && isEngineeringPhysics(sub?.name || '')) {
          units = getDemoUnits()
        }
        setUnits(units)
      })
      .catch(err => {
        console.error('Failed to load unit data:', err)
        setUnits(getDemoUnits())
      })
      .finally(() => setLoading(false))
  }, [subjectId])

  const reg = REG_INFO[regId] || REG_INFO.JNTUK

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
        maxWidth: '740px',
        margin: '0 auto',
        padding: '120px 24px 60px',
      }}>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate(`/student/${regId}`)}
          whileHover={{ x: -4, color: reg.color }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-3)',
            cursor: 'pointer',
            fontSize: '12px',
            letterSpacing: '1.5px',
            fontFamily: 'var(--font-accent)',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            transition: 'color 0.25s',
          }}
        >
          ← Back to Subjects
        </motion.button>

        {/* Breadcrumb Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '100px',
          padding: '6px 18px',
          width: 'fit-content',
        }}>
          {[reg.label, subject?.name || 'Subject', 'Select Unit'].map((item, i, arr) => (
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

        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: 'clamp(24px, 4vw, 42px)',
            letterSpacing: '-1px',
            color: 'var(--text)',
            lineHeight: 1.1,
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            {loading ? 'READING FILE…' : (subject?.name || 'Subject')}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Select a unit breakdown to discover notes, videos, and questions.</p>
        </motion.div>

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

        {/* Unit List Rows */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {units.map((unit, i) => {
              const isRowHovered = hovered === unit.id
              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => navigate(`/student/${regId}/${subjectId}/${unit.id}`)}
                  onMouseEnter={() => setHovered(unit.id)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={{ x: 6 }}
                  style={{
                    background: isRowHovered ? reg.color + '05' : 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(28px)',
                    border: `1px solid ${isRowHovered ? reg.color + '30' : 'rgba(255, 255, 255, 0.45)'}`,
                    borderRadius: '18px',
                    padding: '24px 28px',
                    cursor: 'pointer',
                    boxShadow: isRowHovered ? `0 12px 28px ${reg.color}10` : 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Unit Number Badge */}
                    <motion.div
                      animate={{
                        background: isRowHovered ? reg.color : 'rgba(91, 108, 255, 0.05)',
                        borderColor: isRowHovered ? 'transparent' : 'rgba(91, 108, 255, 0.15)',
                      }}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        border: '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '16px',
                        color: isRowHovered ? '#fff' : reg.color,
                      }}>
                        {unit.unitNumber}
                      </span>
                    </motion.div>
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '16px',
                        fontWeight: 800,
                        color: 'var(--text)',
                        marginBottom: '4px',
                        letterSpacing: '-0.2px',
                      }}>
                        {unit.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                        Study Notes · Video Lectures · Question Files
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ color: isRowHovered ? reg.color : 'var(--text-4)', x: isRowHovered ? 4 : 0 }}
                    style={{ fontSize: '20px' }}
                  >
                    →
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && units.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '56px 0', color: 'var(--text-4)' }}
          >
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>📚</div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-2)',
            }}>
              No Units Indexed
            </h4>
          </motion.div>
        )}
      </div>

      <AIAssistant />
    </div>
  )
}