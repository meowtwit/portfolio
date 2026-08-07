import { useRef, useState, type KeyboardEvent } from 'react'
import { works } from '../data/works'
import { A } from '../router/A'
import { WorkPreviewPane } from './WorkPreviewPane'

const ALL_GROUPS = 'すべて'
const groups = [ALL_GROUPS, 'AI・学習', 'プロダクト・ツール', '表現・身体'] as const

export function WorksIndex({ initialSlug }: { initialSlug?: string | null }) {
  const initialIndex = Math.max(0, works.findIndex((work) => work.slug === initialSlug))
  const [selectedSlug, setSelectedSlug] = useState(works[initialIndex].slug)
  const [selectedGroup, setSelectedGroup] = useState<string>(ALL_GROUPS)
  const rowRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const groupRefs = useRef<Array<HTMLButtonElement | null>>([])
  const filteredWorks = selectedGroup === ALL_GROUPS
    ? works
    : works.filter((work) => work.group === selectedGroup)
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
        ? groups.length - 1
        : (next + groups.length) % groups.length
    groupRefs.current[index]?.focus()
  }

  const selectGroup = (group: string) => {
    const nextWorks = group === ALL_GROUPS
      ? works
      : works.filter((work) => work.group === group)
    setSelectedGroup(group)
    if (!nextWorks.some((work) => work.slug === selectedSlug)) setSelectedSlug(nextWorks[0].slug)
  }

  return (
    <>
      <section className="work-filters" aria-labelledby="work-filter-title">
        <div className="work-filters__label" id="work-filter-title">GROUP / FILTER</div>
        <div className="work-filter-chips" role="group" aria-label="作品グループ">
          {groups.map((group, index) => (
            <button
              key={group}
              ref={(node) => { groupRefs.current[index] = node }}
              type="button"
              aria-pressed={selectedGroup === group}
              className="work-filter-chip"
              onClick={() => selectGroup(group)}
              onKeyDown={(event) => moveCategory(event, index + (event.key === 'ArrowLeft' ? -1 : 1))}
            >
              {group}
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
