import { A } from '../router/A'

export function NotFoundPage() {
  return (
    <main id="main" className="not-found" tabIndex={-1}>
      <div className="not-found__geometry" aria-hidden="true"><span>4</span><i /><span>4</span></div>
      <p>PAGE NOT FOUND</p>
      <h1>この場所には、まだ何もありません。</h1>
      <A className="primary-cta" href="/">トップへ戻る <span>→</span></A>
    </main>
  )
}
