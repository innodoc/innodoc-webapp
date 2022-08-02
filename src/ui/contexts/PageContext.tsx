import { createContext } from 'react'

import type { PageContextClient } from '@/types/page'

const defaultPageContext: PageContextClient = {
  exports: {},
  isHydration: false,
  Page: () => null,
  pageExports: {},
  pageProps: {},
  url: '',
  urlParsed: {
    hash: '',
    hashOriginal: null,
    hashString: null,
    origin: null,
    pathname: '',
    pathnameOriginal: '',
    search: {},
    searchAll: {},
    searchOriginal: null,
    searchString: null,
  },
  urlPathname: '',
}

const PageContext = createContext<PageContextClient>(defaultPageContext)

function PageContextProvider({ pageContext, children }: PageContextProviderProps) {
  return <PageContext.Provider value={pageContext}>{children}</PageContext.Provider>
}

type PageContextProviderProps = {
  pageContext: PageContextClient
  children: React.ReactNode
}

export { PageContextProvider }
export default PageContext
