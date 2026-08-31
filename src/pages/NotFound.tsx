import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import './NotFound.css'

export default function NotFound() {
  useEffect(() => {
    document.title = `Not found — ${site.name}`
  }, [])

  return (
    <section className="section nf">
      <div className="shell nf__inner">
        <h1 className="eyebrow nf__title">404 Not Found</h1>
        <div className="nf__actions">
          <Link className="btn btn--primary" to="/">
            Return home
          </Link>
          <Link className="btn btn--ghost" to="/#projects">
            See work
          </Link>
        </div>
      </div>
    </section>
  )
}
