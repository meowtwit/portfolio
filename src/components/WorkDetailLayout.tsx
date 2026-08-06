import { useEffect } from 'react'
import type { Work } from '../data/works'
import { works } from '../data/works'
import { A, useNavigate } from '../router/A'
import { GeometryPreview } from './GeometryPreview'

function WorkMedia({ work }: { work: Work }) {
  if (work.coverImage) return <img className="work-cover" data-transition-media src={work.coverImage} alt={`${work.title}の制作画像`} />
  return (
    <div className="detail-geometry-media" data-transition-media role="img" aria-label={`${work.title}の幾何プレビュー`}>
      <GeometryPreview work={work} />
    </div>
  )
}

export function WorkDetailLayout({ work }: { work: Work }) {
  const navigate = useNavigate()
  const index = works.findIndex((item) => item.id === work.id)
  const previous = works[(index - 1 + works.length) % works.length]
  const next = works[(index + 1) % works.length]

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      event.preventDefault()
      navigate('/works')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return (
    <main id="main" className="work-detail" tabIndex={-1}>
      <nav className="detail-breadcrumb" aria-label="パンくず"><A href="/works">作品一覧</A><span>/</span><span>{work.title}</span></nav>
      <article>
        <header className="work-hero">
          <div className="work-hero__title">
            <p className="eyebrow"><span>{work.id}</span> WORK DETAIL</p>
            <h1 tabIndex={-1}>{work.title}</h1>
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
