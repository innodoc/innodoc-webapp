import orm from '../orm'
import selectors from './section'

// Mock other selectors
jest.mock('./app.js', () => ({
  getCurrentSectionId: () => 'test/child1',
  getLanguage: () => 'en',
}))

// Create/Mock state
const dummyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { Section } = session

  Section.create({
    id: 'test',
    ord: [0],
    title: {
      en: 'test title',
    },
    content: {
      en: 'test content',
    },
    parentId: null,
  })

  Section.create({
    id: 'test/child1',
    ord: [0, 0],
    title: {
      en: 'test child1 title',
    },
    content: {
      en: 'test child1 content',
    },
    parentId: 'test',
  })

  Section.create({
    id: 'test/child2',
    ord: [0, 1],
    title: {
      en: 'test child2 title',
    },
    content: {
      en: 'test child2 content',
    },
    parentId: 'test',
  })

  return {
    db: state,
  }
}

const state = dummyState()

describe('section selectors', () => {
  test('getSection', () => {
    expect(selectors.getSection(state, 'test')).toEqual(state.db.Section.itemsById.test)
    expect(selectors.getSection(state, 'test/child1')).toEqual(state.db.Section.itemsById['test/child1'])
    expect(selectors.getSection(state, 'test/child2')).toEqual(state.db.Section.itemsById['test/child2'])
  })

  test('getSectionTitle', () => {
    expect(selectors.getSectionTitle(state, 'test')).toEqual(state.db.Section.itemsById.test.title.en)
    expect(selectors.getSectionTitle(state, 'test/child1')).toEqual(state.db.Section.itemsById['test/child1'].title.en)
    expect(selectors.getSectionTitle(state, 'test/child2')).toEqual(state.db.Section.itemsById['test/child2'].title.en)
  })

  test('getSectionContent', () => {
    expect(selectors.getSectionContent(state, 'test')).toEqual(state.db.Section.itemsById.test.content.en)
    expect(selectors.getSectionContent(state, 'test/child1')).toEqual(state.db.Section.itemsById['test/child1'].content.en)
    expect(selectors.getSectionContent(state, 'test/child2')).toEqual(state.db.Section.itemsById['test/child2'].content.en)
  })

  test('getBreadcrumbSections', () => {
    expect(selectors.getBreadcrumbSections(state)).toEqual([
      {
        id: state.db.Section.itemsById.test.id,
        title: state.db.Section.itemsById.test.title.en,
      },
      {
        id: state.db.Section.itemsById['test/child1'].id,
        title: state.db.Section.itemsById['test/child1'].title.en,
      },
    ])
  })

  test('getNavSections', () => {
    expect(selectors.getNavSections(state, 'test')).toEqual({
      prev: null,
      next: state.db.Section.itemsById['test/child1'],
    })
    expect(selectors.getNavSections(state, 'test/child2')).toEqual({
      prev: state.db.Section.itemsById['test/child1'],
      next: null,
    })
    expect(selectors.getNavSections(state, 'test/child1')).toEqual({
      prev: state.db.Section.itemsById.test,
      next: state.db.Section.itemsById['test/child2'],
    })
  })

  test('getToc', () => {
    const toc = selectors.getToc(state)
    expect(toc[0].id).toEqual('test')
    expect(toc[0].children[0].id).toEqual('test/child1')
    expect(toc[0].children[1].id).toEqual('test/child2')
  })
})
