import Breadcrumb from './Breadcrumb'

/**
 * PageHeader - Consistent header component matching the presentation layout with
 * title, category pill, subtitle, optional handwritten note callout, and action buttons.
 */
export default function PageHeader({
  badge,
  title,
  subtitle,
  annotation,
  breadcrumbs,
  actions,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`cc-page-header ${className}`}
      style={{
        marginBottom: '32px',
        position: 'relative',
        ...style,
      }}
    >
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          {badge && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                background: 'rgba(253, 186, 18, 0.15)',
                border: '1px solid rgba(253, 186, 18, 0.35)',
                color: 'var(--cc-deep-orange, #F4511E)',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                marginBottom: '10px',
              }}
            >
              {badge}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: 800,
                color: 'var(--text, #111827)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              {title}
            </h1>

            {annotation && (
              <span className="handwritten-annotation">
                <span className="handwritten-arrow">✦</span>
                {annotation}
              </span>
            )}
          </div>

          {subtitle && (
            <p
              style={{
                marginTop: '10px',
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                color: 'var(--text-3, #4B5563)',
                lineHeight: 1.6,
                maxWidth: '680px',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
