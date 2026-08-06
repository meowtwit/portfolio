import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { WorkDetailLayout } from './components/WorkDetailLayout'
import { findWork } from './data/works'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { WorksPage } from './pages/WorksPage'
import { NavigationProvider } from './router/A'
import { createBrowserHistory } from './router/history'

const history = createBrowserHistory()

function pathnameFrom(path: string) {
  return new URL(path, window.location.origin).pathname.replace(/\/+$/, '') || '/'
}

export default function App() {
  const [location, setLocation] = useState(history.current())
  const pathname = pathnameFrom(location.path)

  useEffect(() => history.listen(setLocation), [])

  const navigate = useCallback((path: string) => {
    const next = history.push(path)
    setLocation(next)
    window.scrollTo(0, 0)
  }, [])

  const route = useMemo(() => {
    if (pathname === '/') return { title: '早雲楓人 — Portfolio', page: <HomePage /> }
    if (pathname === '/works') return { title: '作品 — 早雲楓人', page: <WorksPage /> }
    if (pathname === '/about') return { title: '人物 — 早雲楓人', page: <AboutPage /> }
    if (pathname === '/contact') return { title: '連絡 — 早雲楓人', page: <ContactPage /> }
    const match = pathname.match(/^\/works\/([^/]+)$/)
    if (match) {
      const work = findWork(decodeURIComponent(match[1]))
      if (work) return { title: `${work.title} — 早雲楓人`, page: <WorkDetailLayout work={work} /> }
    }
    return { title: '404 — 早雲楓人', page: <NotFoundPage /> }
  }, [pathname])

  useEffect(() => { document.title = route.title }, [route.title])

  return (
    <NavigationProvider navigate={navigate}>
      <AppShell pathname={pathname}>{route.page}</AppShell>
    </NavigationProvider>
  )
}
