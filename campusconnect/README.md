# 🎓 CampusConnect

### *The Ultimate Academic & Placement Prep Ecosystem for Engineering Students*

---

**CampusConnect** is a premium, high-fidelity web platform designed to streamline academics and career readiness for engineering students (with specialized support for **JNTUK, AU, and university regulations**). Built with a state-of-the-art 3D interactive user interface and smooth scrolling animations, CampusConnect bridges the gap between college curricula and high-tier corporate placement requirements.

---

## 🌟 Key Portals & Core Features

### 1. 📚 Student Portal (Academic Resource Center)
*   **Syllabus-Aligned Learning:** Structured course materials organized strictly by JNTUK, AU, and university regulations.
*   **Unit-by-Unit Breakdowns:** Granular access to notes, recommended lectures, and critical exam questions for over 200+ subjects.
*   **Curated Academic PDFs:** High-quality study guides and reference materials available for download instantly.

### 2. 💼 Placement Portal (Preparation Suite)
*   **Company-Specific Roadmaps:** Custom preparation modules tailored for recruiters like **TCS NQT, Wipro, Accenture, and Cognizant**.
*   **Aptitude & Reasoning Practice:** High-quality quantitative aptitude, logical reasoning, and verbal practice modules.
*   **Core CS Foundations:** Dedicated prep tracks for Database Management (DBMS), Operating Systems (OS), Computer Networks (CN), and Object-Oriented Programming (OOPs).

### 3. ⚡ Skill Portal (Development Hub)
*   **Web Development Pathways:** Progressive modules covering modern frontend and backend engineering.
*   **Data Structures & Algorithms (DSA):** Structured practice problems mapped from beginner to advanced levels.
*   **Portfolio Building:** Structured prompts and guides to build industry-ready portfolio projects.

### 4. ✨ AI Career Assistant & Workspace
*   **ATS Resume Analysis:** Upload PDF/Doc/Text resumes to receive an instant ATS score, placement readiness benchmark, and suggestions.
*   **Skill Gap Radar Charts:** Interactive data visualization of your technical proficiencies and fields needing improvement.
*   **Interactive 6-Month Roadmap:** Customized learning roadmaps detailing week-by-week goals and recommended study materials.
*   **AI Mentor Chat:** A contextual workspace chat interface to clarify technical queries and syllabus doubts.

---

## 🎨 Immersive Design & UI/UX Stack

CampusConnect uses modern design trends, custom micro-interactions, and 3D scenes:
*   **3D Elements:** Powered by `@react-three/fiber`, `@react-three/drei`, and `@splinetool/react-spline` for interactive welcome page landing sequences.
*   **Cinematic Scrolling:** Integrated with **Lenis Smooth Scroll** and frame scroll-sequences for an Apple-style scrolling narrative.
*   **Animations:** Rich components utilize **Framer Motion** and **GSAP** for smooth transitions and hover tilt effects.
*   **Data Visualizations:** Dynamic skill radars and analytics charts powered by **Recharts**.
*   **Premium CSS:** Tailored HSL-color variables, glassmorphism, responsive grids, and luxury glow indicators.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core Single Page Application Framework |
| **Vite** | Modern, ultra-fast frontend build tool |
| **React Router DOM v7** | Route management and protected route architecture |
| **Three.js / React Three Fiber** | 3D web rendering and interactive background effects |
| **Lenis / GSAP / Framer Motion** | Scroll smoothing, timeline timelines, and complex layouts |
| **Recharts** | Interactive charts and analytics |
| **Lucide Icons** | Premium vector iconography |
| **Axios** | Promised-based HTTP client for API interactions |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
Make sure you have **Node.js** (v18 or higher recommended) and **npm** installed on your machine.

### Installation
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Vinay-ravuri/CampusConnect.git
    cd CampusConnect/campusconnect
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *Open your browser and navigate to `http://localhost:5173` to view the application.*

4.  **Build for Production:**
    ```bash
    npm run build
    ```
    *This generates optimized production files under the `/dist` directory.*

---

## 📂 Directory Structure

```text
campusconnect/
├── public/                 # Static assets (3D sequences, icons)
├── src/
│   ├── api/                # API client configuration (Axios)
│   ├── components/         # Reusable UI components & 3D canvases
│   │   └── career/         # Specialized AI Career widgets
│   ├── context/            # AuthContext & global state providers
│   ├── pages/              # Application pages (Welcome, Portals, Admin)
│   ├── services/           # AI Career & API services
│   ├── App.jsx             # Main router configuration & smooth scroll init
│   ├── index.css           # Core styling system and global design tokens
│   └── main.jsx            # React root mount point
├── package.json            # Project dependencies and script tasks
└── vite.config.js          # Vite configuration
```
