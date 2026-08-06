import { createContext, forwardRef, useContext, type AnchorHTMLAttributes, type ReactNode } from 'react'

type Navigate = (path: string) => void

const NavigationContext = createContext<Navigate | null>(null)

export function NavigationProvider({ navigate, children }: { navigate: Navigate; children: ReactNode }) {
  return <NavigationContext.Provider value={navigate}>{children}</NavigationContext.Provider>
}

export function useNavigate(): Navigate {
  const navigate = useContext(NavigationContext)
  if (!navigate) throw new Error('useNavigate must be used inside NavigationProvider')
  return navigate
}

export const A = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function A(
  { href, onClick, target, ...props },
  ref,
) {
  const navigate = useContext(NavigationContext)

  return (
    <a
      ref={ref}
      {...props}
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event)
        if (
          event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
          event.shiftKey || event.altKey || target === '_blank' || !href || navigate === null
        ) return

        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return
        event.preventDefault()
        navigate(`${url.pathname}${url.search}${url.hash}`)
      }}
    />
  )
})
