import { motion } from 'framer-motion'

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

const typeBadge = {
  internship: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', label: 'Internship' },
  job:        { bg: 'rgba(99,102,241,0.1)',  color: '#6366F1', label: 'Full-Time' },
}

const companyEmojis = {
  'Google': '🔴', 'Microsoft': '🟦', 'Amazon': '🟠', 'Adobe': '🔴',
  'Flipkart': '🟡', 'Razorpay': '🔵', 'Infosys': '🟢', 'TCS': '🔷',
  'Wipro': '🟡', 'Accenture': '🟣', 'IBM': '🔵', 'Oracle': '🔴',
  'Meta': '🔵', 'Netflix': '🔴', 'Uber': '⚫',
}

export default function OpportunitiesCard({ data = [] }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        }}>💼</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Internship & Opportunity Recommendations
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            AI-matched roles based on your skill profile
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
        {data.map((opp, i) => {
          const badge = typeBadge[opp.type] || typeBadge.job
          const emoji = companyEmojis[opp.company] || '🏢'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(255,122,0,0.12)' }}
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,122,0,0.12)',
                borderLeft: `4px solid ${opp.type === 'internship' ? '#10B981' : '#6366F1'}`,
                borderRadius: 14, padding: '16px',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >
              {/* Company / Platform row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: opp.type === 'internship' ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>{emoji}</div>
                <div>
                  <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {opp.type === 'internship' ? 'Platform' : 'Company'}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: '#111827' }}>
                    {opp.company}
                  </div>
                </div>
              </div>

              {/* Role */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                  Role
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#374151' }}>
                  {opp.title}
                </div>
              </div>

              {/* Required Skills / Skills Needed */}
              {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 9.5, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>
                    {opp.type === 'internship' ? 'Skills Needed' : 'Required Skills'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {opp.requiredSkills.map(s => (
                      <span key={s} style={{
                        fontSize: 9, padding: '2px 7px', borderRadius: 100,
                        background: opp.type === 'internship' ? 'rgba(16,185,129,0.06)' : 'rgba(99,102,241,0.06)',
                        color: opp.type === 'internship' ? '#10B981' : '#6366F1',
                        fontWeight: 600,
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,122,0,0.05)' }}>
                <span style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 100,
                  background: badge.bg, color: badge.color, fontWeight: 700,
                }}>
                  {badge.label}
                </span>
                <span style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 100,
                  background: 'rgba(255,122,0,0.08)', color: '#FF7A00', fontWeight: 700,
                  fontFamily: "'Space Grotesk',sans-serif",
                }}>
                  {opp.matchPercent}% match
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
