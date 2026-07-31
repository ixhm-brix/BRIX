import { type CSSProperties } from 'react'
import GlassSurface from '../components/GlassSurface'
import TopoField from '../components/TopoField'
import { SCHEDULE } from '../content'

export default function Schedule() {
  return (
    <section id="schedule" className="relative overflow-hidden bg-basalt">
      <div className="absolute inset-0">
        <TopoField seed={7} intensity={1.15} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_50%,rgba(11,15,14,0.9)_0%,rgba(11,15,14,0.5)_50%,transparent_80%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-basalt to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-basalt to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-36">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <span className="reading">{SCHEDULE.label}</span>
            <h2 className="mt-6 font-display text-[clamp(1.9rem,4.2vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ceramic">
              {SCHEDULE.headline.lead}{' '}
              <span className="text-amber">{SCHEDULE.headline.accent}</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ceramic/60">{SCHEDULE.note}</p>
          </div>

          {/* Delivery windows, read off the price sheet rather than counted down to */}
          <div className="relative lg:col-span-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-16 bg-[radial-gradient(closest-side_at_32%_22%,rgba(240,190,120,0.40),rgba(192,91,54,0.18)_50%,transparent_100%)]"
          />

            <GlassSurface
              width="100%"
              height={288}
              borderRadius={22}
              backgroundOpacity={0.035}
              saturation={1.7}
              blur={14}
              displace={2}
              distortionScale={-175}
              redOffset={4}
              greenOffset={16}
              blueOffset={28}
              style={{ '--glass-brightness': 1.45 } as CSSProperties}
            >
              <div className="flex w-full flex-col gap-5 px-6 sm:px-8">
                <span className="reading">How long each one takes</span>

                {/*
                  One block per week, each block the same size. Not a fill inside a
                  track: a track reads as progress toward a maximum, which is both
                  meaningless here and backwards, since fewer weeks is the better result.
                */}
                <ul className="flex flex-col gap-4">
                  {SCHEDULE.windows.map((w) => (
                    <li key={w.name} className="flex items-center gap-3">
                      <span className="w-[5.5rem] shrink-0 text-sm text-ceramic/80">{w.name}</span>
                      <span className="flex gap-1.5" aria-hidden>
                        {Array.from({ length: w.weeks }, (_, i) => (
                          <span key={i} className="h-2.5 w-8 rounded-[2px] bg-amber" />
                        ))}
                      </span>
                      <span className="ml-auto shrink-0 font-mono text-xs text-ceramic/70">
                        {w.weeks} {w.weeks === 1 ? 'week' : 'weeks'}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="border-t border-mist/15 pt-4 text-[11px] leading-relaxed text-ceramic/50">
                  Bespoke work is quoted with its own date before you commit.
                </p>
              </div>
            </GlassSurface>
          </div>
        </div>

        <ol className="mt-24 grid grid-cols-1 gap-px bg-mist/12 sm:mt-32 md:grid-cols-2">
          {SCHEDULE.steps.map((s) => (
            <li key={s.marker} className="bg-basalt/85 p-7 backdrop-blur-sm sm:p-9">
              <span className="reading text-laterite">{s.marker}</span>
              <h3 className="mt-4 font-display text-xl font-medium leading-tight tracking-[-0.02em] text-ceramic sm:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ceramic/55">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
