import { useRef, useState, type KeyboardEvent } from 'react'
import { works } from '../data/works'
import { A } from '../router/A'
import { WorkPreviewPane } from './WorkPreviewPane'

export function WorksIndex() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const rowRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const selected = works[selectedIndex]

  const move = (event: KeyboardEvent<HTMLAnchorElement>, next: number) => {
    event.preventDefault()
    const index = (next + works.length) % works.length
    setSelectedIndex(index)
    rowRefs.current[index]?.focus()
  }

  return (
    <div className="works-explorer">
      <section className="works-table" aria-label="作品索引">
        <div className="works-table__head" aria-hidden="true">
          <span>No.</span><span>タイトル</span><span>カテゴリ</span><span>年</span>
        </div>
        <div className="works-table__body">
          {works.map((work, index) => (
            <A
              key={work.id}
              ref={(node) => { rowRefs.current[index] = node }}
              href={`/works/${work.slug}`}
              className={`work-row${index === selectedIndex ? ' is-selected' : ''}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
              aria-label={`${work.id} ${work.title}、${work.category}、${work.year}年`}
              onMouseEnter={() => setSelectedIndex(index)}
              onFocus={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') move(event, index + 1)
                if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') move(event, index - 1)
                if (event.key === 'Home') move(event, 0)
                if (event.key === 'End') move(event, works.length - 1)
              }}
            >
              <span>{work.id}</span><strong>{work.title}</strong><span>{work.category}</span><span>{work.year}</span>
            </A>
          ))}
        </div>
        <div className="works-table__foot"><span>↑↓ SELECT / ENTER OPEN</span><strong>全12件</strong></div>
      </section>
      <WorkPreviewPane work={selected} />
    </div>
  )
}
