import { motion, useReducedMotion } from 'motion/react'
import { useTheme } from '../lib/theme'
import './ThemeToggle.css'

function Moon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.5 14.6A9 9 0 1 1 9.4 3.5a7.2 7.2 0 0 0 11.1 11.1Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Sun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.6" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <line x1="12" y1="1.8" x2="12" y2="3.8" />
        <line x1="12" y1="20.2" x2="12" y2="22.2" />
        <line x1="1.8" y1="12" x2="3.8" y2="12" />
        <line x1="20.2" y1="12" x2="22.2" y2="12" />
        <line x1="5" y1="5" x2="6.4" y2="6.4" />
        <line x1="17.6" y1="17.6" x2="19" y2="19" />
        <line x1="5" y1="19" x2="6.4" y2="17.6" />
        <line x1="17.6" y1="6.4" x2="19" y2="5" />
      </g>
    </svg>
  )
}

/**
 * Two-position switch. Both settings stay visible and the thumb slides to the
 * one in force, so the current theme is readable without hovering or guessing.
 * It remains a single control: either half flips to the other theme.
 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const reduced = useReducedMotion()
  const isDark = theme === 'dark'
  const target = isDark ? 'light' : 'dark'

  return (
    <button
      type="button"
      className={`theme-switch ${isDark ? 'is-dark' : 'is-light'}`}
      onClick={toggle}
      aria-label={`Switch to ${target} theme`}
      title={`Switch to ${target} theme`}
    >
      <motion.span
        className="theme-switch__thumb"
        aria-hidden="true"
        animate={{ x: isDark ? 0 : '100%' }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
      />
      <span className="theme-switch__side">
        <Moon />
      </span>
      <span className="theme-switch__side">
        <Sun />
      </span>
    </button>
  )
}
