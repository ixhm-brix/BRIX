import { type CSSProperties, type ReactNode } from 'react'
import GlassSurface from '../components/GlassSurface'
import { BESPOKE, MATRIX, TIERS } from '../content'

/**
 * Priced as a ladder, not a spec sheet.
 *
 * TIERS and MATRIX are index-aligned: tier n adds exactly the capability group at
 * MATRIX[n] and inherits everything below it. So each card lists only what is new and
 * names what it carries up — instead of repeating all twelve rows three times, which is
 * what forced the old comparison table to scroll sideways on a phone.
 *
 * The core sample on each card is the honest read of that: which strata you are getting.
 * Filled or hollow markers, never a fill inside a track — nothing here is a percentage.
 */

const GROUPS = MATRIX.map((m) => m.group)

function CoreSample({ depth }: { depth: number }) {
  return (
    <ul className="flex flex-col gap-2">
      {GROUPS.map((group, i) => {
        const included = i <= depth
        return (
          <li key={group} className="flex items-center gap-2.5">
            <span
              aria-hidden
              className={`h-2.5 w-2.5 shrink-0 rounded-[1px] ${
                included ? 'bg-amber' : 'border border-mist/30'
              }`}
            />
            <span
              className={`font-mono text-[10px] uppercase tracking-survey ${
                included ? 'text-ceramic/80' : 'text-mist/45'
              }`}
            >
              {group}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function TierBody({ index }: { index: number }) {
  const tier = TIERS[index]
  const adds = MATRIX[index].rows
  const inherits = index > 0 ? TIERS[index - 1].name : null

  return (
    <div className="flex h-full w-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <span className="reading">{tier.code}</span>
        {tier.popular && (
          <span className="rounded-full bg-amber px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-basalt">
            Most picked
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-ceramic">
        {tier.name}
      </h3>
      <p className="mt-1.5 text-sm text-ceramic/50">{tier.promise}</p>

      {/* The struck price is the only place the old figure appears — everywhere else on
          the site quotes what you actually pay. Solid chip and a bright struck figure
          because this sits on plain cards and on the lit glass card, where a
          tinted-on-tint treatment disappeared entirely. */}
      {tier.priceBefore && (
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <s className="tnum font-mono text-sm text-ceramic/70 decoration-laterite decoration-[1.5px]">
            <span className="sr-only">Was </span>
            {tier.priceBefore}
          </s>
          {tier.saving && (
            <span className="rounded-full bg-laterite px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ceramic">
              Save {tier.saving}
            </span>
          )}
        </div>
      )}

      <div className={`flex items-baseline gap-2 ${tier.priceBefore ? 'mt-1.5' : 'mt-6'}`}>
        <span className="tnum font-display text-3xl font-medium text-ceramic">{tier.price}</span>
        <span className="font-mono text-[11px] text-mist">RWF</span>
      </div>
      <span className="reading mt-1.5">live in {tier.timeline}</span>

      <div className="mt-6 border-t border-mist/15 pt-5">
        <CoreSample depth={index} />
      </div>

      <div className="mt-6">
        <p className="reading text-laterite">
          {inherits ? `Everything in ${inherits}, plus` : 'What you get'}
        </p>
        <ul className="mt-3.5 flex flex-col gap-2.5">
          {adds.map((row) => (
            <li key={row.label} className="flex gap-2.5">
              <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber" />
              <span className="text-[13px] leading-snug text-ceramic/70">{row.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-7">
        <p className="reading">{tier.guarantees} written guarantees</p>
        <a
          href="#contact"
          className={`mt-4 block rounded-full px-4 py-3 text-center text-sm font-medium transition-colors ${
            tier.popular
              ? 'bg-amber text-basalt hover:bg-ceramic'
              : 'border border-mist/25 text-ceramic/85 hover:border-amber hover:text-amber'
          }`}
        >
          Start here
        </a>
      </div>
    </div>
  )
}

function Card({ index, children }: { index: number; children: ReactNode }) {
  const featured = TIERS[index].popular

  if (!featured) {
    return <article className="rounded-2xl bg-soil">{children}</article>
  }

  // The recommended tier is rendered in the site's signature material.
  return (
    <article className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 bg-[radial-gradient(closest-side_at_50%_30%,rgba(240,190,120,0.30),rgba(192,91,54,0.14)_52%,transparent_100%)]"
      />
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={16}
        backgroundOpacity={0.04}
        saturation={1.7}
        blur={13}
        displace={1.6}
        distortionScale={-150}
        redOffset={3}
        greenOffset={14}
        blueOffset={25}
        className="glass-surface--flush"
        style={{ '--glass-brightness': 1.45 } as CSSProperties}
      >
        {children}
      </GlassSurface>
    </article>
  )
}

export default function Pricing() {
  return (
    /* overflow-hidden because the featured card's glow is inset by -40px; at phone
       width that bleeds past the viewport and stretches the fixed nav with it. */
    <section id="pricing" className="overflow-hidden bg-basalt px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="reading">Price sheet</span>
            <h2 className="mt-6 max-w-xl font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ceramic">
              Every price we charge, <span className="text-amber">printed in full.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ceramic/50">
            Each one carries the one below it. Find the lowest row you need — that is your
            package.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((tier, i) => (
            <Card key={tier.key} index={i}>
              <TierBody index={i} />
            </Card>
          ))}
        </div>

        {/* Scoped rather than packaged. Full-width rows so a third entry does not orphan
            in a two-column grid, and so the AI row has space for what it actually does. */}
        <div className="mt-4 flex flex-col gap-4">
          {BESPOKE.map((b) => (
            <article
              key={b.code}
              className="flex flex-col gap-5 rounded-2xl border border-mist/12 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-7"
            >
              <div className="sm:max-w-xl">
                <span className="reading">{b.code} · Quoted per project</span>
                <h3 className="mt-3 font-display text-xl font-medium tracking-[-0.02em] text-ceramic">
                  {b.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ceramic/50">{b.promise}</p>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-6 sm:flex-col sm:items-end sm:gap-2">
                {b.price ? (
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[10px] text-mist">from</span>
                    <span className="tnum font-display text-lg font-medium text-ceramic">
                      {b.price}
                    </span>
                    <span className="font-mono text-[10px] text-mist">RWF</span>
                  </span>
                ) : (
                  <span className="max-w-[11rem] font-mono text-[10px] uppercase tracking-survey text-mist sm:text-right">
                    {b.note}
                  </span>
                )}
                <a
                  href="#contact"
                  className="reading whitespace-nowrap text-amber transition-colors hover:text-ceramic"
                >
                  Scope it →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
