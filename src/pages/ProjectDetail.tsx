import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { hasGallery, projectBySlug, projects } from '../data/projects'
import type { Screenshot } from '../data/projects'
import { site } from '../data/site'
import { Expand, GitHubMark, GitHubMarkPrivate } from '../components/icons'
import Reveal from '../components/Reveal'
import './ProjectDetail.css'

const asset = (src: string) => `${import.meta.env.BASE_URL}${src}`

/**
 * A gallery card. Most captures are full-page, so the card crops to a fixed
 * ratio from the top and the real thing opens in the viewer; portrait captures
 * are letterboxed instead, since cropping a phone screen to landscape leaves a
 * sliver of status bar. A missing file degrades to a labelled placeholder
 * rather than a broken-image icon.
 */
function Shot({
  shot,
  onOpen,
}: {
  shot: Screenshot
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  const [missing, setMissing] = useState(false)

  const classes = ['shot']
  if (shot.wide) classes.push('shot--wide')
  if (shot.phone) classes.push('shot--phone')

  return (
    <figure className={classes.join(' ')}>
      {missing ? (
        <div className="shot__pending">
          <span>Screenshot coming soon</span>
        </div>
      ) : (
        <button type="button" className="shot__frame" onClick={onOpen}>
          <img
            className="shot__img"
            src={asset(shot.src)}
            alt={shot.alt}
            width={shot.w}
            height={shot.h}
            loading="lazy"
            decoding="async"
            onError={() => setMissing(true)}
          />
          <span className="shot__zoom" aria-hidden="true">
            <Expand />
          </span>
          <span className="sr-only">View full screenshot</span>
        </button>
      )}
      <figcaption className="shot__caption">{shot.caption}</figcaption>
    </figure>
  )
}

/**
 * Full-size viewer. The captures run to several thousand pixels tall, so the
 * image scrolls inside the panel at full width rather than being scaled down
 * to an unreadable strip. Arrow keys walk the whole gallery, Esc closes, and
 * focus returns to the card that opened it.
 */
function Lightbox({
  shots,
  index,
  onClose,
  onStep,
}: {
  shots: Screenshot[]
  index: number
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const shot = shots[index]
  const panel = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panel.current?.focus()
  }, [])

  // A new image starts at its own top, not wherever the last one was scrolled.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [index])

  // The page behind must not scroll while the viewer is open.
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.alt}>
      <div className="lightbox__scrim" onClick={onClose} aria-hidden="true" />

      <div
        className="lightbox__panel"
        ref={panel}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            const stops = panel.current?.querySelectorAll('button')
            if (!stops?.length) return
            const edge = e.shiftKey ? stops[0] : stops[stops.length - 1]
            if (document.activeElement !== edge && document.activeElement !== panel.current) return
            ;(e.shiftKey ? stops[stops.length - 1] : stops[0]).focus()
          } else if (e.key === 'Escape') onClose()
          else if (e.key === 'ArrowRight') onStep(1)
          else if (e.key === 'ArrowLeft') onStep(-1)
          else return
          e.preventDefault()
        }}
      >
        <div className="lightbox__bar">
          <p className="lightbox__caption">{shot.caption}</p>
          <span className="lightbox__count">
            {index + 1} / {shots.length}
          </span>
          <button type="button" className="lightbox__btn" onClick={() => onStep(-1)}>
            <span aria-hidden="true">←</span>
            <span className="sr-only">Previous screenshot</span>
          </button>
          <button type="button" className="lightbox__btn" onClick={() => onStep(1)}>
            <span aria-hidden="true">→</span>
            <span className="sr-only">Next screenshot</span>
          </button>
          <button type="button" className="lightbox__btn" onClick={onClose}>
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Close viewer</span>
          </button>
        </div>

        <div className="lightbox__scroll" ref={scroller}>
          <img src={asset(shot.src)} alt={shot.alt} width={shot.w} height={shot.h} />
        </div>
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? projectBySlug(slug) : undefined
  const [viewing, setViewing] = useState<number | null>(null)
  const opener = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setViewing(null)
    opener.current?.focus()
    opener.current = null
  }, [])

  useEffect(() => {
    if (project) document.title = `${project.title} — ${site.name}`
  }, [project])

  // A listed project with no screenshots behind it owns no route either.
  if (!project || !hasGallery(project)) return <Navigate to="/404" replace />

  // "Next project" walks only the ones that have somewhere to go.
  const readable = projects.filter(hasGallery)
  const index = readable.findIndex((p) => p.slug === project.slug)
  const next = readable[(index + 1) % readable.length]

  // Flattened so the viewer walks the whole gallery, not one group at a time.
  const shots = project.gallery.flatMap((g) => g.shots)

  return (
    <article className="case">
      <header className="case__head">
        <div className="shell">
          <Link to="/#projects" className="case__back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M19 12H6M11.5 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All projects
          </Link>

          <div className="case__meta">
            <span className={`project__status project__status--${project.status.toLowerCase()}`}>
              {project.status}
            </span>
            <span className="project__kind">{project.kind}</span>
            <span className="case__year">{project.year}</span>
          </div>

          <h1 className="case__title">{project.title}</h1>
          <p className="case__summary">{project.summary}</p>

          <div className="case__actions">
            {project.repo ? (
              <a
                className="btn btn--primary"
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
              >
                <GitHubMark />
                View repository
              </a>
            ) : (
              /*
               * Built at work. The button keeps its place rather than vanishing,
               * so the absence of a link reads as a fact about the project.
               */
              <button type="button" className="btn btn--ghost btn--locked" disabled>
                <GitHubMarkPrivate />
                Private repo
              </button>
            )}
            {project.demo && (
              <a
                className="btn btn--ghost"
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
              >
                Live demo
              </a>
            )}
          </div>

          <ul className="case__tags">
            {project.tags.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="shell case__gallery" id="screenshots">
        <h2 className="case__section-title">Screenshots</h2>
        <p className="case__gallery-note">
          {project.galleryNote ??
            'Cards are cropped to the top of each page. Select one to read the full capture.'}
        </p>
        {project.gallery.map((group, i) => (
          <Reveal as="section" key={group.heading} delay={i * 0.05} className="case__shot-group">
            <h3 className="case__shot-group-title">{group.heading}</h3>
            <div className="shots">
              {group.shots.map((shot) => (
                <Shot
                  key={shot.src}
                  shot={shot}
                  onOpen={(event) => {
                    opener.current = event.currentTarget
                    setViewing(shots.indexOf(shot))
                  }}
                />
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {viewing !== null && (
        <Lightbox
          shots={shots}
          index={viewing}
          onClose={close}
          onStep={(delta) => setViewing((i) => (i === null ? i : (i + delta + shots.length) % shots.length))}
        />
      )}

      <div className="shell">
        <Link to={`/projects/${next.slug}`} className="case__next">
          <span className="case__next-label">Next project</span>
          <span className="case__next-title">{next.title}</span>
          <span className="case__next-blurb">{next.blurb}</span>
        </Link>
      </div>
    </article>
  )
}
