import orm from '../orm'
import courseSelectors from './course'

const courseData = {
  id: 0,
  homeLink: '/section/foo',
  languages: ['en'],
  logo: undefined,
  mathJaxOptions: {},
  title: { en: ['foobar'] },
}

describe('courseSelectors', () => {
  let state
  let app

  beforeEach(() => {
    state = orm.getEmptyState()
    const session = orm.mutableSession(state)
    app = session.App.create({})
    const course = session.Course.create(courseData)
    app.set('currentCourseId', course.id)
    state = { orm: state }
  })

  test('getCourses', () => expect(courseSelectors.getCourses(state)).toEqual([courseData]))

  describe('getCurrentCourse', () => {
    test('course exists', () => expect(courseSelectors.getCurrentCourse(state)).toEqual(courseData))

    test("course doesn't exist", () => {
      app.set('currentCourseId', undefined)
      expect(courseSelectors.getCurrentCourse(state)).toBeUndefined()
    })
  })
})
