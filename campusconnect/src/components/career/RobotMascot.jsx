import React from 'react'

export default function RobotMascot({ size = 110 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Speech Bubble */}
      <div
        style={{
          position: 'absolute',
          right: '90%',
          top: '12%',
          background: '#FFFFFF',
          border: '1.5px solid #BFDBFE',
          borderRadius: 16,
          padding: '8px 14px',
          boxShadow: '0 6px 20px rgba(37, 99, 235, 0.08)',
          whiteSpace: 'nowrap',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12.5,
          fontWeight: 700,
          color: '#1E3A8A',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 2,
        }}
      >
        <span>Let AI guide you to your dream job!</span>
        {/* Triangle arrow pointer */}
        <div
          style={{
            position: 'absolute',
            right: -7,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '7px solid #BFDBFE',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: '6px solid #FFFFFF',
          }}
        />
      </div>

      {/* 3D Robot Figure */}
      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 120 132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 12px 24px rgba(37, 99, 235, 0.15))' }}
      >
        {/* Antennas with gold sphere */}
        <line x1="60" y1="12" x2="60" y2="2" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="2" r="4.5" fill="#F59E0B" />
        <line x1="60" y1="2" x2="60" y2="0" stroke="#FBBF24" strokeWidth="2" />

        {/* Head Base */}
        <rect x="24" y="12" width="72" height="52" rx="20" fill="url(#headGrad)" stroke="#E2E8F0" strokeWidth="2" />

        {/* Gloss highlight on head */}
        <path d="M34 16 Q60 14 86 16" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

        {/* Blue Visor / Screen */}
        <rect x="32" y="24" width="56" height="30" rx="12" fill="#0F172A" />

        {/* Expressive Glowing Eyes */}
        <rect x="42" y="32" width="12" height="14" rx="6" fill="#38BDF8" />
        <circle cx="48" cy="36" r="2.5" fill="#FFFFFF" />

        <rect x="66" y="32" width="12" height="14" rx="6" fill="#38BDF8" />
        <circle cx="72" cy="36" r="2.5" fill="#FFFFFF" />

        {/* Robot Ears / Side Nodes */}
        <rect x="18" y="28" width="6" height="18" rx="3" fill="#F59E0B" />
        <rect x="96" y="28" width="6" height="18" rx="3" fill="#F59E0B" />

        {/* Neck */}
        <rect x="52" y="64" width="16" height="8" rx="2" fill="#94A3B8" />

        {/* Body */}
        <rect x="28" y="72" width="64" height="48" rx="18" fill="url(#bodyGrad)" stroke="#E2E8F0" strokeWidth="2" />

        {/* Chest Plate / Core Emblem */}
        <rect x="42" y="82" width="36" height="24" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="60" cy="94" r="5" fill="#2563EB" />
        <circle cx="60" cy="94" r="2.5" fill="#93C5FD" />

        {/* Arms */}
        <rect x="12" y="78" width="12" height="28" rx="6" fill="url(#armGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="96" y="78" width="12" height="28" rx="6" fill="url(#armGrad)" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* Gradients */}
        <defs>
          <linearGradient id="headGrad" x1="24" y1="12" x2="96" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#F8FAFC" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="28" y1="72" x2="92" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="armGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
