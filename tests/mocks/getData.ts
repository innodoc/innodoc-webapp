import type { LanguageCode } from 'iso-639-1'

import makeCourses from './fakeData/makeCourses'

let courses: ReturnType<typeof makeCourses>

function getData(locales: LanguageCode[] = ['de', 'en']) {
  if (!courses) courses = makeCourses(locales)
  return courses
}

export default getData
