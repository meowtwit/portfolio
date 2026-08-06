import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { A } from '../router/A'

export function IntroScenes() {
  const domains = useRef<HTMLElement>(null)
  const breadth = useRef<HTMLElement>(null)
  const exit = useRef<HTMLElement>(null)
  const [domainState, setDomainState] = useState({ active: 0, tick: 0 })

  useEffect(() => {
    let frame = 0
    const clamp = (value: number) => Math.max(0, Math.min(1, value))
    const sceneProgress = (element: HTMLElement) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 1
      const rect = element.getBoundingClientRect()
      return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height))
    }
    const update = () => {
      if (domains.current) {
        const progress = sceneProgress(domains.current)
        domains.current.style.setProperty('--scene-progress', progress.toFixed(4))
        const active = Math.min(2, Math.floor(progress * 3))
        setDomainState((current) => active === current.active
          ? current
          : { active, tick: current.tick + 1 })
      }

      if (breadth.current) {
        const progress = sceneProgress(breadth.current)
        breadth.current.style.setProperty('--scene-progress', progress.toFixed(4))
        breadth.current.querySelectorAll<HTMLElement>('.breadth-item').forEach((item, index) => {
          const itemProgress = clamp((progress - index * 0.075) / 0.48)
          item.style.setProperty('--item-progress', Math.max(0.04, itemProgress).toFixed(4))
          item.style.setProperty('--item-shift', `${((1 - itemProgress) * 44).toFixed(2)}px`)
          item.style.setProperty('--item-mobile-shift', `${((1 - itemProgress) * -24).toFixed(2)}px`)
        })
      }

      if (exit.current) {
        const progress = sceneProgress(exit.current)
        const panelProgress = clamp(progress / 0.58)
        exit.current.style.setProperty('--scene-progress', progress.toFixed(4))
        exit.current.style.setProperty('--exit-panel-progress', Math.max(0.035, panelProgress).toFixed(4))
      }
    }
    const requestUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    motionPreference.addEventListener('change', requestUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      motionPreference.removeEventListener('change', requestUpdate)
    }
  }, [])

  const domainsList = [
    ['01', 'AI SYSTEMS', '探索・学習・評価'],
    ['02', 'SOFTWARE / AUTOMATION', 'プロダクト・運用'],
    ['03', 'PHYSICAL COMPUTING', '身体・環境・入力'],
  ] as const

  return (
    <div className="intro-scenes">
      <section ref={domains} className="intro-scene domains" aria-labelledby="domains-title">
        <header className="scene-header"><span>SCENE 02</span><h2 id="domains-title">制作領域</h2><p>同じ仕組みが、置かれる場所によって役割を変える。</p></header>
        <div className="domain-map">
          <svg
            className={domainState.tick === 0 ? '' : `domain-switch-${domainState.tick % 2 ? 'a' : 'b'}`}
            width="420"
            height="420"
            viewBox="0 0 420 420"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path className="domain-draw domain-draw--outer" pathLength="1" d="M210 36L374 210L210 384L46 210Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle className="domain-draw domain-draw--inner" pathLength="1" cx="210" cy="210" r="92" fill="none" stroke="currentColor" />
            <path className="domain-draw domain-draw--axes" pathLength="1" d="M210 36V384M46 210H374" stroke="currentColor" />
            <circle className="domain-core" cx="210" cy="210" r="13" fill="currentColor" />
          </svg>
          <ol aria-label="スクロール位置に対応する制作領域">
            {domainsList.map((domain, index) => (
              <li key={domain[0]} className={index === domainState.active ? 'is-active' : ''} aria-current={index === domainState.active ? 'step' : undefined}>
                <b>{domain[0]}</b><span>{domain[1]}</span><small>{domain[2]}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section ref={breadth} className="intro-scene breadth" aria-labelledby="breadth-title">
        <header className="scene-header"><span>SCENE 03</span><h2 id="breadth-title">活動の幅</h2><p>技術だけではなく、誰と・どこで・どう作るか。</p></header>
        <div className="breadth-axis" aria-label="活動領域">
          {['神山まるごと高専', 'AI開発', '共同創業', 'ロボティクス', 'ダンス・表現'].map((item, index) => (
            <div
              key={item}
              className="breadth-item"
              style={{ '--item-rest': index % 2 ? '28px' : '0px' } as CSSProperties}
            >
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>
            </div>
          ))}
          <div className="breadth-core" aria-hidden="true"><i /><i /></div>
        </div>
        <A className="text-link" href="/about">人物と経歴を詳しく見る <span>→</span></A>
      </section>

      <section ref={exit} className="intro-scene exit-scene" aria-labelledby="exit-title">
        <header className="scene-header"><span>SCENE 04</span><h2 id="exit-title">次に見るものを選ぶ</h2></header>
        <div className="exit-split">
          <A href="/works" className="exit-link exit-link--dark">
            <small>12 PROJECTS / INDEX</small><strong>作品を見る</strong><span aria-hidden="true">→</span>
          </A>
          <A href="/about" className="exit-link">
            <small>PROFILE / TIMELINE</small><strong>人物を知る</strong><span aria-hidden="true">→</span>
          </A>
        </div>
      </section>
    </div>
  )
}
