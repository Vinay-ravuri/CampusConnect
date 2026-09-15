import { motion } from 'framer-motion'

/**
 * GlassCard - Translucent white card with backdrop blur, 20-28px rounded corners,
 * soft shadows, subtle borders, and warm ambient hover elevation.
 */
export default function GlassCard({
  children,
  className = '',
  glow = false,
  radius = 'xl', // 'md' (20px), 'lg' (24px), 'xl' (28px)
  hoverEffect = true,
  padding = '24px',
  style = {},
  onClick,
  ...props
}) {
  const radiusMap = {
    sm: '12px',
    md: 'var(--r-md, 20px)',
    lg: 'var(--r-lg, 24px)',
    xl: 'var(--r-xl, 28px)',
    '2xl': 'var(--r-2xl, 36px)',
  }

  const borderRadius = radiusMap[radius] || radiusMap.xl

  const cardStyle = {
    background: 'var(--surface, rgba(255, 255, 255, 0.72))',
    backdropFilter: 'var(--glass-blur, blur(24px))',
    WebkitBackdropFilter: 'var(--glass-blur, blur(24px))',
    border: '1px solid var(--border, rgba(249, 115, 22, 0.12))',
    borderRadius,
    padding,
    boxShadow: 'var(--shadow-sm, 0 4px 16px rgba(17, 24, 39, 0.04))',
    position: 'relative',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }

  return (
    <motion.div
      className={`cc-glass-card ${glow ? 'cc-glass-card-glow' : ''} ${className}`}
      style={cardStyle}
      onClick={onClick}
      whileHover={hoverEffect ? {
        y: -3,
        borderColor: 'var(--border-2, rgba(249, 115, 22, 0.22))',
        boxShadow: 'var(--shadow-md, 0 10px 30px rgba(17, 24, 39, 0.06))',
      } : undefined}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--grad-main)',
            opacity: 0.8,
          }}
        />
      )}
      {children}
    </motion.div>
  )
}
