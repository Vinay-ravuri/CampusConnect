import { motion } from 'framer-motion'

export default function ProjectRecommendationsCard() {
  const PROJECTS = [
    {
      title: 'E-Commerce Microservices Platform',
      targetRole: 'Java / Backend Developer',
      difficulty: 'Intermediate → Advanced',
      color: '#0078D4',
      bgColor: '#E6F2FB',
      whyItMatters: 'Recruiters evaluate if you can write modular REST APIs, handle JWT authentication, and manage MySQL database transactions.',
      skillsDemonstrated: ['Java 17', 'Spring Boot', 'MySQL', 'JWT Security', 'Docker'],
      featuresToImplement: [
        'User authentication with refresh tokens and role-based access.',
        'Product catalog API with pagination and text search indexing.',
        'Shopping cart & Order processing transactional workflow.',
        'Docker containerization & Postman API documentation.'
      ],
      recruiterEvaluation: 'Evaluates REST API design, database normalization, and Spring Security configurations.'
    },
    {
      title: 'Campus Placement & Job Gateway',
      targetRole: 'Full Stack Developer',
      difficulty: 'Intermediate',
      color: '#FF7A00',
      bgColor: '#FFF7ED',
      whyItMatters: 'Demonstrates end-to-end full stack capability connecting React UI with Node.js/Express backend APIs.',
      skillsDemonstrated: ['React.js', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
      featuresToImplement: [
        'Responsive UI with dark/light mode and search filters.',
        'Student profile management with PDF resume uploader.',
        'Company job posting admin dashboard.',
        'Real-time job application status tracker.'
      ],
      recruiterEvaluation: 'Evaluates frontend state management, clean responsive styling, and Express API middleware.'
    },
    {
      title: 'AI Resume Screener & ATS Analyzer',
      targetRole: 'AI / ML Engineer',
      difficulty: 'Advanced',
      color: '#7C3AED',
      bgColor: '#EDE9FE',
      whyItMatters: 'Shows practical application of LLMs, TF-IDF keyword extraction, and PyTorch / Python data pipelines.',
      skillsDemonstrated: ['Python', 'FastAPI', 'PyTorch / HuggingFace', 'Scikit-Learn', 'PDFMiner'],
      featuresToImplement: [
        'PDF text parsing and skill keyword extraction engine.',
        'Cosine similarity matching between resume and job description.',
        'FastAPI backend serving inference endpoints under 500ms.',
        'Streamlit or React interactive dashboard.'
      ],
      recruiterEvaluation: 'Evaluates NLP preprocessing techniques, model evaluation metrics, and API deployment.'
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
            — PORTFOLIO BUILDER —
          </span>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#111827', marginTop: 4 }}>
            Recommended Placement Projects
          </h3>
        </div>
        <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 100, background: 'rgba(255,122,0,0.1)', color: '#FF7A00', fontWeight: 700 }}>
          💡 Industry Approved
        </span>
      </div>

      <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.6, marginBottom: 24 }}>
        Building these targeted projects will significantly strengthen your GitHub portfolio and make your resume stand out during tech interviews.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        {PROJECTS.map(proj => (
          <div
            key={proj.title}
            style={{
              background: '#FAF9F6',
              border: `1px solid ${proj.color}25`,
              borderLeft: `5px solid ${proj.color}`,
              borderRadius: 18,
              padding: '22px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 800, color: '#111827' }}>
                {proj.title}
              </h4>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: proj.bgColor, color: proj.color }}>
                {proj.targetRole} • {proj.difficulty}
              </span>
            </div>

            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 14 }}>
              <strong>Why it matters:</strong> {proj.whyItMatters}
            </p>

            {/* Skills demonstrated */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {proj.skillsDemonstrated.map(s => (
                <span key={s} style={{ fontSize: 10.5, padding: '3px 9px', borderRadius: 8, background: proj.bgColor, color: proj.color, fontWeight: 700 }}>
                  {s}
                </span>
              ))}
            </div>

            {/* Key features list */}
            <div style={{ background: '#ffffff', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#9CA3AF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                KEY FEATURES TO BUILD &amp; DEMO
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 6 }}>
                {proj.featuresToImplement.map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: proj.color, fontWeight: 800 }}>•</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
