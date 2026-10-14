import React from 'react'

export default function CompanyLogo({ name = '', size = 36, style = {} }) {
  const normalized = name.toLowerCase()

  if (normalized.includes('google')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
    )
  }

  if (normalized.includes('microsoft')) {
    return (
      <svg width={size} height={size} viewBox="0 0 23 23" style={style}>
        <rect fill="#F25022" x="1" y="1" width="10" height="10" rx="1" />
        <rect fill="#7FBA00" x="12" y="1" width="10" height="10" rx="1" />
        <rect fill="#00A4EF" x="1" y="12" width="10" height="10" rx="1" />
        <rect fill="#FFB900" x="12" y="12" width="10" height="10" rx="1" />
      </svg>
    )
  }

  if (normalized.includes('amazon')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFF4E5',
          borderRadius: 8,
          fontWeight: 900,
          color: '#FF9900',
          fontFamily: "'Inter', sans-serif",
          fontSize: size * 0.45,
          position: 'relative',
          ...style,
        }}
      >
        <span style={{ color: '#111827' }}>a</span>
        <svg
          width={size * 0.7}
          height={size * 0.3}
          viewBox="0 0 40 16"
          style={{ position: 'absolute', bottom: 3 }}
        >
          <path
            d="M2 4 C15 16, 25 16, 38 4"
            fill="none"
            stroke="#FF9900"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <polygon points="36,2 40,5 37,8" fill="#FF9900" />
        </svg>
      </div>
    )
  }

  if (normalized.includes('tcs')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
          border: '1px solid #FECDD3',
          borderRadius: 8,
          fontWeight: 900,
          color: '#E11D48',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: size * 0.34,
          letterSpacing: '-0.5px',
          lineHeight: 1,
          ...style,
        }}
      >
        <span style={{ fontSize: size * 0.28, color: '#BE123C' }}>🌸</span>
        <span style={{ fontWeight: 900, marginTop: 1 }}>tcs</span>
      </div>
    )
  }

  if (normalized.includes('infosys')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: 8,
          fontWeight: 800,
          color: '#0284C7',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: size * 0.28,
          letterSpacing: '-0.3px',
          ...style,
        }}
      >
        Infosys
      </div>
    )
  }

  if (normalized.includes('accenture')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDF4FF',
          border: '1px solid #F5D0FE',
          borderRadius: 8,
          fontWeight: 900,
          color: '#A855F7',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: size * 0.28,
          ...style,
        }}
      >
        <span>&gt;</span>accenture
      </div>
    )
  }

  if (normalized.includes('ibm')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#EFF6FF',
          border: '1px solid #93C5FD',
          borderRadius: 8,
          fontWeight: 900,
          color: '#1D4ED8',
          fontFamily: "'Courier New', monospace",
          fontSize: size * 0.38,
          letterSpacing: '1px',
          ...style,
        }}
      >
        IBM
      </div>
    )
  }

  if (normalized.includes('wipro')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          fontWeight: 800,
          color: '#0F172A',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: size * 0.28,
          position: 'relative',
          ...style,
        }}
      >
        <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#3B82F6' }} />
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }} />
        </div>
        <span>wipro</span>
      </div>
    )
  }

  if (normalized.includes('adobe')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FA0F00',
          borderRadius: 8,
          ...style,
        }}
      >
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M14.58 2H24v20h-5.26l-4.16-9.98zm-5.16 0H0v20h5.26l4.16-9.98zm2.58 8.02L15.94 22h-3.92l-1.99-4.88h-3.7l3.67-7.1z" />
        </svg>
      </div>
    )
  }

  // Fallback
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.45,
        color: '#4B5563',
        ...style,
      }}
    >
      💼
    </div>
  )
}
