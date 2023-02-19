import type { LanguageCode } from 'iso-639-1'

import type { ApiCourse } from '#types/entities/course'

import makeContent from './makeContent'
import makePages from './makePages'
import makeSections from './makeSections'
import { getDates, seed } from './utils'

const makeFooterContent = (locales: LanguageCode[], seed: string) =>
  makeContent(locales, { headerDepth: 4, nodeCount: 2, seed })

const makeCourse = (course: ApiCourse, locales: LanguageCode[]) => ({
  data: course,
  footerContent: {
    a: makeFooterContent(locales, 'footer-a'),
    b: makeFooterContent(locales, 'footer-b'),
  },
  pages: makePages(course.id, locales),
  sections: makeSections(course.id, locales),
})

const makeCoursesData = (locales: LanguageCode[]): ApiCourse[] => {
  const courseId = 0
  seed(`course-${courseId}`)
  return [
    {
      id: courseId,
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
}

const makeCourses = (locales: LanguageCode[]) => {
  const courses = makeCoursesData(locales)

  return courses.reduce<Record<number, ReturnType<typeof makeCourse>>>(
    (acc, course) => ({
      ...acc,
      [course.id]: makeCourse(course, locales),
    }),
    {}
  )
}

export default makeCourses
