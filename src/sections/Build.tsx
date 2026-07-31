import { CAPABILITIES } from '../content'

/**
 * Replaces the borrowed "recent work" register. Until there are real projects to show
 * with permission, this states what the studio makes — which is true today — rather
 * than filling a grid with invented clients.
 */
export default function Build() {
  return (
    <section id="build" className="bg-basalt px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="reading">What we build</span>
            <h2 className="mt-6 max-w-xl font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ceramic">
              Six things, <span className="text-amber">done properly.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ceramic/50">
            Most businesses need the first two. Everything after that is for when the first two
            are already working.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-px bg-mist/12 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <li key={c.name} className="group bg-basalt p-7 transition-colors hover:bg-soil sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ceramic transition-colors group-hover:text-amber">
                  {c.name}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ceramic/55">{c.body}</p>
              <p className="reading mt-6">{c.meta}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
