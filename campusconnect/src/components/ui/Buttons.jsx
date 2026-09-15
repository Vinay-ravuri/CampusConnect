import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * PrimaryButton - Warm yellow-to-orange gradient button with soft shadow and hover elevation.
 */
export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  className = '',
  style = {},
  type = 'button',
  ...props
}) {
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '13px', gap: '6px', borderRadius: '100px' },
    md: { padding: '11px 24px', fontSize: '14px', gap: '8px', borderRadius: '100px' },
    lg: { padding: '14px 32px', fontSize: '15px', gap: '10px', borderRadius: '100px' },
  }

  const currentSize = sizeStyles[size] || sizeStyles.md

  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? undefined : {
        scale: 1.02,
        boxShadow: '0 8px 24px rgba(249, 115, 22, 0.28)',
      }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
        background: 'var(--grad-main, linear-gradient(135deg, #FDBA12 0%, #F97316 60%, #F4511E 100%))',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: currentSize.borderRadius,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.20)',
        letterSpacing: '0.2px',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        gap: currentSize.gap,
        ...style,
      }}
      className={`cc-primary-btn ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : 17} />}
          <span>{children}</span>
          {IconRight && <IconRight size={size === 'sm' ? 14 : 17} />}
        </>
      )}
    </motion.button>
  )
}

/**
 * SecondaryButton - Translucent glass button with subtle border, hover state, and icon support.
 */
export function SecondaryButton({
  children,
  onClick,
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  size = 'md',
  fullWidth = false,
  className = '',
  style = {},
  type = 'button',
  ...props
}) {
  const sizeStyles = {
    sm: { padding: '7px 15px', fontSize: '13px', gap: '6px', borderRadius: '100px' },
    md: { padding: '10px 22px', fontSize: '14px', gap: '8px', borderRadius: '100px' },
    lg: { padding: '13px 28px', fontSize: '15px', gap: '10px', borderRadius: '100px' },
  }

  const currentSize = sizeStyles[size] || sizeStyles.md

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : {
        scale: 1.02,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'var(--border-2, rgba(249, 115, 22, 0.25))',
      }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
        background: 'var(--surface, rgba(255, 255, 255, 0.72))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: 'var(--text, #111827)',
        border: '1px solid var(--border, rgba(249, 115, 22, 0.14))',
        borderRadius: currentSize.borderRadius,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: 'var(--shadow-xs, 0 1px 3px rgba(17, 24, 39, 0.03))',
        letterSpacing: '0.2px',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        gap: currentSize.gap,
        ...style,
      }}
      className={`cc-secondary-btn ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 17} color="var(--cc-orange)" />}
      <span>{children}</span>
      {IconRight && <IconRight size={size === 'sm' ? 14 : 17} />}
    </motion.button>
  )
}
