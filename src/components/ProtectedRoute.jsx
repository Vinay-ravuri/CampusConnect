import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import LoginModal from './LoginModal'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(true)

  if (!isLoggedIn) {
    return (
      <div style={{ background: '#04040a', minHeight: '100vh' }}>
        <LoginModal onClose={() => setShowLogin(false)} />
      </div>
    )
  }

  return children
}