import GlassCard from './GlassCard'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * StatCard - Metric display card with numerical value, label, trend pill,
 * icon badge, and compliance with the Data Principle (clearly labeled demo tags when appropriate).
 */
export default function StatCard({
  label,
  value,
  icon: Icon,
  trend, // e.g. "+12%" or "-5%"
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  trendLabel = 'vs last semester',
  isDemo = false,
  accentColor = 'var(--cc-orange, #F97316)',
  className = '',
  style = {},
}) {
  return (
    <GlassCard
      className={`cc-stat-card ${className}`}
      padding="20px 24px"
      radius="lg"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-3, #4B5563)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {label}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isDemo && (
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(17, 24, 39, 0.05)',
                color: 'var(--text-4, #9CA3AF)',
                letterSpacing: '0.4px',
              }}
              title="Illustrative benchmark from sample dataset"
            >
              Demo Benchmark
            </span>
          )}

          {Icon && (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, rgba(253, 186, 18, 0.15) 0%, rgba(249, 115, 22, 0.10) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: accentColor,
              }}
            >
              <Icon size={18} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <div
          style={{
            fontSize: 'clamp(24px, 2.5vw, 32px)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text, #111827)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>

        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '100px',
              background:
                trendDirection === 'up'
                  ? 'rgba(16, 185, 129, 0.10)'
                  : trendDirection === 'down'
                  ? 'rgba(239, 68, 68, 0.10)'
                  : 'rgba(17, 24, 39, 0.06)',
              color:
                trendDirection === 'up'
                  ? 'var(--success, #10B981)'
                  : trendDirection === 'down'
                  ? 'var(--danger, #EF4444)'
                  : 'var(--text-3, #4B5563)',
            }}
          >
            {trendDirection === 'up' && <TrendingUp size={11} />}
            {trendDirection === 'down' && <TrendingDown size={11} />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {trendLabel && (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-4, #9CA3AF)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {trendLabel}
        </div>
      )}
    </GlassCard>
  )
}
