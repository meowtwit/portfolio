import { WorksIndex } from '../components/WorksIndex'

export function WorksPage({ initialSlug }: { initialSlug?: string | null }) {
  return (
    <main id="main" className="works-page" tabIndex={-1}>
      <header className="page-heading works-heading">
        <p className="eyebrow"><span>INDEX</span> COMPARE / SELECT / OPEN</p>
        <div><h1 tabIndex={-1}>作品</h1><p>見てほしい順に固定した12件。<br />カテゴリで絞り、行を選ぶと右側で要点を比較できます。</p></div>
      </header>
      <WorksIndex initialSlug={initialSlug} />
    </main>
  )
}
