import { FRAGMENT_TYPES } from '#constants'
import type { ApiCourse } from '#types/entities/course'

import makeContent from './makeContent'
import makePages from './makePages'
import makeSections from './makeSections'
import type { Fakers } from './types'
import { getDates, getLocales, seed } from './utils'

const makeFooterContent = (fakers: Fakers, seed: string) =>
  makeContent(fakers, { headerDepth: 4, nodeCount: 2, seed })

const makeCourseData = (courseId: number, fakers: Fakers): ApiCourse => ({
  id: courseId,
  slug: 'testcourse',
  homeLink: 'app:page|home',
  locales: getLocales(fakers),
  title: {
    de: 'Kurs für integration tests',
    en: 'Course for integration tests',
  },
  shortTitle: { de: 'Testkurs', en: 'Test course' },
  description: {
    de: 'Dieser Kurs dient dem Testen der Funktionalität.',
    en: 'This course is for testing functionality.',
  },
  ...getDates(fakers),
})

const makeCourse = (courseId: number, fakers: Fakers) => {
  seed(`course-${courseId}`, Object.values(fakers)[0])
  return {
    data: makeCourseData(courseId, fakers),
    footerContent: Object.fromEntries(
      FRAGMENT_TYPES.map((fragmentType) => [fragmentType, makeFooterContent(fakers, fragmentType)])
    ),
    pages: makePages(courseId, fakers),
    sections: makeSections(courseId, fakers),
  }
}

const makeCourses = (fakers: Fakers) => [makeCourse(0, fakers)]

export default makeCourses
