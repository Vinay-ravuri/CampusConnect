import { motion } from 'framer-motion'

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

function CircularATS({ score }) {
  const r = 52, sw = 10
  const circ = 2 * Math.PI * r
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
  const offset = circ - (score / 100) * circ
  return (
    <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
      <svg width={130} height={130} viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke={`${color}18`} strokeWidth={sw} />
        <motion.circle
          cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 900, fontSize: 28, color, lineHeight: 1,
        }}>{score}</div>
        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, letterSpacing: '1px', marginTop: 2 }}>ATS SCORE</div>
      </div>
    </div>
  )
}

export default function ResumeIntelCard({ data = {} }) {
  const ats = data.atsScore || 0
  const atsColor = ats >= 80 ? '#10B981' : ats >= 60 ? '#F59E0B' : '#EF4444'
  const atsLabel = ats >= 80 ? 'Excellent' : ats >= 60 ? 'Good' : 'Needs Improvement'

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#F43F5E,#E11D48)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(244,63,94,0.3)',
        }}>📄</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            Resume Intelligence
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            ATS analysis • Keyword gaps • Recruiter insights
          </div>
        </div>
      </div>

      {/* ATS Score section */}
      <div style={{
        display: 'flex', gap: 24, alignItems: 'center',
        background: `${atsColor}06`,
        border: `1px solid ${atsColor}20`,
        borderRadius: 16, padding: '20px', marginBottom: 20,
        flexWrap: 'wrap',
      }}>
        <CircularATS score={ats} />
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 6 }}>
            ATS Compatibility Score
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 100,
            background: `${atsColor}12`, color: atsColor,
            fontWeight: 700, fontSize: 12, marginBottom: 10,
          }}>
            ● {atsLabel}
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
            {ats >= 80
              ? 'Your resume is highly ATS-compatible. Most job portals will successfully parse your profile.'
              : ats >= 60
              ? 'Your resume passes most ATS filters. Adding missing keywords will boost visibility significantly.'
              : 'Your resume needs improvement to pass ATS filters. Focus on adding relevant keywords and restructuring.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>

        {/* Missing Keywords */}
        <div style={{ background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 14, padding: '16px' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: '#F43F5E', marginBottom: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
            🔍 Missing Keywords
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(data.missingKeywords || []).map((kw, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  fontSize: 10.5, padding: '3px 9px', borderRadius: 100,
                  background: 'rgba(244,63,94,0.08)', color: '#F43F5E',
                  fontWeight: 600, border: '1px solid rgba(244,63,94,0.2)',
                }}>
                {kw}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, padding: '16px' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: '#10B981', marginBottom: 10 }}>
            ✅ Strengths
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(data.strengths || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: '#10B981', fontSize: 12, flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14, padding: '16px' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: '#F59E0B', marginBottom: 10 }}>
            ⚠️ Weaknesses
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(data.weaknesses || []).map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: '#F59E0B', fontSize: 12, flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, padding: '16px' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: '#6366F1', marginBottom: 10 }}>
            💡 Suggestions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(data.suggestions || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: '#6366F1', fontSize: 12, flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
