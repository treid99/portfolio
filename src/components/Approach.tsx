import { principles } from '../data/principles'
import Pipeline from './Pipeline'
import Reveal from './Reveal'
import './Approach.css'

export default function Approach() {
  return (
    <section className="section section--sunk" id="approach">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Approach</p>
          <h2 className="section-title">What I actually believe about quality</h2>
          <p className="section-lede">
            A resume lists tools. This is the part that decides how those tools get used — and it
            is the thing I would want to know if I were hiring me.
          </p>
        </Reveal>

        <ul className="approach__grid">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.index} delay={i * 0.06} className="card approach__card">
              <span className="approach__index">{p.index}</span>
              <h3 className="approach__title">{p.title}</h3>
              <p className="approach__body">{p.body}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.08}>
          <div className="approach__pipeline-head">
            <h3 className="approach__pipeline-title">Where the tests actually run</h3>
            <p className="approach__pipeline-note">
              Every stage is a gate with a different cost of failure. Cheap checks run first and
              fail loudly; the expensive end-to-end pass only spends time on a build that already
              deserves it.
            </p>
          </div>
          <Pipeline />
        </Reveal>
      </div>
    </section>
  )
}
