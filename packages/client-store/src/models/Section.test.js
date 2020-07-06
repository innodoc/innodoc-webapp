import orm from '../orm'

import { loadManifestSuccess, loadSectionSuccess, sectionVisit } from '../actions/content'
import { clearProgress, loadProgress } from '../actions/user'

const toc = [
  {
    id: 'test',
    title: { en: 'test title' },
    children: [
      {
        id: 'child1',
        title: { en: 'test child1 title' },
      },
      {
        id: 'child2',
        title: { en: 'test child2 title' },
        type: 'exercises',
      },
    ],
  },
]

const loadToc = (state) => {
  const session = orm.session(state)
  const { Section } = session
  Section.create({
    id: 'test/child1',
    ord: [0, 0],
    title: { en: 'test child1 title' },
    parentId: 'test',
    type: 'regular',
  })
  Section.create({
    id: 'test/child2',
    ord: [0, 1],
    title: { en: 'test child2 title' },
    parentId: 'test',
    type: 'exercises',
  })
  Section.create({
    id: 'test',
    ord: [0],
    title: { en: 'test title' },
    parentId: undefined,
    type: 'regular',
  })
  return session.state
}

describe('Section', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('should instantiate', () => {
    session.Section.create({ id: 'foo/bar' })
    expect(session.Section.all().count()).toEqual(1)
  })

  describe('reducer', () => {
    test('loadManifestSuccess', () => {
      const resultState = loadToc(session.state)
      session.Section.reducer(loadManifestSuccess({ content: { toc } }), session.Section)
      expect(session.state).toEqual(resultState)
    })

    test('loadSectionSuccess', () => {
      session = orm.session(loadToc(session.state))
      const action = loadSectionSuccess({
        content: 'test child1 content',
        language: 'en',
        contentId: 'test/child1',
      })
      session.Section.reducer(action, session.Section)
      const expectedSession = orm.session(loadToc(orm.getEmptyState()))
      expectedSession.Section.withId('test/child1').set('content', {
        en: 'test child1 content',
      })
      expect(session.state).toEqual(expectedSession.state)
    })

    test('sectionVisit', () => {
      session = orm.session(loadToc(session.state))
      const action = sectionVisit('test/child1')
      session.Section.reducer(action, session.Section)
      const expectedSession = orm.session(loadToc(orm.getEmptyState()))
      expectedSession.Section.withId('test/child1').set('visited', true)
      expect(session.state).toEqual(expectedSession.state)
    })

    test('loadProgress', () => {
      session = orm.session(loadToc(session.state))
      const action = loadProgress([], ['test/child1', 'test'])
      session.Section.reducer(action, session.Section)
      const visited = session.Section.filter((s) => s.visited)
        .toRefArray()
        .map((s) => s.id)
      expect(visited).toHaveLength(2)
      expect(visited).toContain('test')
      expect(visited).toContain('test/child1')
    })

    test('clearProgress', () => {
      session = orm.session(loadToc(session.state))
      session.Section.all().at(1).set('visited', true)
      expect(session.Section.all().filter({ visited: true }).count()).toBe(1)
      session.Section.reducer(clearProgress(), session.Section)
      expect(session.Section.all().filter({ visited: true }).count()).toBe(0)
    })

    test('no-op action', () => {
      session.Section.reducer({ type: 'DOES-NOT-EXIST' }, session.Section)
    })
  })

  describe('getDisplaytitle()', () => {
    it.each([
      [[0], '1 Test title'],
      [[0, 0], '1.1 Test title'],
      [[0, 0, 0], '1.1.1 Test title'],
      [[4, 5, 3], '5.6.4 Test title'],
    ])('should generate displayTitle (ord="%s" -> "%s")', (ord, expectedDisplayTitle) => {
      const section = session.Section.create({
        id: 'test',
        ord,
        title: { en: 'Test title' },
        parentId: undefined,
      })
      expect(section.getDisplayTitle('en')).toBe(expectedDisplayTitle)
    })
  })
})
