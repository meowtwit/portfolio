import { useRef } from 'react'
import { useFrameEffect, setVisible } from '../lib/frame'
import { span, ease } from '../lib/scroll'
import { BEAT } from '../lib/beats'

/**
 * 技法03 — 遮蔽物で隠して差し替える
 *
 * A folding fan opens across the frame, and when it closes the stage behind it
 * has changed. In the reference the occluder is always a prop belonging to the
 * scene — a fan, a plume of smoke — never a graphic panel, which is why it
 * reads as something happening rather than something applied.
 *
 * The blade is drawn as one solid sector rather than a stack of leaves, so the
 * coverage is guaranteed by arithmetic instead of by hoping overlapping wedges
 * happen to meet. The ribs are then cut back out of it in paper, which is what
 * makes it read as a fan and not as a wipe.
 */

/** the pivot is the bottom-right corner of the frame, in viewBox units */
const CX = 100
const CY = 100
/** far past the far corner of any viewport */
const R = 300
/** widest half-angle of the open fan, degrees */
const HALF = 62
const RIBS = 9

const rad = (deg: number) => (deg * Math.PI) / 180
const px = (deg: number, r = R) => CX + Math.cos(rad(deg)) * r
const py = (deg: number, r = R) => CY + Math.sin(rad(deg)) * r

function sector(centre: number, half: number): string {
  const a0 = centre - half
  const a1 = centre + half
  const large = half * 2 > 180 ? 1 : 0
  return `M${CX} ${CY} L${px(a0)} ${py(a0)} A${R} ${R} 0 ${large} 1 ${px(a1)} ${py(a1)} Z`
}

export function Occlude() {
  const root = useRef<HTMLDivElement>(null)
  const blade = useRef<SVGPathElement>(null)
  const ribs = useRef<(SVGLineElement | null)[]>([])

  useFrameEffect((t) => {
    const [a, b] = BEAT.occlude
    const on = t > a - 0.015 && t < b + 0.015
    setVisible(root.current, on)
    if (!on) return

    const open = ease.inOut(span(t, a, a + (b - a) * 0.42))
    const close = ease.inOut(span(t, a + (b - a) * 0.56, b))
    const cover = open - close

    // swings from off the lower right up to the diagonal, opening as it goes.
    // At full cover the sector spans −197°..−73°, which contains the entire
    // −180°..−90° quadrant the viewport occupies from this pivot.
    const centre = -22 - cover * 113
    const half = cover * HALF

    if (blade.current) blade.current.setAttribute('d', sector(centre, half))

    ribs.current.forEach((l, i) => {
      if (!l) return
      const k = (i / (RIBS - 1)) * 2 - 1 // -1..1
      const ang = centre + k * half * 0.94
      l.setAttribute('x2', String(px(ang, R * 0.98)))
      l.setAttribute('y2', String(py(ang, R * 0.98)))
      l.style.opacity = cover > 0.12 ? '1' : '0'
    })
  })

  return (
    <div className="layer" ref={root}>
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <path ref={blade} className="ink" d={sector(-22, 0)} />
        {/* the ribs, cut back out in paper so the blade reads as a folding fan */}
        {Array.from({ length: RIBS }, (_, i) => (
          <line
            key={i}
            ref={(el) => {
              ribs.current[i] = el
            }}
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY}
            stroke="var(--paper)"
            strokeWidth="0.55"
            style={{ opacity: 0 }}
          />
        ))}
      </svg>
    </div>
  )
}
