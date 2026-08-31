import { useEffect } from 'react'
import Hero from '../components/Hero'
// import Metrics from '../components/Metrics'
// import Approach from '../components/Approach'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import { site } from '../data/site'

export default function Home() {
  useEffect(() => {
    document.title = `${site.name} — Portfolio`
  }, [])

  return (
    <>
      <Hero />
      {/* <Metrics /> */}
      {/* <Approach /> */}
      <Experience />
      <Skills />
      <Projects />
      <Contact />
    </>
  )
}
