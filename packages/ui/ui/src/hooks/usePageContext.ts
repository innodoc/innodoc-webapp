import { useContext } from 'react'

import { VikePageContext } from '#contexts'

function usePageContext() {
  return useContext(VikePageContext)
}

export default usePageContext
