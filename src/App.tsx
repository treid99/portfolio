import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from './lib/theme'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'

// The homepage is what almost every visitor loads first, so only it ships
// in the initial bundle; the secondary routes arrive on demand.
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

/**
 * Anchor links such as /#experience arrive as a route change, so the browser's
 * own fragment handling never fires. This restores it, and otherwise sends new
 * pages back to the top.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // The target may belong to a route that has only just mounted.
      const raf = requestAnimationFrame(() => {
        const target = document.querySelector(hash)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else window.scrollTo({ top: 0, left: 0 })
      })
      return () => cancelAnimationFrame(raf)
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}

/** Reserves viewport height so a lazy route swap does not collapse the page. */
function RouteFallback() {
  return <div style={{ minHeight: '70vh' }} aria-busy="true" />
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollManager />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </ThemeProvider>
  )
}
