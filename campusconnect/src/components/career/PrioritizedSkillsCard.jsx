import { motion } from 'framer-motion'

export default function PrioritizedSkillsCard() {
  const SKILL_PRIORITIES = [
    {
      level: 'HIGH PRIORITY',
      color: '#DC2626',
      bgColor: '#FEE2E2',
      badgeBorder: 'rgba(220,38,38,0.2)',
      skills: [
        { name: 'Data Structures & Algorithms', why: 'Essential for passing online coding assessments at product & service tech companies.' },
        { name: 'Spring Boot / Node.js Framework', why: 'High industry demand for backend developers to build scalable enterprise REST APIs.' },
        { name: 'SQL & Database Indexing', why: '90% of tech interviews assess SQL joins, window functions, and database schema design.' },
      ]
    },
    {
      level: 'MEDIUM PRIORITY',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      badgeBorder: 'rgba(245,158,11,0.2)',
      skills: [
        { name: 'Git & GitHub Collaboration', why: 'Crucial for team development workflows, pull requests, and showcasing live portfolio code.' },
        { name: 'Docker Containerization', why: 'Modern recruiters expect candidates to know how to containerize and run apps locally.' },
        { name: 'AWS Cloud Fundamentals', why: 'Cloud certifications (AWS Cloud Practitioner) give significant advantage in campus placements.' },
      ]
    },
    {
      level: 'LOW PRIORITY',
      color: '#059669',
      bgColor: '#D1FAE5',
      badgeBorder: 'rgba(5,150,105,0.2)',
      skills: [
        { name: 'CI/CD Pipelines (Jenkins / GitHub Actions)', why: 'Good to know for DevOps roles after mastering core programming and data structures.' },
        { name: 'Kubernetes Orchestration', why: 'Advanced DevOps topic that can be learned on the job once cloud basics are clear.' },
      ]
    }
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
            — ACTIONABLE SKILL RADAR —
          </span>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#111827', marginTop: 4 }}>
            Skills You Should Learn Next
          </h3>
        </div>
        <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,122,0,0.1)', color: '#FF7A00', fontWeight: 700 }}>
          ⚡ Prioritized Matrix
        </span>
      </div>

      <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.6, marginBottom: 24 }}>
        Prioritize your study time effectively based on immediate placement impact versus long-term career growth.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {SKILL_PRIORITIES.map(group => (
          <div key={group.level} style={{ background: '#FAF9F6', borderRadius: 18, padding: '20px', border: `1px solid ${group.badgeBorder}` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 100, background: group.bgColor, color: group.color, fontSize: 10.5, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '1px', marginBottom: 14 }}>
              <span>●</span> {group.level}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.skills.map(sk => (
                <div key={sk.name} style={{ background: '#ffffff', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: '#111827', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 3 }}>
                    {sk.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>
                    <strong style={{ color: group.color }}>Why it matters:</strong> {sk.why}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
