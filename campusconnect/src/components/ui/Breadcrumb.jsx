import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Breadcrumb - Clean navigation breadcrumbs with clickable ancestors and warm active leaf indicator.
 */
export default function Breadcrumb({ items = [], className = '' }) {
  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={`cc-breadcrumb ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '13px',
        fontFamily: 'var(--font-heading)',
        color: 'var(--text-3, #4B5563)',
        marginBottom: '16px',
      }}
    >
      <Link
        to="/welcome"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-3, #4B5563)',
          textDecoration: 'none',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cc-orange)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3, #4B5563)')}
      >
        <Home size={14} />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ChevronRight size={13} style={{ opacity: 0.4 }} />
            {isLast || !item.href ? (
              <span
                style={{
                  fontWeight: 600,
                  color: isLast ? 'var(--cc-orange, #F97316)' : 'var(--text, #111827)',
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                style={{
                  color: 'var(--text-3, #4B5563)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cc-orange)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3, #4B5563)')}
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
