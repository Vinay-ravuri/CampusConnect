import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  if (!isLoggedIn) {
    return (
      <div style={{
        background: '#0B0F19',
        minHeight: '100vh',
      }}>
        <LoginModal
          redirectTo="/dashboard"
          onClose={() => navigate('/welcome')}
        />
      </div>
    )
  }

  return children
}