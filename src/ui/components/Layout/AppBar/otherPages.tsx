import type { ReactNode } from 'react'

import Icon from '@/ui/components/common/Icon'

const otherPages = [
  {
    icon: <Icon name="mdi:table-of-contents" />,
    label: 'nav.toc',
    to: '/toc',
  },
] as Page[]

type Page = {
  icon: ReactNode
  label: string
  to: string
}

export default otherPages
