import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
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
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App