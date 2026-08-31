import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import './Pipeline.css'

type Stage = {
  label: string
  sub: string
  /** Rendered inside the node once the stage has passed. */
  icon: 'commit' | 'build' | 'unit' | 'api' | 'e2e' | 'report'
}

const STAGES: Stage[] = [
  { label: 'Commit', sub: 'branch pushed', icon: 'commit' },
  { label: 'Build', sub: 'typecheck + lint', icon: 'build' },
  { label: 'Unit', sub: 'fast, isolated', icon: 'unit' },
  { label: 'Contract', sub: 'API shape', icon: 'api' },
  { label: 'E2E', sub: 'Playwright, sharded', icon: 'e2e' },
  { label: 'Report', sub: 'traces + verdict', icon: 'report' },
]

const W = 1020
const H = 132
const PAD = 74
const TRACK_Y = 54
const GAP = (W - PAD * 2) / (STAGES.length - 1)
const xAt = (i: number) => PAD + GAP * i

const STEP_MS = 900

export default function Pipeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-80px' })
  const reduced = useReducedMotion()
  // -1 = idle, 0..n-1 = stage reached, n = full pass held before the reset.
  // useReducedMotion resolves after the first render, so the completed state
  // is applied in the effect below rather than captured in the initial state.
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (reduced) {
      setActive(STAGES.length)
      return
    }
    if (!inView) return
    const id = setInterval(() => {
      setActive((prev) => (prev >= STAGES.length ? -1 : prev + 1))
    }, STEP_MS)
    return () => clearInterval(id)
  }, [inView, reduced])

  const complete = active >= STAGES.length
  const headIndex = Math.min(Math.max(active, 0), STAGES.length - 1)
  const progressX = active < 0 ? PAD : xAt(headIndex)

  return (
    <div className="pipeline" ref={ref}>
      <div className="pipeline__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="pipeline__svg"
          role="img"
          aria-label="A continuous integration pipeline: commit, build, unit tests, contract tests, Playwright end-to-end tests, then a report."
        >
          {/* Base track */}
          <line
            x1={PAD}
            y1={TRACK_Y}
            x2={W - PAD}
            y2={TRACK_Y}
            stroke="var(--border-strong)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Progress track */}
          <motion.line
            x1={PAD}
            y1={TRACK_Y}
            y2={TRACK_Y}
            stroke={complete ? 'var(--good)' : 'var(--accent)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ x2: progressX }}
            transition={{ duration: reduced ? 0 : STEP_MS / 1000, ease: 'easeInOut' }}
            initial={{ x2: reduced ? W - PAD : PAD }}
          />

          {/* Travelling head */}
          {!reduced && active >= 0 && !complete && (
            <motion.g
              animate={{ x: progressX }}
              initial={{ x: PAD }}
              transition={{ duration: STEP_MS / 1000, ease: 'easeInOut' }}
            >
              <circle cx={0} cy={TRACK_Y} r="12" fill="var(--accent)" opacity="0.16" />
              <circle cx={0} cy={TRACK_Y} r="4.5" fill="var(--accent)" />
            </motion.g>
          )}

          {STAGES.map((stage, i) => {
            const x = xAt(i)
            const passed = active >= i
            return (
              <g key={stage.label}>
                <motion.circle
                  cx={x}
                  cy={TRACK_Y}
                  r="17"
                  fill="var(--surface)"
                  stroke={passed ? (complete ? 'var(--good)' : 'var(--accent)') : 'var(--border-strong)'}
                  strokeWidth="2"
                  animate={{ scale: passed ? 1 : 0.86 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  style={{ transformOrigin: `${x}px ${TRACK_Y}px` }}
                />

                <motion.g
                  animate={{ opacity: passed ? 1 : 0.45 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    color: passed
                      ? complete
                        ? 'var(--good)'
                        : 'var(--accent)'
                      : 'var(--ink-3)',
                  }}
                >
                  <StageGlyph icon={stage.icon} x={x} y={TRACK_Y} />
                </motion.g>

                <text
                  x={x}
                  y={TRACK_Y + 42}
                  textAnchor="middle"
                  className={`pipeline__label ${passed ? 'is-on' : ''}`}
                >
                  {stage.label}
                </text>
                <text x={x} y={TRACK_Y + 58} textAnchor="middle" className="pipeline__sub">
                  {stage.sub}
                </text>
              </g>
            )
          })}

          {/* Verdict chip at the end of a full pass */}
          <motion.g
            animate={{ opacity: complete ? 1 : 0, y: complete ? 0 : 6 }}
            transition={{ duration: 0.35 }}
          >
            <rect
              x={W - PAD - 34}
              y={TRACK_Y - 46}
              width="72"
              height="24"
              rx="12"
              fill="var(--good-soft)"
              stroke="var(--good)"
              strokeWidth="1"
            />
            <text x={W - PAD + 2} y={TRACK_Y - 29} textAnchor="middle" className="pipeline__verdict">
              PASSED
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  )
}

function StageGlyph({ icon, x, y }: { icon: Stage['icon']; x: number; y: number }) {
  const common = {
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  }

  switch (icon) {
    case 'commit':
      return (
        <g transform={`translate(${x - 8} ${y - 8})`}>
          <circle cx="8" cy="8" r="3.4" {...common} />
          <path d="M0 8h4.6M11.4 8H16" {...common} />
        </g>
      )
    case 'build':
      return (
        <g transform={`translate(${x - 8} ${y - 8})`}>
          <path d="M5.6 4.6 2 8l3.6 3.4M10.4 4.6 14 8l-3.6 3.4" {...common} />
        </g>
      )
    case 'unit':
      return (
        <g transform={`translate(${x - 8} ${y - 8})`}>
          <path d="M6.2 2v4.2L2.6 12.2A1.6 1.6 0 0 0 4 14.6h8a1.6 1.6 0 0 0 1.4-2.4L9.8 6.2V2" {...common} />
          <path d="M5 2h6" {...common} />
        </g>
      )
    case 'api':
      return (
        <g transform={`translate(${x - 8} ${y - 8})`}>
          <rect x="1.6" y="3" width="12.8" height="10" rx="2" {...common} />
          <path d="M1.6 6.6h12.8M5 9.8h2.6" {...common} />
        </g>
      )
    case 'e2e':
      return (
        <g transform={`translate(${x - 8} ${y - 8})`}>
          <path d="M8 2.6c3.6 0 6.2 3 6.8 5.4-.6 2.4-3.2 5.4-6.8 5.4S1.8 10.4 1.2 8C1.8 5.6 4.4 2.6 8 2.6Z" {...common} />
          <circle cx="8" cy="8" r="2.1" {...common} />
        </g>
      )
    case 'report':
      return (
        <g transform={`translate(${x - 8} ${y - 8})`}>
          <path d="M2.6 13.4V7M6.9 13.4V3.4M11.2 13.4V9.4" {...common} />
        </g>
      )
  }
}
