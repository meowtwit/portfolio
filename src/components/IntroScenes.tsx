import { A } from '../router/A'

export function IntroScenes() {
  return (
    <div className="intro-scenes">
      <section className="intro-scene domains" aria-labelledby="domains-title">
        <header className="scene-header"><span>SCENE 02</span><h2 id="domains-title">制作領域</h2><p>同じ仕組みが、置かれる場所によって役割を変える。</p></header>
        <div className="domain-map">
          <svg viewBox="0 0 420 420" aria-hidden="true">
            <path d="M210 36L374 210L210 384L46 210Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="210" cy="210" r="92" fill="none" stroke="currentColor" />
            <path d="M210 36V384M46 210H374" stroke="currentColor" />
            <circle cx="210" cy="210" r="13" fill="currentColor" />
          </svg>
          <ol>
            <li><b>01</b><span>AI SYSTEMS</span><small>探索・学習・評価</small></li>
            <li><b>02</b><span>SOFTWARE / AUTOMATION</span><small>プロダクト・運用</small></li>
            <li><b>03</b><span>PHYSICAL COMPUTING</span><small>身体・環境・入力</small></li>
          </ol>
        </div>
      </section>

      <section className="intro-scene breadth" aria-labelledby="breadth-title">
        <header className="scene-header"><span>SCENE 03</span><h2 id="breadth-title">活動の幅</h2><p>技術だけではなく、誰と・どこで・どう作るか。</p></header>
        <div className="breadth-axis" aria-label="活動領域">
          {['神山まるごと高専', 'AI開発', '共同創業', 'ロボティクス', 'ダンス・表現'].map((item, index) => (
            <div key={item} className="breadth-item"><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></div>
          ))}
          <div className="breadth-core" aria-hidden="true"><i /><i /></div>
        </div>
        <A className="text-link" href="/about">人物と経歴を詳しく見る <span>→</span></A>
      </section>

      <section className="intro-scene exit-scene" aria-labelledby="exit-title">
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
