import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { certifications, education, experience } from '../data/experience'
import Reveal from './Reveal'
import ResumeDownload from './ResumeDownload'
import './Experience.css'

/** The "At a glance" card tracks whichever role is flagged current. */
const currentRole = experience.find((role) => role.current) ?? experience[0]

/** Total time at the company across every role — bump this as it grows. */
const tenure = '6 years'

const spring = { stiffness: 120, damping: 28, restDelta: 0.001 }

export default function Experience() {
  const trackRef = useRef<HTMLDivElement>(null)
  const eduRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 70%', 'end 60%'],
  })
  const fill = useSpring(scrollYProgress, spring)

  /* Education is a single short entry, so its rail needs a tighter window than
     the roles track or it would never fill on the way past. */
  const { scrollYProgress: eduProgress } = useScroll({
    target: eduRef,
    offset: ['start 90%', 'end 70%'],
  })
  const eduFill = useSpring(eduProgress, spring)

  return (
    <section className="section" id="experience">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">Six years in EdTech</h2>
        </Reveal>

        <div className="xp__layout">
          <div className="xp__col">
            <div className="xp" ref={trackRef}>
              <div className="xp__rail" aria-hidden="true">
                <motion.div
                  className="xp__rail-fill"
                  style={{ scaleY: reduced ? 1 : fill }}
                />
              </div>

              <ol className="xp__list">
                {experience.map((role, i) => (
                  <Reveal as="li" key={role.title} delay={i * 0.05} className="xp__item">
                    <span className={`xp__dot ${role.current ? 'is-current' : ''}`} aria-hidden="true" />

                    <div className="xp__head">
                      <p className="xp__dates">
                        {role.start} <span aria-hidden="true">→</span> {role.end}
                      </p>
                      {role.current && <span className="xp__now">Current</span>}
                    </div>

                    <h3 className="xp__title">{role.title}</h3>
                    <p className="xp__org">
                      {role.company} · {role.location}
                    </p>
                    <p className="xp__summary">{role.summary}</p>

                    <ul className="xp__highlights">
                      {role.highlights.map((h) => (
                        <li key={h}>
                          <Bullet />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className="xp__stack">
                      {role.stack.map((s) => (
                        <li key={s} className="tag">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal className="edu">
              <p className="eyebrow">Education</p>

              <div className="xp edu__track" ref={eduRef}>
                <div className="xp__rail" aria-hidden="true">
                  <motion.div className="xp__rail-fill" style={{ scaleY: reduced ? 1 : eduFill }} />
                </div>

                <div className="xp__item">
                  <span className="xp__dot" aria-hidden="true" />

                  <div className="xp__head">
                    <p className="xp__dates">Graduated {education.date}</p>
                  </div>

                  <h3 className="xp__title">{education.degreeFull}</h3>
                  <p className="xp__org">
                    {education.school} · {education.location}
                  </p>

                  <ul className="xp__highlights">
                    <li>
                      <Bullet />
                      <span>Notable coursework: {education.coursework.join(', ')}.</span>
                    </li>
                    {education.projects.length > 0 && (
                      <li>
                        <Bullet />
                        <span>School projects: {education.projects.join(', ')}.</span>
                      </li>
                    )}
                    <li>
                      <Bullet />
                      <span>{education.extracurricular} student-athlete.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="glance">
            <div className="card glance__card">
              <h3 className="glance__title">At a glance</h3>

              <dl className="glance__facts">
                <div>
                  <dt>Education</dt>
                  <dd>
                    {education.degree}
                    <span>
                      {education.school} · {education.date}
                    </span>
                  </dd>
                </div>
                {currentRole && (
                  <div>
                    <dt>Current role</dt>
                    <dd>
                      {currentRole.title}
                      <span>{currentRole.company}</span>
                    </dd>
                  </div>
                )}
                <div>
                  <dt>Experience</dt>
                  <dd>{tenure}</dd>
                </div>
                {certifications.map((c) => (
                  <div key={c.name}>
                    <dt>Certification</dt>
                    <dd>
                      {c.name}
                      <span>
                        {c.issuer} · {c.date}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="glance__downloads">
                <div className="glance__download-row">
                  <ResumeDownload
                    label="Download Resume"
                    variant="primary"
                    className="glance__dl"
                    align="start"
                    block
                    icon
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Bullet() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="xp__tick">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
