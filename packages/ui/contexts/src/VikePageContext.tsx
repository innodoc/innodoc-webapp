import { createContext } from 'react'
import type { ReactNode } from 'react'
import type { PageContext } from 'vike/types'

const VikePageContext = createContext<PageContext>(undefined as never)

function VikePageContextProvider({ pageContext, children }: VikePageContextProviderProps) {
  return <VikePageContext.Provider value={pageContext}>{children}</VikePageContext.Provider>
}

interface VikePageContextProviderProps {
  pageContext: PageContext
  children: ReactNode
}

export { VikePageContextProvider }
export default VikePageContext
