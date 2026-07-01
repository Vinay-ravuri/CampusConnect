import { motion } from 'framer-motion'

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

export default function RoadmapCard({ data = [] }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#10B981,#059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
        }}>🗺️</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Personalized Learning Roadmap
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            Your AI-generated 6-month path to placement
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 14, top: 0, bottom: 0,
          width: 2,
          background: 'linear-gradient(to bottom, #FF7A00, rgba(255,122,0,0.1))',
          borderRadius: 2,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {data.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', paddingBottom: i === data.length - 1 ? 0 : 28 }}
            >
              {/* Circle indicator */}
              <div style={{
                position: 'absolute', left: -38, top: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: item.completed
                  ? 'linear-gradient(135deg,#10B981,#059669)'
                  : 'linear-gradient(135deg,#FF7A00,#FFB800)',
                border: '3px solid #FFFDF8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: '#fff', fontWeight: 800,
                boxShadow: item.completed
                  ? '0 0 0 4px rgba(16,185,129,0.15)'
                  : '0 0 0 4px rgba(255,122,0,0.15)',
                fontFamily: "'Space Grotesk',sans-serif",
                zIndex: 1,
              }}>
                {item.completed ? '✓' : item.month}
              </div>

              {/* Content */}
              <div style={{
                background: 'rgba(255,255,255,0.8)',
                border: `1px solid ${item.completed ? 'rgba(16,185,129,0.2)' : 'rgba(255,122,0,0.12)'}`,
                borderRadius: 14, padding: '14px 16px',
                marginLeft: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: '1.2px',
                    padding: '2px 8px', borderRadius: 100,
                    background: 'rgba(255,122,0,0.08)', color: '#FF7A00',
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}>
                    MONTH {item.month}
                  </span>
                  {item.completed && (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 100,
                      background: 'rgba(16,185,129,0.1)', color: '#10B981',
                    }}>✓ DONE</span>
                  )}
                </div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 4 }}>
                  {item.step}
                </div>
                <p style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.6, marginBottom: 8 }}>
                  {item.description}
                </p>

                {/* Resources */}
                {item.resources?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginRight: 4 }}>📚</span>
                    {item.resources.slice(0, 3).map((r, ri) => (
                      <span key={ri} style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 100,
                        background: 'rgba(99,102,241,0.06)', color: '#6366F1', fontWeight: 600,
                      }}>{r}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
