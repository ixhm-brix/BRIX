import { useEffect, useRef } from 'react'

/**
 * A live topographic survey.
 *
 * Rwanda is the land of a thousand hills, and this studio is of that ground. Real
 * isolines lifted out of a scrolling noise field by marching squares, with every fifth
 * line drawn bolder the way an index contour is on an actual survey sheet. The glass
 * panels sit over it and refract it.
 *
 * PERFORMANCE — this is ambient background running on the main thread, so it is built
 * to get out of the user's way. Measured: the first version cost a 200ms median frame
 * while scrolling. In order of how much each mattered:
 *   1. Animates only while on screen. Three of these existed and all ran constantly.
 *   2. Stops entirely while the page scrolls, resumes when it settles. Scrolling must
 *      never have to compete with terrain for the main thread.
 *   3. Marching squares walks each cell once over only the levels crossing that cell,
 *      rather than every level over every cell — about 15x fewer iterations.
 *   4. Segment endpoints are plain numbers. The old version allocated four objects per
 *      cell per level, which was most of the garbage.
 *   5. Integer hash instead of Math.sin — that was ~82k trig calls per sampled frame.
 */

type TopoFieldProps = {
  /** Vertical offset into the terrain, so different sections survey different ground. */
  seed?: number
  className?: string
  intensity?: number
}

const LEVELS = 30
const INDEX_EVERY = 5
const FRAME_MS = 1000 / 24
const SCROLL_IDLE_MS = 160

function hash(xi: number, yi: number, seed: number) {
  let h = Math.imul(xi, 374761393) ^ Math.imul(yi, 668265263) ^ Math.imul(seed, 362437)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function valueNoise(x: number, y: number, seed: number) {
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

function terrain(x: number, y: number, t: number, seed: number) {
  return (
    valueNoise(x, y + t, seed) +
    valueNoise(x * 2.1, y * 2.1 - t * 0.6, seed + 11) * 0.5 +
    valueNoise(x * 4.3, y * 4.3 + t * 0.3, seed + 23) * 0.25
  )
}

export default function TopoField({ seed = 0, className = '', intensity = 1 }: TopoFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let step = 0
    let grid = new Float32Array(0)
    let raf = 0
    let last = 0
    let t = reduced ? 12 : 0

    let visible = false
    let scrolling = false
    let scrollTimer = 0

    // Stroke colours never change, so build them once rather than per frame.
    const strokes: string[] = []
    for (let l = 0; l < LEVELS; l++) {
      const mix = l / LEVELS
      const r = Math.round(192 + (224 - 192) * mix)
      const g = Math.round(91 + (163 - 91) * mix)
      const b = Math.round(54 + (75 - 54) * mix)
      const alpha = (l % INDEX_EVERY === 0 ? 0.72 : 0.26) * intensity
      strokes.push(`rgba(${r},${g},${b},${alpha})`)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      // 1.5 keeps hairlines crisp at roughly half the fill cost of a 2x buffer
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      if (!width || !height) return
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      step = width < 640 ? 20 : 14
      cols = Math.ceil(width / step) + 1
      rows = Math.ceil(height / step) + 1
      grid = new Float32Array(cols * rows)
    }

    const sample = () => {
      const f = 0.0055
      for (let j = 0; j < rows; j++) {
        const yy = j * step * f
        const rowBase = j * cols
        for (let i = 0; i < cols; i++) {
          grid[rowBase + i] = terrain(i * step * f, yy, t, seed)
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      if (!cols || !rows) return

      let min = Infinity
      let max = -Infinity
      for (let k = 0; k < grid.length; k++) {
        const v = grid[k]
        if (v < min) min = v
        if (v > max) max = v
      }
      const span = max - min || 1

      const paths: Path2D[] = new Array(LEVELS)
      for (let l = 1; l < LEVELS; l++) paths[l] = new Path2D()

      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const idx = j * cols + i
          const tl = grid[idx]
          const tr = grid[idx + 1]
          const bl = grid[idx + cols]
          const br = grid[idx + cols + 1]

          let cmin = tl
          let cmax = tl
          if (tr < cmin) cmin = tr
          else if (tr > cmax) cmax = tr
          if (bl < cmin) cmin = bl
          else if (bl > cmax) cmax = bl
          if (br < cmin) cmin = br
          else if (br > cmax) cmax = br

          // Only the contour levels that actually pass through this cell
          let lo = Math.ceil(((cmin - min) / span) * LEVELS)
          let hi = Math.floor(((cmax - min) / span) * LEVELS)
          if (lo < 1) lo = 1
          if (hi > LEVELS - 1) hi = LEVELS - 1
          if (lo > hi) continue

          const x = i * step
          const y = j * step
          const x1 = x + step
          const y1 = y + step

          for (let l = lo; l <= hi; l++) {
            const level = min + (span * l) / LEVELS

            let code = 0
            if (tl > level) code |= 8
            if (tr > level) code |= 4
            if (br > level) code |= 2
            if (bl > level) code |= 1
            if (code === 0 || code === 15) continue

            const p = paths[l]
            const topX = x + step * ((level - tl) / (tr - tl || 1e-6))
            const rightY = y + step * ((level - tr) / (br - tr || 1e-6))
            const botX = x + step * ((level - bl) / (br - bl || 1e-6))
            const leftY = y + step * ((level - tl) / (bl - tl || 1e-6))

            switch (code) {
              case 1:
              case 14:
                p.moveTo(x, leftY)
                p.lineTo(botX, y1)
                break
              case 2:
              case 13:
                p.moveTo(botX, y1)
                p.lineTo(x1, rightY)
                break
              case 3:
              case 12:
                p.moveTo(x, leftY)
                p.lineTo(x1, rightY)
                break
              case 4:
              case 11:
                p.moveTo(topX, y)
                p.lineTo(x1, rightY)
                break
              case 6:
              case 9:
                p.moveTo(topX, y)
                p.lineTo(botX, y1)
                break
              case 7:
              case 8:
                p.moveTo(x, leftY)
                p.lineTo(topX, y)
                break
              case 5:
                p.moveTo(x, leftY)
                p.lineTo(topX, y)
                p.moveTo(botX, y1)
                p.lineTo(x1, rightY)
                break
              case 10:
                p.moveTo(x, leftY)
                p.lineTo(botX, y1)
                p.moveTo(topX, y)
                p.lineTo(x1, rightY)
                break
            }
          }
        }
      }

      for (let l = 1; l < LEVELS; l++) {
        ctx.strokeStyle = strokes[l]
        ctx.lineWidth = l % INDEX_EVERY === 0 ? 1.25 : 0.65
        ctx.stroke(paths[l])
      }
    }

    const shouldRun = () => visible && !scrolling && !reduced

    const frame = (now: number) => {
      if (!shouldRun()) {
        raf = 0
        return
      }
      if (now - last > FRAME_MS) {
        t += 0.004
        sample()
        draw()
        last = now
      }
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (!raf && shouldRun()) raf = requestAnimationFrame(frame)
    }

    const onScroll = () => {
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        scrolling = false
        start()
      }, SCROLL_IDLE_MS)
    }

    resize()
    sample()
    draw()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
      },
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    const ro = new ResizeObserver(() => {
      resize()
      sample()
      draw()
    })
    ro.observe(canvas)

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(scrollTimer)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [seed, intensity])

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />
}
