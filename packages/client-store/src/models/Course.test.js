import orm from '../orm'

import { loadManifestSuccess, loadPageSuccess, loadSectionSuccess } from '../actions/content'

describe('Course', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
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
      session.Course.reducer(action, session.Course)
      expect(course.ref.currentSection).toBe(currentSectionId)
      expect(course.ref.currentPage).toBe(currentPageId)
    })

    test('no-op action', () => {
      session.Course.reducer({ type: 'DOES-NOT-EXIST' }, session.Course)
    })
  })

  describe('loadManifest', () => {
    const manifest = {
      home_link: '/section/bar',
      languages: ['en'],
      title: { en: 'foobar' },
      toc: [
        { id: 'foo', title: { en: 'foo' } },
        { id: 'bar', title: { en: 'bar' } },
      ],
    }

    test('loadManifestSuccess', () => {
      session.Course.reducer(loadManifestSuccess({ content: manifest }), session.Course)
      expect(session.Course.first().ref).toEqual({
        currentSection: null,
        homeLink: '/section/bar',
        languages: ['en'],
        logo: null,
        title: { en: 'foobar' },
        id: 0,
      })
    })

    test('loadManifestSuccess (w/o homeLink)', () => {
      const action = loadManifestSuccess({
        content: { ...manifest, home_link: null },
      })
      session.Course.reducer(action, session.Course,)
      expect(session.Course.first().ref).toEqual({
        currentSection: null,
        homeLink: '/section/foo',
        languages: ['en'],
        logo: null,
        title: { en: 'foobar' },
        id: 0,
      })
    })
  })
})
