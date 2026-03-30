import { use } from 'react'

import { PageContextContext } from '#contexts'

function usePageContext() {
  return use(PageContextContext)
}

export default usePageContext
