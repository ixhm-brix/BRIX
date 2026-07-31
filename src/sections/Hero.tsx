import { useState, type CSSProperties } from 'react'
import GlassSurface from '../components/GlassSurface'
import TopoField from '../components/TopoField'
import { BRAND, CAPABILITIES, HERO, NAV } from '../content'

/** Kigali, to the nearest minute. A survey sheet states where it was taken. */
const STATION = '01°56′S 030°04′E'

function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
        <GlassSurface
          width="100%"
          height={62}
          borderRadius={31}
          backgroundOpacity={0.045}
          saturation={1.55}
          blur={12}
          displace={1}
          /* Gentler channel separation than the stationary panels: this one is fixed and
             passes over body copy, where wide offsets read as colour fringing on text. */
          distortionScale={-95}
          redOffset={0}
          greenOffset={5}
          blueOffset={10}
          className="mx-auto max-w-6xl"
          style={{ '--glass-brightness': 1.35 } as CSSProperties}
        >
          <div className="flex w-full items-center gap-4 px-3 sm:px-5">
            <a href="#top" aria-label="briqx — home" className="shrink-0">
              <img src="/briqx-mark.png" alt="briqx" className="h-6 w-auto select-none" draggable={false} />
            </a>

            <nav className="ml-auto hidden items-center gap-8 md:flex">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-ceramic/70 transition-colors hover:text-ceramic"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href="#contact"
              className="ml-auto hidden shrink-0 rounded-full bg-ceramic px-5 py-2 text-sm font-medium text-basalt transition-colors hover:bg-amber md:ml-0 md:block"
            >
              Start a build
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="reading ml-auto md:hidden"
              aria-label="Open menu"
            >
              Menu
            </button>
          </div>
        </GlassSurface>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-basalt/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between">
            <img src="/briqx-mark.png" alt="briqx" className="h-6 w-auto" />
            <button type="button" onClick={() => setOpen(false)} className="reading" aria-label="Close menu">
              Close
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-2">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-medium tracking-tight text-ceramic"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-auto rounded-full bg-ceramic px-6 py-3.5 text-center font-medium text-basalt"
          >
            Start a build
          </a>
        </div>
      )}
    </>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <TopoField seed={0} />
      </div>

      {/* Enough scrim to read the type, not enough to flatten the terrain */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_100%_at_30%_20%,rgba(11,15,14,0.86)_0%,rgba(11,15,14,0.45)_45%,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-basalt" />

      <Nav />

      {/*
        Framed like a survey sheet: a header band and a footer band holding the body
        between them. Without the bands the whole upper third was dead space and the
        composition collapsed into the bottom-left corner.
      */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28">
        <div className="flex items-center justify-between gap-4 border-b border-mist/12 pb-4">
          <div className="reading flex items-center gap-3">
            <span className="tnum">{STATION}</span>
            <span className="hidden h-px w-8 bg-mist/40 sm:block" />
            <span className="hidden sm:inline">{BRAND.place}</span>
          </div>
          <span className="reading">{BRAND.tagline}</span>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <img
            src="/briqx-wordmark.png"
            alt={BRAND.name}
            draggable={false}
            className="mt-9 w-full max-w-[min(70vw,24rem)] select-none sm:mt-8"
          />

          <h1 className="mt-14 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.04em] text-ceramic">
            {HERO.headline.lead}{' '}
            <span className="text-amber">{HERO.headline.accent}</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-snug text-ceramic/60">{HERO.subtext}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-ceramic px-6 py-3 text-sm font-medium text-basalt transition-colors hover:bg-amber"
            >
              {HERO.primaryCta}
            </a>

            {HERO.secondary.map((cta) => (
              <GlassSurface
                key={cta.label}
                width="auto"
                height={46}
                borderRadius={23}
                backgroundOpacity={0.03}
                saturation={1.6}
                blur={10}
                displace={1}
                distortionScale={-120}
                greenOffset={14}
                blueOffset={24}
                style={{ '--glass-brightness': 1.6 } as CSSProperties}
              >
                <a
                  href={cta.href}
                  className="whitespace-nowrap px-5 text-sm text-ceramic/85 transition-colors hover:text-ceramic"
                >
                  {cta.label}
                </a>
              </GlassSurface>
            ))}
          </div>
        </div>

        {/* Readings taken through glass, sitting over the open terrain */}
        <div className="relative lg:col-span-5">
          {/* Glass shows what is behind it, and basalt is nearly black. This is the
              light the panel refracts — without it there is nothing to be clear about. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-16 bg-[radial-gradient(closest-side_at_32%_22%,rgba(240,190,120,0.40),rgba(192,91,54,0.18)_50%,transparent_100%)]"
          />
          <GlassSurface
            width="100%"
            height={268}
            borderRadius={22}
            backgroundOpacity={0.035}
            saturation={1.7}
            blur={13}
            displace={1.8}
            distortionScale={-170}
            redOffset={3}
            greenOffset={15}
            blueOffset={27}
            style={{ '--glass-brightness': 1.45 } as CSSProperties}
          >
            <dl className="flex w-full flex-col justify-center gap-1 px-5 sm:px-7">
              {HERO.terms.map((t, i) => (
                <div
                  key={t.label}
                  className={`flex items-baseline justify-between gap-4 py-4 ${
                    i > 0 ? 'border-t border-mist/15' : ''
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <dt className="reading">{t.label}</dt>
                    <dd className="text-[11px] text-ceramic/45">{t.note}</dd>
                  </div>
                  <dd className="flex shrink-0 items-baseline gap-1.5">
                    <span className="tnum font-display text-2xl font-medium leading-none text-ceramic sm:text-3xl">
                      {t.value}
                    </span>
                    {t.unit && <span className="font-mono text-[10px] text-mist">{t.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </GlassSurface>
        </div>
        </div>

        {/* Footer band: what's on offer, stated before you scroll, and a bridge
            straight into the section that follows. */}
        <div className="flex items-center justify-between gap-6 border-t border-mist/12 pt-4">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {CAPABILITIES.map((c) => (
              <li key={c.name}>
                <a
                  href="#build"
                  className="reading transition-colors hover:text-amber"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#build"
            aria-label="Scroll to what we build"
            className="reading hidden shrink-0 transition-colors hover:text-amber sm:block"
          >
            Scroll ↓
          </a>
        </div>
      </div>
    </section>
  )
}
