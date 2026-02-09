import { useContext } from 'react'

import { VikePageContext } from '@innodoc/contexts'

function usePageContext() {
  return useContext(VikePageContext)
}

export default usePageContext
