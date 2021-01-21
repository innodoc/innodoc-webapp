import orm from '../orm'

import {
  changeCourse,
  contentNotFound,
  routeChangeStart,
  setServerConfiguration,
} from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import { toggleSidebar } from '../actions/ui'
import { userLoggedIn, userLoggedOut } from '../actions/user'

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
    expect(app.ftSearchEnabled).toBe(false)
    expect(app.staticRoot).toBe('')
    expect(app.show404).toBe(false)
    expect(app.sidebarVisible).toBe(false)
  })

  describe('reducer', () => {
    test('setServerConfiguration', () => {
      session.App.reducer(
        setServerConfiguration(
          'https://app.example.com/',
          'https://content.example.com/',
          false,
          'https://cdn.example.com/',
          'csrfToken123!',
          'sec',
          'p',
          'content.pdf'
        ),
        session.App
      )
      const app = session.App.first().ref
      expect(app.appRoot).toEqual('https://app.example.com/')
      expect(app.contentRoot).toEqual('https://content.example.com/')
      expect(app.ftSearchEnabled).toBe(false)
      expect(app.staticRoot).toEqual('https://cdn.example.com/')
      expect(app.csrfToken).toEqual('csrfToken123!')
      expect(app.sectionPathPrefix).toEqual('sec')
      expect(app.pagePathPrefix).toEqual('p')
      expect(app.pdfFilename).toEqual('content.pdf')
    })

    test('changeCourse', () => {
      session.App.reducer(changeCourse({ id: 17 }), session.App)
      expect(session.App.first().ref.currentCourseId).toEqual(17)
    })

    test('contentNotFound', () => {
      session.App.reducer(contentNotFound(), session.App)
      expect(session.App.first().ref.show404).toEqual(true)
    })

    test('routeChangeStart', () => {
      session.App.reducer(routeChangeStart(), session.App)
      expect(session.App.first().ref.show404).toEqual(false)
    })

    test('changeLanguage', () => {
      session.App.reducer(changeLanguage('en'), session.App)
      expect(session.App.first().ref.language).toEqual('en')
    })

    test('userLoggedIn', () => {
      session.App.reducer(userLoggedIn('alice@example.com'), session.App)
      expect(session.App.first().ref.loggedInEmail).toEqual('alice@example.com')
    })

    test('userLoggedOut', () => {
      session.App.first().set('userLoggedIn', 'alice@example.com')
      session.App.reducer(userLoggedOut(), session.App)
      expect(session.App.first().ref.loggedInEmail).toBeUndefined()
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
