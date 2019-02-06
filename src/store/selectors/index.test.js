import orm from '../orm'
import appSelectors from '.'

const dummyApp = {
  id: 0,
  contentRoot: 'http://root/to/conent',
  currentCourse: 5,
  error: 'error',
  language: 'en',
  message: 'custom message',
  sidebarVisible: true,
  staticRoot: 'https://cdn.example.com/',
}

// Create/Mock state
const dummyState = (() => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  session.App.create(dummyApp)
  return { orm: state }
})()

describe('appSelectors', () => {
  test('getApp', () => {
    expect(appSelectors.getApp(dummyState)).toEqual(dummyApp)
  })

  test('getOrmState', () => {
    expect(appSelectors.getOrmState(dummyState)).toBe(dummyState.orm)
  })
})
