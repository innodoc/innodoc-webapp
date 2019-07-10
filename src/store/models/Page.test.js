import orm from '../orm'
import PageModel from './Page'
import { loadManifestSuccess, loadPageSuccess } from '../actions/content'

const pages = [
  {
    id: 'foo',
    icon: 'foo',
    link_in_footer: true,
    link_in_nav: false,
    ord: 0,
    title: { en: 'Foo title' },
  },
  {
    id: 'bar',
    icon: 'bar',
    link_in_footer: false,
    link_in_nav: true,
    ord: 1,
    title: { en: 'Bar title' },
  },
]

const loadPages = (state) => {
  const session = orm.session(state)
  session.Page.create({
    id: 'foo',
    icon: 'foo',
    inFooter: true,
    inNav: false,
    ord: 0,
    title: { en: 'Foo title' },
  })
  session.Page.create({
    id: 'bar',
    icon: 'bar',
    inFooter: false,
    inNav: true,
    ord: 1,
    title: { en: 'Bar title' },
  })
  return session.state
}

let state
let session
let loadedPages

describe('Page', () => {
  beforeEach(() => {
    state = orm.getEmptyState()
    session = orm.session(state)
    loadedPages = loadPages(state)
  })

  it('should instantiate', () => {
    const page = session.Page.create({ id: 'foo' })
    expect(page.id).toBe('foo')
    expect(page.inFooter).toBe(false)
    expect(page.inNav).toBe(false)
  })

  describe('reducer', () => {
    test('loadManifestSuccess', () => {
      PageModel.reducer(loadManifestSuccess({ content: { pages } }), session.Page)
      expect(session.state).toEqual(loadedPages)
    })

    test('loadPageSuccess', () => {
      session = orm.session(loadedPages)
      const action = loadPageSuccess({
        content: 'Foo content',
        contentId: 'foo',
        language: 'en',
      })
      PageModel.reducer(action, session.Page)
      const expectedSession = orm.session(loadedPages)
      expectedSession.Page.withId('foo').set('content', { en: 'Foo content' })
      expect(session.state).toEqual(expectedSession.state)
    })

    test('no-op action', () => {
      PageModel.reducer({ type: 'DOES-NOT-EXIST' }, session.Page)
    })
  })

  test('displayTitle', () => {
    session = orm.session(loadedPages)
    expect(session.Page.first().getDisplayTitle('en')).toBe('Foo title')
  })
})
