import { fakerDE, fakerEN } from '@faker-js/faker'

import { FRAGMENT_TYPES } from '@innodoc/constants'
import type { ApiCourse } from '@innodoc/schema/types'

import makeContent from './makeContent.js'
import makePages from './makePages.js'
import makeSections from './makeSections.js'
import { getDates, getLocales, seed } from './utils.js'
import type { FakerCourse, FakerFragments, Fakers } from './types.js'

const makeCourseData = (courseId: number, fakers: Fakers): ApiCourse => ({
  id: courseId,
  slug: 'test-course',
  homeLink: 'app:page|home',
  locales: getLocales(fakers),
  title: {
    de: 'Kurs zum Testen',
    en: 'Course for testing',
  },
  shortTitle: { de: 'Testkurs', en: 'Test course' },
  description: {
    de: 'Dieser Kurs dient dem Testen der Funktionalität.',
    en: 'This course serves to test the functionality.',
  },
  ...getDates(fakers),
})

function makeFragments(fakers: Fakers): FakerFragments {
  const fragments: FakerFragments = {}
  for (const fragmentType of FRAGMENT_TYPES) {
    fragments[fragmentType] = makeFragmentContent(fakers, fragmentType)
  }
  return fragments
}

const makeFragmentContent = (fakers: Fakers, seed: string) =>
  makeContent(fakers, { headerDepth: 4, nodeCount: 2, seed })

function makeCourse(courseId: number, fakers: Fakers): FakerCourse {
  seed(`course-${courseId}`, fakers)
  return {
    data: makeCourseData(courseId, fakers),
    fragments: makeFragments(fakers),
    pages: makePages(courseId, fakers),
    sections: makeSections(courseId, fakers),
  }
}

const defaultFakers = { en: fakerEN, de: fakerDE }
const makeCourses = (fakers = defaultFakers) => [makeCourse(0, fakers)]

export default makeCourses
