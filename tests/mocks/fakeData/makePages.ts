import type { LanguageCode } from 'iso-639-1'

import makeContent from './makeContent'
import type { Page } from './types'
import { getDates, getTitlesSlug, range, seed } from './utils'

const makePage = (id: number, courseId: number, locales: LanguageCode[]): Page => {
  seed(`page-${courseId}-${id}`)
  return {
    data: {
      id,
      courseId,
      linked: ['footer'],
      ...getTitlesSlug(locales),
      ...getDates(),
    },
    content: makeContent(locales),
  }
}

const makePages = (courseId: number, locales: LanguageCode[]) => {
  const pages = range(6).map((i) => makePage(i, courseId, locales))

  pages[0].data = {
    ...pages[0].data,
    icon: 'mdi:home',
    slug: 'home',
    linked: ['footer', 'nav'],
    title: { de: 'Home-Seite', en: 'Home page' },
    shortTitle: { de: 'Home', en: 'Home' },
  }
  pages[0].content.en = `This is the start of the journey.

[example link](https://www.example.com/)
[example link reference][linkRef]

[linkRef]: https://www.example.com/reference
`
  pages[0].content.de = `Dies ist der Beginn der Reise.

[Beispiel-Link](https://www.example.com/)
[Beispiel-Referenz-Link][linkRef]

[linkRef]: https://www.example.com/reference
`

  pages[1].data = {
    ...pages[1].data,
    linked: ['footer', 'nav'],
  }

  return pages
}

export default makePages
