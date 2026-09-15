import { motion } from 'framer-motion'

/**
 * ProgressBar - Animated progress bar with smooth rounded pill, percentage label,
 * and warm yellow-to-orange gradient fill.
 */
export default function ProgressBar({
  value = 0, // 0 to 100
  label,
  showPercentage = true,
  height = 8,
  gradient = 'var(--grad-main, linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #F4511E 100%))',
  trackColor = 'rgba(249, 115, 22, 0.10)',
  className = '',
  style = {},
}) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={`cc-progress-bar ${className}`} style={{ width: '100%', ...style }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '12px',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {label && (
            <span style={{ fontWeight: 600, color: 'var(--text-2, #374151)' }}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span style={{ fontWeight: 700, color: 'var(--cc-orange, #F97316)' }}>
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: trackColor,
          borderRadius: '100px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            background: gradient,
            borderRadius: '100px',
            boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)',
          }}
        />
      </div>
    </div>
  )
}
