import { faker } from '@faker-js/faker'
import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse } from '#types/entities/course'

import makeContent from './makeContent'
import makePages from './makePages'
import makeSections from './makeSections'
import { getDates } from './utils'

const makeFooterContent = (locales: LanguageCode[]) =>
  makeContent(locales, { headerDepth: 4, nodeCount: 2 })

const makeCourse = (course: ApiCourse, locales: LanguageCode[]) => ({
  data: course,
  footerContent: { a: makeFooterContent(locales), b: makeFooterContent(locales) },
  pages: makePages(course.id, locales),
  sections: makeSections(course.id, locales),
})

const makeCourses = (locales: LanguageCode[]) => {
  faker.seed(161) // Consistent random results

  const courses: ApiCourse[] = [
    {
      id: 0,
      slug: 'testcourse',
      homeLink: '/page/home',
      locales,
      title: {
        de: 'Kurs für integration tests',
        en: 'Course for integration tests',
      },
      shortTitle: { de: 'Testkurs', en: 'Test course' },
      description: {
        de: 'Dieser Kurs dient dem Testen der Funktionalität.',
        en: 'This course is for testing functionality.',
      },
      ...getDates(),
    },
  ]

  return courses.reduce<Record<number, ReturnType<typeof makeCourse>>>(
    (acc, course) => ({
      ...acc,
      [course.id]: makeCourse(course, locales),
    }),
    {}
  )
}

export default makeCourses
