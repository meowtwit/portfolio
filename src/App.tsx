import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import {
  transitionPrimitive,
  transitionTiming,
  type TransitionRun,
  type TransitionSnapshot,
} from './components/TransitionLayer'
import { WorkDetailLayout } from './components/WorkDetailLayout'
import { findWork, works } from './data/works'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { WorksPage } from './pages/WorksPage'
import { NavigationProvider } from './router/A'
import { createBrowserHistory, withBasePath } from './router/history'

const history = createBrowserHistory()

function pathnameFrom(path: string) {
  return new URL(path, window.location.origin).pathname.replace(/\/+$/, '') || '/'
}

function detailSlug(pathname: string): string | null {
  const match = pathname.match(/^\/works\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

function captureTransitionMedia(): TransitionSnapshot | undefined {
  const element = document.querySelector<HTMLElement>('[data-transition-media]')
  if (!element) return undefined
  const clone = element.cloneNode(true) as HTMLElement
  clone.classList.remove('is-transition-target', 'preview-media-swap__in', 'preview-media-swap__out')

  const measured = element.getBoundingClientRect()
  const isVisible = measured.bottom > 0 && measured.top < window.innerHeight
    && measured.right > 0 && measured.left < window.innerWidth
  let rect = { left: measured.left, top: measured.top, width: measured.width, height: measured.height }

  if (!isVisible) {
    const width = Math.min(window.innerWidth * 0.72, 1120)
    const height = width * (measured.height / Math.max(measured.width, 1))
    rect = {
      left: (window.innerWidth - width) / 2,
      top: Math.max(88, (window.innerHeight - height) / 2),
      width,
      height,
    }
  }

  return { markup: clone.outerHTML, rect }
}

export default function App() {
  const initialLocation = useMemo(() => history.current(), [])
  const [displayedLocation, setDisplayedLocation] = useState(initialLocation)
  const [navigationLocation, setNavigationLocation] = useState(initialLocation)
  const [transition, setTransition] = useState<TransitionRun | null>(null)
  const [worksSelection, setWorksSelection] = useState(() => detailSlug(pathnameFrom(initialLocation.path)))
  const displayedRef = useRef(initialLocation)
  const timersRef = useRef<number[]>([])
  const runIdRef = useRef(0)
  const pathname = pathnameFrom(displayedLocation.path)
  const navigationPathname = pathnameFrom(navigationLocation.path)

  const clearRun = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }, [])

  const commitLocation = useCallback((next: ReturnType<typeof history.current>, restoreScroll: boolean) => {
    const nextPathname = pathnameFrom(next.path)
    const slug = detailSlug(nextPathname)
    if (slug) setWorksSelection(slug)

    displayedRef.current = next
    window.scrollTo(0, restoreScroll ? next.scrollY ?? 0 : 0)
    setDisplayedLocation(next)
    requestAnimationFrame(() => window.scrollTo(0, restoreScroll ? next.scrollY ?? 0 : 0))
  }, [])

  const beginTransition = useCallback((next: ReturnType<typeof history.current>, restoreScroll: boolean) => {
    clearRun()
    const from = displayedRef.current
    const fromPath = pathnameFrom(from.path)
    const toPath = pathnameFrom(next.path)

    if (fromPath === toPath || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTransition(null)
      commitLocation(next, restoreScroll)
      return
    }

    let primitive = transitionPrimitive(fromPath, toPath)
    let snapshot = primitive === 'expand' || primitive === 'expand-reverse'
      ? captureTransitionMedia()
      : undefined
    if ((primitive === 'expand' || primitive === 'expand-reverse') && !snapshot) {
      primitive = 'open'
      snapshot = undefined
    }

    runIdRef.current += 1
    const id = runIdRef.current
    const timing = transitionTiming[primitive]
    const run: TransitionRun = {
      id,
      primitive,
      phase: timing.swap === 0 ? 'reveal' : 'cover',
      fromPath,
      toPath,
      startedAt: performance.now(),
      duration: timing.duration,
      snapshot,
    }
    setTransition(run)

    if (timing.swap === 0) {
      commitLocation(next, restoreScroll)
    } else {
      timersRef.current.push(window.setTimeout(() => {
        commitLocation(next, restoreScroll)
        setTransition((current) => current?.id === id ? { ...current, phase: 'reveal' } : current)
      }, timing.swap))
    }

    timersRef.current.push(window.setTimeout(() => {
      setTransition((current) => current?.id === id ? null : current)
      timersRef.current = []
    }, timing.duration))
  }, [clearRun, commitLocation])

  useEffect(() => history.listen((next) => {
    setNavigationLocation(next)
    beginTransition(next, true)
  }), [beginTransition])

  useEffect(() => {
    if (!transition) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stopMotion = (event: MediaQueryListEvent) => {
      if (!event.matches) return
      clearRun()
      setTransition(null)
      commitLocation(history.current(), true)
    }
    preference.addEventListener('change', stopMotion)
    return () => preference.removeEventListener('change', stopMotion)
  }, [clearRun, commitLocation, transition])

  useEffect(() => () => clearRun(), [clearRun])

  const navigate = useCallback((path: string) => {
    const requested = new URL(path, window.location.href)
    const current = new URL(history.current().path, window.location.origin)
    if (`${requested.pathname}${requested.search}${requested.hash}` === `${current.pathname}${current.search}${current.hash}`) return
    const next = history.push(path)
    setNavigationLocation(next)
    beginTransition(next, false)
  }, [beginTransition])

  const route = useMemo(() => {
    if (pathname === '/') return {
      title: '早雲楓人 — Portfolio',
      description: '早雲楓人のポートフォリオ。AI、ソフトウェア、フィジカルシステムを、現場で動く形まで実装した制作記録。',
      noindex: false,
      page: <HomePage />,
    }
    if (pathname === '/works') return {
      title: '作品 — 早雲楓人',
      description: `早雲楓人の作品${works.length}件。AI、ソフトウェア、オートメーション、ロボティクスなどの設計・実装・検証を紹介します。`,
      noindex: false,
      page: <WorksPage initialSlug={worksSelection} />,
    }
    if (pathname === '/about') return {
      title: '人物 — 早雲楓人',
      description: '神山まるごと高専で学ぶ早雲楓人のプロフィール、制作領域、活動・経歴。',
      noindex: false,
      page: <AboutPage />,
    }
    if (pathname === '/contact') return {
      title: '連絡 — 早雲楓人',
      description: '早雲楓人への制作、開発、研究に関する問い合わせフォーム、連絡先、外部リンク。',
      noindex: false,
      page: <ContactPage />,
    }
    const match = pathname.match(/^\/works\/([^/]+)$/)
    if (match) {
      const work = findWork(decodeURIComponent(match[1]))
      if (work) return { title: `${work.title} — 早雲楓人`, description: work.shortDescription, noindex: false, page: <WorkDetailLayout work={work} /> }
    }
    return {
      title: '404 — 早雲楓人',
      description: '指定されたページは見つかりませんでした。早雲楓人のポートフォリオトップへ戻れます。',
      noindex: true,
      page: <NotFoundPage />,
    }
  }, [pathname, worksSelection])

  useEffect(() => {
    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.append(element)
      }
      element.content = content
    }

    document.title = route.title
    setMeta('meta[name="description"]', 'name', 'description', route.description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', route.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', route.description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', detailSlug(pathname) ? 'article' : 'website')
    setMeta('meta[name="robots"]', 'name', 'robots', route.noindex ? 'noindex, follow' : 'index, follow')

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const canonicalOrigin = canonical ? new URL(canonical.href).origin : window.location.origin
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = new URL(withBasePath(pathname), canonicalOrigin).href
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical.href)
  }, [pathname, route.description, route.noindex, route.title])

  const initialFocus = useRef(true)
  useEffect(() => {
    if (initialFocus.current) {
      initialFocus.current = false
      return
    }
    const frame = requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('#main h1')?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [displayedLocation.key])

  return (
    <NavigationProvider navigate={navigate}>
      <AppShell pathname={navigationPathname} routeKey={displayedLocation.key} transition={transition}>
        {route.page}
      </AppShell>
    </NavigationProvider>
  )
}
