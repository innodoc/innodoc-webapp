import orm from '../orm'
import AppModel from './app'
import {
  changeCourse,
  loadSectionFailure,
  setContentRoot,
} from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'

const createEmptyState = () => {
  const state = orm.getEmptyState()
  const session = orm.mutableSession(state)
  const { App } = session

  // Creating default app state
  App.create({
    id: 0,
  })

  return state
}

describe('reducer', () => {
  test('load section failure', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    AppModel.reducer(loadSectionFailure('no error'), session.App)

    expect(session.state.App.itemsById[0].error).toEqual('no error')
  })

  test('set content root', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    AppModel.reducer(setContentRoot('nowhere'), session.App)

    expect(session.state.App.itemsById[0].contentRoot).toEqual('nowhere')
  })

  test('change course', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    AppModel.reducer(changeCourse(0), session.App)

    expect(session.state.App.itemsById[0].currentCourseId).toEqual(0)
  })

  test('change language', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    AppModel.reducer(changeLanguage('en'), session.App)

    expect(session.state.App.itemsById[0].language).toEqual('en')
  })

  test('clear message', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    session.App.withId(0).set('message', 'blub')
    AppModel.reducer(clearMessage(), session.App)

    expect(session.state.App.itemsById[0].message).toEqual(null)
  })

  test('show message', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    AppModel.reducer(showMessage('heyho'), session.App)

    expect(session.state.App.itemsById[0].message).toEqual('heyho')
  })

  test('toggle sidebar', () => {
    const state = createEmptyState()
    const isVisible = state.App.itemsById[0].sidebarVisible

    const session = orm.session(state)
    AppModel.reducer(toggleSidebar(), session.App)

    expect(session.state.App.itemsById[0].sidebarVisible).toEqual(!isVisible)
  })
})
