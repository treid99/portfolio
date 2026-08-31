import { metrics } from '../data/metrics'
import Counter from './Counter'
import Reveal from './Reveal'
import './Metrics.css'

export default function Metrics() {
  return (
    <section className="metrics" aria-label="Career metrics">
      <div className="shell">
        <ul className="metrics__grid">
          {metrics.map((m, i) => (
            <Reveal as="li" key={m.label} delay={i * 0.07} className="metrics__item">
              <p className="metrics__value">
                <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="metrics__label">{m.label}</p>
              <p className="metrics__detail">{m.detail}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
