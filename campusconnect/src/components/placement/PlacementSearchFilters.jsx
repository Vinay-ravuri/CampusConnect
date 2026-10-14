import React from 'react'
import { Search, ChevronDown, Star, Award } from 'lucide-react'

export const FILTER_CHIPS = [
  { id: 'ALL', label: 'All' },
  { id: 'BEGINNER', label: 'Beginner' },
  { id: 'INTERMEDIATE', label: 'Intermediate' },
  { id: 'ADVANCED', label: 'Advanced' },
  { id: 'FREE', label: 'Free', icon: Star },
  { id: 'CERTIFIED', label: 'Certification', icon: Award },
]

export default function PlacementSearchFilters({
  searchQuery = '',
  onSearchChange,
  activeFilter = 'ALL',
  onFilterChange,
  onSearchSubmit,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '26px',
      }}
    >
      {/* ── Search Input Box with Search Button ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#FFFFFF',
          borderRadius: '9999px',
          border: '1px solid #E2E8F0',
          padding: '4px 6px 4px 16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          flex: '1 1 360px',
          maxWidth: '560px',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <Search size={16} style={{ color: '#94A3B8', marginRight: '10px', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearchSubmit) {
              onSearchSubmit(searchQuery)
            }
          }}
          placeholder="Search courses, topics (e.g. DSA, DBMS, System Design...)"
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '13.5px',
            color: '#1E293B',
            fontFamily: 'Inter, sans-serif',
          }}
        />

        <button
          type="button"
          onClick={() => onSearchSubmit && onSearchSubmit(searchQuery)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: '#059669',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '7px 16px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.2)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
        >
          <span>Search</span>
          <ChevronDown size={13} />
        </button>
      </div>

      {/* ── Filter Chips ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip.id
          const ChipIcon = chip.icon

          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onFilterChange(chip.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '9999px',
                border: isActive ? '1px solid #059669' : '1px solid #E2E8F0',
                background: isActive ? '#059669' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#475569',
                fontSize: '12.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(5, 150, 105, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.15s ease-in-out',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#CBD5E1'
                  e.currentTarget.style.color = '#0F172A'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#E2E8F0'
                  e.currentTarget.style.color = '#475569'
                }
              }}
            >
              {ChipIcon && (
                <ChipIcon
                  size={13}
                  style={{
                    color: isActive ? '#FFFFFF' : chip.id === 'FREE' ? '#10B981' : '#F59E0B',
                  }}
                />
              )}
              <span>{chip.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
