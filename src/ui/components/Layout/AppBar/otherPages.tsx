import type { ReactNode } from 'react'

import type { PageLinkLocation } from '#types/common'
import Icon from '#ui/components/common/Icon'

// TODO: merge builtin pages from into here
const otherPages = [
  {
    icon: <Icon name="mdi:chart-line" />,
    linked: ['nav'],
    title: 'internalPages.progress.title',
    to: 'app:progress',
  },
  {
    icon: <Icon name="mdi:table-of-contents" />,
    linked: ['footer'],
    title: 'internalPages.toc.title',
    to: 'app:toc',
  },
  {
    icon: <Icon name="mdi:list-box" />,
    linked: ['footer'],
    title: 'internalPages.glossary.title',
    to: 'app:glossary',
  },
] as Page[]

interface Page {
  icon: ReactNode
  linked: PageLinkLocation[]
  title: string
  to: string
}

export default otherPages
