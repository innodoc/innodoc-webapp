import orm from '../orm'
import selectors from './course'

// Create/Mock state
const dummyState = (() => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { App, Course } = session

  // Create course
  Course.create({
    homeLink: 'foo',
    languages: ['en'],
    title: { en: ['foobar'] },
  })

  // Creating default app state
  App.create({
    id: 0,
    currentCourseId: 0,
  })

  return {
    db: state,
  }
})()

describe('course selectors', () => {
  test('getCourseTable', () => {
    expect(selectors.getCourseTable(dummyState)).toBe(dummyState.db.Course)
  })

  test('getCourses', () => {
    expect(selectors.getCourses(dummyState)).toBe(dummyState.db.Course.items)
  })

  test('getCurrentCourse', () => {
    expect(selectors.getCurrentCourse(dummyState)).toBe(dummyState.db.Course.itemsById[0])
  })
})
