import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react'
import { PrimaryButton } from './Buttons'
import GlassCard from './GlassCard'

/**
 * EmptyState - Clean empty illustration/icon, title, explanation, and action button.
 */
export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no records available in this section yet.',
  actionLabel,
  onAction,
  className = '',
  style = {},
}) {
  return (
    <GlassCard
      className={`cc-empty-state ${className}`}
      padding="48px 24px"
      radius="xl"
      hoverEffect={false}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '520px',
        margin: '0 auto',
        ...style,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(253, 186, 18, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--cc-orange, #F97316)',
          marginBottom: '16px',
        }}
      >
        <Icon size={26} />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text, #111827)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-3, #4B5563)',
          lineHeight: 1.5,
          maxWidth: '380px',
          marginBottom: actionLabel ? '20px' : '0',
        }}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <PrimaryButton size="sm" onClick={onAction}>
          {actionLabel}
        </PrimaryButton>
      )}
    </GlassCard>
  )
}

/**
 * LoadingSkeleton - Shimmering placeholder skeletons for cards, text rows, and metrics.
 */
export function LoadingSkeleton({
  variant = 'card', // 'card' | 'text' | 'metric' | 'avatar'
  count = 1,
  height,
  width,
  className = '',
  style = {},
}) {
  const items = Array.from({ length: count }, (_, i) => i)

  const getStyle = () => {
    switch (variant) {
      case 'avatar':
        return {
          width: width || '44px',
          height: height || '44px',
          borderRadius: '50%',
        }
      case 'text':
        return {
          width: width || '100%',
          height: height || '16px',
          borderRadius: '6px',
        }
      case 'metric':
        return {
          width: width || '100%',
          height: height || '110px',
          borderRadius: 'var(--r-lg, 24px)',
        }
      case 'card':
      default:
        return {
          width: width || '100%',
          height: height || '180px',
          borderRadius: 'var(--r-xl, 28px)',
        }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {items.map((key) => (
        <div
          key={key}
          className={`cc-skeleton ${className}`}
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(253, 186, 18, 0.08) 50%, rgba(255,255,255,0.6) 100%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonShimmer 1.6s infinite linear',
            border: '1px solid rgba(249, 115, 22, 0.08)',
            ...getStyle(),
            ...style,
          }}
        />
      ))}
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

/**
 * ErrorState - Friendly error container with retry button and error details.
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while retrieving the requested data. Please try again.',
  onRetry,
  className = '',
  style = {},
}) {
  return (
    <GlassCard
      className={`cc-error-state ${className}`}
      padding="36px 24px"
      radius="xl"
      hoverEffect={false}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 auto',
        borderColor: 'rgba(239, 68, 68, 0.25)',
        ...style,
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '14px',
          background: 'rgba(239, 68, 68, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger, #EF4444)',
          marginBottom: '14px',
        }}
      >
        <AlertCircle size={24} />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--text, #111827)',
          marginBottom: '6px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-3, #4B5563)',
          lineHeight: 1.5,
          maxWidth: '360px',
          marginBottom: onRetry ? '18px' : '0',
        }}
      >
        {message}
      </p>

      {onRetry && (
        <PrimaryButton size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </PrimaryButton>
      )}
    </GlassCard>
  )
}
