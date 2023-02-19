import makeCourses from './fakeData/makeCourses'

let courses: ReturnType<typeof makeCourses>

function getData() {
  if (!courses) courses = makeCourses(['en', 'de'])
  return courses
}

export default getData
