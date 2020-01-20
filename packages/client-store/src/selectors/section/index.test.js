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
    parentId: undefined,
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
    },
    makeMakeGetContentLink: jest.fn(),
    selectId: actualAppImport.selectId,
  }
})

// let state
let session
beforeEach(() => {
  session = orm.mutableSession(defaultInitialState().orm)
  const app = session.App.first()
  const course = session.Course.create({
    homeLink: '/section/test',
    languages: ['en'],
    title: 'courseTitle',
  })
  Object.values(sections).forEach((section) => session.Section.create(section))
  app.set('language', 'en')
  app.set('currentCourseId', course.id)
})

const setCurrentSection = (sectionId) =>
  session.Course.first().set('currentSection', sectionId)
const getState = () => ({ orm: session.state })

describe('sectionSelectors', () => {
  beforeEach(() => setCurrentSection('test/child1'))

  test.each([
    ['test/child1/child11', true],
    ['does/not/exist', false],
  ])('sectionExists: %s', (sectionId, exists) =>
    expect(sectionSelectors.sectionExists(getState(), sectionId)).toBe(exists)
  )

  test.each(['test/child1', 'test/child1/child12'])(
    'getSection: %s',
    (sectionId) =>
      expect(sectionSelectors.getSection(getState(), sectionId)).toEqual(
        sections[sectionId]
      )
  )

  test('getCurrentSection', () =>
    expect(sectionSelectors.getCurrentSection(getState())).toEqual(
      sections['test/child1']
    ))

  test('getCurrentSubsections', () =>
    expect(sectionSelectors.getCurrentSubsections(getState())).toEqual([
      sections['test/child1/child11'],
      sections['test/child1/child12'],
    ]))

  test('getCurrentTitle', () =>
    expect(sectionSelectors.getCurrentTitle(getState())).toEqual(
      '1.1 test child1 title'
    ))
})

describe('getBreadcrumbSections', () => {
  test.each([
    ['test', [{ id: 'test', title: '1 test title' }]],
    [
      'test/child1',
      [
        { id: 'test', title: '1 test title' },
        { id: 'test/child1', title: '1.1 test child1 title' },
      ],
    ],
    [
      'test/child1/child12',
      [
        { id: 'test', title: '1 test title' },
        { id: 'test/child1', title: '1.1 test child1 title' },
        { id: 'test/child1/child12', title: '1.1.2 test child12 title' },
      ],
    ],
  ])('%s', (sectionId, crumbs) => {
    setCurrentSection(sectionId)
    expect(sectionSelectors.getBreadcrumbSections(getState())).toEqual(crumbs)
  })
})

describe('getNextPrevSections', () => {
  test.each([
    ['test', undefined, 'test/child1'],
    ['test/child1', 'test', 'test/child1/child11'],
    ['test/child1/child12', 'test/child1/child11', 'test/child2'],
    ['test/child2', 'test/child1/child12', undefined],
  ])('%s', (sectionId, expPrevId, expNextId) => {
    setCurrentSection(sectionId)
    const { prevId, nextId } = sectionSelectors.getNextPrevSections(getState())
    expect(prevId).toEqual(expPrevId)
    expect(nextId).toEqual(expNextId)
  })
})

describe('getToc', () => {
  test('getToc', () => {
    const toc = sectionSelectors.getToc(getState())
    expect(toc[0].id).toEqual('test')
    expect(toc[0].children[0].id).toEqual('test/child1')
    expect(toc[0].children[0].children[0].id).toEqual('test/child1/child11')
    expect(toc[0].children[0].children[1].id).toEqual('test/child1/child12')
    expect(toc[0].children[1].id).toEqual('test/child2')
  })
})

describe('makeGetSectionLink', () => {
  it('calls makeMakeGetContentLink', () => {
    expect(makeMakeGetContentLink).toBeCalledTimes(1)
    expect(makeMakeGetContentLink).toBeCalledWith('Section')
  })
})
