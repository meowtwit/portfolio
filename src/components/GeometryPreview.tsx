import type { Work } from '../data/works'

export function GeometryPreview({ work, compact = false }: { work: Work; compact?: boolean }) {
  const index = Number(work.id)
  const mode = index % 4
  const grid = Array.from({ length: compact ? 6 : 10 }, (_, i) => i)

  return (
    <div className={`geometry-preview mode-${mode}`} aria-hidden="true">
      <svg viewBox="0 0 800 460" preserveAspectRatio="xMidYMid meet">
        <rect x="1" y="1" width="798" height="458" fill="none" stroke="currentColor" />
        {grid.map((value) => (
          <g key={value}>
            <line x1={80 + value * 64} y1="70" x2={80 + value * 64} y2="390" className="guide" />
            <line x1="80" y1={70 + value * 32} x2="720" y2={70 + value * 32} className="guide" />
          </g>
        ))}
        {mode === 0 && <>
          <circle cx="400" cy="230" r={60 + index * 3} fill="none" stroke="currentColor" />
          <path d="M160 330 Q400 60 640 330" fill="none" stroke="currentColor" strokeWidth="3" />
          <line x1="400" y1="55" x2="400" y2="405" stroke="currentColor" strokeWidth="3" />
        </>}
        {mode === 1 && <>
          <path d="M145 350 L400 76 L655 350 Z" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M145 110 L400 384 L655 110 Z" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="400" cy="230" r="34" fill="white" stroke="currentColor" strokeWidth="3" />
        </>}
        {mode === 2 && <>
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={210 + i * 95} cy={230 + (i % 2 ? -72 : 72)} r={18 + i * 5} fill={i === 4 ? 'currentColor' : 'white'} stroke="currentColor" strokeWidth="3" />)}
          <path d="M145 230 C245 20 555 440 655 230" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M145 230 C245 440 555 20 655 230" fill="none" stroke="currentColor" strokeWidth="3" />
        </>}
        {mode === 3 && <>
          <path d="M155 350 A245 245 0 0 1 645 350" fill="none" stroke="currentColor" strokeWidth="3" />
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1="400" y1="350" x2={190 + i * 84} y2={105 + Math.abs(2.5 - i) * 16} stroke="currentColor" strokeWidth="3" />)}
          <circle cx="400" cy="350" r="28" fill="currentColor" />
        </>}
        <text x="28" y="42" className="svg-code">SYSTEM / {work.id.padStart(2, '0')}</text>
        <text x="772" y="430" textAnchor="end" className="svg-code">{work.category.toUpperCase()}</text>
      </svg>
    </div>
  )
}
