/**
 * DEMO DATA — Engineering Physics (JNTUK)
 * Used as fallback when the backend returns no resources.
 * This fills all three tabs: PDF Notes, YouTube Videos, Important Topics.
 */

export const DEMO_SUBJECTS = {
  'engineering-physics': {
    name: 'Engineering Physics',
    regulation: 'JNTUK',
  },
}

// Five units for Engineering Physics
export const DEMO_UNITS = [
  { id: 'ep-u1', unitNumber: 1, title: 'Crystal Structures & Bonding' },
  { id: 'ep-u2', unitNumber: 2, title: 'Quantum Mechanics' },
  { id: 'ep-u3', unitNumber: 3, title: 'Band Theory of Solids' },
  { id: 'ep-u4', unitNumber: 4, title: 'Semiconductor Physics' },
  { id: 'ep-u5', unitNumber: 5, title: 'Dielectrics & Magnetic Materials' },
]

// Resources keyed by unit index (0-based)
const EP_RESOURCES = [
  // ── UNIT 1 — Crystal Structures & Bonding ──────────────────────
  [
    // PDFs
    {
      id: 'ep1-pdf1', type: 'PDF',
      title: 'Crystal Structures — Complete Notes',
      description: 'Bravais Lattices, Miller Indices, XRD, Packing Factors',
      fileSize: '2.4 MB',
      url: 'https://drive.google.com/file/d/1-DEMO-placeholder/view',
    },
    {
      id: 'ep1-pdf2', type: 'PDF',
      title: 'Chemical Bonding in Solids',
      description: 'Ionic, Covalent, Metallic & Hydrogen Bonding with examples',
      fileSize: '1.8 MB',
      url: 'https://drive.google.com/file/d/2-DEMO-placeholder/view',
    },
    {
      id: 'ep1-pdf3', type: 'PDF',
      title: 'Previous Year Questions — Unit 1',
      description: 'JNTUK R20 R19 R16 sorted questions with solutions',
      fileSize: '980 KB',
      url: 'https://drive.google.com/file/d/3-DEMO-placeholder/view',
    },
    // Videos
    {
      id: 'ep1-vid1', type: 'YOUTUBE',
      title: 'Crystal Structures & Unit Cells — Full Lecture',
      description: 'Simple Cubic, BCC, FCC, HCP with animations',
      duration: '38:22',
      url: 'https://www.youtube.com/watch?v=lNgsXiJGDjo',
    },
    {
      id: 'ep1-vid2', type: 'YOUTUBE',
      title: 'Miller Indices — Planes & Directions',
      description: 'Step-by-step procedure with solved examples',
      duration: '25:10',
      url: 'https://www.youtube.com/watch?v=3OEfGWKLBng',
    },
    {
      id: 'ep1-vid3', type: 'YOUTUBE',
      title: 'X-Ray Diffraction & Bragg\'s Law',
      description: 'XRD principle, Bragg equation derivation, applications',
      duration: '31:45',
      url: 'https://www.youtube.com/watch?v=Iqo-T0DKZWM',
    },
    // Important Topics
    { id: 'ep1-imp1', type: 'IMPORTANT_TOPIC', title: 'Derive the relation between lattice parameter and atomic radius for BCC and FCC structures' },
    { id: 'ep1-imp2', type: 'IMPORTANT_TOPIC', title: 'Explain Miller Indices and derive the interplanar spacing formula for cubic system (d = a/√(h²+k²+l²))' },
    { id: 'ep1-imp3', type: 'IMPORTANT_TOPIC', title: 'State and derive Bragg\'s Law for X-ray diffraction. Explain Bragg\'s spectrometer' },
    { id: 'ep1-imp4', type: 'IMPORTANT_TOPIC', title: 'Calculate packing fraction for SC, BCC and FCC crystal structures with diagrams' },
    { id: 'ep1-imp5', type: 'IMPORTANT_TOPIC', title: 'Explain the types of crystal bonding: Ionic, Covalent, Metallic — with energy expressions' },
    { id: 'ep1-imp6', type: 'IMPORTANT_TOPIC', title: 'What are point defects? Explain Frenkel and Schottky defects with neat diagrams' },
    { id: 'ep1-imp7', type: 'IMPORTANT_TOPIC', title: '★ SHORT ANSWER: Define Basis, Lattice, Crystal structure. What is a unit cell?' },
  ],

  // ── UNIT 2 — Quantum Mechanics ─────────────────────────────────
  [
    // PDFs
    {
      id: 'ep2-pdf1', type: 'PDF',
      title: 'Quantum Mechanics — Handwritten Notes',
      description: 'Wave-Particle duality, de Broglie, Heisenberg, Schrödinger equation',
      fileSize: '3.1 MB',
      url: 'https://drive.google.com/file/d/4-DEMO-placeholder/view',
    },
    {
      id: 'ep2-pdf2', type: 'PDF',
      title: 'Particle in a Box & Quantum Numbers',
      description: 'Infinite square well, energy eigenvalues, wave functions',
      fileSize: '1.5 MB',
      url: 'https://drive.google.com/file/d/5-DEMO-placeholder/view',
    },
    {
      id: 'ep2-pdf3', type: 'PDF',
      title: 'Unit 2 — Important Questions Solved',
      description: 'JNTUK R20 model paper solutions for Quantum Mechanics',
      fileSize: '1.2 MB',
      url: 'https://drive.google.com/file/d/6-DEMO-placeholder/view',
    },
    // Videos
    {
      id: 'ep2-vid1', type: 'YOUTUBE',
      title: 'Wave-Particle Duality & de Broglie Hypothesis',
      description: 'Photoelectric effect, Compton scattering, matter waves',
      duration: '42:15',
      url: 'https://www.youtube.com/watch?v=IsX9oiNqSDs',
    },
    {
      id: 'ep2-vid2', type: 'YOUTUBE',
      title: 'Heisenberg Uncertainty Principle — Derivation & Examples',
      description: 'Physical meaning, gamma-ray microscope thought experiment',
      duration: '28:30',
      url: 'https://www.youtube.com/watch?v=s3TVgdnJVk4',
    },
    {
      id: 'ep2-vid3', type: 'YOUTUBE',
      title: 'Time Independent Schrödinger Equation',
      description: 'Full derivation, applications to 1D potential well',
      duration: '35:00',
      url: 'https://www.youtube.com/watch?v=m36zp7W1sPM',
    },
    // Important Topics
    { id: 'ep2-imp1', type: 'IMPORTANT_TOPIC', title: 'Derive the time-independent Schrödinger wave equation from first principles' },
    { id: 'ep2-imp2', type: 'IMPORTANT_TOPIC', title: 'Explain de Broglie\'s hypothesis. Derive λ = h/mv. Describe Davisson-Germer experiment' },
    { id: 'ep2-imp3', type: 'IMPORTANT_TOPIC', title: 'State Heisenberg\'s uncertainty principle. Derive using gamma-ray microscope thought experiment' },
    { id: 'ep2-imp4', type: 'IMPORTANT_TOPIC', title: 'Solve the quantum mechanical problem of a particle confined in a 1D infinite potential well' },
    { id: 'ep2-imp5', type: 'IMPORTANT_TOPIC', title: 'Explain physical significance of wave function ψ. What are the conditions on an acceptable ψ?' },
    { id: 'ep2-imp6', type: 'IMPORTANT_TOPIC', title: '★ SHORT ANSWER: What is zero-point energy? Why can a particle not be at rest inside a quantum box?' },
  ],

  // ── UNIT 3 — Band Theory of Solids ────────────────────────────
  [
    // PDFs
    {
      id: 'ep3-pdf1', type: 'PDF',
      title: 'Band Theory — Complete Chapter Notes',
      description: 'Free electron model, Bloch theorem, Kronig-Penney model, effective mass',
      fileSize: '2.7 MB',
      url: 'https://drive.google.com/file/d/7-DEMO-placeholder/view',
    },
    {
      id: 'ep3-pdf2', type: 'PDF',
      title: 'Conductors, Semiconductors & Insulators — Comparison',
      description: 'Band gap values, examples, classification with diagrams',
      fileSize: '900 KB',
      url: 'https://drive.google.com/file/d/8-DEMO-placeholder/view',
    },
    // Videos
    {
      id: 'ep3-vid1', type: 'YOUTUBE',
      title: 'Kronig-Penney Model & Energy Bands',
      description: 'Derivation of allowed and forbidden energy bands',
      duration: '44:10',
      url: 'https://www.youtube.com/watch?v=_fAb1dC1QKo',
    },
    {
      id: 'ep3-vid2', type: 'YOUTUBE',
      title: 'Fermi Energy & Fermi-Dirac Distribution',
      description: 'Fermi level definition, temperature dependence, calculations',
      duration: '32:50',
      url: 'https://www.youtube.com/watch?v=jdTHXHgFhA8',
    },
    // Important Topics
    { id: 'ep3-imp1', type: 'IMPORTANT_TOPIC', title: 'Explain the Kronig-Penney model. Show that energy spectrum of electrons has allowed and forbidden bands' },
    { id: 'ep3-imp2', type: 'IMPORTANT_TOPIC', title: 'What is effective mass of an electron? Derive expression and explain its physical significance' },
    { id: 'ep3-imp3', type: 'IMPORTANT_TOPIC', title: 'Describe Fermi-Dirac distribution function. Plot and explain its variation with temperature' },
    { id: 'ep3-imp4', type: 'IMPORTANT_TOPIC', title: 'Distinguish between conductors, semiconductors and insulators on the basis of band theory' },
    { id: 'ep3-imp5', type: 'IMPORTANT_TOPIC', title: '★ SHORT ANSWER: What is Brillouin zone? Explain with a 1D lattice example' },
  ],

  // ── UNIT 4 — Semiconductor Physics ───────────────────────────
  [
    // PDFs
    {
      id: 'ep4-pdf1', type: 'PDF',
      title: 'Semiconductors — Full Notes with Formulas',
      description: 'Intrinsic, Extrinsic, Hall effect, P-N junction, drift & diffusion',
      fileSize: '3.3 MB',
      url: 'https://drive.google.com/file/d/9-DEMO-placeholder/view',
    },
    {
      id: 'ep4-pdf2', type: 'PDF',
      title: 'Hall Effect — Derivation & Applications',
      description: 'Hall coefficient, determination of carrier type, Hall mobility',
      fileSize: '1.1 MB',
      url: 'https://drive.google.com/file/d/10-DEMO-placeholder/view',
    },
    {
      id: 'ep4-pdf3', type: 'PDF',
      title: 'Unit 4 JNTUK Model Paper Solutions',
      description: '2019–2024 solved questions for Semiconductor Physics',
      fileSize: '1.6 MB',
      url: 'https://drive.google.com/file/d/11-DEMO-placeholder/view',
    },
    // Videos
    {
      id: 'ep4-vid1', type: 'YOUTUBE',
      title: 'Intrinsic & Extrinsic Semiconductors Explained',
      description: 'Carrier concentration, doping, n-type and p-type semiconductors',
      duration: '39:20',
      url: 'https://www.youtube.com/watch?v=n_7bgHvEJSk',
    },
    {
      id: 'ep4-vid2', type: 'YOUTUBE',
      title: 'Hall Effect — Theory & Experiment',
      description: 'Setup, derivation of Hall coefficient, carrier density measurement',
      duration: '27:45',
      url: 'https://www.youtube.com/watch?v=wpAA3qeOYiI',
    },
    {
      id: 'ep4-vid3', type: 'YOUTUBE',
      title: 'Fermi Level in Semiconductors',
      description: 'Position of Fermi level in intrinsic and extrinsic semiconductors',
      duration: '33:00',
      url: 'https://www.youtube.com/watch?v=Tq3kILGNLog',
    },
    // Important Topics
    { id: 'ep4-imp1', type: 'IMPORTANT_TOPIC', title: 'Derive an expression for carrier concentration in an intrinsic semiconductor' },
    { id: 'ep4-imp2', type: 'IMPORTANT_TOPIC', title: 'Explain Hall Effect. Derive expression for Hall coefficient and mention its applications' },
    { id: 'ep4-imp3', type: 'IMPORTANT_TOPIC', title: 'Distinguish between n-type and p-type semiconductors. Explain with energy band diagrams' },
    { id: 'ep4-imp4', type: 'IMPORTANT_TOPIC', title: 'Derive Einstein relation between diffusion coefficient and mobility of charge carriers' },
    { id: 'ep4-imp5', type: 'IMPORTANT_TOPIC', title: 'What is Fermi level? Explain position of Fermi level in intrinsic and extrinsic semiconductors' },
    { id: 'ep4-imp6', type: 'IMPORTANT_TOPIC', title: '★ SHORT ANSWER: Define mobility, drift velocity and conductivity. State their interrelation' },
  ],

  // ── UNIT 5 — Dielectrics & Magnetic Materials ─────────────────
  [
    // PDFs
    {
      id: 'ep5-pdf1', type: 'PDF',
      title: 'Dielectric Materials — Complete Notes',
      description: 'Polarisation types, Clausius-Mossotti, dielectric loss, frequency response',
      fileSize: '2.2 MB',
      url: 'https://drive.google.com/file/d/12-DEMO-placeholder/view',
    },
    {
      id: 'ep5-pdf2', type: 'PDF',
      title: 'Magnetic Materials — Para, Dia, Ferromagnetics',
      description: 'Susceptibility, B-H curve, hysteresis, soft & hard magnets',
      fileSize: '1.9 MB',
      url: 'https://drive.google.com/file/d/13-DEMO-placeholder/view',
    },
    {
      id: 'ep5-pdf3', type: 'PDF',
      title: 'Superconductivity — Meissner Effect & Applications',
      description: 'Type I & II superconductors, BCS theory introduction, applications',
      fileSize: '1.4 MB',
      url: 'https://drive.google.com/file/d/14-DEMO-placeholder/view',
    },
    // Videos
    {
      id: 'ep5-vid1', type: 'YOUTUBE',
      title: 'Dielectric Materials & Polarisation',
      description: 'Electronic, ionic, orientational & space charge polarisation',
      duration: '36:15',
      url: 'https://www.youtube.com/watch?v=vxRtV6JWhCg',
    },
    {
      id: 'ep5-vid2', type: 'YOUTUBE',
      title: 'Ferromagnetism & Hysteresis Loop',
      description: 'Magnetic domains, B-H curve, retentivity, coercivity, applications',
      duration: '29:40',
      url: 'https://www.youtube.com/watch?v=RJVL80Gg3lA',
    },
    {
      id: 'ep5-vid3', type: 'YOUTUBE',
      title: 'Superconductivity — Meissner Effect & BCS Theory',
      description: 'Critical temperature, magnetic field, Cooper pairs, Josephson junction',
      duration: '41:00',
      url: 'https://www.youtube.com/watch?v=AxKLu4CeSAs',
    },
    // Important Topics
    { id: 'ep5-imp1', type: 'IMPORTANT_TOPIC', title: 'Derive the Clausius-Mossotti relation for dielectric materials. Explain electronic polarisability' },
    { id: 'ep5-imp2', type: 'IMPORTANT_TOPIC', title: 'Explain the four types of dielectric polarisation with diagrams and frequency response graph' },
    { id: 'ep5-imp3', type: 'IMPORTANT_TOPIC', title: 'Distinguish between soft and hard magnetic materials. Give examples and applications of each' },
    { id: 'ep5-imp4', type: 'IMPORTANT_TOPIC', title: 'Explain B-H curve and hysteresis loop. Define retentivity, coercivity and hysteresis loss' },
    { id: 'ep5-imp5', type: 'IMPORTANT_TOPIC', title: 'What is superconductivity? Explain Meissner effect and Type I vs Type II superconductors' },
    { id: 'ep5-imp6', type: 'IMPORTANT_TOPIC', title: 'Write a short note on BCS theory of superconductivity and Josephson junction applications' },
    { id: 'ep5-imp7', type: 'IMPORTANT_TOPIC', title: '★ SHORT ANSWER: Define dielectric constant, loss tangent and dielectric strength' },
  ],
]

/**
 * Returns demo resources for Engineering Physics based on unit index.
 * unitIndex = 0 → Unit 1, unitIndex = 1 → Unit 2 … etc.
 */
export function getDemoResources(unitIndex = 0) {
  const idx = Math.min(unitIndex, EP_RESOURCES.length - 1)
  return EP_RESOURCES[idx]
}

/**
 * Returns demo units for Engineering Physics.
 */
export function getDemoUnits() {
  return DEMO_UNITS
}

/**
 * Checks if a subject name matches Engineering Physics (case-insensitive).
 */
export function isEngineeringPhysics(subjectName = '') {
  const s = subjectName.toLowerCase()
  return s.includes('engineering physics') || s.includes('eng physics') || s.includes('engg physics') || s.includes('applied physics')
}
