import type { Work } from '../data/works'

export function WorkPlate({ work }: { work: Work }) {
  return (
    <div className="work-plate" aria-hidden="true">
      <div className="work-plate__top"><span>WORK / No. {work.id}</span><span>{work.year}</span></div>
      <div className="work-plate__title"><span>No. {work.id}</span><strong>{work.title}</strong></div>
      <div className="work-plate__bottom"><span>CATEGORY</span><b>{work.category}</b></div>
    </div>
  )
}
