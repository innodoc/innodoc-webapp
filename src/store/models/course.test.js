import orm from '../orm'
import CourseModel from './course'
import { loadManifestSuccess, loadSection, loadSectionSuccess } from '../actions/content'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { App } = session

  // Creating default app state
  App.create({
    id: 0,
    language: 'en',
  })

  return state
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
    const state = createEmptyState()

    const session = orm.session(state)
    CourseModel.reducer(
      loadManifestSuccess({ content: manifest, parsed: false }), session.Course, session)
    expect(session.state.Course.itemsById[0]).toEqual({
      ...manifest,
      id: 0,
      currentSectionId: null,
      toc: undefined,
    })

    CourseModel.reducer(
      loadManifestSuccess({ parsed: true }), session.Course, session)
    expect(session.state.Course.items).toHaveLength(1)
  })

  test('load section', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    CourseModel.reducer(
      loadManifestSuccess({ content: manifest, parsed: false }), session.Course, session)
    expect(session.state.Course.itemsById[0]).toEqual({
      ...manifest,
      id: 0,
      currentSectionId: null,
      toc: undefined,
    })
    session.App.withId(0).set('currentCourseId', 0)

    CourseModel.reducer(loadSection('/path/'), session.Course, session)
    expect(session.state.Course.itemsById[0].currentSectionId).toEqual(null)

    CourseModel.reducer(loadSectionSuccess({ sectionId: '/path/' }), session.Course, session)
    expect(session.state.Course.itemsById[0].currentSectionId).toEqual('/path/')
  })
})
