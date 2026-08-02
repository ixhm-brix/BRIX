import { useEffect, useRef } from 'react'

/**
 * A hill, seen from above — and awake.
 *
 * On a survey sheet a summit is nested closed contours tightening toward the peak. This
 * draws that with the page terrain's own lines and laterite-to-amber ramp, so the
 * launcher is made of the site rather than placed on it.
 *
 * Four things stack to make it read as alive rather than looping. None of them is a
 * pulse or a ring, which is the generic chat-widget vocabulary:
 *   1. Breathing — every contour swells and settles together on a slow cycle.
 *   2. Differential rotation — inner contours turn faster than outer ones, the way a
 *      fluid body shears. This is what stops it looking like a spinning graphic.
 *   3. An occasional swell that travels outward through the rings, on an irregular
 *      interval, so it is never predictable. This is the thing that reads as breath.
 *   4. It notices you: within range the whole summit leans toward the pointer and warms.
 */

type SummitProps = {
  size?: number
  rings?: number
  /** Warms and quickens slightly on hover. */
  active?: boolean
  paused?: boolean
  /** Track the pointer. On for the launcher, off for the small header mark. */
  interactive?: boolean
}

function hash(xi: number, yi: number, seed: number) {
  let h = Math.imul(xi, 374761393) ^ Math.imul(yi, 668265263) ^ Math.imul(seed, 362437)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function noise2(x: number, y: number, seed: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const a = hash(xi, yi, seed)
  const b = hash(xi + 1, yi, seed)
  const c = hash(xi, yi + 1, seed)
  const d = hash(xi + 1, yi + 1, seed)
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
}

export default function Summit({
  size = 84,
  rings = 8,
  active = false,
  paused = false,
  interactive = false,
}: SummitProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ active, paused })
  stateRef.current = { active, paused }

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(size * dpr)
    canvas.height = Math.round(size * dpr)
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const maxR = size * 0.46
    const STEPS = 72
    const REACH = 260 // px within which the summit senses the pointer

    let raf = 0
    let t = 0
    let last = 0

    let onScreen = true
    // Measured: leaving this running during scroll halved the frame rate (33ms vs
    // 17ms median). Same rule as the page terrain — nothing decorative competes with
    // scrolling. 160ms of stillness while the page moves is imperceptible.
    let scrolling = false
    let scrollTimer = 0

    // Pointer lean, eased toward its target so it never snaps
    let leanX = 0
    let leanY = 0
    let leanTargetX = 0
    let leanTargetY = 0
    let near = 0
    let nearTarget = 0

    // The travelling swell. Idle at -1, then runs once and schedules the next.
    let swell = -1
    let nextSwell = 3 + Math.random() * 5

    const draw = () => {
      const { active: hot } = stateRef.current
      ctx.clearRect(0, 0, size, size)

      const heat = hot ? 1 : 0.86 + near * 0.14
      // Whole body breathing — slow, and never quite the same twice because two
      // periods that do not divide evenly are summed.
      const breathe = 1 + Math.sin(t * 0.85) * 0.028 + Math.sin(t * 0.31) * 0.016
      const ox = cx + leanX
      const oy = cy + leanY

      // Its own ground.
      //
      // Without this the summit is drawn in the same lines and colours as the page
      // terrain directly behind it, so it camouflages — it reads as part of the map
      // rather than an object resting on it. A warm dark disc gives its contours their
      // own surface to sit on. It stays opaque through the body and releases over the
      // last fifth of the radius, so it separates without ever cutting a hard edge.
      const discR = maxR * 1.12 * breathe
      const base = ctx.createRadialGradient(ox, oy, 0, ox, oy, discR)
      base.addColorStop(0, 'rgba(28,20,14,0.97)')
      base.addColorStop(0.66, 'rgba(23,17,12,0.95)')
      base.addColorStop(0.82, 'rgba(19,14,10,0.82)')
      base.addColorStop(1, 'rgba(17,12,9,0)')
      ctx.fillStyle = base
      ctx.beginPath()
      ctx.arc(ox, oy, discR, 0, Math.PI * 2)
      ctx.fill()

      const glowR = maxR * (1.05 + near * 0.12) * breathe
      const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, glowR)
      glow.addColorStop(0, `rgba(240,196,137,${(0.34 + near * 0.16) * heat})`)
      glow.addColorStop(0.45, `rgba(224,163,75,${(0.12 + near * 0.08) * heat})`)
      glow.addColorStop(1, 'rgba(192,91,54,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(ox, oy, glowR, 0, Math.PI * 2)
      ctx.fill()

      // Swell position travels from the peak outward past the rim
      const swellPos = swell >= 0 ? (swell / 1.7) * 1.35 : -9

      for (let i = rings; i >= 1; i--) {
        const k = i / rings
        const wobble = 0.06 + (1 - k) * 0.3
        const baseR = maxR * (0.14 + 0.86 * k) * breathe

        // Inner contours turn faster than outer ones — shear, not spin
        const spin = t * (0.05 + (1 - k) * 0.16) * (hot ? 1.5 : 1)

        ctx.beginPath()
        for (let s = 0; s <= STEPS; s++) {
          const a = (s / STEPS) * Math.PI * 2 + spin
          const nx = Math.cos(a) * 1.5 + 3
          const ny = Math.sin(a) * 1.5 + 3
          const n = noise2(nx + t * 0.3, ny - t * 0.19, i * 7 + 3)
          const r = baseR * (1 + (n - 0.5) * wobble * 2)
          const x = ox + Math.cos(a) * r
          const y = oy + Math.sin(a) * r
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()

        const mix = 1 - k
        const cr = Math.round(192 + (255 - 192) * mix)
        const cg = Math.round(91 + (231 - 91) * mix)
        const cb = Math.round(54 + (190 - 54) * mix)
        const isIndex = i % 3 === 0

        // Fade outward so the outermost contour dissolves into the page terrain
        // instead of closing as a hard ring, which would read as a border.
        const fade = 0.3 + 0.7 * (1 - k) ** 0.8
        const lift = Math.exp(-((k - swellPos) ** 2) / 0.012)

        const alpha = Math.min((isIndex ? 1 : 0.72) * fade * heat + lift * 0.55, 1)
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`
        ctx.lineWidth = (isIndex ? 1.5 : 1) + lift * 0.7
        ctx.stroke()
      }

      // The peak, shimmering with the breath
      const peak = 2 + Math.sin(t * 0.85) * 0.35 + near * 0.5
      ctx.beginPath()
      ctx.arc(ox, oy, peak, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,243,220,${0.88 * heat})`
      ctx.fill()
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (stateRef.current.paused || !onScreen || scrolling || document.hidden) {
        last = now
        return
      }
      if (now - last < 40) return
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      t += dt * (stateRef.current.active ? 1.7 : 1)

      // Ease the lean and warmth so nothing snaps
      leanX += (leanTargetX - leanX) * 0.08
      leanY += (leanTargetY - leanY) * 0.08
      near += (nearTarget - near) * 0.07

      if (swell < 0) {
        if (t > nextSwell) swell = 0
      } else {
        swell += dt
        if (swell > 1.7) {
          swell = -1
          nextSwell = t + 6 + Math.random() * 7
        }
      }

      draw()
    }

    last = performance.now()
    draw()
    raf = requestAnimationFrame(frame)

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
    })
    io.observe(canvas)

    const onScroll = () => {
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        scrolling = false
      }, 160)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      if (dist > REACH) {
        nearTarget = 0
        leanTargetX = 0
        leanTargetY = 0
        return
      }
      const pull = 1 - dist / REACH
      nearTarget = pull
      leanTargetX = (dx / dist || 0) * pull * size * 0.055
      leanTargetY = (dy / dist || 0) * pull * size * 0.055
    }

    if (interactive) window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(scrollTimer)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (interactive) window.removeEventListener('pointermove', onPointer)
    }
  }, [size, rings, interactive])

  return <canvas ref={ref} aria-hidden className="block" style={{ width: size, height: size }} />
}
