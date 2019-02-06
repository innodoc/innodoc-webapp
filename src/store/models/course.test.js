import orm from '../orm'
import CourseModel from './course'
import { loadManifestSuccess, loadSection, loadSectionSuccess } from '../actions/content'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { App } = session
  App.create({ id: 0, language: 'en' })
  return session
}

const manifest = {
  homeLink: 'bar',
  languages: ['en'],
  title: { en: 'foobar' },
  toc: [
    {
      id: 'foo',
      title: { en: 'foo' },
    },
    {
      id: 'bar',
      title: { en: 'bar' },
    },
  ],
}

describe('model', () => {
  test('create', () => {
    const session = createEmptyState()
    session.Course.create({})
    expect(session.Course.all().count()).toEqual(1)
  })
})

describe('reducer', () => {
  test('loadManifestSuccess', () => {
    const session = createEmptyState()
    CourseModel.reducer(
      loadManifestSuccess({ content: manifest }), session.Course, session)
    expect(session.Course.first().ref).toEqual({
      ...manifest,
      id: 0,
      currentSection: null,
      toc: undefined,
    })
  })

  test('loadManifestSuccess (w/o homeLink)', () => {
    const session = createEmptyState()
    const action = loadManifestSuccess({
      content: { ...manifest, homeLink: null },
    })
    CourseModel.reducer(action, session.Course, session)
    expect(session.Course.first().ref).toEqual({
      ...manifest,
      homeLink: 'foo',
      id: 0,
      currentSection: null,
      toc: undefined,
    })
  })

  test('loadSection', () => {
    const session = createEmptyState()
    CourseModel.reducer(loadManifestSuccess({ content: manifest }), session.Course, session)
    session.App.first().set('currentCourse', 0)
    const course = session.Course.first()
    CourseModel.reducer(loadSection('/path/'), session.Course, session)
    expect(course.ref.currentSection).toEqual(null)
  })

  test('loadSectionSuccess', () => {
    const session = createEmptyState()
    CourseModel.reducer(loadManifestSuccess({ content: manifest }), session.Course, session)
    session.App.first().set('currentCourse', 0)
    const course = session.Course.first()
    CourseModel.reducer(loadSectionSuccess({ sectionId: '/path/' }), session.Course, session)
    expect(course.ref.currentSection).toEqual('/path/')
  })
})
