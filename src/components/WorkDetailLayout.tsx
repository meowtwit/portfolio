import type { Work } from '../data/works'
import { works } from '../data/works'
import { A } from '../router/A'

function WorkMedia({ work }: { work: Work }) {
  if (work.coverImage) return <img className="work-cover" src={work.coverImage} alt={`${work.title}の制作画像`} />
  return (
    <div className="work-cover-placeholder" role="img" aria-label={`${work.title}の画像は準備中です`}>
      <svg viewBox="0 0 1200 675" preserveAspectRatio="none" aria-hidden="true">
        <rect x="1" y="1" width="1198" height="673" fill="none" stroke="currentColor" />
        <line x1="1" y1="1" x2="1199" y2="674" stroke="currentColor" />
        <line x1="1199" y1="1" x2="1" y2="674" stroke="currentColor" />
        <path d="M0 44H42M44 0V42M1200 44H1158M1156 0V42M0 631H42M44 675V633M1200 631H1158M1156 675V633" stroke="currentColor" strokeWidth="3" />
      </svg>
      <span>NO IMAGE YET</span><small>MEDIA SLOT / {work.id}</small>
    </div>
  )
}

export function WorkDetailLayout({ work }: { work: Work }) {
  const index = works.findIndex((item) => item.id === work.id)
  const previous = works[(index - 1 + works.length) % works.length]
  const next = works[(index + 1) % works.length]

  return (
    <main id="main" className="work-detail" tabIndex={-1}>
      <div className="detail-breadcrumb"><A href="/works">作品一覧</A><span>/</span><span>{work.title}</span></div>
      <article>
        <header className="work-hero">
          <div className="work-hero__title">
            <p className="eyebrow"><span>{work.id}</span> WORK DETAIL</p>
            <h1>{work.title}</h1>
            <p className="work-hero__claim">{work.shortDescription}</p>
          </div>
          <WorkMedia work={work} />
          <div className="work-meta" aria-label="作品情報">
            <span>{work.year}</span><span>{work.category}</span><span>{work.role}</span>
          </div>
        </header>

        <div className="detail-section-list">
          {work.sections.map((section, index) => (
            <section className="detail-section" key={section.key} aria-labelledby={`${work.slug}-${section.key}`}>
              <div className="detail-section__number">{String(index + 1).padStart(2, '0')}</div>
              <header>
                <p>{section.title}</p>
                <h2 id={`${work.slug}-${section.key}`}>{section.lead}</h2>
              </header>
              <div className="detail-section__body">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.facts && (
                <ul className="detail-facts" aria-label="実測値">
                  {section.facts.map((fact) => <li key={fact}>{fact}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        {work.links.length > 0 && (
          <div className="work-links"><span>LINKS</span>{work.links.map((link) => <a key={link.label} href={link.href}>{link.label} ↗</a>)}</div>
        )}

        <nav className="prev-next" aria-label="作品間ナビゲーション">
          <A href={`/works/${previous.slug}`}><small>← 前の作品</small><strong>{previous.title}</strong></A>
          <A href="/works"><small>INDEX</small><strong>作品一覧へ戻る</strong></A>
          <A href={`/works/${next.slug}`}><small>次の作品 →</small><strong>{next.title}</strong></A>
        </nav>
      </article>
    </main>
  )
}
