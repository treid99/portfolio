import { Link } from 'react-router-dom'
import { hasGallery, projects } from '../data/projects'
import { site } from '../data/site'
import Reveal from './Reveal'
import { ArrowRight, GitHubMark } from './icons'
import './Projects.css'

export default function Projects() {
  const github = site.socials.find((s) => s.label === 'GitHub')

  return (
    <section className="section" id="projects">
      <div className="shell">
        <Reveal>
          <div className="projects__head">
            <div>
              <p className="eyebrow">Projects</p>
              <h2 className="section-title">Things I have built</h2>
              <p className="section-lede">
                Test infrastructure, work tooling, plus the occasional side project. Most have screenshots, and a link to the source
                where that source is public.
              </p>
            </div>
            {github && (
              <a
                className="btn btn--ghost projects__all"
                href={github.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                <GitHubMark />
                All repositories
              </a>
            )}
          </div>
        </Reveal>

        <ul className="projects__grid">
          {projects.map((project, i) => {
            // No screenshots behind it means no link and no hover lift, so the
            // card does not promise a page that is not there.
            const linked = hasGallery(project)

            return (
              <Reveal as="li" key={project.slug} delay={i * 0.06}>
                <article className={`card project${linked ? '' : ' project--static'}`}>
                  <div className="project__top">
                    <div className="project__flags">
                      <span className={`project__status project__status--${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                      <span className="project__kind">{project.kind}</span>
                    </div>
                    <span className="project__year">{project.year}</span>
                  </div>

                  <h3 className="project__title">
                    {linked ? (
                      <Link to={`/projects/${project.slug}`} className="project__link">
                        {project.title}
                        <span className="project__hit" aria-hidden="true" />
                      </Link>
                    ) : (
                      project.title
                    )}
                  </h3>

                  <p className="project__blurb">{project.blurb}</p>

                  <ul className="project__tags">
                    {project.tags.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="project__foot">
                    {linked && (
                      <span className="link-arrow">
                        See more
                        <ArrowRight />
                      </span>
                    )}
                    {/* Work projects have no public source, so the card shows no mark. */}
                    {project.repo && (
                      <a
                        className="project__repo"
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GitHubMark />
                        <span className="sr-only">{project.title} on GitHub</span>
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
