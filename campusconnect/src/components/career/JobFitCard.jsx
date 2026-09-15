import { motion } from 'framer-motion'

export default function JobFitCard({ targetRole = 'Software Engineer', skills = [] }) {
  // Compute realistic job fit data based on candidate skills
  const ROLES_DATA = [
    {
      role: 'Java Backend Developer',
      fitScore: 82,
      matchedSkills: ['Java', 'OOPs', 'SQL', 'Git'],
      missingSkills: ['Spring Boot', 'REST APIs', 'Unit Testing (JUnit)'],
      priority: 'High',
    },
    {
      role: 'Full Stack Web Developer',
      fitScore: 76,
      matchedSkills: ['React.js', 'HTML/CSS', 'JavaScript'],
      missingSkills: ['Node.js', 'MongoDB', 'System Design'],
      priority: 'High',
    },
    {
      role: 'AI / ML Engineer',
      fitScore: 68,
      matchedSkills: ['Python', 'Math', 'Data Structures'],
      missingSkills: ['TensorFlow/PyTorch', 'Model Deployment', 'Deep Learning'],
      priority: 'Medium',
    },
    {
      role: 'Cloud & DevOps Engineer',
      fitScore: 62,
      matchedSkills: ['Linux', 'Git', 'Scripting'],
      missingSkills: ['AWS Cloud', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
      priority: 'Medium',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 122, 0, 0.18)',
        borderRadius: 24,
        padding: '32px 28px',
        boxShadow: '0 12px 48px rgba(255, 122, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: '#FF7A00', textTransform: 'uppercase', fontFamily: "'Space Grotesk', sans-serif" }}>
            — MATCHED ROLES &amp; JOB FIT —
          </span>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#111827', marginTop: 4 }}>
            Job Fit Analysis
          </h3>
        </div>
        <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,122,0,0.1)', color: '#FF7A00', fontWeight: 700 }}>
          🎯 Automated Matching
        </span>
      </div>

      <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.6, marginBottom: 24 }}>
        Based on your current tech stack and academic background, here is how well your profile aligns with major target industry roles in India.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        {ROLES_DATA.map((item, idx) => (
          <div
            key={item.role}
            style={{
              background: '#FAF9F6',
              border: '1px solid rgba(255, 122, 0, 0.12)',
              borderRadius: 16,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
            }}
          >
            <div>
              {/* Role Title & Circular Score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#111827', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.role}
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: item.fitScore >= 75 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  color: item.fitScore >= 75 ? '#10B981' : '#F59E0B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif",
                  border: `2px solid ${item.fitScore >= 75 ? '#10B981' : '#F59E0B'}`,
                }}>
                  {item.fitScore}%
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 10, marginBottom: 14, overflow: 'hidden' }}>
                <div style={{
                  width: `${item.fitScore}%`, height: '100%',
                  background: item.fitScore >= 75 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #FF7A00, #FFB800)',
                  borderRadius: 10,
                }} />
              </div>

              {/* You Have */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#10B981', letterSpacing: '0.5px', marginBottom: 4 }}>
                  ✓ SKILLS YOU HAVE
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {item.matchedSkills.map(s => (
                    <span key={s} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, background: 'rgba(16,185,129,0.08)', color: '#10B981', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Need to Improve */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', letterSpacing: '0.5px', marginBottom: 4 }}>
                  ⚠ SKILLS TO IMPROVE
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {item.missingSkills.map(s => (
                    <span key={s} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, background: 'rgba(220,38,38,0.08)', color: '#DC2626', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
