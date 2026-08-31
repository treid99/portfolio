import { site } from '../data/site'
import Reveal from './Reveal'
import './Contact.css'

export default function Contact() {
  return (
    <section className="section section--sunk contact" id="contact">
      <div className="shell">
        <Reveal>
          <div className="contact__panel">
            <div className="contact__glow" aria-hidden="true" />

            <p className="eyebrow">Contact</p>
            {/* <p className="contact__lede">
              Open to SDET and quality engineering roles in the NYC metro area or remote. If you
              have a suite nobody trusts any more, that is a conversation I enjoy.
            </p> */}

            <div className="contact__actions">
              <a className="btn btn--primary contact__mail" href={`mailto:${site.email}`}>
                <MailIcon />
                {site.email}
              </a>
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  className="btn btn--ghost"
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2.8"
        y="5"
        width="18.4"
        height="14"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="m3.6 7 7.2 5.4a2 2 0 0 0 2.4 0L20.4 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}
