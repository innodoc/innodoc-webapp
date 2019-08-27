import defaultInitialState from '../../defaultInitialState'
import orm from '../../orm'
import sectionSelectors from '.'
import { makeMakeGetContentLink } from '..'

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

jest.mock('..', () => {
  const actualAppImport = jest.requireActual('..')
  return {
    __esModule: true,
    default: {
      getApp: actualAppImport.default.getApp,
      getOrmState: actualAppImport.default.getOrmState,
    },
    makeMakeGetContentLink: jest.fn(() => (
      () => {}
    )),
    selectId: actualAppImport.selectId,
  }
})

let state
beforeEach(() => {
  const session = orm.session(defaultInitialState().orm)
  const app = session.App.first()
  const course = session.Course.create({
    homeLink: 'test',
    languages: ['en'],
    title: 'courseTitle',
  })
  Object.values(sections).forEach((section) => session.Section.create(section))
  app.set('language', 'en')
  app.set('currentCourse', course.id)
  state = { orm: session.state }
})

const setCurrentSection = (localState, sectionId) => {
  const session = orm.session(localState.orm)
  session.Course.first().set('currentSection', sectionId)
  return { orm: session.state }
}

describe('sectionSelectors', () => {
  beforeEach(() => {
    state = setCurrentSection(state, 'test/child1')
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

  test('getCurrentTitle', () => {
    expect(sectionSelectors.getCurrentTitle(state)).toEqual('1.1 test child1 title')
  })
})

describe('getBreadcrumbSections', () => {
  test.each([
    ['test', [
      { id: 'test', title: '1 test title' },
    ]],
    ['test/child1', [
      { id: 'test', title: '1 test title' },
      { id: 'test/child1', title: '1.1 test child1 title' },
    ]],
    ['test/child1/child12', [
      { id: 'test', title: '1 test title' },
      { id: 'test/child1', title: '1.1 test child1 title' },
      { id: 'test/child1/child12', title: '1.1.2 test child12 title' },
    ]],
  ])('%s', (sectionId, crumbs) => {
    state = setCurrentSection(state, sectionId)
    expect(sectionSelectors.getBreadcrumbSections(state)).toEqual(crumbs)
  })
})

describe('getNextPrevSections', () => {
  test.each([
    ['test', null, 'test/child1'],
    ['test/child1', 'test', 'test/child1/child11'],
    ['test/child1/child12', 'test/child1/child11', 'test/child2'],
    ['test/child2', 'test/child1/child12', null],
  ])('%s', (sectionId, expPrevId, expNextId) => {
    state = setCurrentSection(state, sectionId)
    const { prevId, nextId } = sectionSelectors.getNextPrevSections(state)
    expect(prevId).toEqual(expPrevId)
    expect(nextId).toEqual(expNextId)
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

describe('makeGetSectionLink', () => {
  it('calls makeMakeGetContentLink', () => {
    sectionSelectors.makeGetSectionLink()
    expect(makeMakeGetContentLink).toBeCalledWith('Section')
  })
})
