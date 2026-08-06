import type { ReactNode } from 'react'
import { GlobalNav } from './GlobalNav'
import { TransitionLayer } from './TransitionLayer'

export function AppShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">本文へ移動</a>
      <GlobalNav pathname={pathname} />
      {children}
      <TransitionLayer />
    </div>
  )
}
