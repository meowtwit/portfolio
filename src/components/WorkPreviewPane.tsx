import { useLayoutEffect, useRef, useState } from 'react'
import type { Work } from '../data/works'
import { A } from '../router/A'
import { withBasePath } from '../router/history'
import { WorkPlate } from './WorkPlate'

function PreviewVisual({ work }: { work: Work }) {
  if (work.coverImage) {
    return <img className="preview-cover" src={withBasePath(work.coverImage)} alt={`${work.title}の制作画像`} />
  }
  return <WorkPlate work={work} />
}

export function WorkPreviewPane({ work }: { work: Work }) {
  const latestWork = useRef(work)
  const clearTimer = useRef<number | null>(null)
  const [outgoing, setOutgoing] = useState<Work | null>(null)

  useLayoutEffect(() => {
    if (latestWork.current.id === work.id) return
    const previous = latestWork.current
    latestWork.current = work

    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOutgoing(null)
      return
    }

    setOutgoing(previous)
    clearTimer.current = window.setTimeout(() => {
      setOutgoing(null)
      clearTimer.current = null
    }, 145)
    return () => {
      if (clearTimer.current !== null) window.clearTimeout(clearTimer.current)
    }
  }, [work])

  return (
    <aside className="work-preview" aria-live="polite" aria-label={`${work.title}のプレビュー`}>
      <div className="work-preview__topline"><span>PREVIEW / {work.id}</span><span>{work.year}</span></div>
      <div className="preview-media-swap">
        {outgoing && <div className="preview-media-swap__out"><PreviewVisual work={outgoing} /></div>}
        <div key={work.id} data-transition-media className={outgoing ? 'preview-media-swap__in' : ''}><PreviewVisual work={work} /></div>
      </div>
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
