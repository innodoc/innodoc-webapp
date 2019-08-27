import defaultInitialState from '../defaultInitialState'
import orm from '../orm'
import pageSelectors from './page'
import { makeMakeGetContentLink } from '.'

jest.mock('.', () => {
  const actualAppImport = jest.requireActual('.')
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
beforeEach(() => {
  const session = orm.session(defaultInitialState().orm)
  const app = session.App.first()
  const course = session.Course.create({
    languages: ['en'],
    title: 'courseTitle',
  })
  Object.values(pages).forEach((page) => session.Page.create(page))
  app.set('language', 'en')
  app.set('currentCourse', course.id)
  state = { orm: session.state }
})

const setCurrentpage = (localState, pageId) => {
  const session = orm.session(localState.orm)
  session.Course.first().set('currentPage', pageId)
  return { orm: session.state }
}

describe('pageSelectors', () => {
  beforeEach(() => {
    state = setCurrentpage(state, 'bar')
  })

  test.each([
    ['foo', true],
    ['does-not-exist', false],
  ])('sectionExists: %s', (pageId, exists) => {
    expect(pageSelectors.pageExists(state, pageId)).toBe(exists)
  })

  test.each([
    [pages.bar],
    [null],
  ])('getCurrentPage (%s)', (currentPage) => {
    state = setCurrentpage(state, currentPage ? currentPage.id : undefined)
    expect(pageSelectors.getCurrentPage(state)).toEqual(currentPage)
  })

  test('getPage', () => {
    expect(pageSelectors.getPage(state, 'foo')).toEqual(pages.foo)
  })

  test('getFooterPages', () => {
    expect(pageSelectors.getFooterPages(state)).toEqual([pages.bar, pages.baz])
  })

  test('getNavPages', () => {
    expect(pageSelectors.getNavPages(state)).toEqual([pages.qux, pages.foo])
  })
})

describe('makeGetPageLink', () => {
  it('calls makeMakeGetContentLink', () => {
    pageSelectors.makeGetPageLink()
    expect(makeMakeGetContentLink).toBeCalledWith('Page')
  })
})
