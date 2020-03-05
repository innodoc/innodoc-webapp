import orm from '../orm'

import {
  changeCourse,
  loadSectionFailure,
  loadPageFailure,
  setServerConfiguration,
} from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import { clearMessage, showMessage, toggleSidebar } from '../actions/ui'

describe('App', () => {
  let session

  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
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

    test('setServerConfiguration', () => {
      session.App.reducer(
        setServerConfiguration(
          'https://app.example.com/',
          'https://content.example.com/',
          'https://cdn.example.com/',
          'sec',
          'p'
        ),
        session.App
      )
      const app = session.App.first().ref
      expect(app.appRoot).toEqual('https://app.example.com/')
      expect(app.contentRoot).toEqual('https://content.example.com/')
      expect(app.staticRoot).toEqual('https://cdn.example.com/')
      expect(app.sectionPathPrefix).toEqual('sec')
      expect(app.pagePathPrefix).toEqual('p')
    })

    test('changeCourse', () => {
      session.App.reducer(changeCourse({ id: 17 }), session.App)
      expect(session.App.first().ref.currentCourseId).toEqual(17)
    })

    test('changeLanguage', () => {
      session.App.reducer(changeLanguage('en'), session.App)
      expect(session.App.first().ref.language).toEqual('en')
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
