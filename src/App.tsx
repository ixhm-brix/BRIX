import Hero from './sections/Hero'
import Build from './sections/Build'
import Pricing from './sections/Pricing'
import Schedule from './sections/Schedule'
import Faq from './sections/Faq'
import Manifesto from './sections/Manifesto'
import Contact from './sections/Contact'

/**
 * Order is deliberate: everything a buyer needs to decide comes first and
 * uninterrupted — what we make, what it costs, when it lands, and the questions
 * they'd ask anyway. The studio's position on how it works is the closing
 * argument rather than the opening one, sitting directly before the ask.
 */
export default function App() {
  return (
    <main className="bg-basalt">
      <Hero />
      <Build />
      <Pricing />
      <Schedule />
      <Faq />
      <Manifesto />
      <Contact />
    </main>
  )
}
