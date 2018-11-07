import orm from '../orm'
import SectionModel from './section'
import { loadSectionSuccess, loadTocSuccess } from '../actions/content'

const toc = [
  {
    id: 'test',
    title: 'test title',
    children: [
      {
        id: 'child1',
        title: 'test child1 title',
      },
      {
        id: 'child2',
        title: 'test child2 title',
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
    title: {
      en: 'test child1 title',
    },
    parentId: 'test',
  })

  Section.create({
    id: 'test/child2',
    ord: [0, 1],
    title: {
      en: 'test child2 title',
    },
    parentId: 'test',
  })

  Section.create({
    id: 'test',
    ord: [0],
    title: {
      en: 'test title',
    },
    parentId: null,
  })

  return session.state
}

const loadSection = (state) => {
  const session = orm.session(state)
  const { Section } = session

  Section.withId('test/child1').set('content', { en: 'test child1 content' })
  return session.state
}

describe('reducer', () => {
  test('load and parse toc', () => {
    const state = orm.getEmptyState()
    const resultState = loadToc(state)

    const session = orm.session(state)
    SectionModel.reducer(loadTocSuccess({ language: 'en', content: toc }), session.Section)

    expect(session.state).toEqual(resultState)
  })

  test('load section', () => {
    const state = loadToc(orm.getEmptyState())
    const resultState = loadSection(state)

    const session = orm.session(state)
    SectionModel.reducer(
      loadSectionSuccess({ language: 'en', sectionPath: 'test/child1', content: 'test child1 content' }),
      session.Section)

    expect(session.state).toEqual(resultState)
  })
})
