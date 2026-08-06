export interface HistoryLocation {
  path: string
  key: string
  scrollY?: number
}

export interface BrowserHistory {
  current(): HistoryLocation
  push(path: string): HistoryLocation
  replace(path: string): HistoryLocation
  listen(listener: (location: HistoryLocation) => void): () => void
}

let sequence = 0

const basePath = (() => {
  const normalized = `/${import.meta.env.BASE_URL || '/'}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '')
  return normalized === '' || normalized === '/' ? '' : normalized
})()

function nextKey(): string {
  sequence += 1
  return `${Date.now().toString(36)}-${sequence.toString(36)}`
}

export function stripBasePath(pathname: string): string {
  if (!basePath) return pathname || '/'
  if (pathname === basePath) return '/'
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || '/'
  return pathname || '/'
}

export function withBasePath(path: string): string {
  const url = new URL(path, window.location.origin)
  const pathname = stripBasePath(url.pathname)
  const browserPath = basePath ? `${basePath}${pathname === '/' ? '/' : pathname}` : pathname
  return `${browserPath}${url.search}${url.hash}`
}

function cleanPath(path: string): string {
  const url = new URL(path, window.location.href)
  return `${stripBasePath(url.pathname)}${url.search}${url.hash}`
}

export function createBrowserHistory(): BrowserHistory {
  const read = (): HistoryLocation => {
    const state = window.history.state as Partial<HistoryLocation> | null
    return {
      path: `${stripBasePath(window.location.pathname)}${window.location.search}${window.location.hash}`,
      key: typeof state?.key === 'string' ? state.key : nextKey(),
      scrollY: typeof state?.scrollY === 'number' ? state.scrollY : undefined,
    }
  }

  let location = read()
  window.history.replaceState({ ...window.history.state, key: location.key }, '', withBasePath(location.path))
  window.history.scrollRestoration = 'manual'

  const saveScroll = () => {
    location = { ...location, scrollY: window.scrollY }
    window.history.replaceState(location, '', withBasePath(location.path))
  }

  return {
    current: () => location,
    push(path) {
      saveScroll()
      location = { path: cleanPath(path), key: nextKey() }
      window.history.pushState(location, '', withBasePath(location.path))
      return location
    },
    replace(path) {
      location = { path: cleanPath(path), key: location.key }
      window.history.replaceState(location, '', withBasePath(location.path))
      return location
    },
    listen(listener) {
      const onPopState = () => {
        location = read()
        listener(location)
        requestAnimationFrame(() => window.scrollTo(0, location.scrollY ?? 0))
      }
      window.addEventListener('popstate', onPopState)
      return () => window.removeEventListener('popstate', onPopState)
    },
  }
}
