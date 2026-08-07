import { A } from '../router/A'

const links = [
  { href: '/works', label: '作品', code: 'W' },
  { href: '/about', label: '人物', code: 'A' },
  { href: '/contact', label: '連絡', code: 'C' },
] as const

function isActive(pathname: string, href: string) {
  return href === '/works' ? pathname.startsWith('/works') : pathname === href
}

export function GlobalNav({ pathname }: { pathname: string }) {
  return (
    <header className="global-nav">
      <nav className="global-nav__inner" aria-label="主要ナビゲーション">
        <A className="global-nav__name" href="/" aria-current={pathname === '/' ? 'page' : undefined}>
          <span>早雲楓人</span>
        </A>
        <div className="global-nav__links">
          {links.map((link) => (
            <A
              key={link.href}
              className={`global-nav__link${isActive(pathname, link.href) ? ' is-active' : ''}`}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? 'page' : undefined}
            >
              <span>{link.label}</span><small aria-hidden="true">{link.code}</small>
            </A>
          ))}
        </div>
      </nav>
    </header>
  )
}
