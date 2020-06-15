import initialState from '../initialState'
import orm from '../orm'
import pageSelectors from './page'
import { makeMakeGetContentLink } from '.'

jest.mock('.', () => {
  const actualAppImport = jest.requireActual('.')
  return {
    __esModule: true,
    default: {
      getApp: actualAppImport.default.getApp,
    },
    makeMakeGetContentLink: jest.fn(),
    selectId: actualAppImport.selectId,
  }
})

const pages = {
  foo: {
    content: { en: 'foo content' },
    id: 'foo',
    inFooter: false,
    inNav: true,
    ord: 1,
    title: { en: 'Foo title' },
  },
  qux: {
    content: { en: 'qux content' },
    id: 'qux',
    inFooter: false,
    inNav: true,
    ord: 0,
    title: { en: 'Qux title' },
  },
  bar: {
    content: { en: 'bar content' },
    id: 'bar',
    inFooter: true,
    inNav: false,
    ord: 0,
    title: { en: 'Bar title' },
  },
  baz: {
    content: { en: 'baz content' },
    id: 'baz',
    inFooter: true,
    inNav: false,
    ord: 1,
    title: { en: 'Baz title' },
  },
}

let state
let session
beforeEach(() => {
  session = orm.mutableSession(initialState().orm)
  const app = session.App.first()
  const course = session.Course.create({
    languages: ['en'],
    title: 'courseTitle',
  })
  Object.values(pages).forEach((page) => session.Page.create(page))
  app.set('language', 'en')
  app.set('currentCourseId', course.id)
  state = { orm: session.state }
})

describe('pageSelectors', () => {
  test.each([
    ['foo', true],
    ['baz', true],
    ['does-not-exist', false],
  ])('sectionExists: %s (%s)', (pageId, exists) =>
    expect(pageSelectors.pageExists(state, pageId)).toBe(exists)
  )

  test.each([
    ['foo', pages.foo],
    ['bar', pages.bar],
    [undefined, undefined],
  ])('getCurrentPage (%s)', (pageId, currentPage) => {
    session.Course.first().set('currentPageId', pageId)
    expect(pageSelectors.getCurrentPage(state)).toEqual(currentPage)
  })

  test('getPage', () =>
    expect(pageSelectors.getPage(state, 'foo')).toEqual(pages.foo))

  test('getFooterPages', () =>
    expect(pageSelectors.getFooterPages(state)).toEqual([pages.bar, pages.baz]))

  test('getNavPages', () =>
    expect(pageSelectors.getNavPages(state)).toEqual([pages.qux, pages.foo]))
})

describe('makeGetPageLink', () => {
  it('calls makeMakeGetContentLink', () => {
    expect(makeMakeGetContentLink).toBeCalledTimes(1)
    expect(makeMakeGetContentLink).toBeCalledWith('Page')
  })
})
