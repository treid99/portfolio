import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { site } from '../data/site'
import HeroBackdrop from './HeroBackdrop'
import ResumeDownload from './ResumeDownload'
import './Hero.css'

const FOCUS = [
  'automated workflows',
  'the user experience',
  'data integrity',
  'code quality',
  'release confidence',
]

/**
 * Rendered invisibly inside the slot so it reserves the width of the widest
 * phrase and supplies the baseline. Nothing needs tuning when FOCUS changes.
 */
const LONGEST_FOCUS = FOCUS.reduce((a, b) => (b.length > a.length ? b : a), '')

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((v) => (v + 1) % FOCUS.length), 2600)
    return () => clearInterval(id)
  }, [reduced])

  const rise = (delay: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 22 },
    animate: reduced ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section className="hero">
      <HeroBackdrop />

      <div className="shell hero__grid">
        <div className="hero__copy">
          <motion.p className="hero__status" {...rise(0.05)}>
            <span className="hero__pulse" aria-hidden="true" />
            {site.location}
          </motion.p>

          <motion.h1 className="hero__name" {...rise(0.12)}>
            {site.name}
          </motion.h1>

          <motion.p className="hero__role" {...rise(0.2)}>
            {site.role}
          </motion.p>

          <motion.p className="hero__focus" {...rise(0.28)}>
            <span className="hero__focus-label">Currently focused on</span>
            <span className="hero__focus-slot">
              <span className="hero__focus-sizer" aria-hidden="true">
                {LONGEST_FOCUS}
              </span>
              <span className="hero__focus-track">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={FOCUS[i]}
                    className="hero__focus-word"
                    initial={reduced ? undefined : { opacity: 0, y: 14 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -14 }}
                    transition={{ duration: 0.34, ease }}
                  >
                    {FOCUS[i]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </motion.p>

          <motion.p className="hero__lede" {...rise(0.36)}>
            {site.tagline}
          </motion.p>

          <motion.div className="hero__cta" {...rise(0.44)}>
            <Link className="btn btn--primary" to="/#projects">
              See the work
              <Arrow />
            </Link>
            <ResumeDownload label="Resume" align="start" icon />
          </motion.div>

          <motion.ul className="hero__links" {...rise(0.52)}>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener" className="hero__link">
                  {s.label}
                  <ExternalMark />
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="hero__link">
                Email
              </a>
            </li>
          </motion.ul>
        </div>

        <motion.div
          className="hero__portrait"
          initial={reduced ? undefined : { opacity: 0, scale: 0.96, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease }}
        >
          <div className="hero__frame">
            <img
              src={`${import.meta.env.BASE_URL}assets/portrait.jpg`}
              alt={`${site.name}, photographed beside a canal in Venice`}
              width={900}
              height={1125}
              fetchPriority="high"
            />
            <div className="hero__frame-edge" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h13M12.5 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExternalMark() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 16 16 8M9 8h7v7"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
