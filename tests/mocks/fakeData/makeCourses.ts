import type { LanguageCode } from 'iso-639-1'

import { FRAGMENT_TYPES } from '#constants'
import type { ApiCourse } from '#types/entities/course'

import makeContent from './makeContent'
import makePages from './makePages'
import makeSections from './makeSections'
import { getDates, seed } from './utils'

const makeFooterContent = (locales: LanguageCode[], seed: string) =>
  makeContent(locales, { headerDepth: 4, nodeCount: 2, seed })

const makeCourseData = (courseId: number, locales: LanguageCode[]): ApiCourse => ({
  id: courseId,
  slug: 'testcourse',
  homeLink: 'app:page|home',
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
})

const makeCourse = (courseId: number, locales: LanguageCode[]) => {
  seed(`course-${courseId}`)
  return {
    data: makeCourseData(courseId, locales),
    footerContent: Object.fromEntries(
      FRAGMENT_TYPES.map((fragmentType) => [fragmentType, makeFooterContent(locales, fragmentType)])
    ),
    pages: makePages(courseId, locales),
    sections: makeSections(courseId, locales),
  }
}

const makeCourses = (locales: LanguageCode[]) => [makeCourse(0, locales)]

export default makeCourses
