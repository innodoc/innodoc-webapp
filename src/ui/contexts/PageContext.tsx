import { createContext } from 'react'

import type { PageContext as PageContextType } from '@innodoc/types'

const PageContext = createContext<PageContextType>({
  Page: () => null,
  pageProps: {},
})

function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContextType
  children: React.ReactNode
}) {
  return <PageContext.Provider value={pageContext}>{children}</PageContext.Provider>
}

export { PageContextProvider }
export default PageContext
