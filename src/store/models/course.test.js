import orm from '../orm'
import CourseModel from './course'
import { loadManifestSuccess, loadSection, loadSectionSuccess } from '../actions/content'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { App } = session
  App.create({
    id: 0,
    language: 'en',
  })
  return session
}

const manifest = {
  homeLink: 'foo',
  languages: ['en'],
  title: { en: 'foobar' },
  toc: [
    {
      id: 'foo',
      title: { en: 'foo' },
    },
  ],
}

describe('reducer', () => {
  test('load manifest', () => {
    // TODO: test parseManifest
    const session = createEmptyState()
    CourseModel.reducer(
      loadManifestSuccess({ content: manifest, parsed: false }), session.Course, session)
    expect(session.Course.first().ref).toEqual({
      ...manifest,
      id: 0,
      currentSectionId: null,
      toc: undefined,
    })
    CourseModel.reducer(
      loadManifestSuccess({ parsed: true }), session.Course, session)
    expect(session.Course.all().count()).toBe(1)
  })

  test('load section', () => {
    const session = createEmptyState()
    CourseModel.reducer(
      loadManifestSuccess({ content: manifest, parsed: false }), session.Course, session)
    expect(session.Course.first().ref).toEqual({
      ...manifest,
      id: 0,
      currentSectionId: null,
      toc: undefined,
    })
    session.App.first().set('currentCourseId', 0)
    const course = session.Course.first()
    CourseModel.reducer(loadSection('/path/'), session.Course, session)
    expect(course.ref.currentSectionId).toEqual(null)
    CourseModel.reducer(loadSectionSuccess({ sectionId: '/path/' }), session.Course, session)
    expect(course.ref.currentSectionId).toEqual('/path/')
  })
})
