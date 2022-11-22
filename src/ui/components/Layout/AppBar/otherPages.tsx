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

type Page = {
  icon: ReactNode
  linked: PageLinkLocation[]
  title: string
  to: string
}

const otherPagesFooter = otherPages.filter((page) => page.linked.includes('footer'))
const otherPagesNav = otherPages.filter((page) => page.linked.includes('nav'))

export { otherPagesFooter, otherPagesNav }
export default otherPages
