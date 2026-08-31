import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

type Props = {
  to: number
  prefix?: string
  suffix?: string
  /** Seconds. */
  duration?: number
}

/** Counts up once, the first time it scrolls into view. */
export default function Counter({ to, prefix = '', suffix = '', duration = 1.4 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  // No negative margin: on a short viewport an inset root box can leave a
  // counter permanently "not in view", freezing it at zero.
  const inView = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  // useReducedMotion resolves after the first render, so the final value is
  // applied in the effect below rather than captured in the initial state.
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduced) {
      setValue(to)
      return
    }
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, reduced, to, duration])

  const rendered = to >= 1000 ? Math.round(value).toLocaleString('en-US') : Math.round(value)

  return (
    <span ref={ref}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  )
}
