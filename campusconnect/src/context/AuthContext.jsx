import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cc_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // fallback
      }
    }
    const defaultUser = { name: 'vinay', email: 'vinay@campusconnect.edu', role: 'STUDENT' }
    try {
      localStorage.setItem('cc_user', JSON.stringify(defaultUser))
    } catch {}
    return defaultUser
  })

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, name, email: userEmail, role } = res.data
      const userData = { name, email: userEmail, role }
      setUser(userData)
      localStorage.setItem('cc_user', JSON.stringify(userData))
      localStorage.setItem('cc_token', token)
      return userData
    } catch (err) {
      if (!err.response) {
        console.warn('Backend server not reachable. Performing mock login.')
        const isAdm = email === 'admin@campusconnect.com'
        const userData = {
          name: isAdm ? 'Admin User' : (email.split('@')[0] || 'Student'),
          email,
          role: isAdm ? 'ADMIN' : 'STUDENT'
        }
        setUser(userData)
        localStorage.setItem('cc_user', JSON.stringify(userData))
        localStorage.setItem('cc_token', 'mock_token_jwt')
        return userData
      }
      throw err
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { token, name: userName, email: userEmail, role } = res.data
      const userData = { name: userName, email: userEmail, role }
      setUser(userData)
      localStorage.setItem('cc_user', JSON.stringify(userData))
      localStorage.setItem('cc_token', token)
      return userData
    } catch (err) {
      if (!err.response) {
        console.warn('Backend server not reachable. Performing mock registration.')
        const userData = { name, email, role: 'STUDENT' }
        setUser(userData)
        localStorage.setItem('cc_user', JSON.stringify(userData))
        localStorage.setItem('cc_token', 'mock_token_jwt')
        return userData
      }
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cc_user')
    localStorage.removeItem('cc_token')
  }

  const isAdmin = user?.role === 'ADMIN'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)