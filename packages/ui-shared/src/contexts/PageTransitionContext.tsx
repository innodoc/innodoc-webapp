import type { ComponentType, PropsWithChildren } from 'react'
import { createContext, useCallback, useRef, useState } from 'react'

interface PageTransitionContextValue {
  pagePrev: ComponentType | null
  setPagePrev: (page: ComponentType) => void
}

const PageTransitionContext = createContext<PageTransitionContextValue | undefined>(undefined)

type PageTransitionProviderProps = PropsWithChildren

function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pagePrevRef = useRef<ComponentType | null>(null)
  const [, forceUpdate] = useState({})

  const setPagePrev = useCallback((page: ComponentType) => {
    pagePrevRef.current = page
    forceUpdate({}) // Trigger re-render to update pagePrev
  }, [])

  return (
    <PageTransitionContext.Provider value={{ pagePrev: pagePrevRef.current, setPagePrev }}>
      {children}
    </PageTransitionContext.Provider>
  )
}

export type { PageTransitionContextValue }
export { PageTransitionProvider }
export default PageTransitionContext
