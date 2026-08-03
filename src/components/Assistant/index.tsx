import { useCallback, useEffect, useRef, useState } from 'react'
import TopoField from '../TopoField'
import Face from './Face'
import { ASSISTANT } from '../../content'
import { ask, GREETING, SUGGESTIONS, type Message } from './client'
import { useKeyboardInset } from './useKeyboardInset'

/**
 * The assistant, as a summit on the survey.
 *
 * A hill seen from above is nested contour rings, and this site is a topographic map of
 * a country of hills — so the launcher is drawn from the page's own material rather than
 * dropped on top of it. It is alive because the ground breathes: the contours re-form
 * continuously and never repeat. No stroke and no pulse. See Summit.tsx.
 */

const LENS = 74

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

function Typing() {
  return (
    <span className="flex items-center gap-1.5 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="assistant-dot h-1.5 w-1.5 rounded-full bg-amber"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  )
}

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [hail, setHail] = useState(false)
  const [typed, setTyped] = useState('')
  const [hover, setHover] = useState(false)

  const reduced = useReducedMotion()
  const keyboard = useKeyboardInset()

  // Below sm the panel is a sheet; above it, a floating card. Only the sheet has
  // to dodge the keyboard.
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const on = () => setCompact(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // On a phone the chat goes full screen for as long as it is open. Earlier this
  // tried to stay a floating card and merely dodge the keyboard, which meant
  // setting top, bottom AND an explicit height — three constraints fighting each
  // other, and double-compensating on Android where the viewport meta already
  // shrinks the layout viewport. Full screen needs none of that arithmetic: the
  // sheet fills the viewport and the keyboard is handled by padding the bottom.
  const sheet = compact && open
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // Munyakazi speaks up on every load, not once per session. The delay is deliberate:
  // arriving at the same moment as the page reads as an ad, whereas speaking up once
  // someone has had a look around reads as noticing them.
  useEffect(() => {
    const t = window.setTimeout(() => setHail(true), 7000)
    return () => window.clearTimeout(t)
  }, [])

  // Typed out rather than pasted in. A message that appears whole reads as a banner;
  // one that types reads as somebody talking to you.
  useEffect(() => {
    if (!hail) return
    if (reduced) {
      setTyped(ASSISTANT.hail)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(ASSISTANT.hail.slice(0, i))
      if (i >= ASSISTANT.hail.length) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [hail, reduced])

  // Retires itself once it has been readable for a while, so it never becomes furniture
  useEffect(() => {
    if (!hail) return
    const t = window.setTimeout(() => setHail(false), ASSISTANT.hail.length * 22 + 7000)
    return () => window.clearTimeout(t)
  }, [hail])

  const dismissHail = () => setHail(false)

  useEffect(() => {
    if (!open) return
    dismissHail()
    const t = window.setTimeout(() => inputRef.current?.focus(), 260)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Pin the log to the newest message, repeatedly for a short window.
  //
  // A single scroll is not enough: the panel reflows when the keyboard opens and
  // bubbles change height as text wraps, so scrollHeight measured in the first
  // frame is stale and the last message ends up clipped behind the input.
  const pinToBottom = useCallback((smooth = false) => {
    const started = performance.now()
    const step = () => {
      const el = logRef.current
      if (!el) return
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
      if (performance.now() - started < 500) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    pinToBottom(true)
  }, [messages, thinking, pinToBottom])

  // The keyboard opening changes how much of the log is visible; re-pin so the
  // newest message is never left behind the input.
  useEffect(() => {
    if (!open) return
    pinToBottom()
  }, [open, keyboard.inset, keyboard.viewportHeight, sheet, pinToBottom])

  const send = (text: string) => {
    const clean = text.trim()
    if (!clean || thinking) return

    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text: clean }])
    setDraft('')
    setThinking(true)

    void ask(clean).then((reply) => {
      setMessages((m) => [...m, reply])
      setThinking(false)
    })
  }

  return (
    <>
      <div
        className={`fixed bottom-5 right-5 z-[70] flex items-center gap-3 transition-opacity duration-200 sm:bottom-7 sm:right-7 ${
          sheet ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        {hail && !open && (
          <div className="assistant-peek flex items-center gap-2 rounded-full bg-soil/95 py-1.5 pl-2 pr-1.5 shadow-[0_12px_34px_rgba(0,0,0,0.5)] ring-1 ring-ceramic/[0.08] backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 whitespace-nowrap pr-1 text-left"
            >
              <Face size={26} paused={reduced} />
              <span className="text-[13px] leading-none text-ceramic/85">
                {typed}
                {typed.length < ASSISTANT.hail.length && (
                  <span className="assistant-caret ml-0.5 inline-block h-3 w-px bg-amber align-middle" />
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={dismissHail}
              aria-label="Dismiss"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-mist transition-colors hover:bg-ceramic/10 hover:text-ceramic"
            >
              ×
            </button>
          </div>
        )}

        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          aria-expanded={open}
          aria-controls="briqx-assistant"
          aria-label={open ? `Close ${ASSISTANT.name}` : `Ask ${ASSISTANT.name}`}
          className="group relative flex items-center justify-center transition-transform duration-300 active:scale-95"
          style={{ width: LENS, height: LENS }}
        >
          {/* Light spilling past the body. No shell, no rim: the presence is the
              object, and enclosing it in glass turned it back into an ornament. */}
          <span className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(closest-side,rgba(224,163,75,0.34),rgba(192,91,54,0.12)_55%,transparent_78%)]" />
          <span
            className="relative block transition-transform duration-500 ease-out group-hover:scale-[1.07]"
            style={{ width: LENS, height: LENS }}
          >
            <Face size={LENS} active={hover || thinking} paused={reduced} interactive />
          </span>
          <span
            className={`pointer-events-none absolute inset-0 flex items-center justify-center text-xl leading-none text-basalt transition-opacity duration-300 ${
              open ? 'opacity-90' : 'opacity-0'
            }`}
          >
            ×
          </span>
        </button>
      </div>

      <div
        id="briqx-assistant"
        role="dialog"
        aria-label={ASSISTANT.name}
        aria-hidden={!open}
        className={`fixed z-[69] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-3 scale-95 opacity-0'
        } ${
          sheet
            ? 'inset-0 bg-basalt'
            : 'inset-x-3 bottom-[5.5rem] origin-bottom-right sm:inset-x-auto sm:bottom-24 sm:right-7 sm:w-[380px]'
        }`}
        style={
          sheet
            ? {
                // Only the keyboard's own height. The viewport itself is already
                // handled by inset-0, whether or not the browser shrank it.
                paddingBottom: keyboard.inset,
                paddingTop: 'env(safe-area-inset-top)',
              }
            : undefined
        }
      >
        <div
          className={`relative flex flex-col overflow-hidden bg-basalt shadow-[0_24px_70px_rgba(0,0,0,0.55)] ring-1 ring-ceramic/[0.07] ${
            sheet ? 'h-full rounded-none' : 'rounded-3xl'
          }`}
        >
          {/* Its own terrain, so the panel reads the same wherever it opens over the page */}
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <TopoField seed={5} intensity={0.6} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(11,15,14,0.72),rgba(11,15,14,0.94)_60%,#0B0F0E)]" />

          <div className={`relative flex flex-col ${sheet ? "min-h-0 flex-1" : "h-[min(72vh,540px)]"}`}>
            <header className="flex items-center gap-3 border-b border-ceramic/10 px-4 py-3.5">
              <Face size={34} active={thinking} paused={reduced} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ceramic">{ASSISTANT.name}</p>
                <p className="reading mt-0.5 truncate">{ASSISTANT.role}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  launcherRef.current?.focus()
                }}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-mist transition-colors hover:bg-ceramic/10 hover:text-ceramic"
              >
                ×
              </button>
            </header>

            <div
              ref={logRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              role="log"
              aria-live="polite"
            >
              {messages.map((m) =>
                m.role === 'assistant' ? (
                  <div
                    key={m.id}
                    className="max-w-[92%] rounded-2xl rounded-tl-md bg-soil px-3.5 py-2.5"
                  >
                    <p className="whitespace-pre-line text-[13px] leading-relaxed text-ceramic/85">
                      {m.text}
                    </p>

                    {/* Offline: published content, displayed not answered */}
                    {m.offline && !!m.prices?.length && (
                      <div className="mt-3 border-t border-ceramic/10 pt-2.5">
                        <p className="reading text-laterite">What we charge</p>
                        <ul className="mt-1.5 space-y-1">
                          {m.prices.map((p) => (
                            <li key={p} className="text-[12px] leading-snug text-ceramic/70">
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {m.offline && !!m.questions?.length && (
                      <div className="mt-3 border-t border-ceramic/10 pt-2.5">
                        <p className="reading text-laterite">Questions we are asked</p>
                        <ul className="mt-1.5 space-y-1">
                          {m.questions.map((q) => (
                            <li key={q} className="text-[12px] leading-snug text-ceramic/70">
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.whatsapp && (
                      <a
                        href={m.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex rounded-full border border-amber/50 px-3 py-1.5 text-[11px] font-medium text-amber transition-colors hover:bg-amber hover:text-basalt"
                      >
                        Ask a person on WhatsApp
                      </a>
                    )}
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-amber px-3.5 py-2.5"
                  >
                    <p className="text-[13px] leading-relaxed text-basalt">{m.text}</p>
                  </div>
                ),
              )}

              {thinking && (
                <div className="w-fit rounded-2xl rounded-tl-md bg-soil px-3.5 py-2.5">
                  <Typing />
                </div>
              )}

              {messages.length === 1 && !thinking && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-ceramic/15 px-3 py-1.5 text-xs text-ceramic/70 transition-colors hover:border-amber hover:text-amber"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
              className="border-t border-ceramic/10 p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-ceramic/15 bg-basalt/70 py-1.5 pl-4 pr-1.5 focus-within:border-amber/60">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about prices, timing, ownership…"
                  aria-label="Your question"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] text-ceramic outline-none placeholder:text-mist/60"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || thinking}
                  aria-label="Send"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber text-basalt transition-opacity disabled:opacity-30"
                >
                  ↑
                </button>
              </div>
              <p className="reading mt-2.5 px-1 text-center">
                Not sure? <span className="text-ceramic/60">Ask a person on WhatsApp</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export type { Message }
