import type { Work } from '../data/works'
import { A } from '../router/A'
import { GeometryPreview } from './GeometryPreview'

export function WorkPreviewPane({ work }: { work: Work }) {
  return (
    <aside className="work-preview" aria-live="polite" aria-label={`${work.title}のプレビュー`}>
      <div className="work-preview__topline"><span>PREVIEW / {work.id}</span><span>{work.year}</span></div>
      <GeometryPreview work={work} />
      <div className="work-preview__heading">
        <p>{work.category}</p>
        <h2>{work.title}</h2>
      </div>
      <p className="work-preview__description">{work.shortDescription}</p>
      <dl className="preview-specs">
        <div><dt>担当範囲</dt><dd>{work.role}</dd></div>
        <div><dt>使用技術</dt><dd>{work.tech.join(' / ')}</dd></div>
        <div><dt>year</dt><dd>{work.year}</dd></div>
      </dl>
      <A className="preview-detail-link" href={`/works/${work.slug}`}>詳細を読む <span aria-hidden="true">→</span></A>
    </aside>
  )
}
