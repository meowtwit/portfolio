import { useRef, useState, type KeyboardEvent } from 'react'
import { works } from '../data/works'
import { A } from '../router/A'
import { WorkPreviewPane } from './WorkPreviewPane'

const ALL_CATEGORIES = 'すべて'
const categories = [ALL_CATEGORIES, ...new Set(works.map((work) => work.category))]

export function WorksIndex({ initialSlug }: { initialSlug?: string | null }) {
  const initialIndex = Math.max(0, works.findIndex((work) => work.slug === initialSlug))
  const [selectedSlug, setSelectedSlug] = useState(works[initialIndex].slug)
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)
  const rowRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const categoryRefs = useRef<Array<HTMLButtonElement | null>>([])
  const filteredWorks = selectedCategory === ALL_CATEGORIES
    ? works
    : works.filter((work) => work.category === selectedCategory)
  const selected = filteredWorks.find((work) => work.slug === selectedSlug) ?? filteredWorks[0]

  const move = (event: KeyboardEvent<HTMLAnchorElement>, next: number) => {
    event.preventDefault()
    const index = (next + filteredWorks.length) % filteredWorks.length
    setSelectedSlug(filteredWorks[index].slug)
    rowRefs.current[index]?.focus()
  }

  const moveCategory = (event: KeyboardEvent<HTMLButtonElement>, next: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const index = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? categories.length - 1
        : (next + categories.length) % categories.length
    categoryRefs.current[index]?.focus()
  }

  const selectCategory = (category: string) => {
    const nextWorks = category === ALL_CATEGORIES
      ? works
      : works.filter((work) => work.category === category)
    setSelectedCategory(category)
    if (!nextWorks.some((work) => work.slug === selectedSlug)) setSelectedSlug(nextWorks[0].slug)
  }

  return (
    <>
      <section className="work-filters" aria-labelledby="work-filter-title">
        <div className="work-filters__label" id="work-filter-title">CATEGORY / FILTER</div>
        <div className="work-filter-chips" role="group" aria-label="作品カテゴリ">
          {categories.map((category, index) => (
            <button
              key={category}
              ref={(node) => { categoryRefs.current[index] = node }}
              type="button"
              aria-pressed={selectedCategory === category}
              className="work-filter-chip"
              onClick={() => selectCategory(category)}
              onKeyDown={(event) => moveCategory(event, index + (event.key === 'ArrowLeft' ? -1 : 1))}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div className="works-explorer">
        <section className="works-table" aria-label="作品索引" aria-live="polite">
          <div className="works-table__head" aria-hidden="true">
            <span>No.</span><span>タイトル</span><span>カテゴリ</span><span>年</span>
          </div>
          <div className="works-table__body">
            {filteredWorks.map((work, index) => (
              <A
                key={work.id}
                ref={(node) => { rowRefs.current[index] = node }}
                href={`/works/${work.slug}`}
                className={`work-row${work.slug === selected.slug ? ' is-selected' : ''}`}
                aria-current={work.slug === selected.slug ? 'true' : undefined}
                aria-label={`${work.id} ${work.title}、${work.category}、${work.year}年`}
                onMouseEnter={() => setSelectedSlug(work.slug)}
                onFocus={() => setSelectedSlug(work.slug)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') move(event, index + 1)
                  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') move(event, index - 1)
                  if (event.key === 'Home') move(event, 0)
                  if (event.key === 'End') move(event, filteredWorks.length - 1)
                }}
              >
                <span>{work.id}</span><strong>{work.title}</strong><span>{work.category}</span><span>{work.year}</span>
              </A>
            ))}
          </div>
          <div className="works-table__foot"><span>↑↓ SELECT / ENTER OPEN</span><strong>{filteredWorks.length} / {works.length}件</strong></div>
        </section>
        <WorkPreviewPane work={selected} />
      </div>
    </>
  )
}
