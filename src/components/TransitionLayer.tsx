import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

export type TransitionPrimitive = 'fan' | 'expand' | 'expand-reverse' | 'flip' | 'split' | 'open'
export type TransitionPhase = 'cover' | 'reveal'

export interface TransitionRect {
  left: number
  top: number
  width: number
  height: number
}

export interface TransitionSnapshot {
  markup: string
  rect: TransitionRect
}

export interface TransitionRun {
  id: number
  primitive: TransitionPrimitive
  phase: TransitionPhase
  fromPath: string
  toPath: string
  startedAt: number
  duration: number
  snapshot?: TransitionSnapshot
}

const DETAIL_ROUTE = /^\/works\/[^/]+$/

export function transitionPrimitive(fromPath: string, toPath: string): TransitionPrimitive {
  if (fromPath === '/' && toPath === '/works') return 'fan'
  if (fromPath === '/works' && DETAIL_ROUTE.test(toPath)) return 'expand'
  if (DETAIL_ROUTE.test(fromPath) && toPath === '/works') return 'expand-reverse'
  if (DETAIL_ROUTE.test(fromPath) && DETAIL_ROUTE.test(toPath)) return 'flip'
  if (toPath === '/about') return 'split'
  return 'open'
}

export const transitionTiming: Record<TransitionPrimitive, { duration: number; swap: number }> = {
  fan: { duration: 900, swap: 450 },
  expand: { duration: 560, swap: 0 },
  'expand-reverse': { duration: 560, swap: 0 },
  flip: { duration: 540, swap: 270 },
  split: { duration: 560, swap: 280 },
  open: { duration: 520, swap: 260 },
}

/**
 * Fan geometry, in screen coordinates.
 *
 * The first port kept the reference constants (radius 300 in a 100-unit box,
 * blade angle eased over "cover") and looked right in the source project — but
 * measured against pixels here, that mapping put almost the whole sweep into
 * the last half of the animation: 0% of the screen dark at cover 0.18, 18% at
 * cover 0.5, then everything at once. On video it read as a hard black flash,
 * which is precisely not the motion this fan exists to preserve.
 *
 * So the blade is now authored against the screen: the pivot sits at the
 * bottom-right corner, the far edge of the viewport subtends a known angular
 * range from that pivot, and the leading edge sweeps that range linearly. The
 * eye sees a constant-speed unfolding, and the beloved closing sweep plays at
 * the same pace in reverse.
 */
const RIBS = 9
/** angular range that the whole viewport occupies, seen from the corner pivot */
const SWEEP_FROM = -180
const SWEEP_TO = -90

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const easeInOut = (value: number) => value < 0.5
  ? 4 * value * value * value
  : 1 - ((-2 * value + 2) ** 3) / 2
const rad = (degrees: number) => (degrees * Math.PI) / 180

function fanPath(width: number, height: number, lead: number, trail: number): string {
  // pivot just outside the corner so the hub circle never shows a seam
  const cx = width
  const cy = height
  const R = Math.hypot(width, height) * 1.08
  const a0 = SWEEP_FROM + (SWEEP_TO - SWEEP_FROM) * trail
  const a1 = SWEEP_FROM + (SWEEP_TO - SWEEP_FROM) * lead
  if (a1 - a0 < 0.05) return `M${cx} ${cy}`
  const x0 = cx + Math.cos(rad(a0)) * R
  const y0 = cy + Math.sin(rad(a0)) * R
  const x1 = cx + Math.cos(rad(a1)) * R
  const y1 = cy + Math.sin(rad(a1)) * R
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`
}

function FanOccluder({ run }: { run: TransitionRun }) {
  const blade = useRef<SVGPathElement>(null)
  const ribs = useRef<Array<SVGLineElement | null>>([])
  const size = useRef({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const onResize = () => { size.current = { w: window.innerWidth, h: window.innerHeight } }
    window.addEventListener('resize', onResize)
    let frame = 0
    const draw = () => {
      const elapsed = performance.now() - run.startedAt
      const progress = clamp(elapsed / run.duration)
      // three phases: unfold 0..0.4, hold 0.4..0.6 (the route swaps under full
      // cover), fold 0.6..1. The leading edge moves with an eased sweep; the
      // trailing edge stays shut until the fold, so the close is the same
      // motion played from the other side — the part the client loves.
      const lead = easeInOut(clamp(progress / 0.4))
      const trail = easeInOut(clamp((progress - 0.6) / 0.4))
      const { w, h } = size.current
      blade.current?.setAttribute('d', fanPath(w, h, lead, trail))
      const cx = w
      const cy = h
      const R = Math.hypot(w, h) * 1.06
      ribs.current.forEach((line, index) => {
        const angle = SWEEP_FROM + ((SWEEP_TO - SWEEP_FROM) * (index + 0.5)) / RIBS
        const t = (angle - SWEEP_FROM) / (SWEEP_TO - SWEEP_FROM)
        const visible = t < lead && t > trail
        if (!line) return
        line.style.visibility = visible ? 'visible' : 'hidden'
        line.setAttribute('x1', String(cx))
        line.setAttribute('y1', String(cy))
        line.setAttribute('x2', String(cx + Math.cos(rad(angle)) * R))
        line.setAttribute('y2', String(cy + Math.sin(rad(angle)) * R))
      })
      if (progress < 1) frame = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [run.duration, run.id, run.startedAt])

  return (
    <svg className="transition-fan" width="100%" height="100%" preserveAspectRatio="none">
      <path ref={blade} fill="#000" d="M0 0" />
      {Array.from({ length: RIBS }, (_, index) => (
        <line
          key={index}
          ref={(node) => { ribs.current[index] = node }}
          x1={0}
          y1={0}
          x2={0}
          y2={0}
          stroke="#fff"
          strokeWidth="1.5"
          style={{ visibility: 'hidden' }}
        />
      ))}
    </svg>
  )
}

function PanelTransition({ type, phase }: { type: 'split' | 'open'; phase: TransitionPhase }) {
  return (
    <div className={`transition-panels transition-panels--${type} is-${phase}`}>
      <i /><i />
    </div>
  )
}

function rectStyle(rect: TransitionRect): CSSProperties {
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
}

function SharedFrame({ run }: { run: TransitionRun }) {
  const [target, setTarget] = useState<TransitionRect | null>(null)
  const [moving, setMoving] = useState(false)

  useLayoutEffect(() => {
    const element = document.querySelector<HTMLElement>('[data-transition-media]')
    if (!element || !run.snapshot) return

    const rect = element.getBoundingClientRect()
    const next = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    element.classList.add('is-transition-target')
    setTarget(next)
    const frame = requestAnimationFrame(() => setMoving(true))

    return () => {
      cancelAnimationFrame(frame)
      element.classList.remove('is-transition-target')
    }
  }, [run.id, run.snapshot])

  if (!run.snapshot) return null
  const rect = moving && target ? target : run.snapshot.rect

  return (
    <div
      className={`transition-shared-frame${moving ? ' is-moving' : ''}`}
      style={rectStyle(rect)}
      dangerouslySetInnerHTML={{ __html: run.snapshot.markup }}
    />
  )
}

export function TransitionLayer({ run }: { run: TransitionRun | null }) {
  if (!run) return <div className="transition-layer" aria-hidden="true" />

  return (
    <div className={`transition-layer transition-layer--${run.primitive}`} aria-hidden="true">
      {run.primitive === 'fan' && <FanOccluder run={run} />}
      {run.primitive === 'split' && <PanelTransition type="split" phase={run.phase} />}
      {run.primitive === 'open' && <PanelTransition type="open" phase={run.phase} />}
      {(run.primitive === 'expand' || run.primitive === 'expand-reverse') && <SharedFrame run={run} />}
    </div>
  )
}
