import orm from '../orm'
import courseSelectors from './course'

const dummyCourse = {
  id: 0,
  homeLink: 'foo',
  languages: ['en'],
  title: { en: ['foobar'] },
}

// Create/Mock state
const dummyState = (course = dummyCourse) => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  if (course) {
    session.Course.create(course)
  }
  session.App.create({
    id: 0,
    currentCourse: session.Course.first(),
  })
  return { orm: state }
}

describe('courseSelectors', () => {
  test('getCourses', () => {
    const state = dummyState()
    expect(courseSelectors.getCourses(state)).toEqual([dummyCourse])
  })

  describe('getCurrentCourse', () => {
    test('course exists', () => {
      const state = dummyState()
      expect(courseSelectors.getCurrentCourse(state)).toEqual(dummyCourse)
    })

    test("course doesn't exist", () => {
      const state = dummyState(null)
      expect(courseSelectors.getCurrentCourse(state)).toBe(null)
    })
  })
})
