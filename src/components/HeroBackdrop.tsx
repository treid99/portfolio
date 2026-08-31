import { motion, useReducedMotion } from 'motion/react'
import './HeroBackdrop.css'

/**
 * Decorative hero background: a masked engineering grid, two slow-drifting
 * glows, and three signal lines whose dashes travel left to right — a quiet
 * nod to a pipeline running behind everything.
 */
export default function HeroBackdrop() {
  const reduced = useReducedMotion()

  const lines = [
    { d: 'M-40 118 H 420 Q 470 118 470 168 V 250', delay: 0 },
    { d: 'M-40 250 H 300 Q 350 250 350 300 V 420', delay: 1.1 },
    { d: 'M-40 366 H 210 Q 260 366 260 316 V 190', delay: 2.2 },
  ]

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__grid" />

      <motion.div
        className="backdrop__glow backdrop__glow--a"
        animate={reduced ? undefined : { x: [0, 40, 0], y: [0, -26, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="backdrop__glow backdrop__glow--b"
        animate={reduced ? undefined : { x: [0, -34, 0], y: [0, 30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg className="backdrop__signals" viewBox="0 0 640 480" preserveAspectRatio="xMinYMid slice">
        {lines.map((line) => (
          <g key={line.d}>
            <path
              d={line.d}
              fill="none"
              stroke="var(--accent-line)"
              strokeWidth="1"
              opacity="0.45"
            />
            {!reduced && (
              <motion.path
                d={line.d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="26 460"
                initial={{ strokeDashoffset: 486 }}
                animate={{ strokeDashoffset: -60 }}
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: line.delay,
                }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
