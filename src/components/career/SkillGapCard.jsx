import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts'
import { motion } from 'framer-motion'

const cardStyle = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,122,0,0.15)',
  borderRadius: 20,
  padding: '28px 26px',
  boxShadow: '0 8px 32px rgba(255,122,0,0.08)',
}

const scoreConfig = [
  { key: 'jobReadiness',       label: 'Job Readiness',        color: '#FF7A00' },
  { key: 'placementReadiness', label: 'Placement Readiness',  color: '#10B981' },
  { key: 'technicalSkill',     label: 'Technical Skill',      color: '#6366F1' },
  { key: 'industryAlignment',  label: 'Industry Alignment',   color: '#F59E0B' },
]

function ScoreBadge({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      border: `1px solid ${color}25`,
      borderRadius: 12, padding: '12px 16px', textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontWeight: 900, fontSize: 26, color,
        letterSpacing: '-1px', lineHeight: 1,
      }}>{value}%</div>
      <div style={{ fontSize: 10.5, color: '#6B7280', fontWeight: 600, marginTop: 4, letterSpacing: '0.3px' }}>
        {label}
      </div>
      {/* Mini progress */}
      <div style={{ height: 4, background: `${color}15`, borderRadius: 100, marginTop: 8, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: color, borderRadius: 100 }}
        />
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(255,255,255,0.97)',
      border: '1px solid rgba(255,122,0,0.2)',
      borderRadius: 12, padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(255,122,0,0.12)',
      fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 6, fontFamily: "'Space Grotesk',sans-serif" }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, fontWeight: 600, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <span>{p.name}:</span>
          <span>{p.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function SkillGapCard({ skillGaps = [], scores = {} }) {
  const radarData = skillGaps.map(s => ({
    skill: s.skill.length > 12 ? s.skill.slice(0, 12) + '…' : s.skill,
    current: s.currentLevel,
    required: s.requiredLevel,
  }))

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg,#6366F1,#4F46E5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        }}>📊</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: '#111827', letterSpacing: '-0.3px' }}>
            AI Skill Gap Analysis
          </div>
          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
            Current skills vs industry-required levels for your target domain
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{ height: 320, marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="rgba(255,122,0,0.12)" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#374151', fontSize: 11, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={90} domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 9 }}
              tickCount={5}
            />
            <Radar name="Your Level" dataKey="current" stroke="#FF7A00" fill="#FF7A00" fillOpacity={0.22} strokeWidth={2} />
            <Radar name="Required Level" dataKey="required" stroke="#6366F1" fill="#6366F1" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 3" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, paddingTop: 12 }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill list comparison */}
      {skillGaps.length > 0 && (
        <div style={{
          background: 'rgba(255,122,0,0.02)',
          border: '1px solid rgba(255,122,0,0.08)',
          borderRadius: 14,
          padding: '16px',
          marginBottom: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#FF7A00', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
            Detailed Skill Gaps (Current vs Industry Required)
          </div>
          {skillGaps.map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#374151', fontFamily: "'Space Grotesk',sans-serif" }}>
                  {item.skill}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>
                  Current: <strong style={{ color: '#FF7A00' }}>{item.currentLevel}%</strong> vs Required: <strong style={{ color: '#6366F1' }}>{item.requiredLevel}%</strong>
                </span>
              </div>
              {/* Dual Bar Progress */}
              <div style={{ height: 6, background: 'rgba(0,0,0,0.04)', borderRadius: 100, position: 'relative', overflow: 'hidden' }}>
                {/* Required level indicator */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${item.requiredLevel}%`,
                  background: 'rgba(99,102,241,0.22)',
                  borderRadius: 100
                }} />
                {/* Current level bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.currentLevel}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg,#FF7A00,#FFA14A)',
                    borderRadius: 100
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Score Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {scoreConfig.map(({ key, label, color }) => (
          <ScoreBadge key={key} label={label} value={scores[key] || 0} color={color} />
        ))}
      </div>
    </div>
  )
}
