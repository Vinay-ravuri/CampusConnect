import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Lenis from 'lenis'
import SplashScreen from './pages/SplashScreen'
import Welcome from './pages/Welcome'
import ChoosePage from './pages/ChoosePage'
import StudentPortal from './pages/StudentPortal'
import SubjectList from './pages/SubjectList'
import UnitPage from './pages/UnitPage'
import ResourcePage from './pages/ResourcePage'
import PlacementPortal from './pages/PlacementPortal'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import Contact from './pages/Contact'
import CareerAssistant from './pages/CareerAssistant'

import { ToastProvider } from './components/ui'

import CinematicExperience from './pages/CinematicExperience'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/cinematic" element={<CinematicExperience />} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/choose" element={<StudentPortal />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/student/:regId" element={<SubjectList />} />
          <Route path="/student/:regId/:subjectId" element={<UnitPage />} />
          <Route path="/student/:regId/:subjectId/:unitNum" element={<UnitPage />} />
          <Route path="/placement" element={<PlacementPortal />} />
          <Route path="/placement-resources" element={<PlacementPortal />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/career" element={<ProtectedRoute><CareerAssistant /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App