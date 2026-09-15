/**
 * Badge - Standardized status and category badge with pill shape and subtle borders.
 */
export default function Badge({
  children,
  variant = 'orange', // 'yellow' | 'orange' | 'deep-orange' | 'blue' | 'success' | 'warning' | 'danger' | 'neutral'
  size = 'md', // 'sm' | 'md'
  dot = false,
  className = '',
  style = {},
}) {
  const variantMap = {
    yellow: {
      bg: 'rgba(253, 186, 18, 0.15)',
      border: 'rgba(253, 186, 18, 0.35)',
      color: '#B45309',
      dotColor: '#FDBA12',
    },
    orange: {
      bg: 'rgba(249, 115, 22, 0.12)',
      border: 'rgba(249, 115, 22, 0.28)',
      color: 'var(--cc-deep-orange, #F4511E)',
      dotColor: '#F97316',
    },
    'deep-orange': {
      bg: 'rgba(244, 81, 30, 0.12)',
      border: 'rgba(244, 81, 30, 0.28)',
      color: '#C2410C',
      dotColor: '#F4511E',
    },
    blue: {
      bg: 'rgba(37, 99, 235, 0.10)',
      border: 'rgba(37, 99, 235, 0.25)',
      color: '#1D4ED8',
      dotColor: '#2563EB',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      color: '#047857',
      dotColor: '#10B981',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      color: '#B45309',
      dotColor: '#F59E0B',
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      color: '#B91C1C',
      dotColor: '#EF4444',
    },
    neutral: {
      bg: 'rgba(17, 24, 39, 0.06)',
      border: 'rgba(17, 24, 39, 0.12)',
      color: '#374151',
      dotColor: '#6B7280',
    },
  }

  const current = variantMap[variant] || variantMap.orange

  return (
    <span
      className={`cc-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius: '100px',
        background: current.bg,
        border: `1px solid ${current.border}`,
        color: current.color,
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        letterSpacing: '0.2px',
        lineHeight: 1.4,
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: current.dotColor,
          }}
        />
      )}
      <span>{children}</span>
    </span>
  )
}
