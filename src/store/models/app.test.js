import orm from '../orm'
import AppModel from './app'
import { changeCourse, loadSectionFailure, setContentRoot } from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.session(state)
  session.App.create({ id: 0 })
  return session
}

describe('reducer', () => {
  test('load section failure', () => {
    const session = createEmptyState()
    AppModel.reducer(loadSectionFailure('no error'), session.App)
    expect(session.App.first().ref.error).toEqual('no error')
  })

  test('set content root', () => {
    const session = createEmptyState()
    AppModel.reducer(setContentRoot('nowhere'), session.App)
    expect(session.App.first().ref.contentRoot).toEqual('nowhere')
  })

  test('change course', () => {
    const session = createEmptyState()
    AppModel.reducer(changeCourse({ id: 0 }), session.App)
    expect(session.App.first().ref.currentCourseId).toEqual(0)
  })

  test('change language', () => {
    const session = createEmptyState()
    AppModel.reducer(changeLanguage('en'), session.App)
    expect(session.App.first().ref.language).toEqual('en')
  })

  test('clear message', () => {
    const session = createEmptyState()
    session.App.withId(0).set('message', 'blub')
    AppModel.reducer(clearMessage(), session.App)
    expect(session.App.first().ref.message).toEqual(null)
  })

  test('show message', () => {
    const session = createEmptyState()
    AppModel.reducer(showMessage('heyho'), session.App)
    expect(session.App.first().ref.message).toEqual('heyho')
  })

  test('toggle sidebar', () => {
    const session = createEmptyState()
    const app = session.App.first()
    const isVisible = app.ref.sidebarVisible
    AppModel.reducer(toggleSidebar(), session.App)
    expect(app.ref.sidebarVisible).toEqual(!isVisible)
  })
})
