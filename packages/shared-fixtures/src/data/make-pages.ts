import type { FakerPage, Fakers } from './types.js'
import makeContent from './make-content.js'
import { getDates, getTitlesSlug, range, seed } from './utils.js'

const makePage = (id: number, courseId: number, fakers: Fakers): FakerPage => {
  seed(`page-${String(courseId)}-${String(id)}`, fakers)
  return {
    data: {
      id,
      courseId,
      icon: null,
      linked: ['footer'],
      ...getTitlesSlug(fakers),
      ...getDates(fakers),
    },
    content: makeContent(fakers),
  }
}

const makePages = (courseId: number, fakers: Fakers) => {
  const pages = range(6).map((i) => makePage(i, courseId, fakers))

  const firstPage = pages.at(0)
  const secondPage = pages.at(1)
  if (!firstPage || !secondPage) {
    throw new Error('Expteced pages')
  }

  firstPage.data = {
    ...firstPage.data,
    icon: 'mdi:home',
    slug: 'home',
    linked: ['footer', 'nav'],
    title: { de: 'Home-Seite', en: 'Home page' },
    shortTitle: { de: 'Home', en: 'Home' },
  }
  firstPage.content.en = `This is the start of the journey.

[example link](https://www.example.com/)
[example link reference][linkRef]

[linkRef]: https://www.example.com/reference
`
  firstPage.content.de = `Dies ist der Beginn der Reise.

[Beispiel-Link](https://www.example.com/)
[Beispiel-Referenz-Link][linkRef]

[linkRef]: https://www.example.com/reference
`

  secondPage.data = {
    ...secondPage.data,
    linked: ['footer', 'nav'],
  }

  return pages
}

export default makePages
