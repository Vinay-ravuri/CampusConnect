import { motion } from 'framer-motion'

const ACCENT = '#FF7A00'
const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

const demandColor = { High: '#10B981', Medium: '#F59E0B', Low: '#EF4444' }
const demandBg   = { High: 'rgba(16,185,129,0.1)', Medium: 'rgba(245,158,11,0.1)', Low: 'rgba(239,68,68,0.1)' }

export default function CareerOptionsCard({ data = [] }) {
  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#FF7A00,#FFB800)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(255,122,0,0.3)',
        }}>🎯</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Career Match Recommendations
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            AI-ranked career paths based on your profile
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map((path, i) => (
          <motion.div
            key={path.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: i === 0 ? 'linear-gradient(135deg,rgba(255,122,0,0.06),rgba(255,184,0,0.04))' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${i === 0 ? 'rgba(255,122,0,0.25)' : 'rgba(255,122,0,0.1)'}`,
              borderRadius: 14, padding: '16px 18px',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {i === 0 && (
              <div style={{
                position: 'absolute', top: 10, right: 12,
                fontSize: 9, fontWeight: 800, letterSpacing: '1.5px',
                padding: '3px 8px', borderRadius: 100,
                background: 'linear-gradient(135deg,#FF7A00,#FFB800)',
                color: '#fff', fontFamily: "'Space Grotesk',sans-serif",
              }}>BEST MATCH</div>
            )}

            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: i === 0 ? 'linear-gradient(135deg,#FF7A00,#FFB800)' : 'rgba(255,122,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800,
                fontSize: 11, color: i === 0 ? '#fff' : ACCENT,
              }}>{i + 1}</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: '#111827' }}>
                {path.title}
              </div>
            </div>

            {/* Match % bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Match Score</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: ACCENT, fontFamily: "'Space Grotesk',sans-serif" }}>
                  {path.matchPercent}%
                </span>
              </div>
              <div style={{ height: 7, background: 'rgba(255,122,0,0.12)', borderRadius: 100, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${path.matchPercent}%` }}
                  transition={{ duration: 0.9, delay: i * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: '100%', borderRadius: 100,
                    background: i === 0 ? 'linear-gradient(90deg,#FF7A00,#FFB800)' : 'linear-gradient(90deg,rgba(255,122,0,0.6),rgba(255,184,0,0.6))',
                  }}
                />
              </div>
            </div>

            {/* Badges row */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 10, padding: '3px 9px', borderRadius: 100,
                background: demandBg[path.demand] || 'rgba(16,185,129,0.1)',
                color: demandColor[path.demand] || '#10B981',
                fontWeight: 700, letterSpacing: '0.3px',
              }}>
                ● {path.demand} Demand
              </span>
              <span style={{
                fontSize: 10, padding: '3px 9px', borderRadius: 100,
                background: 'rgba(99,102,241,0.08)', color: '#6366F1',
                fontWeight: 700,
              }}>
                📈 {path.growth} Growth
              </span>
              <span style={{
                fontSize: 10, padding: '3px 9px', borderRadius: 100,
                background: 'rgba(255,122,0,0.08)', color: ACCENT,
                fontWeight: 700,
              }}>
                {path.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
