import { motion, useReducedMotion } from 'motion/react'
import { site } from '../data/site'

/** "Thomas Reid" -> "TR". Derived so the mark follows the name, not a literal. */
const initials = site.name
  .split(/\s+/)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

/**
 * Brand mark: a rounded square holding the initials. It settles in on mount and
 * lifts a little on hover — enough to read as a link without redrawing itself.
 */
export default function Monogram() {
  const reduced = useReducedMotion()

  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
      initial={reduced ? false : { scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={reduced ? undefined : { y: -1.5, scale: 1.04 }}
      transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ flexShrink: 0, overflow: 'visible' }}
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        fill="var(--accent-soft)"
        stroke="var(--accent-line)"
        strokeWidth="1"
      />
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--accent)"
        fontFamily="var(--font-mono)"
        fontSize="12.5"
        fontWeight="600"
        letterSpacing="0.5"
      >
        {initials}
      </text>
    </motion.svg>
  )
}
