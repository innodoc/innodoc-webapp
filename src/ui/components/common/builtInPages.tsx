import type { BuiltinPage } from '#types/entities/page'

import Icon from './Icon'

/** Built-in pages */
const builtInPages: BuiltinPage[] = [
  {
    icon: <Icon name="mdi:home" />,
    title: 'builtinPages.home.title',
    routeName: 'app:home',
  },
  {
    icon: <Icon name="mdi:chart-line" />,
    linked: ['footer', 'nav'],
    title: 'builtinPages.progress.title',
    routeName: 'app:progress',
  },
  {
    icon: <Icon name="mdi:table-of-contents" />,
    linked: ['footer'],
    title: 'builtinPages.toc.title',
    routeName: 'app:toc',
  },
  {
    icon: <Icon name="mdi:list-box" />,
    linked: ['footer'],
    title: 'builtinPages.glossary.title',
    routeName: 'app:glossary',
  },
]

export default builtInPages
