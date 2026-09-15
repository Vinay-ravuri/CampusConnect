import { motion } from 'framer-motion'

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

function CircularProgress({ value, color, size = 80, strokeWidth = 8 }) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${color}18`} strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

const readinessMetrics = [
  { key: 'overall',       label: 'Placement Readiness',   color: '#FF7A00',   icon: '🎯' },
  { key: 'technical',     label: 'Technical Skills',      color: '#0891B2',   icon: '💻' },
  { key: 'communication', label: 'Communication',         color: '#F59E0B',   icon: '🗣️' },
  { key: 'projectStrength', label: 'Project Strength',     color: '#10B981',   icon: '⚙️' },
]

function getLabel(val) {
  if (val >= 80) return { text: 'Excellent', color: '#10B981' }
  if (val >= 65) return { text: 'Good', color: '#F59E0B' }
  if (val >= 50) return { text: 'Fair', color: '#FF7A00' }
  return { text: 'Needs Work', color: '#EF4444' }
}

export default function PlacementReadinessCard({ data = {} }) {
  const overall = data.overall || 0

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#FF7A00,#F97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(255,122,0,0.3)',
        }}>🎯</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Placement Readiness Predictor
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            AI prediction of your campus placement probability
          </div>
        </div>
      </div>

      {/* Hero score */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 24,
        background: 'linear-gradient(135deg,rgba(255,122,0,0.06),rgba(255,184,0,0.04))',
        border: '1px solid rgba(255,122,0,0.15)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <CircularProgress value={overall} color="#FF7A00" size={100} strokeWidth={9} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontWeight: 900, fontSize: 22, color: '#FF7A00', lineHeight: 1,
            }}>{overall}%</div>
            <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>OVERALL</div>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 6 }}>
            Placement Readiness
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 100,
            background: `${getLabel(overall).color}15`,
            color: getLabel(overall).color,
            fontWeight: 700, fontSize: 12,
          }}>
            <span>●</span> {getLabel(overall).text}
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 8, lineHeight: 1.5 }}>
            Based on your skills, profile, and market demand analysis.
          </p>
        </div>
      </div>

      {/* Individual metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {readinessMetrics.slice(1).map((m, i) => {
          const val = data[m.key] || 0
          const lbl = getLabel(val)
          return (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ fontSize: 18, flexShrink: 0 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: "'Space Grotesk',sans-serif" }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: m.color, fontFamily: "'Space Grotesk',sans-serif" }}>
                    {val}%
                  </span>
                </div>
                <div style={{ height: 8, background: `${m.color}15`, borderRadius: 100, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.9, delay: i * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: `linear-gradient(90deg,${m.color},${m.color}cc)`, borderRadius: 100 }}
                  />
                </div>
              </div>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 100,
                background: `${lbl.color}12`, color: lbl.color,
                fontWeight: 700, flexShrink: 0,
              }}>{lbl.text}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
