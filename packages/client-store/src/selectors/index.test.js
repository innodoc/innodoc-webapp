import orm from '../orm'
import appSelectors, { makeMakeGetContentLink, selectId } from '.'

const app = {
  id: 0,
  contentRoot: 'http://root/to/conent',
  currentCourse: 5,
  language: 'en',
  message: 'custom message',
  show404: false,
  sidebarVisible: true,
  staticRoot: 'https://cdn.example.com/',
}

let state

beforeEach(() => {
  const ormState = orm.getEmptyState()
  const session = orm.mutableSession(ormState)
  session.App.create(app)
  session.Section.create({
    id: 'foo/bar',
    title: { en: 'Foo bar' },
    ord: [0],
  })
  session.Page.create({
    id: 'quz',
    title: { en: 'Quz' },
    ord: 0,
  })
  state = { orm: ormState }
})

describe('appSelectors', () => {
  test('getApp', () => expect(appSelectors.getApp(state)).toEqual(app))
})

test('selectId', () => expect(selectId(state, 12)).toBe(12))

describe.each([
  ['Section', 'foo/bar', '1 Foo bar'],
  ['Page', 'quz', 'Quz'],
])('makeMakeGetContentLink (%s)', (modelName, contentId, title) => {
  let makeGetContentLink
  let getContentLink
  beforeEach(() => {
    makeGetContentLink = makeMakeGetContentLink(modelName)
    getContentLink = makeGetContentLink()
  })

  it('returns content data w/o hash', () => {
    const contentLink = getContentLink(state, contentId)
    expect(contentLink.contentId).toBe(contentId)
    expect(contentLink.title).toBe(title)
    expect(contentLink.hash).toBeUndefined()
  })

  it('returns content data and hash', () => {
    const contentLink = getContentLink(state, `${contentId}#baz`)
    expect(contentLink.contentId).toBe(contentId)
    expect(contentLink.title).toBe(title)
    expect(contentLink.hash).toBe('baz')
  })

  it('notices unknown content', () => {
    const contentLink = getContentLink(state, 'does/not/exist')
    expect(contentLink.contentId).toBe('does/not/exist')
    expect(contentLink.title).toMatch('UNKNOWN')
  })
})
