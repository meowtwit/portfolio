import { WorksIndex } from '../components/WorksIndex'

export function WorksPage() {
  return (
    <main id="main" className="works-page" tabIndex={-1}>
      <header className="page-heading works-heading">
        <p className="eyebrow"><span>INDEX</span> COMPARE / SELECT / OPEN</p>
        <div><h1>作品</h1><p>更新順ではなく、見てほしい順に固定した12件。<br />行を選ぶと、右側で要点を比較できます。</p></div>
      </header>
      <WorksIndex />
    </main>
  )
}
