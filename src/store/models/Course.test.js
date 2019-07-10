import orm from '../orm'
import CourseModel from './Course'
import { loadManifestSuccess, loadPageSuccess, loadSectionSuccess } from '../actions/content'

let state
let session

describe('Course', () => {
  beforeEach(() => {
    state = orm.getEmptyState()
    session = orm.session(state)
    session.App.create({ language: 'en' })
    session.Course.create({})
  })

  it('should instantiate', () => {
    expect(session.Course.all().count()).toEqual(1)
  })

  describe('reducer', () => {
    test.each([
      ['loadSectionSuccess', loadSectionSuccess({ contentId: 'bar' }), 'bar', null],
      ['loadPageSuccess', loadPageSuccess({ contentId: 'baz' }), null, 'baz'],
    ])('%s', (_, action, currentSectionId, currentPageId) => {
      const course = session.Course.create({
        currentSection: session.Section.create({ id: 'foo', title: 'Foo' }),
        homeLink: 'foo',
        languages: ['en'],
        title: 'Foo course',
      })
      CourseModel.reducer(action, session.Course)
      expect(course.ref.currentSection).toBe(currentSectionId)
      expect(course.ref.currentPage).toBe(currentPageId)
    })

    test('no-op action', () => {
      CourseModel.reducer({ type: 'DOES-NOT-EXIST' }, session.Course)
    })
  })

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
      CourseModel.reducer(loadManifestSuccess({ content: manifest }), session.Course)
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
      CourseModel.reducer(action, session.Course,)
      expect(session.Course.first().ref).toEqual({
        ...manifest,
        homeLink: 'foo',
        id: 0,
        currentSection: null,
        toc: undefined,
      })
    })
  })
})
