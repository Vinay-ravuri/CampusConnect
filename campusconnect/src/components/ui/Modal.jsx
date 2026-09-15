import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Modal - Accessible glassmorphic modal dialog with backdrop blur,
 * Framer Motion entrance/exit, ESC key & outside click listeners.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '540px',
  showClose = true,
  className = '',
}) {
  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && onClose) {
              onClose()
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(17, 24, 39, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`cc-modal ${className}`}
            style={{
              width: '100%',
              maxWidth,
              background: '#FFFFFF',
              borderRadius: 'var(--r-xl, 28px)',
              border: '1px solid var(--border, rgba(249, 115, 22, 0.14))',
              boxShadow: 'var(--shadow-xl, 0 32px 64px rgba(17, 24, 39, 0.12))',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Warm Accent Ribbon */}
            <div
              style={{
                height: '4px',
                width: '100%',
                background: 'var(--grad-main)',
              }}
            />

            {/* Modal Header */}
            {(title || showClose) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '24px 28px 12px 28px',
                }}
              >
                <div>
                  {title && (
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--text, #111827)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-3, #4B5563)',
                        marginTop: '4px',
                      }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>

                {showClose && (
                  <button
                    onClick={onClose}
                    style={{
                      background: 'rgba(17, 24, 39, 0.05)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-3, #4B5563)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(17, 24, 39, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(17, 24, 39, 0.05)')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div style={{ padding: '16px 28px 28px 28px' }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
