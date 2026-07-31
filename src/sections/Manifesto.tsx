import { MANIFESTO } from '../content'

/**
 * Four claims you can scan, not a centred paragraph you have to read.
 * Each one is a position the studio can be held to, keyed by what it governs.
 */
export default function Manifesto() {
  return (
    <section className="bg-basalt px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <span className="reading">{MANIFESTO.label}</span>

        <h2 className="mt-6 max-w-2xl font-display text-[clamp(1.9rem,4.2vw,3.1rem)] font-medium leading-[1.03] tracking-[-0.035em] text-ceramic">
          {MANIFESTO.headline.lead}{' '}
          <span className="text-amber">{MANIFESTO.headline.accent}</span>
        </h2>

        <dl className="mt-14 grid grid-cols-1 gap-px bg-mist/20 sm:grid-cols-2">
          {MANIFESTO.claims.map((claim) => (
            <div key={claim.key} className="bg-basalt py-7 sm:px-7 sm:py-8">
              <dt className="reading text-laterite">{claim.key}</dt>
              <dd className="mt-3 max-w-sm text-[15px] leading-snug text-ceramic/75">
                {claim.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
