import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Stagger helper: seconds of delay before this element animates. */
  delay?: number
  /** Distance travelled, in px. */
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

/**
 * One reveal primitive for the whole site, so motion stays consistent.
 * Animates once, and collapses to a plain fade-free render when the
 * visitor prefers reduced motion.
 */
export default function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: Props) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}
