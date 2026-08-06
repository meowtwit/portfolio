import type { ReactNode } from 'react'
import { GlobalNav } from './GlobalNav'
import { TransitionLayer, type TransitionRun } from './TransitionLayer'

function routeMotionClass(run: TransitionRun | null): string {
  if (!run) return ''
  if (run.primitive === 'flip') return run.phase === 'cover' ? ' route-stage--flip-out' : ' route-stage--flip-in'
  if (run.primitive === 'split' && run.phase === 'reveal') return ' route-stage--split-in'
  return ''
}

export function AppShell({
  pathname,
  routeKey,
  transition,
  children,
}: {
  pathname: string
  routeKey: string
  transition: TransitionRun | null
  children: ReactNode
}) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">本文へ移動</a>
      <GlobalNav pathname={pathname} />
      <div className="route-viewport">
        <div key={routeKey} className={`route-stage${routeMotionClass(transition)}`}>{children}</div>
      </div>
      <TransitionLayer run={transition} />
    </div>
  )
}
