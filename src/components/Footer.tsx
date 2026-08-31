import { Link } from 'react-router-dom'
import { nav, site } from '../data/site'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <p className="footer__name">{site.name}</p>
          <p className="footer__role">
            {site.role} · {site.location}
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          {nav.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={`mailto:${site.email}`}>Email</a>
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="shell footer__meta">
        <p>© {year} {site.name}</p>
        <p className="footer__colophon">
          Built with React, TypeScript and Vite. Motion by motion.dev. Deployed on GitHub Pages.
        </p>
      </div>
    </footer>
  )
}
