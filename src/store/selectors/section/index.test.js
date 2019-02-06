import orm from '../../orm'
import sectionSelectors from '.'

const course = {
  currentSection: 'test/child1',
  homeLink: 'test',
  languages: ['en'],
  title: 'courseTitle',
}

const sections = {
  test: {
    id: 'test',
    ord: [0],
    title: { en: 'test title' },
    content: { en: 'test content' },
    parentId: null,
  },
  'test/child1': {
    id: 'test/child1',
    ord: [0, 0],
    title: { en: 'test child1 title' },
    content: { en: 'test child1 content' },
    parentId: 'test',
  },
  'test/child2': {
    id: 'test/child2',
    ord: [0, 1],
    title: { en: 'test child2 title' },
    content: { en: 'test child2 content' },
    parentId: 'test',
  },
  'test/child1/child11': {
    id: 'test/child1/child11',
    ord: [0, 0, 0],
    title: { en: 'test child11 title' },
    content: { en: 'test child11 content' },
    parentId: 'test/child1',
  },
  'test/child1/child12': {
    id: 'test/child1/child12',
    ord: [0, 0, 1],
    title: { en: 'test child12 title' },
    content: { en: 'test child12 content' },
    parentId: 'test/child1',
  },
}

// Create ORM state
const dummyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.App.create({
    id: 0,
    currentCourse: 0,
    language: 'en',
  })
  session.Course.create(course)
  Object.values(sections).forEach(section => session.Section.create(section))
  return [{ orm: state }, session]
}

describe('sectionSelectors', () => {
  const [state] = dummyState()

  test.each([
    ['test/child1/child11', true],
    ['does/not/exist', false],
  ])('sectionExists: %s', (sectionId, exists) => {
    expect(sectionSelectors.sectionExists(state, sectionId)).toBe(exists)
  })

  test.each([
    'test/child1',
    'test/child1/child12',
  ])('getSection: %s', (sectionId) => {
    expect(sectionSelectors.getSection(state, sectionId)).toEqual(sections[sectionId])
  })

  test('getCurrentSection', () => {
    expect(sectionSelectors.getCurrentSection(state)).toEqual(sections['test/child1'])
  })

  test('getCurrentSubsections', () => {
    expect(sectionSelectors.getCurrentSubsections(state)).toEqual([
      sections['test/child1/child11'],
      sections['test/child1/child12'],
    ])
  })
})

describe('getBreadcrumbSections', () => {
  test.each([
    ['test', [
      { id: 'test', title: 'test title' },
    ]],
    ['test/child1', [
      { id: 'test', title: 'test title' },
      { id: 'test/child1', title: 'test child1 title' },
    ]],
    ['test/child1/child12', [
      { id: 'test', title: 'test title' },
      { id: 'test/child1', title: 'test child1 title' },
      { id: 'test/child1/child12', title: 'test child12 title' },
    ]],
  ])('%s', (id, crumbs) => {
    const [state, session] = dummyState()
    session.Course.first().set('currentSection', id)
    expect(sectionSelectors.getBreadcrumbSections(state)).toEqual(crumbs)
  })
})

describe('getNextPrevSections', () => {
  test.each([
    ['test', null, sections['test/child1']],
    ['test/child1', sections.test, sections['test/child1/child11']],
    ['test/child1/child12', sections['test/child1/child11'], sections['test/child2']],
    ['test/child2', sections['test/child1/child12'], null],
  ])('%s', (id, prev, next) => {
    const [state, session] = dummyState()
    session.Course.first().set('currentSection', id)
    expect(sectionSelectors.getNextPrevSections(state)).toEqual({ prev, next })
  })
})

describe('getToc', () => {
  const [state] = dummyState()
  test('getToc', () => {
    const toc = sectionSelectors.getToc(state)
    expect(toc[0].id).toEqual('test')
    expect(toc[0].children[0].id).toEqual('test/child1')
    expect(toc[0].children[0].children[0].id).toEqual('test/child1/child11')
    expect(toc[0].children[0].children[1].id).toEqual('test/child1/child12')
    expect(toc[0].children[1].id).toEqual('test/child2')
  })
})
