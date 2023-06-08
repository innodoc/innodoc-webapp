import { fakerDE, fakerEN } from '@faker-js/faker'

import makeCourses from './fakeData/makeCourses'

let courses: ReturnType<typeof makeCourses>

function getCourses() {
  if (!courses) {
    courses = makeCourses({ en: fakerEN, de: fakerDE })
  }
  return courses
}

export default getCourses
