import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const newToast = { id, type, title, message }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast]
  )

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
    info: (message, title = 'Notification') => addToast({ type: 'info', title, message }),
    dismiss: removeToast,
  }

  const icons = {
    success: <CheckCircle2 size={18} color="var(--success, #10B981)" />,
    error: <AlertCircle size={18} color="var(--danger, #EF4444)" />,
    warning: <AlertTriangle size={18} color="var(--warning, #F59E0B)" />,
    info: <Info size={18} color="var(--cc-orange, #F97316)" />,
  }

  const borders = {
    success: 'rgba(16, 185, 129, 0.3)',
    error: 'rgba(239, 68, 68, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
    info: 'rgba(249, 115, 22, 0.3)',
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 'var(--r-md, 20px)',
                border: `1px solid ${borders[t.type] || borders.info}`,
                boxShadow: '0 10px 30px rgba(17, 24, 39, 0.08)',
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>{icons[t.type]}</div>

              <div style={{ flex: 1 }}>
                {t.title && (
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--text, #111827)',
                    }}
                  >
                    {t.title}
                  </div>
                )}
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-3, #4B5563)',
                    marginTop: t.title ? '2px' : 0,
                    lineHeight: 1.4,
                  }}
                >
                  {t.message}
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  color: 'var(--text-4, #9CA3AF)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
