import { useEffect, useRef } from 'react'

/**
 * Munyakazi, with a face.
 *
 * Four abstract attempts came before this — a contour summit, a liquid drop, a glass
 * globe, a plasma core. Each was a handsome shape, and none of them read as alive,
 * because a shape is never alive. What people recognise instantly is something that
 * LOOKS BACK. Eyes do in a glance what no amount of clever motion does.
 *
 * So: a small robot. Three behaviours carry it, and they are all about attention
 * rather than decoration —
 *
 *   Gaze    the pupils track your cursor across the whole page, and the head tilts
 *           slightly after them. This is the one that makes people say "it saw me".
 *   Blink   irregular, occasionally a double blink. Perfectly periodic blinking is
 *           the classic tell of a machine pretending, so the interval is randomised.
 *   Breath  a slow vertical float with the antenna lagging behind, because a rigid
 *           body reads as an icon and a body with follow-through reads as a creature.
 *
 * Drawn as SVG with gradients rather than WebGL: it needs to look like a rendered 3D
 * object, not be one. No model to license, nothing to download, and it cannot
 * compete with scrolling the way a render loop would.
 */

type FaceProps = {
  size?: number
  /** Thinking: quicker breath, brighter antenna, eyes narrow in concentration. */
  active?: boolean
  paused?: boolean
  /** Track the pointer. On for the launcher, off for small inline marks. */
  interactive?: boolean
}

export default function Face({
  size = 74,
  active = false,
  paused = false,
  interactive = false,
}: FaceProps) {
  const rootRef = useRef<SVGSVGElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const pupilsRef = useRef<SVGGElement>(null)
  const lidLRef = useRef<SVGRectElement>(null)
  const lidRRef = useRef<SVGRectElement>(null)
  const antennaRef = useRef<SVGCircleElement>(null)
  const stateRef = useRef({ active, paused })
  stateRef.current = { active, paused }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let raf = 0
    let t = 0
    let last = performance.now()

    // Measured: animating SVG attributes every frame during a scroll took the median
    // frame from 33ms to 117ms. Same rule as the page terrain — nothing decorative
    // competes with scrolling. It also idles when off screen or on a hidden tab.
    let scrolling = false
    let scrollTimer = 0
    let onScreen = true

    // Gaze, eased so the eyes glide rather than snap.
    let gx = 0
    let gy = 0
    let tgx = 0
    let tgy = 0

    // Blink. -1 idle; otherwise counts up through the close/open.
    let blink = -1
    let nextBlink = 1.5 + Math.random() * 3
    let doubleBlink = false

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const { active: hot, paused: still } = stateRef.current
      if (still || scrolling || !onScreen || document.hidden) {
        last = now
        return
      }
      if (now - last < 33) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt * (hot ? 1.7 : 1)

      gx += (tgx - gx) * 0.12
      gy += (tgy - gy) * 0.12

      // Idle float. Two periods so it never settles into an obvious rhythm.
      const bob = Math.sin(t * 1.5) * 0.9 + Math.sin(t * 0.62) * 0.5
      headRef.current?.setAttribute(
        'transform',
        `translate(${gx * 0.35} ${bob + gy * 0.35}) rotate(${gx * 0.5} 50 54)`,
      )

      // Antenna lags the head — follow-through is most of what sells a body.
      const lag = Math.sin((t - 0.16) * 1.5) * 1.5 + Math.sin((t - 0.16) * 0.62) * 0.8
      antennaRef.current?.setAttribute('cx', String(50 + lag * 0.8 + gx * 0.5))

      pupilsRef.current?.setAttribute('transform', `translate(${gx} ${gy})`)

      // Blink cycle
      if (blink < 0) {
        if (t > nextBlink) blink = 0
      } else {
        blink += dt
        const D = 0.16
        if (blink > D) {
          if (doubleBlink) {
            doubleBlink = false
            blink = 0
          } else {
            blink = -1
            // Humans blink irregularly; a fixed interval is the giveaway.
            nextBlink = t + 1.8 + Math.random() * 4.5
            doubleBlink = Math.random() < 0.25
          }
        }
      }

      // 0 open -> 1 shut -> 0 open
      const shut = blink < 0 ? 0 : Math.sin((blink / 0.16) * Math.PI)
      // Concentrating narrows the eyes a little.
      const squint = hot ? 0.22 : 0
      const openH = 13 * (1 - Math.max(shut, squint))
      for (const lid of [lidLRef.current, lidRRef.current]) {
        if (!lid) continue
        lid.setAttribute('height', String(Math.max(0.6, openH)))
        lid.setAttribute('y', String(47 + (13 - Math.max(0.6, openH)) / 2))
      }

      const glow = 0.55 + Math.sin(t * (hot ? 5 : 2.1)) * 0.25 + (hot ? 0.2 : 0)
      antennaRef.current?.setAttribute('opacity', String(Math.min(1, glow)))
    }

    raf = requestAnimationFrame(frame)

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
    })
    io.observe(root)

    const onScroll = () => {
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        scrolling = false
      }, 160)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onPointer = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      // Saturates with distance, so a cursor far away still pins the gaze fully.
      const norm = (v: number, k: number) => Math.tanh(v / k)
      tgx = norm(dx, 260) * 3.4
      tgy = norm(dy, 260) * 2.6
    }
    if (interactive) window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(scrollTimer)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (interactive) window.removeEventListener('pointermove', onPointer)
    }
  }, [interactive])

  const uid = `mk-${size}`

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden
      className="block overflow-visible"
    >
      <defs>
        {/* Warm ceramic shell, lit from upper-left like the logo */}
        <linearGradient id={`${uid}-shell`} x1="22%" y1="4%" x2="78%" y2="100%">
          <stop offset="0%" stopColor="#F7F2E4" />
          <stop offset="52%" stopColor="#E8E3D4" />
          <stop offset="100%" stopColor="#B9AE97" />
        </linearGradient>
        <linearGradient id={`${uid}-visor`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#241A12" />
          <stop offset="100%" stopColor="#0C0908" />
        </linearGradient>
        <radialGradient id={`${uid}-eye`} cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#FFF3DC" />
          <stop offset="45%" stopColor="#E0A34B" />
          <stop offset="100%" stopColor="#C05B36" />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0A34B" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E0A34B" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="50" cy="92" rx="24" ry="4.5" fill="rgba(0,0,0,0.45)" />

      <g ref={headRef}>
        {/* antenna */}
        <rect x="48.6" y="17" width="2.8" height="12" rx="1.4" fill={`url(#${uid}-shell)`} />
        <circle cx="50" cy="15" r="9" fill={`url(#${uid}-halo)`} />
        <circle ref={antennaRef} cx="50" cy="15" r="4.2" fill="#E0A34B" />
        <circle cx="48.6" cy="13.6" r="1.3" fill="#FFF6E4" opacity="0.9" />

        {/* head */}
        <rect x="18" y="28" width="64" height="54" rx="19" fill={`url(#${uid}-shell)`} />
        <rect
          x="18" y="28" width="64" height="54" rx="19"
          fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"
        />
        {/* ears */}
        <rect x="11.5" y="45" width="6" height="18" rx="3" fill="#B9AE97" />
        <rect x="82.5" y="45" width="6" height="18" rx="3" fill="#B9AE97" />

        {/* visor */}
        <rect x="26" y="39" width="48" height="30" rx="14" fill={`url(#${uid}-visor)`} />
        <rect
          x="26" y="39" width="48" height="30" rx="14"
          fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1"
        />
        {/* glass highlight across the visor */}
        <path d="M30 46 Q40 40 52 41 L46 47 Q36 46 30 52 Z" fill="rgba(255,255,255,0.09)" />

        {/* eyes — height animates for blink and squint */}
        <g ref={pupilsRef}>
          <rect ref={lidLRef} x="35.5" y="47" width="9" height="13" rx="4.5" fill={`url(#${uid}-eye)`} />
          <rect ref={lidRRef} x="55.5" y="47" width="9" height="13" rx="4.5" fill={`url(#${uid}-eye)`} />
        </g>
      </g>
    </svg>
  )
}
