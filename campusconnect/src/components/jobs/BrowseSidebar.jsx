import React from 'react'
import {
  Briefcase,
  Building2,
  GraduationCap,
  Clock,
  Wifi,
  Landmark,
  FileText,
  Bookmark,
  History
} from 'lucide-react'

export const BROWSE_ITEMS = [
  { id: 'ALL', label: 'All Opportunities', icon: Briefcase },
  { id: 'FULL_TIME', label: 'Full-time Jobs', icon: Building2 },
  { id: 'INTERNSHIP', label: 'Internships', icon: GraduationCap },
  { id: 'PART_TIME', label: 'Part-time Jobs', icon: Clock },
  { id: 'REMOTE', label: 'Remote Jobs', icon: Wifi },
  { id: 'ON_CAMPUS', label: 'On-Campus Drives', icon: Landmark },
  { id: 'GOVT', label: 'Govt. Jobs', icon: FileText },
  { id: 'SAVED', label: 'Saved Jobs', icon: Bookmark },
  { id: 'APPLICATIONS', label: 'Application History', icon: History },
]

export default function BrowseSidebar({
  activeItem = 'ALL',
  onSelectItem,
  savedCount = 0,
  applicationsCount = 0,
}) {
  return (
    <aside
      style={{
        width: '230px',
        minWidth: '230px',
        maxWidth: '230px',
        background: '#FFFFFF',
        borderRadius: '22px',
        border: '1px solid #E2E8F0',
        padding: '18px 12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
        position: 'sticky',
        top: '90px',
        alignSelf: 'flex-start',
        maxHeight: 'calc(100vh - 105px)',
        overflowY: 'auto',
        zIndex: 10,
      }}
      className="cc-browse-sidebar cc-sticky-sidebar"
    >
      {/* Title */}
      <div
        style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#64748B',
          padding: '4px 10px 14px 10px',
          fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
        }}
      >
        BROWSE OPPORTUNITIES
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {BROWSE_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item.id)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#EBF3FE' : 'transparent',
                color: isActive ? '#1D4ED8' : '#334155',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F8FAFC'
                  e.currentTarget.style.color = '#0F172A'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#334155'
                }
              }}
            >
              {/* Active left indicator */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    bottom: '6px',
                    width: '3.5px',
                    borderRadius: '0 4px 4px 0',
                    background: '#2563EB',
                  }}
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <Icon
                  size={16}
                  style={{
                    color: isActive ? '#2563EB' : '#64748B',
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </div>

              {/* Optional badge count for saved and applications */}
              {item.id === 'SAVED' && savedCount > 0 && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    background: isActive ? '#2563EB' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#64748B',
                  }}
                >
                  {savedCount}
                </span>
              )}

              {item.id === 'APPLICATIONS' && applicationsCount > 0 && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    background: isActive ? '#2563EB' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#64748B',
                  }}
                >
                  {applicationsCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
