import type { ReactElement } from 'react'

import type { BuiltinRouteName } from '@innodoc/routes/types/routeNames'
import type { PageLinkLocation } from '@innodoc/types/common'

import { Icon } from '#components/common/misc'

/** Built-in page */
interface BuiltinPage {
  /** URL path */
  routeName: BuiltinRouteName

  /** Page title i18n key */
  title: string

  /** Icon name */
  icon: ReactElement

  /** Location in the page layout where a link should appear */
  linked?: PageLinkLocation[]
}

/** Built-in pages */
const builtInPages: BuiltinPage[] = [
  {
    icon: <Icon name="mdi:home" />,
    title: 'builtinPages.home.title',
    routeName: 'app:course',
  },
  {
    icon: <Icon name="mdi:chart-line" />,
    linked: ['footer', 'nav'],
    title: 'builtinPages.progress.title',
    routeName: 'app:course:progress',
  },
  {
    icon: <Icon name="mdi:table-of-contents" />,
    linked: ['footer'],
    title: 'builtinPages.toc.title',
    routeName: 'app:course:toc',
  },
  {
    icon: <Icon name="mdi:list-box" />,
    linked: ['footer'],
    title: 'builtinPages.glossary.title',
    routeName: 'app:course:glossary',
  },
]

export default builtInPages
