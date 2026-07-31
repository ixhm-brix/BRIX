import { useState } from 'react'
import { FAQ } from '../content'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-basalt px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <span className="reading">Asked and answered</span>
            <h2 className="mt-6 font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ceramic">
              Things people <span className="text-amber">actually ask.</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ceramic/50">
              The questions we get on the first email and on Google, answered here so the first
              call can be about your business instead.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-block rounded-full border border-mist/25 px-5 py-2.5 text-sm text-ceramic/80 transition-colors hover:border-amber hover:text-amber"
            >
              Ask us on WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-8">
          {FAQ.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="border-t border-mist/12 last:border-b">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-5 py-5 text-left"
                  >
                    <span className="reading tnum mt-1.5">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`flex-1 text-base leading-snug transition-colors sm:text-lg ${
                        isOpen ? 'text-ceramic' : 'text-ceramic/65'
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={`mt-2.5 h-px w-4 shrink-0 transition-all duration-300 ${
                        isOpen ? 'rotate-0 bg-amber' : 'rotate-90 bg-mist/60'
                      }`}
                    />
                  </button>
                </h3>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pl-11 pr-6 text-sm leading-relaxed text-ceramic/50">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
