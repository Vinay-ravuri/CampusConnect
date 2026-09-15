import { motion } from 'framer-motion'

/**
 * FilterChip - Pill-shaped filter button with active warm highlight, count badge, and smooth transition.
 */
export default function FilterChip({
  label,
  active = false,
  count,
  onClick,
  icon: Icon,
  className = '',
  style = {},
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`cc-filter-chip ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 16px',
        borderRadius: '100px',
        border: active
          ? '1px solid var(--cc-orange, #F97316)'
          : '1px solid var(--border, rgba(249, 115, 22, 0.14))',
        background: active
          ? 'linear-gradient(135deg, rgba(253, 186, 18, 0.18) 0%, rgba(249, 115, 22, 0.12) 100%)'
          : 'var(--surface, rgba(255, 255, 255, 0.72))',
        color: active ? 'var(--cc-deep-orange, #F4511E)' : 'var(--text-2, #374151)',
        fontWeight: active ? 700 : 500,
        fontSize: '13px',
        fontFamily: 'var(--font-heading)',
        cursor: 'pointer',
        boxShadow: active
          ? '0 2px 8px rgba(249, 115, 22, 0.15)'
          : 'var(--shadow-xs, 0 1px 3px rgba(17, 24, 39, 0.02))',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {Icon && <Icon size={14} color={active ? 'var(--cc-orange)' : 'currentColor'} />}
      <span>{label}</span>
      {count !== undefined && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '18px',
            height: '18px',
            padding: '0 5px',
            borderRadius: '100px',
            fontSize: '10px',
            fontWeight: 700,
            background: active ? 'var(--cc-orange, #F97316)' : 'rgba(17, 24, 39, 0.06)',
            color: active ? '#FFFFFF' : 'var(--text-3, #4B5563)',
          }}
        >
          {count}
        </span>
      )}
    </motion.button>
  )
}
