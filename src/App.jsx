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
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import Contact from './pages/Contact'
import CareerAssistant from './pages/CareerAssistant'

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/choose" element={<ChoosePage />} />
        <Route path="/student" element={<ProtectedRoute><StudentPortal /></ProtectedRoute>} />
        <Route path="/student/:regId" element={<ProtectedRoute><SubjectList /></ProtectedRoute>} />
        <Route path="/student/:regId/:subjectId" element={<ProtectedRoute><UnitPage /></ProtectedRoute>} />
        <Route path="/student/:regId/:subjectId/:unitNum" element={<ProtectedRoute><ResourcePage /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><PlacementPortal /></ProtectedRoute>} />
        <Route path="/career" element={<ProtectedRoute><CareerAssistant /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App