import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoginModal from './LoginModal'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(true)

  if (!isLoggedIn) {
    return (
      <div style={{
        background: 'linear-gradient(160deg, #FCFCFD 0%, #FAF9F6 55%, #F3EFE9 100%)',
        minHeight: '100vh',
      }}>
        <AnimatePresence>
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </AnimatePresence>
      </div>
    )
  }

  return children
}