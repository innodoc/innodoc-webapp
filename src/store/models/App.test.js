import orm from '../orm'
import {
  changeCourse,
  clearError,
  loadSectionFailure,
  loadPageFailure,
  setContentRoot,
  setStaticRoot,
} from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'

let state
let session

describe('App', () => {
  beforeEach(() => {
    state = orm.getEmptyState()
    session = orm.session(state)
    session.App.create({})
  })

  it('should instantiate', () => {
    const app = session.App.first()
    expect(app.id).toBe(0)
    expect(app.contentRoot).toBe('')
    expect(app.staticRoot).toBe('')
  })

  describe('reducer', () => {
    test('loadSectionFailure', () => {
      session.App.reducer(loadSectionFailure('section error'), session.App)
      expect(session.App.first().ref.error).toEqual('section error')
    })

    test('loadPageFailure', () => {
      session.App.reducer(loadPageFailure('page error'), session.App)
      expect(session.App.first().ref.error).toEqual('page error')
    })

    test('clearError', () => {
      session.App.first().set('error', {})
      session.App.reducer(clearError(), session.App)
      expect(session.App.first().ref.error).toEqual(null)
    })

    test('setContentRoot', () => {
      session.App.reducer(setContentRoot('https://content.example.com'), session.App)
      expect(session.App.first().ref.contentRoot).toEqual('https://content.example.com')
    })

    test('setStaticRoot', () => {
      session.App.reducer(setStaticRoot('https://cdn.example.com'), session.App)
      expect(session.App.first().ref.staticRoot).toEqual('https://cdn.example.com')
    })

    test('changeCourse', () => {
      session.App.reducer(changeCourse({ id: 17 }), session.App)
      expect(session.App.first().ref.currentCourse).toEqual(17)
    })

    test('changeLanguage', () => {
      session.App.reducer(changeLanguage('en'), session.App)
      expect(session.App.first().ref.language).toEqual('en')
    })

    test('clearMessage', () => {
      session.App.first().set('message', 'foo')
      session.App.reducer(clearMessage(), session.App)
      expect(session.App.first().ref.message).toEqual(null)
    })

    test('showMessage', () => {
      session.App.reducer(showMessage('bar'), session.App)
      expect(session.App.first().ref.message).toEqual('bar')
    })

    test('toggleSidebar', () => {
      const app = session.App.first()
      const isVisible = app.ref.sidebarVisible
      session.App.reducer(toggleSidebar(), session.App)
      expect(app.ref.sidebarVisible).toEqual(!isVisible)
      session.App.reducer(toggleSidebar(), session.App)
      expect(app.ref.sidebarVisible).toEqual(isVisible)
    })

    test('no-op action', () => {
      session.App.reducer({ type: 'DOES-NOT-EXIST' }, session.App)
    })
  })
})
