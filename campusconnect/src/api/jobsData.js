/* ═══════════════════════════════════════════════════════════════
   JOBS DATA HUB — CampusConnect Opportunities
   Targeting 2025, 2026, & 2027 Batches (Engineering Students)
   ═══════════════════════════════════════════════════════════════ */

export const JOB_CATEGORIES = [
  { id: 'ALL', label: 'All Opportunities', icon: '🎯' },
  { id: 'SOFTWARE', label: 'Software Engineering', icon: '💻' },
  { id: 'WEB', label: 'Web Development', icon: '🌐' },
  { id: 'JAVA', label: 'Java Developer', icon: '☕' },
  { id: 'PYTHON', label: 'Python & Data', icon: '🐍' },
  { id: 'AIML', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'CLOUD', label: 'Cloud & DevOps', icon: '☁️' },
  { id: 'INTERNSHIP', label: 'Internships', icon: '⚡' },
  { id: 'FRESHER', label: 'Graduate / Fresher Jobs', icon: '🎓' },
]

export const JOBS_LIST = [
  {
    id: 'job-1',
    title: 'Software Engineer — Graduate 2027',
    company: 'Microsoft India',
    logo: '🟦',
    color: '#0078D4',
    bgColor: '#E6F2FB',
    location: 'Hyderabad / Bangalore / Hybrid',
    workMode: 'Hybrid',
    type: 'Full Time',
    category: 'SOFTWARE',
    batch: '2027',
    experience: 'Fresher',
    branch: ['CSE', 'IT', 'ECE'],
    salary: '₹18 - ₹24 LPA',
    postedDate: '2 days ago',
    deadline: '15 Sep 2026',
    verified: true,
    skills: ['C++', 'Data Structures', 'Algorithms', 'OOPs', 'System Design'],
    shortDesc: 'Build core cloud applications and enterprise backend systems at Microsoft. Ideal for 2027 graduating engineers.',
    description: `Microsoft India is hiring Software Development Engineers for our Cloud & AI engineering teams in Hyderabad and Bangalore. In this role, you will design, write high-performance code, and deploy large-scale cloud services used by millions globally.`,
    responsibilities: [
      'Design, implement, and maintain scalable software services using modern C++ and C#.',
      'Collaborate with cross-functional teams to define architecture and API specifications.',
      'Write clean, well-tested code with high algorithmic efficiency and fault-tolerance.',
      'Participate in code reviews, design syncs, and system reliability enhancements.'
    ],
    requirements: [
      'B.Tech / B.E / M.Tech in Computer Science, IT, ECE or related engineering field.',
      'Graduating batch: 2027 (or 2026 pre-final graduates).',
      'Strong problem-solving skills in Data Structures, Algorithms, and Object-Oriented Programming.',
      'Proficiency in C++, C#, Java, or Python.',
      'Minimum CGPA requirement: 7.5/10.'
    ],
    externalUrl: 'https://careers.microsoft.com/us/en/job/1749201/Software-Engineer-Graduate'
  },
  {
    id: 'job-2',
    title: 'Java Backend Developer Intern',
    company: 'Razorpay',
    logo: '💳',
    color: '#072654',
    bgColor: '#E6ECF5',
    location: 'Bangalore / Remote',
    workMode: 'Remote',
    type: 'Internship',
    category: 'JAVA',
    batch: '2027',
    experience: 'Fresher',
    branch: ['CSE', 'IT'],
    salary: '₹45,000 / month Stipend',
    postedDate: '1 day ago',
    deadline: '20 Sep 2026',
    verified: true,
    skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git'],
    shortDesc: 'Develop robust payment APIs and microservices for India’s top fintech payment gateway platform.',
    description: `Razorpay is looking for passionate Java Engineering Interns to join our Core Payments team. You will build high-throughput microservices using Spring Boot, process millions of daily transactions, and work with distributed MySQL/Redis databases.`,
    responsibilities: [
      'Build and optimize microservices using Java 17 and Spring Boot framework.',
      'Integrate third-party banking APIs and webhooks with high security benchmarks.',
      'Write unit tests and perform load testing using JUnit and Mockito.',
      'Debug production logs and optimize SQL query execution plans.'
    ],
    requirements: [
      'Eligible Batches: 2027 and 2026.',
      'Hands-on experience building Java or Spring Boot projects.',
      'Understanding of relational databases (MySQL / PostgreSQL) and indexing.',
      'Familiarity with Git, Postman, and RESTful API principles.'
    ],
    externalUrl: 'https://razorpay.com/jobs/engineering/java-backend-intern'
  },
  {
    id: 'job-3',
    title: 'AI / ML Research Engineer Intern',
    company: 'Google AI Labs',
    logo: '🔴',
    color: '#EA4335',
    bgColor: '#FDECEA',
    location: 'Bangalore / On-site',
    workMode: 'On-site',
    type: 'Internship',
    category: 'AIML',
    batch: '2026',
    experience: 'Fresher',
    branch: ['CSE', 'IT', 'ECE', 'AI/DS'],
    salary: '₹60,000 / month Stipend',
    postedDate: '3 days ago',
    deadline: '30 Sep 2026',
    verified: true,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Linear Algebra', 'NLP'],
    shortDesc: 'Work alongside research scientists to build state-of-the-art Large Language Models and Computer Vision systems.',
    description: `Google India Research Lab invites applications for the AI Research Internship. Interns work directly on cutting-edge deep learning algorithms, fine-tuning multimodal models, and accelerating AI inferencing pipelines.`,
    responsibilities: [
      'Implement deep learning architectures using PyTorch and JAX.',
      'Curate datasets, perform feature engineering, and optimize transformer model training.',
      'Publish research findings or contribute to open-source machine learning toolkits.',
      'Benchmark model precision against standard datasets (ImageNet, SQuAD, GLUE).'
    ],
    requirements: [
      'Enrolled in B.Tech / M.Tech (2026 or 2027 batch).',
      'Strong mathematical foundation in Linear Algebra, Probability, and Vector Calculus.',
      'Prior project experience in Machine Learning or NLP.',
      'High proficiency in Python and NumPy/SciPy.'
    ],
    externalUrl: 'https://careers.google.com/jobs/results/ai-ml-intern-2026'
  },
  {
    id: 'job-4',
    title: 'Full Stack Web Developer (React + Node)',
    company: 'Zepto',
    logo: '⚡',
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    location: 'Mumbai / Remote',
    workMode: 'Remote',
    type: 'Full Time',
    category: 'WEB',
    batch: '2026',
    experience: '0-1 Years',
    branch: ['CSE', 'IT', 'ECE'],
    salary: '₹14 - ₹18 LPA',
    postedDate: 'Just Now',
    deadline: '25 Sep 2026',
    verified: true,
    skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'TailwindCSS'],
    shortDesc: 'Build real-time high-scale customer web applications and warehouse management web tools.',
    description: `Zepto is one of India's fastest-growing quick-commerce tech companies. We are hiring Full Stack Engineers to build fast, responsive React frontends and Node.js microservices handling thousands of orders per minute.`,
    responsibilities: [
      'Develop modern user interfaces using React, Next.js, and TypeScript.',
      'Design REST & GraphQL API endpoints backed by MongoDB and Redis caches.',
      'Optimize web vitals, bundle size, and rendering performance.',
      'Implement real-time WebSocket communication for live delivery tracking.'
    ],
    requirements: [
      'Graduating batch 2026 or recent 2025 graduate.',
      'Strong expertise in JavaScript / TypeScript (ES6+ features, Async/Await).',
      'Proven full stack project portfolio deployed live on Vercel/Render/AWS.',
      'Good understanding of web security (JWT, CORS, XSS prevention).'
    ],
    externalUrl: 'https://www.zeptonow.com/careers/fullstack-developer-2026'
  },
  {
    id: 'job-5',
    title: 'Associate Cloud Engineer (AWS / DevOps)',
    company: 'TCS Digital',
    logo: '🔷',
    color: '#1A5276',
    bgColor: '#D6EAF8',
    location: 'Visakhapatnam / Hyderabad / Chennai',
    workMode: 'On-site',
    type: 'Full Time',
    category: 'CLOUD',
    batch: '2027',
    experience: 'Fresher',
    branch: ['CSE', 'IT', 'ECE', 'EEE', 'Civil', 'Mech'],
    salary: '₹7.5 - ₹9.0 LPA',
    postedDate: '4 days ago',
    deadline: '10 Oct 2026',
    verified: true,
    skills: ['AWS', 'Docker', 'Linux', 'Python Scripting', 'CI/CD'],
    shortDesc: 'Join TCS Digital Cadre to manage enterprise cloud infrastructure, Kubernetes clusters, and automated CI/CD pipelines.',
    description: `TCS Digital is offering direct entry roles for Associate Cloud & DevOps Engineers across Andhra Pradesh & Telangana hubs. Selected candidates will manage AWS/Azure cloud environments, configure Docker containers, and automate deployment scripts.`,
    responsibilities: [
      'Provision cloud infrastructure using Infrastructure as Code (Terraform / CloudFormation).',
      'Monitor application health logs using CloudWatch, Prometheus, and Grafana.',
      'Configure automated CI/CD pipelines in Jenkins and GitHub Actions.',
      'Maintain Linux server security patches and user permission policies.'
    ],
    requirements: [
      'B.Tech 2027 or 2026 batch passing out from any accredited engineering college.',
      'Knowledge of Linux command line, Shell scripting, and AWS cloud basics.',
      'AWS Cloud Practitioner or Solutions Architect Certification is a major plus.',
      'No active backlogs at the time of onboarding.'
    ],
    externalUrl: 'https://www.tcs.com/careers/india/digital-cadre-hiring'
  },
  {
    id: 'job-6',
    title: 'Python Data Analyst Intern',
    company: 'Amazon India',
    logo: '🟠',
    color: '#FF9900',
    bgColor: '#FFF4E0',
    location: 'Hyderabad / Hybrid',
    workMode: 'Hybrid',
    type: 'Internship',
    category: 'PYTHON',
    batch: '2027',
    experience: 'Fresher',
    branch: ['CSE', 'IT', 'ECE', 'EEE'],
    salary: '₹50,000 / month Stipend',
    postedDate: '5 days ago',
    deadline: '18 Sep 2026',
    verified: true,
    skills: ['Python', 'SQL', 'Pandas', 'Tableau', 'Excel'],
    shortDesc: 'Analyze e-commerce seller metrics, build interactive dashboards, and optimize logistics delivery performance.',
    description: `Amazon Business Intelligence team is seeking Data Analyst Interns in Hyderabad. You will write complex SQL queries across petabyte-scale Redshift databases, build automated Tableau reports, and present data-driven recommendations to leadership.`,
    responsibilities: [
      'Extract data using complex SQL queries involving joins, window functions, and subqueries.',
      'Perform exploratory data analysis using Python Pandas, NumPy, and Seaborn.',
      'Build automated executive dashboards in Tableau or PowerBI.',
      'Identify operational bottlenecks in supply chain and seller fulfillment.'
    ],
    requirements: [
      'Target Batch: 2027 & 2026 engineering undergraduates.',
      'Excellent command over SQL (indexing, query optimization, CTEs).',
      'Proficiency in Python for data manipulation and visualization.',
      'Strong analytical reasoning and problem-solving mindset.'
    ],
    externalUrl: 'https://amazon.jobs/en/jobs/2819034/data-analyst-intern-2027'
  },
  {
    id: 'job-7',
    title: 'Cyber Security Operations Analyst',
    company: 'Infosys Specialist',
    logo: '🟢',
    color: '#007CC2',
    bgColor: '#E0F3FB',
    location: 'Bangalore / Pune',
    workMode: 'On-site',
    type: 'Full Time',
    category: 'SOFTWARE',
    batch: '2026',
    experience: 'Fresher',
    branch: ['CSE', 'IT', 'ECE'],
    salary: '₹9.5 LPA',
    postedDate: '1 week ago',
    deadline: '05 Oct 2026',
    verified: true,
    skills: ['Cyber Security', 'Network Protocols', 'Wireshark', 'Python', 'Ethical Hacking'],
    shortDesc: 'Monitor SOC security events, analyze malware behavior, and perform vulnerability assessments.',
    description: `Infosys Cyber Defense Center is expanding its Threat Detection team. As a SOC Analyst, you will monitor network traffic for security breaches, investigate suspicious payloads, and implement firewall security rules.`,
    responsibilities: [
      'Monitor SIEM alerts (Splunk / QRadar) for intrusion attempts.',
      'Conduct vulnerability scanning and penetration testing reports.',
      'Analyze network packet captures using Wireshark and Tcpdump.',
      'Respond to phishing incidents and malware outbreak tickets.'
    ],
    requirements: [
      'Eligible batch: 2026 & 2025 B.Tech graduates.',
      'Strong foundation in Computer Networks (TCP/IP, OSI model, DNS, HTTP/S).',
      'CEH (Certified Ethical Hacker) or CompTIA Security+ certification is advantageous.'
    ],
    externalUrl: 'https://www.infosys.com/careers/specialist-programmer'
  },
  {
    id: 'job-8',
    title: 'Frontend Developer Intern (React & Next.js)',
    company: 'Swiggy',
    logo: '🍔',
    color: '#FC8019',
    bgColor: '#FFF0E5',
    location: 'Bangalore / Remote',
    workMode: 'Remote',
    type: 'Internship',
    category: 'WEB',
    batch: '2027',
    experience: 'Fresher',
    branch: ['CSE', 'IT', 'ECE'],
    salary: '₹35,000 / month Stipend',
    postedDate: '3 days ago',
    deadline: '22 Sep 2026',
    verified: true,
    skills: ['React.js', 'Next.js', 'HTML5/CSS3', 'Framer Motion', 'Redux'],
    shortDesc: 'Craft pixel-perfect, responsive web interfaces for Swiggy web and partner portals.',
    description: `Swiggy Consumer Web engineering team is hiring Frontend Interns. You will work closely with UI/UX designers to translate Figma mockups into sleek React components with micro-animations and accessibility features.`,
    responsibilities: [
      'Develop modular React components using TailwindCSS and CSS Modules.',
      'State management using Redux Toolkit and React Context API.',
      'Optimize page rendering times and ensure cross-browser compatibility.',
      'Participate in sprint planning and UI design review sessions.'
    ],
    requirements: [
      'Target Batch: 2027 / 2026 students.',
      'Portfolio displaying 2+ web apps built using React or Next.js.',
      'Eye for design, smooth CSS animations, and clean responsive layouts.'
    ],
    externalUrl: 'https://careers.swiggy.com/job/frontend-developer-intern'
  }
]
