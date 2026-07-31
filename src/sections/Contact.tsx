import { type CSSProperties } from 'react'
import GlassSurface from '../components/GlassSurface'
import TopoField from '../components/TopoField'
import { BRAND, FOOTER } from '../content'

export default function Contact() {
  return (
    <footer className="relative overflow-hidden bg-basalt">
      {/* Terrain one last time, under the closing ask */}
      <div className="absolute inset-x-0 top-0 h-[560px]">
        <TopoField seed={19} intensity={0.9} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(100%_100%_at_50%_0%,rgba(11,15,14,0.72)_0%,rgba(11,15,14,0.92)_70%,#0B0F0E_100%)]" />

      <section id="contact" className="relative z-10 mx-auto max-w-6xl px-4 pt-28 sm:px-6 sm:pt-36">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="reading">Start a build</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ceramic">
              Tell us your challenge. <span className="text-amber">We'll tell you the price.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ceramic/55">
              One message is enough. You get back a price, a date, and the first name of the
              developer who would build it — before you pay anything.
            </p>
          </div>

          <div className="relative lg:col-span-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-16 bg-[radial-gradient(closest-side_at_32%_22%,rgba(240,190,120,0.40),rgba(192,91,54,0.18)_50%,transparent_100%)]"
          />

            <GlassSurface
              width="100%"
              height={210}
              borderRadius={22}
              backgroundOpacity={0.035}
              saturation={1.7}
              blur={14}
              displace={2}
              distortionScale={-170}
              redOffset={4}
              greenOffset={16}
              blueOffset={28}
              style={{ '--glass-brightness': 1.45 } as CSSProperties}
            >
              <div className="flex w-full flex-col gap-4 px-6 sm:px-8">
                <a
                  href="#"
                  className="block rounded-full bg-ceramic px-6 py-3.5 text-center text-sm font-medium text-basalt transition-colors hover:bg-amber"
                >
                  Tell us your challenge
                </a>
                <a
                  href="#"
                  className="block rounded-full border border-mist/25 px-6 py-3.5 text-center text-sm text-ceramic/85 transition-colors hover:border-amber hover:text-amber"
                >
                  Ask on WhatsApp
                </a>
                <dl className="reading flex justify-between pt-1">
                  <div>
                    <dt className="sr-only">Location</dt>
                    <dd>{BRAND.place}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Deposit</dt>
                    <dd>50 / 50</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Live in</dt>
                    <dd>1–3 wks</dd>
                  </div>
                </dl>
              </div>
            </GlassSurface>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-28 grid grid-cols-2 gap-8 border-t border-mist/12 pt-12 sm:grid-cols-4">
          {FOOTER.columns.map((col) => (
            <nav key={col.title} className="flex flex-col gap-4">
              <h3 className="reading">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-ceramic/60 transition-colors hover:text-ceramic">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* The ceramic mark, full width, closing the page it opened */}
        <div className="py-16 sm:py-20">
          <img
            src="/briqx-wordmark.png"
            alt={BRAND.name}
            draggable={false}
            className="w-full select-none"
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-mist/12 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="reading flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span>{FOOTER.micro[0]}</span>
            <span className="text-mist/40">·</span>
            <span>{FOOTER.micro[1]}</span>
          </div>
          <span className="reading text-mist/50">
            © {new Date().getFullYear()} {BRAND.name}
          </span>
        </div>
      </div>
    </footer>
  )
}
