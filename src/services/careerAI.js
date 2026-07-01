/* ═══════════════════════════════════════════════════════════════
   CAREER AI SERVICE — Gemini 2.0 Flash Integration
   SkillDevelopment AI Platform / CampusConnect
   ═══════════════════════════════════════════════════════════════ */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

/* ─── FALLBACK DATA (demo-safe, never breaks UI) ─────────────── */
const FALLBACK_DATA = {
  careerPaths: [
    { title: 'AI/ML Engineer', matchPercent: 92, growth: 'Very High', demand: 'High', trend: '↑ Rising Fast' },
    { title: 'Full Stack Developer', matchPercent: 86, growth: 'High', demand: 'High', trend: '↑ Stable Growth' },
    { title: 'Data Scientist', matchPercent: 79, growth: 'High', demand: 'High', trend: '↑ Rising' },
    { title: 'Cloud Engineer', matchPercent: 74, growth: 'Very High', demand: 'High', trend: '↑ Booming' },
    { title: 'Cybersecurity Analyst', matchPercent: 65, growth: 'High', demand: 'Medium', trend: '→ Steady' },
  ],
  opportunities: [
    { title: 'Machine Learning Intern', type: 'internship', company: 'Google', requiredSkills: ['Python', 'TensorFlow', 'Scikit-Learn'], matchPercent: 90 },
    { title: 'Software Engineer Intern', type: 'internship', company: 'Microsoft', requiredSkills: ['C++', 'Data Structures', 'Algorithms'], matchPercent: 85 },
    { title: 'Data Science Intern', type: 'internship', company: 'Amazon', requiredSkills: ['SQL', 'Python', 'Tableau'], matchPercent: 80 },
    { title: 'Backend Developer', type: 'job', company: 'Razorpay', requiredSkills: ['Node.js', 'Express', 'MongoDB'], matchPercent: 78 },
    { title: 'AI Research Intern', type: 'internship', company: 'Adobe', requiredSkills: ['Python', 'PyTorch', 'Math'], matchPercent: 75 },
    { title: 'Full Stack Engineer', type: 'job', company: 'Flipkart', requiredSkills: ['React', 'Node.js', 'System Design'], matchPercent: 72 },
  ],
  roadmap: [
    { month: 1, step: 'Python & Math Foundations', description: 'Strengthen Python skills and linear algebra/statistics fundamentals required for ML.', resources: ['Python Crash Course', 'Khan Academy Statistics', '3Blue1Brown Linear Algebra'], completed: false },
    { month: 2, step: 'Machine Learning Basics', description: 'Learn supervised and unsupervised learning algorithms using scikit-learn.', resources: ['Coursera ML by Andrew Ng', 'Kaggle Learn ML', 'Hands-On ML (Book)'], completed: false },
    { month: 3, step: 'Deep Learning & Neural Networks', description: 'Dive into neural networks, CNNs, and RNNs using TensorFlow or PyTorch.', resources: ['fast.ai', 'deeplearning.ai Specialization', 'PyTorch Official Tutorials'], completed: false },
    { month: 4, step: 'Projects & Kaggle Competitions', description: 'Build 2-3 end-to-end ML projects and compete in Kaggle challenges.', resources: ['Kaggle Competitions', 'Papers with Code', 'GitHub Portfolio Guide'], completed: false },
    { month: 5, step: 'System Design & MLOps', description: 'Learn how to deploy ML models, build APIs, and use cloud ML services.', resources: ['AWS SageMaker Docs', 'MLflow Docs', 'Full Stack Deep Learning'], completed: false },
    { month: 6, step: 'Interview Preparation', description: 'Practice DSA, ML interview questions, and mock interviews.', resources: ['LeetCode', 'Glassdoor ML Questions', 'Pramp Mock Interviews'], completed: false },
  ],
  skillGaps: [
    { skill: 'Machine Learning', currentLevel: 55, requiredLevel: 90 },
    { skill: 'Deep Learning', currentLevel: 35, requiredLevel: 85 },
    { skill: 'Python', currentLevel: 75, requiredLevel: 90 },
    { skill: 'Data Analysis', currentLevel: 60, requiredLevel: 80 },
    { skill: 'Cloud (AWS/GCP)', currentLevel: 30, requiredLevel: 70 },
    { skill: 'SQL', currentLevel: 65, requiredLevel: 75 },
  ],
  trendingSkills: [
    { skill: 'Generative AI', demand: 'High', category: 'AI/ML' },
    { skill: 'Prompt Engineering', demand: 'High', category: 'AI/ML' },
    { skill: 'LLM Fine-tuning', demand: 'High', category: 'AI/ML' },
    { skill: 'Cloud Computing (AWS)', demand: 'High', category: 'Cloud' },
    { skill: 'Kubernetes & Docker', demand: 'High', category: 'DevOps' },
    { skill: 'React & Next.js', demand: 'Medium', category: 'Web Dev' },
    { skill: 'System Design', demand: 'High', category: 'Architecture' },
    { skill: 'Cybersecurity', demand: 'Medium', category: 'Security' },
    { skill: 'DevOps / CI-CD', demand: 'Medium', category: 'DevOps' },
    { skill: 'Data Engineering', demand: 'High', category: 'Data' },
  ],
  resumeIntelligence: {
    atsScore: 68,
    missingKeywords: ['Docker', 'Kubernetes', 'TensorFlow', 'CI/CD', 'AWS', 'REST API', 'Agile'],
    strengths: ['Strong Python background demonstrated', 'Academic projects clearly listed', 'Good CGPA above 7.5', 'Relevant coursework mentioned'],
    weaknesses: ['No internship experience listed', 'Missing cloud platform certifications', 'Quantifiable achievements absent', 'No open-source contributions'],
    suggestions: ['Add Docker & Kubernetes to projects section', 'Quantify impact: "Improved accuracy by 15%"', 'List any Kaggle rankings or GitHub stars', 'Add an "Awards & Certifications" section'],
  },
  placementReadiness: { overall: 72, interview: 65, coding: 78, communication: 70, technical: 75, projectStrength: 80 },
  certifications: [
    { name: 'AWS Cloud Practitioner', provider: 'Amazon Web Services', relevance: 'High' },
    { name: 'TensorFlow Developer Certificate', provider: 'Google', relevance: 'High' },
    { name: 'IBM AI Fundamentals', provider: 'IBM', relevance: 'High' },
    { name: 'Google Data Analytics', provider: 'Google', relevance: 'Medium' },
    { name: 'Oracle Java Foundations', provider: 'Oracle', relevance: 'Medium' },
    { name: 'NPTEL Cloud Computing', provider: 'IIT / NPTEL', relevance: 'Medium' },
  ],
  scores: { jobReadiness: 72, placementReadiness: 75, technicalSkill: 78, industryAlignment: 68 },
}

/* ─── BUILD PROMPT ───────────────────────────────────────────── */
function buildPrompt(input) {
  const isResume = !!input.resumeText

  const profileSection = isResume
    ? `RESUME TEXT (extract skills, interests, domain automatically):
"""
${input.resumeText}
"""`
    : `STUDENT PROFILE:
- Skills: ${(input.skills || []).join(', ') || 'Not specified'}
- Interests: ${(input.interests || []).join(', ') || 'Not specified'}
- CGPA: ${input.cgpa || 'Not specified'}
- Domain: ${input.domain || 'Not specified'}
- Certifications: ${(input.certifications || []).join(', ') || 'None'}
- Preferred Work Type: ${input.workType || 'Any'}`

  return `You are an expert AI career counselor for engineering students in India. Analyze the following student profile and generate a comprehensive career guidance report.

${profileSection}

Generate a detailed career analysis. Return ONLY a valid JSON object — no markdown, no code fences, no explanation text, just the raw JSON.

The JSON must match this exact schema:
{
  "careerPaths": [{ "title": "string", "matchPercent": number (0-100), "growth": "Very High|High|Medium|Low", "demand": "High|Medium|Low", "trend": "string" }],
  "opportunities": [{ "title": "string", "type": "internship|job", "company": "string", "requiredSkills": ["string"], "matchPercent": number (0-100) }],
  "roadmap": [{ "month": number, "step": "string", "description": "string", "resources": ["string"], "completed": false }],
  "skillGaps": [{ "skill": "string", "currentLevel": number (0-100), "requiredLevel": number (0-100) }],
  "trendingSkills": [{ "skill": "string", "demand": "High|Medium|Low", "category": "string" }],
  "resumeIntelligence": { "atsScore": number (0-100), "missingKeywords": ["string"], "strengths": ["string"], "weaknesses": ["string"], "suggestions": ["string"] },
  "placementReadiness": { "overall": number, "interview": number, "coding": number, "communication": number, "technical": number, "projectStrength": number },
  "certifications": [{ "name": "string", "provider": "string", "relevance": "High|Medium" }],
  "scores": { "jobReadiness": number, "placementReadiness": number, "technicalSkill": number, "industryAlignment": number }
}

Requirements:
- careerPaths: exactly 5 entries, sorted by matchPercent descending
- opportunities: 5-7 real Indian/global tech companies with realistic roles (and required skills)
- roadmap: 6 months, month 1 to 6
- skillGaps: 5-7 skills relevant to the top career path
- trendingSkills: 8-10 skills currently trending in the tech industry in India
- resumeIntelligence: thorough ATS analysis
- placementReadiness: all values 0-100, including "overall", "technical", "communication", and "projectStrength"
- certifications: 5-7 relevant certifications
- scores: all values 0-100
- Be specific, realistic, and helpful for Indian engineering students targeting campus placements

Return ONLY the JSON object. No other text.`
}

/* ─── STRIP MARKDOWN FENCES ──────────────────────────────────── */
function stripFences(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

/* ─── MAIN EXPORT ────────────────────────────────────────────── */
export async function analyzeCareer(input) {
  if (!API_KEY) {
    console.warn('[careerAI] No VITE_GEMINI_API_KEY found — using fallback data.')
    await new Promise(r => setTimeout(r, 2500)) // simulate loading
    return { ...FALLBACK_DATA }
  }

  try {
    const prompt = buildPrompt(input)

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) throw new Error('Empty response from Gemini')

    const cleaned = stripFences(rawText)
    const parsed = JSON.parse(cleaned)

    // Validate essential keys
    if (!parsed.careerPaths || !parsed.roadmap || !parsed.skillGaps) {
      throw new Error('Invalid response schema from Gemini')
    }

    return parsed
  } catch (err) {
    console.error('[careerAI] Error:', err.message, '— using fallback data.')
    return { ...FALLBACK_DATA }
  }
}

/* ─── MENTOR CHAT ────────────────────────────────────────────── */
export async function askMentor(question, profileContext) {
  if (!API_KEY) {
    return `Great question! Based on your profile, I'd recommend focusing on building practical projects first, then tackling certifications. For your current skill set, Python and cloud basics would give you the most placement advantage. 💡`
  }

  try {
    const contextStr = profileContext
      ? `Student profile context: Skills in ${(profileContext.skills || []).join(', ')}, targeting ${profileContext.domain || 'software'} domain, CGPA: ${profileContext.cgpa || 'N/A'}.`
      : ''

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert AI career mentor for engineering students in India. ${contextStr}\n\nStudent asks: "${question}"\n\nGive a concise, helpful, encouraging answer in 2-4 sentences. Use specific actionable advice. Add 1-2 relevant emojis.`
          }]
        }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
      }),
    })

    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const data = await response.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m here to help! Please try asking again.'
  } catch {
    return 'Great question! Focus on building one solid project in your target domain, then pair it with a relevant certification. Consistency beats intensity — 1 hour daily practice is better than weekend cramming. 🚀'
  }
}
