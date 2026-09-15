import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'

/**
 * Sidebar - Collapsible navigation sidebar for multi-section views with grouping,
 * active pill indicators, and mobile drawer support.
 */
export default function Sidebar({
  sections = [], // [{ title: 'Main', items: [{ id, label, icon: Icon, badge, onClick, active }] }]
  activeId,
  onSelect,
  className = '',
  style = {},
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: collapsed ? '16px 8px' : '20px 16px',
        gap: '24px',
      }}
    >
      {sections.map((section, sIdx) => (
        <div key={sIdx}>
          {section.title && !collapsed && (
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--text-4, #9CA3AF)',
                padding: '0 12px 8px 12px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {section.title}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {section.items.map((item) => {
              const isActive = activeId ? activeId === item.id : item.active
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelect) onSelect(item.id)
                    if (item.onClick) item.onClick()
                    setMobileOpen(false)
                  }}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    gap: '12px',
                    padding: collapsed ? '10px' : '10px 14px',
                    borderRadius: 'var(--r-md, 20px)',
                    border: 'none',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(253, 186, 18, 0.18) 0%, rgba(249, 115, 22, 0.12) 100%)'
                      : 'transparent',
                    color: isActive ? 'var(--cc-deep-orange, #F4511E)' : 'var(--text-2, #374151)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                    fontFamily: 'var(--font-heading)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {Icon && (
                      <Icon
                        size={18}
                        color={isActive ? 'var(--cc-orange, #F97316)' : 'currentColor'}
                      />
                    )}
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed && item.badge !== undefined && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: isActive ? 'var(--cc-orange)' : 'rgba(17, 24, 39, 0.06)',
                        color: isActive ? '#FFFFFF' : 'var(--text-3, #4B5563)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none', // Shown on mobile via CSS media query
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 90,
          background: 'var(--cc-orange)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '50%',
          width: '46px',
          height: '46px',
          boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`cc-sidebar hide-mobile ${className}`}
        style={{
          width: collapsed ? '72px' : '260px',
          minWidth: collapsed ? '72px' : '260px',
          background: 'var(--surface, rgba(255, 255, 255, 0.72))',
          backdropFilter: 'var(--glass-blur, blur(24px))',
          WebkitBackdropFilter: 'var(--glass-blur, blur(24px))',
          borderRight: '1px solid var(--border, rgba(249, 115, 22, 0.12))',
          borderRadius: '0 var(--r-xl, 28px) var(--r-xl, 28px) 0',
          boxShadow: 'var(--shadow-xs)',
          transition: 'width 0.3s var(--ease-smooth)',
          position: 'relative',
          ...style,
        }}
      >
        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '-12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid var(--border, rgba(249, 115, 22, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            color: 'var(--text-3)',
            zIndex: 10,
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(17, 24, 39, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 190,
            }}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '280px',
                height: '100%',
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-3)',
                }}
              >
                <X size={20} />
              </button>
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
