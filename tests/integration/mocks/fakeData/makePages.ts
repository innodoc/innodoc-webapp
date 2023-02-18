import type { LanguageCode } from 'iso-639-1'

import type { ApiPage } from '#types/entities/page'

import makeContent, { type Content } from './makeContent'
import { getDates, getTitlesSlug, range } from './utils'

type Page = [ApiPage, Content]

const makePage = (id: number, courseId: number, locales: LanguageCode[]): Page => [
  {
    id,
    courseId,
    linked: ['footer'],
    ...getTitlesSlug(locales),
    ...getDates(),
  },
  makeContent(locales),
]

const makePages = (courseId: number, locales: LanguageCode[]) => {
  const pages = range(6).map((i) => makePage(i, courseId, locales))

  pages[0][0] = {
    ...pages[0][0],
    icon: 'mdi:home',
    slug: 'home',
    linked: ['footer', 'nav'],
    title: { de: 'Home-Seite', en: 'Home page' },
    shortTitle: { de: 'Home', en: 'Home' },
  }
  pages[0][1].en = `This is the start of the journey.

[example link](https://www.example.com/)
[example link reference][linkRef]

[linkRef]: https://www.example.com/reference
`

  pages[1][0] = {
    ...pages[1][0],
    linked: ['footer', 'nav'],
  }

  return pages.reduce<Record<number, Page>>((acc, page) => ({ ...acc, [page[0].id]: page }), {})
}

export default makePages
