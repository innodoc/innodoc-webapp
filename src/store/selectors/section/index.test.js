import defaultInitialState from '../../defaultInitialState'
import orm from '../../orm'
import sectionSelectors from '.'

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

let state
beforeEach(() => {
  const session = orm.session(defaultInitialState().orm)
  const app = session.App.first()
  const course = session.Course.create({
    homeLink: 'test',
    languages: ['en'],
    title: 'courseTitle',
  })
  Object.values(sections).forEach(section => session.Section.create(section))
  app.set('language', 'en')
  app.set('currentCourse', course.id)
  state = { orm: session.state }
})

const setSectionId = (localState, sectionId) => {
  const session = orm.session(localState.orm)
  session.Course.first().set('currentSection', sectionId)
  return { orm: session.state }
}

describe('sectionSelectors', () => {
  beforeEach(() => {
    state = setSectionId(state, 'test/child1')
  })

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
  ])('%s', (sectionId, crumbs) => {
    state = setSectionId(state, sectionId)
    expect(sectionSelectors.getBreadcrumbSections(state)).toEqual(crumbs)
  })
})

describe('getNextPrevSections', () => {
  test.each([
    ['test', null, sections['test/child1']],
    ['test/child1', sections.test, sections['test/child1/child11']],
    ['test/child1/child12', sections['test/child1/child11'], sections['test/child2']],
    ['test/child2', sections['test/child1/child12'], null],
  ])('%s', (sectionId, prev, next) => {
    state = setSectionId(state, sectionId)
    expect(sectionSelectors.getNextPrevSections(state)).toEqual({ prev, next })
  })
})

describe('getToc', () => {
  test('getToc', () => {
    const toc = sectionSelectors.getToc(state)
    expect(toc[0].id).toEqual('test')
    expect(toc[0].children[0].id).toEqual('test/child1')
    expect(toc[0].children[0].children[0].id).toEqual('test/child1/child11')
    expect(toc[0].children[0].children[1].id).toEqual('test/child1/child12')
    expect(toc[0].children[1].id).toEqual('test/child2')
  })
})
