import { useEffect, useRef } from 'react'
import { A } from '../router/A'

export function HeroCanvas() {
  const root = useRef<HTMLElement>(null)
  const progressArc = useRef<SVGPathElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const range = Math.max(1, Math.min(window.innerHeight * 0.72, root.current?.offsetHeight ?? window.innerHeight))
      const progress = reduced ? 1 : Math.max(0, Math.min(1, window.scrollY / range))
      progressArc.current?.style.setProperty('--arc-progress', String(1 - progress))
    }
    const requestUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <section ref={root} className="hero-canvas" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span>01</span> STRUCTURE INTO MOTION</p>
        <h1 id="hero-title">考えた仕組みを、<br />動くところまでつくる。</h1>
        <p className="hero-fields">AI <i /> SOFTWARE <i /> PHYSICAL SYSTEMS</p>
        <A className="primary-cta" href="/works">
          <span>作品を見る</span><span aria-hidden="true">— 12</span>
        </A>
      </div>
      <div className="hero-instrument" aria-hidden="true">
        <svg viewBox="0 0 640 640">
          <rect x="80" y="80" width="480" height="480" fill="none" stroke="currentColor" />
          <circle cx="320" cy="320" r="180" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="320" cy="320" r="90" fill="none" stroke="currentColor" />
          <path d="M320 40V600M40 320H600" stroke="currentColor" />
          <path d="M158 158L482 482M482 158L158 482" stroke="currentColor" />
          <path d="M320 140L500 320L320 500L140 320Z" fill="white" stroke="currentColor" strokeWidth="4" />
          <path d="M320 140V500M140 320H500" stroke="currentColor" strokeWidth="3" />
          <circle cx="320" cy="320" r="20" fill="currentColor" />
          <path className="hero-arc-guide" d="M320 80A240 240 0 0 1 320 560" fill="none" stroke="currentColor" strokeWidth="2" />
          <path ref={progressArc} className="hero-progress-arc" pathLength="1" d="M320 80A240 240 0 0 1 320 560" fill="none" stroke="currentColor" strokeWidth="9" />
          <text x="92" y="66">INPUT</text><text x="548" y="590" textAnchor="end">OUTPUT</text>
        </svg>
        <div className="instrument-caption"><span>THINK</span><span>BUILD</span><span>RUN</span></div>
      </div>
      <div className="hero-index" aria-hidden="true"><span>SCROLL</span><b>↓</b></div>
    </section>
  )
}
