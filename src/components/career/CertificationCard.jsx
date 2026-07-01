import { motion } from 'framer-motion'

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

const relevanceConfig = {
  High:   { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  Medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
}

const providerEmojis = {
  'Amazon': '☁️', 'Amazon Web Services': '☁️',
  'Google': '🔴', 'IBM': '🔵',
  'Oracle': '🔴', 'Microsoft': '🟦',
  'IIT / NPTEL': '🎓', 'NPTEL': '🎓',
  'Coursera': '📘', 'Udemy': '📗',
}

export default function CertificationCard({ data = [] }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#0891B2,#0E7490)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(8,145,178,0.3)',
        }}>🏅</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Certification Recommendations
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            Top certifications to boost your placement profile
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {data.map((cert, i) => {
          const rel = relevanceConfig[cert.relevance] || relevanceConfig.Medium
          const emoji = providerEmojis[cert.provider] || '📜'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(255,122,0,0.1)' }}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,122,0,0.12)',
                borderTop: `3px solid ${cert.relevance === 'High' ? '#FF7A00' : '#F59E0B'}`,
                borderRadius: 14, padding: '16px',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,122,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>{emoji}</div>
                <span style={{
                  fontSize: 9.5, padding: '3px 8px', borderRadius: 100,
                  background: rel.bg, color: rel.color, fontWeight: 700,
                }}>
                  {cert.relevance} Priority
                </span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 4, lineHeight: 1.4 }}>
                {cert.name}
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
                {cert.provider}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
