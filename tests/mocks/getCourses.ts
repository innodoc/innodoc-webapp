import makeCourses from './fakeData/makeCourses'

let courses: ReturnType<typeof makeCourses>

function getCourses() {
  if (!courses) {
    courses = makeCourses(['en', 'de'])
  }
  return courses
}

export default getCourses
