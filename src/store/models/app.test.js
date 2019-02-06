import orm from '../orm'
import AppModel from './app'
import {
  changeCourse,
  clearError,
  loadSectionFailure,
  setContentRoot,
  setStaticRoot,
} from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.session(state)
  session.App.create({ id: 0 })
  return session
}

describe('reducer', () => {
  test('loadSectionFailure', () => {
    const session = createEmptyState()
    AppModel.reducer(loadSectionFailure('error message'), session.App)
    expect(session.App.first().ref.error).toEqual('error message')
  })

  test('clearError', () => {
    const session = createEmptyState()
    AppModel.reducer(clearError(), session.App)
    expect(session.App.first().ref.error).toEqual(null)
  })

  test('setContentRoot', () => {
    const session = createEmptyState()
    AppModel.reducer(setContentRoot('https://content.example.com'), session.App)
    expect(session.App.first().ref.contentRoot).toEqual('https://content.example.com')
  })

  test('setStaticRoot', () => {
    const session = createEmptyState()
    AppModel.reducer(setStaticRoot('https://cdn.example.com'), session.App)
    expect(session.App.first().ref.staticRoot).toEqual('https://cdn.example.com')
  })

  test('changeCourse', () => {
    const session = createEmptyState()
    AppModel.reducer(changeCourse({ id: 0 }), session.App)
    expect(session.App.first().ref.currentCourse).toEqual(0)
  })

  test('changeLanguage', () => {
    const session = createEmptyState()
    AppModel.reducer(changeLanguage('en'), session.App)
    expect(session.App.first().ref.language).toEqual('en')
  })

  test('clearMessage', () => {
    const session = createEmptyState()
    session.App.withId(0).set('message', 'foo')
    AppModel.reducer(clearMessage(), session.App)
    expect(session.App.first().ref.message).toEqual(null)
  })

  test('showMessage', () => {
    const session = createEmptyState()
    AppModel.reducer(showMessage('bar'), session.App)
    expect(session.App.first().ref.message).toEqual('bar')
  })

  test('toggleSidebar', () => {
    const session = createEmptyState()
    const app = session.App.first()
    const isVisible = app.ref.sidebarVisible
    AppModel.reducer(toggleSidebar(), session.App)
    expect(app.ref.sidebarVisible).toEqual(!isVisible)
    AppModel.reducer(toggleSidebar(), session.App)
    expect(app.ref.sidebarVisible).toEqual(isVisible)
  })
})
