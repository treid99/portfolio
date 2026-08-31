import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './UpsideDown.css'

/**
 * Easter egg: hovering a trigger word tears a hole in the page and lets the
 * Upside Down bleed through — a storm front of dark cloud rolling in from the
 * top and sides, red lightning forking through it, ash on the air, and the
 * Mind Flayer half-buried in the cloud mass.
 *
 * The overlay renders into a portal on <body> so it can sit above the page no
 * matter where the trigger lives, and it never takes pointer events, so the
 * hover it depends on can't be stolen by the overlay itself.
 */

/** Where the rift opens, in viewport coordinates. */
type Origin = { x: number; y: number }

/** Hover intent, in ms — long enough that a mouse passing through won't flash it. */
const OPEN_DELAY = 140

/**
 * Deterministic pseudo-random in [0, 1). Seeded so the generated geometry is
 * identical every render rather than reshuffling on each re-render.
 */
function rand(i: number, salt: number) {
  const n = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return n - Math.floor(n)
}

/* ------------------------------------------------------------------
   Tapered geometry

   The Flayer's tentacles have to thin to a point to read as organic,
   and a uniform stroke can't do that. So they're stored as chains of
   cubics and turned into filled ribbons whose width falls off along
   the length.
   ------------------------------------------------------------------ */

type Point = [number, number]
/** One cubic Bézier: start, two controls, end. */
type Cubic = [Point, Point, Point, Point]
type Curve = { chain: Cubic[]; from: number; to: number }

function pointAt([a, b, c, d]: Cubic, t: number): Point {
  const u = 1 - t
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ]
}

function tangentAt([a, b, c, d]: Cubic, t: number): Point {
  const u = 1 - t
  return [
    3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]),
    3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1]),
  ]
}

/** Samples per cubic. Enough that the outline reads smooth at any scale. */
const RIBBON_STEPS = 22

/**
 * Walks a chain of cubics and returns a closed path outlining a ribbon that
 * tapers from `from` units wide to `to`. The taper is eased rather than linear,
 * with an exponent above 1 so the limb holds most of its width well down its
 * length and then runs out quickly to a tip.
 */
function ribbon({ chain, from, to }: Curve) {
  const near: string[] = []
  const far: string[] = []
  const total = chain.length * RIBBON_STEPS

  for (let i = 0; i <= total; i++) {
    const g = i / total
    const index = Math.min(chain.length - 1, Math.floor(g * chain.length))
    const t = g * chain.length - index
    const [px, py] = pointAt(chain[index], t)
    const [tx, ty] = tangentAt(chain[index], t)
    const len = Math.hypot(tx, ty) || 1
    const half = (from + (to - from) * g ** 1.4) / 2
    const nx = (-ty / len) * half
    const ny = (tx / len) * half

    near.push(`${(px + nx).toFixed(1)} ${(py + ny).toFixed(1)}`)
    far.push(`${(px - nx).toFixed(1)} ${(py - ny).toFixed(1)}`)
  }

  return `M${near.join('L')}L${far.reverse().join('L')}Z`
}

/** Mirrors a curve across the vertical centre line of a `width`-wide viewBox. */
function mirror(curve: Curve, width: number): Curve {
  return {
    ...curve,
    chain: curve.chain.map((seg) => seg.map(([x, y]) => [width - x, y]) as Cubic),
  }
}

/* ------------------------------------------------------------------
   Lightning
   ------------------------------------------------------------------ */

/**
 * Midpoint-displaced polyline between two points. The displacement is scaled by
 * sin(πt) so both ends stay put and the wander is worst in the middle, which is
 * what keeps a bolt looking like one strike rather than a random walk.
 */
function jagged(seed: number, from: Point, to: Point, segments: number, spread: number) {
  const points: Point[] = [from]

  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const off = (rand(seed, i) - 0.5) * spread * Math.sin(Math.PI * t)
    points.push([from[0] + (to[0] - from[0]) * t + off, from[1] + (to[1] - from[1]) * t + off * 0.2])
  }

  points.push(to)
  return points
}

function polyline(points: Point[]) {
  return `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`
}

/**
 * A strike: one main bolt down out of the top edge, plus forks branching off
 * nodes along it. The forks run more sideways than down, so a strike spreads
 * through the cloud band rather than reaching for the ground.
 */
function strikePaths(seed: number, x: number) {
  const main = jagged(seed, [x, -40], [x + (rand(seed, 91) - 0.5) * 180, 175], 9, 105)
  const forks = [2, 4, 5, 7].map((node, k) => {
    const root = main[node]
    const away = rand(seed, 20 + k) < 0.5 ? -1 : 1
    const tip: Point = [
      root[0] + away * (95 + rand(seed, 30 + k) * 135),
      root[1] + 24 + rand(seed, 40 + k) * 70,
    ]
    return polyline(jagged(seed + 7 + k, root, tip, 5, 58))
  })

  return [polyline(main), ...forks]
}

/**
 * The three strike sources: left third, middle, right third of the storm. Each
 * gets its own cycle length so they drift out of phase with one another and the
 * order they fire in keeps changing.
 */
const STRIKES = [
  { x: 250, cx: 0.25, seed: 3, duration: 5.1, delay: 0.6 },
  { x: 760, cx: 0.76, seed: 11, duration: 6.7, delay: 2.4 },
  { x: 500, cx: 0.5, seed: 23, duration: 4.3, delay: 4.1 },
]

/** Brief double-flicker, then dark for the rest of the cycle. */
const STRIKE_KEYFRAMES = [0, 0, 1, 0.2, 0.9, 0, 0]
const STRIKE_TIMES = [0, 0.5, 0.515, 0.535, 0.55, 0.6, 1]

/* ------------------------------------------------------------------
   Cloud front
   ------------------------------------------------------------------ */

/**
 * Each sheet rolls in from an edge and then drifts. Entry and drift are separate
 * elements because motion owns the inline transform on each, and one animation
 * can't hold an offset while another loops on top of it.
 */
const CLOUDS = [
  { key: 'top-back', enter: { y: -140 }, drift: { x: [0, 34, -12, 0], y: [0, 10, -6, 0] }, cycle: 42 },
  { key: 'left', enter: { x: -180 }, drift: { x: [0, 26, 6, 0], y: [0, -12, 8, 0] }, cycle: 51 },
  { key: 'right', enter: { x: 180 }, drift: { x: [0, -30, -8, 0], y: [0, 9, -10, 0] }, cycle: 47 },
  { key: 'top-front', enter: { y: -110 }, drift: { x: [0, -22, 14, 0], y: [0, 7, -5, 0] }, cycle: 36 },
  { key: 'lit', enter: { y: -90 }, drift: { x: [0, 20, -18, 0], y: [0, -8, 6, 0] }, cycle: 39 },
]

/* ------------------------------------------------------------------
   Airborne debris
   ------------------------------------------------------------------ */

const SPORES = Array.from({ length: 42 }, (_, i) => ({
  left: rand(i, 1) * 100,
  top: 6 + rand(i, 2) * 90,
  size: 1.3 + rand(i, 3) * 3.8,
  drift: (rand(i, 4) - 0.5) * 90,
  duration: 7 + rand(i, 5) * 10,
  delay: rand(i, 6) * -14,
  opacity: 0.3 + rand(i, 7) * 0.6,
  /* Mostly embers catching the light, with soot mixed through. */
  ember: rand(i, 8) > 0.3,
}))

/* ------------------------------------------------------------------
   The Mind Flayer
   ------------------------------------------------------------------ */

/**
 * The Flayer is drawn in a 900 × 300 field rather than a square one. The head
 * occupies the same handful of units it always did, so widening the field is
 * what lets the tentacles sweep out to the edges of the screen without the
 * skull growing to match.
 */
const FLAYER_HEAD =
  'M450 108 C 460 108 468 118 474 130 C 482 142 488 156 486 171 C 484 188 472 198 458 200 ' +
  'L 442 200 C 428 198 416 188 414 171 C 412 156 418 142 426 130 C 432 118 440 108 450 108 Z'

/**
 * Left-hand tentacles. Each rises away from the body before falling, which is
 * what makes the silhouette read as the Flayer rather than as an octopus; the
 * right-hand set is mirrored from these. The outer two carry most of the reach,
 * arcing high and wide before dropping away near the edge of the field.
 */
const FLAYER_LEGS: Curve[] = [
  {
    chain: [
      [[434, 158], [380, 120], [310, 80], [250, 66]],
      [[250, 66], [170, 50], [60, 150], [18, 300]],
    ],
    from: 20,
    to: 0.6,
  },
  {
    chain: [
      [[438, 170], [390, 145], [345, 118], [300, 110]],
      [[300, 110], [230, 98], [125, 180], [90, 300]],
    ],
    from: 17.5,
    to: 0.6,
  },
  {
    chain: [
      [[442, 180], [410, 183], [372, 187], [340, 196]],
      [[340, 196], [290, 210], [220, 245], [185, 300]],
    ],
    from: 15,
    to: 0.6,
  },
  {
    chain: [
      [[446, 188], [440, 215], [430, 245], [418, 268]],
      [[418, 268], [410, 282], [400, 292], [390, 300]],
    ],
    from: 12.5,
    to: 0.6,
  },
]

const FLAYER_PATHS = [
  FLAYER_HEAD,
  ...[...FLAYER_LEGS, ...FLAYER_LEGS.map((l) => mirror(l, 900))].map(ribbon),
]

const STRIKE_GEOMETRY = STRIKES.map((s) => ({ ...s, paths: strikePaths(s.seed, s.x) }))

function Rift({ origin }: { origin: Origin }) {
  const reduced = useReducedMotion()

  /*
   * Keyframe arrays are rebuilt on every render, and this component re-renders
   * whenever the page scrolls under a held hover. Memoised so motion sees the
   * same values and doesn't restart the storm mid-strike.
   */
  const strikes = useMemo(() => STRIKE_GEOMETRY, [])

  return createPortal(
    <motion.div
      className="ud"
      aria-hidden="true"
      style={{ '--ud-x': `${origin.x}px`, '--ud-y': `${origin.y}px` } as CSSProperties}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Red glow rimming the tear, drawn over the clear centre. */}
      <div className="ud__rim" />

      {/*
        Every layer below is masked open around the trigger word, so the rift
        reads as though it spread outward from the text the visitor is pointing
        at — and the word itself stays legible in the clear.
      */}
      <div className="ud__layers">
        <div className="ud__scrim" />

        {/* Furnace glow behind the cloud, so the gaps in it read as lit. */}
        <motion.div
          className="ud__ember ud__ember--a"
          animate={reduced ? undefined : { x: [0, 50, -18, 0], scale: [1, 1.14, 1.04, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="ud__ember ud__ember--b"
          animate={reduced ? undefined : { x: [0, -44, 20, 0], scale: [1, 1.1, 1.06, 1] }}
          transition={{ duration: 33, repeat: Infinity, ease: 'easeInOut' }}
        />

        {CLOUDS.slice(0, 3).map((c) => (
          <Cloud key={c.key} cloud={c} reduced={!!reduced} />
        ))}
        <Cloud cloud={CLOUDS[3]} reduced={!!reduced} />
        <Cloud cloud={CLOUDS[4]} reduced={!!reduced} />

        {/*
          Drawn over the lit sheets but under the broad glow: screening light
          on top of a dark shape erases it, while nothing washing over it at all
          leaves a cut-out pasted on the cloud. The radial mask feathers every
          edge — crown, flanks and tentacle tips — so the shape has no outline
          to give it away, and it stays faint and heavily blurred so it resolves
          only once the eye has adjusted.
        */}
        <motion.div
          className="ud__flayer"
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.svg
            viewBox="0 0 900 300"
            preserveAspectRatio="xMidYMin meet"
            animate={reduced ? undefined : { y: [0, -12, 0], rotate: [0, 0.6, 0, -0.6, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          >
            <g className="ud__flayer-ink">
              {FLAYER_PATHS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </motion.svg>
        </motion.div>

        {/* Glow in front of the cloud as well as behind, so the band reads lit. */}
        <motion.div
          className="ud__ember ud__ember--c"
          animate={reduced ? undefined : { x: [0, 28, -16, 0], scale: [1, 1.07, 1.02, 1] }}
          transition={{ duration: 29, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Thin ground fog, a fraction of the weight of the cloud up top. */}
        <div className="ud__fog" />

        <svg className="ud__storm" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMin slice">
          <defs>
            {strikes.map((s) => (
              <radialGradient key={s.seed} id={`ud-burst-${s.seed}`} cx={s.cx} cy="0.04" r="0.62">
                <stop offset="0%" stopColor="#ff8a6a" stopOpacity="0.62" />
                <stop offset="42%" stopColor="#e2261a" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#e2261a" stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {strikes.map((s) => (
            <motion.g
              key={s.seed}
              animate={reduced ? { opacity: 0.14 } : { opacity: STRIKE_KEYFRAMES }}
              transition={
                reduced
                  ? { duration: 0.6 }
                  : {
                      duration: s.duration,
                      delay: s.delay,
                      repeat: Infinity,
                      ease: 'linear',
                      times: STRIKE_TIMES,
                    }
              }
            >
              <rect x="0" y="0" width="1000" height="700" fill={`url(#ud-burst-${s.seed})`} />
              {['wide', 'mid', 'tight'].map((band) => (
                <g key={band} className={`ud__bolt-glow ud__bolt-glow--${band}`}>
                  {s.paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
              ))}
              <g className="ud__bolt-core">
                {s.paths.map((d, i) => (
                  <path key={d} d={d} strokeWidth={i === 0 ? 2.8 : 1.5} />
                ))}
              </g>
            </motion.g>
          ))}
        </svg>

        {/* Ash and debris on the air. */}
        <div className="ud__spores">
          {SPORES.map((s, i) => (
            <motion.span
              key={i}
              className={`ud__spore${s.ember ? ' ud__spore--ember' : ''}`}
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
              }}
              animate={
                reduced
                  ? undefined
                  : { y: [0, -150], x: [0, s.drift], opacity: [0, s.opacity, s.opacity, 0] }
              }
              transition={{ duration: s.duration, repeat: Infinity, ease: 'linear', delay: s.delay }}
            />
          ))}
        </div>
      </div>
    </motion.div>,
    document.body,
  )
}

/** One cloud sheet: an outer element for the roll-in, an inner one for the drift. */
function Cloud({ cloud, reduced }: { cloud: (typeof CLOUDS)[number]; reduced: boolean }) {
  return (
    <motion.div
      className={`ud__cloud ud__cloud--${cloud.key}`}
      initial={reduced ? undefined : { ...cloud.enter, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="ud__cloud-body"
        animate={reduced ? undefined : cloud.drift}
        transition={{ duration: cloud.cycle, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

/** Wraps the trigger text: hovering opens the rift, leaving closes it. */
export default function UpsideDown({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<Origin | null>(null)
  const ref = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const isOpen = origin !== null

  const measure = () => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // The origin is in viewport coordinates, so it goes stale the moment the page
  // moves under a held hover — scrolling with the wheel, or a resize.
  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [isOpen])

  const open = () => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(measure, OPEN_DELAY)
  }

  const close = () => {
    window.clearTimeout(timer.current)
    setOrigin(null)
  }

  return (
    <>
      <span
        ref={ref}
        className={`ud-trigger${isOpen ? ' ud-trigger--open' : ''}`}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </span>
      <AnimatePresence>{origin && <Rift key="ud" origin={origin} />}</AnimatePresence>
    </>
  )
}
