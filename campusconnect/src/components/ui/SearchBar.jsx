import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

/**
 * SearchBar - Glassmorphic search input with search icon, clear button,
 * and keyboard shortcut hint (Ctrl+K / ⌘K).
 */
export default function SearchBar({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search resources, subjects, questions, jobs...',
  showShortcut = true,
  className = '',
  style = {},
  autoFocus = false,
}) {
  const [query, setQuery] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  // Global Ctrl+K / Cmd+K listener to focus search input
  useEffect(() => {
    if (!showShortcut) return
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showShortcut])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (onChange) onChange(val)
  }

  const handleClear = () => {
    setQuery('')
    if (onChange) onChange('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(query)
    }
    if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }

  return (
    <div
      className={`cc-search-bar ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '560px',
        ...style,
      }}
    >
      <Search
        size={18}
        color="var(--cc-orange, #F97316)"
        style={{
          position: 'absolute',
          left: '16px',
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          padding: '12px 75px 12px 46px',
          background: 'var(--surface, rgba(255, 255, 255, 0.72))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border, rgba(249, 115, 22, 0.14))',
          borderRadius: '100px',
          fontSize: '14px',
          fontFamily: 'var(--font-heading)',
          color: 'var(--text, #111827)',
          boxShadow: 'var(--shadow-xs, 0 1px 4px rgba(17, 24, 39, 0.03))',
          outline: 'none',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--cc-orange, #F97316)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.12)'
          e.currentTarget.style.backgroundColor = '#FFFFFF'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border, rgba(249, 115, 22, 0.14))'
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)'
          e.currentTarget.style.backgroundColor = 'var(--surface, rgba(255, 255, 255, 0.72))'
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {query && (
          <button
            onClick={handleClear}
            style={{
              background: 'rgba(17, 24, 39, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-3)',
            }}
            title="Clear search"
          >
            <X size={12} />
          </button>
        )}

        {showShortcut && !query && (
          <kbd
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(17, 24, 39, 0.06)',
              color: 'var(--text-4, #9CA3AF)',
              border: '1px solid rgba(17, 24, 39, 0.1)',
            }}
          >
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  )
}
