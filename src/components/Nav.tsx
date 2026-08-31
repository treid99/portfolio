import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { nav, site } from '../data/site'
import ThemeToggle from './ThemeToggle'
import Monogram from './Monogram'
import ResumeDownload from './ResumeDownload'
import './Nav.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Any navigation closes the mobile sheet.
  useEffect(() => setOpen(false), [pathname, hash])

  // Trap the page behind the sheet, and let Escape dismiss it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) =>
    href.startsWith('/#') ? pathname === '/' && hash === href.slice(1) : pathname === href

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="shell nav__inner">
        <Link to="/" className="nav__brand" aria-label={`${site.name} — home`}>
          <Monogram />
          <span className="nav__brand-text">
            <strong>{site.shortName}</strong>
            <span>{site.roleShort}</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`nav__link ${isActive(item.href) ? 'is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <ResumeDownload className="nav__resume" align="end" />
          <ThemeToggle />
          <button
            className="nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`nav__burger-bar ${open ? 'is-open-top' : ''}`} />
            <span className={`nav__burger-bar ${open ? 'is-open-mid' : ''}`} />
            <span className={`nav__burger-bar ${open ? 'is-open-bot' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="shell nav__sheet-inner">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                >
                  <Link to={item.href} className="nav__sheet-link">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <ResumeDownload
                label="Download resume"
                variant="primary"
                className="nav__sheet-cta"
                align="start"
                block
                inline
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
