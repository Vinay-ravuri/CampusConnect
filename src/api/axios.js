import axios from 'axios'

const api = axios.create({
  baseURL: '/api',   // Vite proxy forwards this to http://localhost:8081/api
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api