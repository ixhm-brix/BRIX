import { useEffect, useState } from 'react'

/**
 * How much of the screen the on-screen keyboard is covering.
 *
 * A `position: fixed` element is placed against the LAYOUT viewport, and `vh` units
 * measure it too. The on-screen keyboard shrinks the VISUAL viewport and leaves the
 * layout viewport alone — so a panel pinned to the bottom sits underneath the
 * keyboard, hiding the input you are typing into and the message you just sent.
 * That is the bug this exists to fix.
 *
 * `interactive-widget=resizes-content` in the viewport meta fixes it declaratively on
 * Chrome/Android, but iOS Safari ignores it, so we measure instead. `visualViewport`
 * is supported everywhere that matters; where it is missing the inset stays 0 and the
 * layout behaves exactly as it did before.
 */

export type KeyboardInset = {
  /** Pixels of the layout viewport hidden by the keyboard. 0 when closed. */
  inset: number
  /** Height of the currently visible area. */
  viewportHeight: number
  open: boolean
}

// Below this the shrink is browser chrome (URL bar collapsing), not a keyboard.
const KEYBOARD_THRESHOLD = 120

export function useKeyboardInset(): KeyboardInset {
  const [state, setState] = useState<KeyboardInset>(() => ({
    inset: 0,
    viewportHeight: typeof window === 'undefined' ? 0 : window.innerHeight,
    open: false,
  }))

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      // Coalesce: iOS fires resize and scroll together while the keyboard animates.
      frame = requestAnimationFrame(() => {
        // offsetTop matters on iOS, where the visual viewport can also be scrolled
        // up relative to the layout viewport rather than only shortened.
        const hidden = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
        setState({
          inset: hidden,
          viewportHeight: vv.height,
          open: hidden > KEYBOARD_THRESHOLD,
        })
      })
    }

    measure()
    vv.addEventListener('resize', measure)
    vv.addEventListener('scroll', measure)
    return () => {
      cancelAnimationFrame(frame)
      vv.removeEventListener('resize', measure)
      vv.removeEventListener('scroll', measure)
    }
  }, [])

  return state
}
