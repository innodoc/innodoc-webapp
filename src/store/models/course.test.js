import orm from '../orm'
import CourseModel from './course'
import { loadManifestSuccess, loadSectionSuccess } from '../actions/content'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.session(state)
  const { App } = session
  App.create({ id: 0, language: 'en' })
  return session
}

let session

beforeEach(() => {
  session = createEmptyState()
})

describe('model', () => {
  test('create', () => {
    session.Course.create({})
    expect(session.Course.all().count()).toEqual(1)
  })
})

describe('reducer', () => {
  describe('loadManifest', () => {
    const manifest = {
      homeLink: 'bar',
      languages: ['en'],
      title: { en: 'foobar' },
      toc: [
        { id: 'foo', title: { en: 'foo' } },
        { id: 'bar', title: { en: 'bar' } },
      ],
    }

    test('loadManifestSuccess', () => {
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
  })

  test('loadSectionSuccess', () => {
    const sectionFoo = session.Section.create({
      id: '/foo/',
      title: 'Foo',
    })
    const sectionBar = session.Section.create({
      id: '/bar/',
      title: 'Bar',
    })
    const course = session.Course.create({
      currentSection: sectionFoo,
      homeLink: '/foo/',
      languages: ['en'],
      title: 'Foo course',
    })
    CourseModel.reducer(loadSectionSuccess({ sectionId: '/bar/' }), session.Course, session)
    expect(course.ref.currentSection).toEqual(sectionBar.ref.id)
  })
})
