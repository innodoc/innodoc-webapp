import { use } from 'react'
import type { PageTransitionContextValue } from '@innodoc/ui-shared/contexts'
import { PageTransitionContext } from '@innodoc/ui-shared/contexts'

function usePageTransition(): PageTransitionContextValue {
  const context = use(PageTransitionContext)

  if (!context) {
    throw new TypeError('Expected page transition context')
  }

  return context
}

export default usePageTransition
