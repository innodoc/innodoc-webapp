import { createContext } from 'react'
import type { PropsWithChildren } from 'react'

import type { PageContext } from '@innodoc/shared-core/types'

const PageContextContext = createContext<PageContext>(undefined as never)

function PageContextProvider({ pageContext, children }: PageContextProviderProps) {
  return <PageContextContext value={pageContext}>{children}</PageContextContext>
}

interface PageContextProviderProps extends PropsWithChildren {
  pageContext: PageContext
}

export { PageContextProvider }
export default PageContextContext
