import { skillGroups } from '../data/skills'
import Reveal from './Reveal'
import './Skills.css'

export default function Skills() {
  return (
    <section className="section section--sunk" id="skills">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Toolkit</p>
          <h2 className="section-title">Skills and tools</h2>
        </Reveal>

        <ul className="skills__grid">
          {skillGroups.map((group, i) => (
            <Reveal as="li" key={group.title} delay={i * 0.05} className="card skills__card">
              <h3 className="skills__title">{group.title}</h3>
              <p className="skills__note">{group.note}</p>
              <ul className="skills__items">
                {group.items.map((item) => (
                  <li key={item} className="tag skills__tag">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
