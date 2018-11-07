import orm from '../orm'
import selectors from './app'

// Create/Mock state
const dummyState = (() => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { App } = session

  // Creating default app state
  App.create({
    id: 0,
    contentRoot: 'root/to/conent',
    currentSectionId: 'current/section/id',
    error: 'error',
    language: 'en',
    message: 'custom message',
    sidebarVisible: true,
  })

  return {
    db: state,
  }
})()

describe('app selectors', () => {
  test('get app state', () => {
    expect(selectors.getAppState(dummyState)).toEqual(dummyState.db.App.itemsById[0])
  })

  test('get language', () => {
    expect(selectors.getLanguage(dummyState)).toEqual('en')
  })

  test('get sidebarVisible', () => {
    expect(selectors.getSidebarVisible(dummyState)).toEqual(true)
  })

  test('get message', () => {
    expect(selectors.getMessage(dummyState)).toEqual('custom message')
  })

  test('get error', () => {
    expect(selectors.getError(dummyState)).toEqual('error')
  })

  test('get content root', () => {
    expect(selectors.getContentRoot(dummyState)).toEqual('root/to/conent')
  })

  test('get current section id', () => {
    expect(selectors.getCurrentSectionId(dummyState)).toEqual('current/section/id')
  })
})
