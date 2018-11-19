import orm from '../orm'
import AppModel from './app'
import {
  loadManifestSuccess,
  loadSection,
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
    currentSectionId: null,
  })

  return state
}

describe('reducer', () => {
  test('load manifest', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    session.App.withId(0).set('language', 'foo')
    AppModel.reducer(loadManifestSuccess({
      content: {
        languages: ['foo'],
        title: { foo: ['bar'] },
        toc: [{ id: 'test' }],
      },
      parsed: false,
    }), session.App)

    expect(session.state.App.itemsById[0].languages).toEqual(['foo'])
    expect(session.state.App.itemsById[0].title).toEqual({ foo: ['bar'] })
  })

  test('load manifest should throw error', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    expect(() => AppModel.reducer(loadManifestSuccess({ parsed: false }), session.App)).toThrow()
    expect(() => AppModel.reducer(loadManifestSuccess({ content: {}, parsed: false }), session.App))
      .toThrow()
    expect(() => AppModel.reducer(loadManifestSuccess({
      content: { languages: [] },
      parsed: false,
    }), session.App)).toThrow()
    expect(() => AppModel.reducer(loadManifestSuccess({
      content: { languages: ['foobar'] },
      parsed: false,
    }), session.App)).toThrow()
    expect(() => AppModel.reducer(loadManifestSuccess({
      content: { languages: ['foobar'], title: [] },
      parsed: false,
    }), session.App)).toThrow()
  })

  test('load manifest with homeLink', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    session.App.withId(0).set('language', 'foo')
    AppModel.reducer(loadManifestSuccess({
      content: {
        homeLink: 'test/child1',
        languages: ['foo'],
        title: { foo: ['bar'] },
      },
      parsed: false,
    }), session.App)

    expect(session.state.App.itemsById[0].homeLink).toEqual('test/child1')
  })

  test('load manifest without homeLink', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    session.App.withId(0).set('language', 'foo')
    AppModel.reducer(loadManifestSuccess({
      content: {
        languages: ['foo'],
        title: { foo: ['bar'] },
        toc: [{ id: 'blub' }],
      },
      parsed: false,
    }), session.App)

    expect(session.state.App.itemsById[0].homeLink).toEqual('blub')
  })

  test('load section', () => {
    const state = createEmptyState()

    const session = orm.session(state)
    session.App.withId(0).set('currentSectionId', 'bla')
    AppModel.reducer(loadSection(), session.App)

    expect(session.state.App.itemsById[0].currentSectionId).toEqual(null)
  })

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
