import type { BuiltinPage } from '#types/entities/page'

import Icon from './Icon'

/** Built-in pages */
const builtInPages: BuiltinPage[] = [
  {
    icon: <Icon name="mdi:chart-line" />,
    linked: ['footer', 'nav'],
    title: 'internalPages.progress.title',
    routeName: 'app:progress',
  },
  {
    icon: <Icon name="mdi:table-of-contents" />,
    linked: ['footer'],
    title: 'internalPages.toc.title',
    routeName: 'app:toc',
  },
  {
    icon: <Icon name="mdi:list-box" />,
    linked: ['footer'],
    title: 'internalPages.glossary.title',
    routeName: 'app:glossary',
  },
]

export default builtInPages
