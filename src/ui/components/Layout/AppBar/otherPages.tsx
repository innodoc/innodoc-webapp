import type { ReactNode } from 'react'

import type { PageLinkLocation } from '#types/common'
import Icon from '#ui/components/common/Icon'

const otherPages = [
  {
    icon: <Icon name="mdi:chart-line" />,
    linked: ['nav'],
    title: 'internalPages.progress.title',
    to: '/progress',
  },
  {
    icon: <Icon name="mdi:table-of-contents" />,
    linked: ['footer'],
    title: 'internalPages.toc.title',
    to: '/toc',
  },
  {
    icon: <Icon name="mdi:list-box" />,
    linked: ['footer'],
    title: 'internalPages.indexPage.title',
    to: '/index',
  },
] as Page[]

interface Page {
  icon: ReactNode
  linked: PageLinkLocation[]
  title: string
  to: string
}

export default otherPages
