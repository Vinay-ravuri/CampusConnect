import { motion } from 'framer-motion'

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

const demandConfig = {
  High:   { color: '#10B981', bg: 'rgba(16,185,129,0.1)',   dot: '🟢' },
  Medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   dot: '🟡' },
  Low:    { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',    dot: '🔴' },
}

export default function TrendingSkillsCard({ data = [] }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#F59E0B,#EF4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
        }}>📈</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Industry Trend Intelligence
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            Most in-demand skills in the tech industry right now
          </div>
        </div>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 100px',
        padding: '8px 14px', marginBottom: 8,
        borderBottom: '1px solid rgba(255,122,0,0.1)',
      }}>
        {['Skill', 'Category', 'Demand'].map(h => (
          <div key={h} style={{
            fontSize: 9.5, fontWeight: 700, color: '#9CA3AF',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            fontFamily: "'Space Grotesk',sans-serif",
          }}>{h}</div>
        ))}
      </div>

      {/* Table rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data.map((item, i) => {
          const cfg = demandConfig[item.demand] || demandConfig.Medium
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              whileHover={{ backgroundColor: 'rgba(255,122,0,0.04)' }}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 120px 100px',
                padding: '10px 14px', borderRadius: 10,
                transition: 'background 0.2s',
                borderBottom: i < data.length - 1 ? '1px solid rgba(255,122,0,0.05)' : 'none',
              }}
            >
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 13, color: '#111827', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 14 }}>{cfg.dot}</span>
                {item.skill}
              </div>
              <div style={{
                fontSize: 11, color: '#6B7280', fontWeight: 500,
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 100,
                  background: 'rgba(99,102,241,0.06)', color: '#6366F1',
                  fontSize: 10, fontWeight: 600,
                }}>{item.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 100,
                  background: cfg.bg, color: cfg.color,
                  fontWeight: 700, letterSpacing: '0.3px',
                }}>
                  {item.demand}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
