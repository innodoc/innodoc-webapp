import contentReducer from './content'
import {
  loadManifestSuccess,
  loadSection,
  loadSectionFailure,
  loadSectionSuccess,
  setContentRoot,
} from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import defaultInitialState, { defaultContentData } from '../defaultInitialState'

const state = {
  content: {
    currentSectionPath: 'TEST01/foo/bar',
    data: {
      en: {
        sections: {
          'TEST01/foo/bar': [{ t: 'Para', c: 'Lorem ipsum.' }],
        },
        toc: [
          {
            title: 'TEST01 section',
            id: 'TEST01',
            children: [
              {
                title: 'foo section',
                id: 'foo',
                children: [
                  {
                    title: 'foo test section',
                    id: 'foo-test',
                  },
                  {
                    title: 'bar section',
                    id: 'bar',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
}

describe('contentReducer', () => {
  const initialContentState = defaultInitialState.content

  test('initialState', () => {
    expect(contentReducer(undefined, {})).toEqual(initialContentState)
  })

  test('LOAD_MANIFEST_SUCCESS', () => {
    const newState = contentReducer(initialContentState, loadManifestSuccess({
      language: 'en',
      content: ['toccontent'],
    }))
    expect(newState.data.en.toc).toEqual(['toccontent'])
  })

  test('LOAD_SECTION', () => {
    const newState = contentReducer(initialContentState, loadSection(78))
    expect(newState.currentSectionPath).toEqual(null)
  })

  test('LOAD_SECTION_SUCCESS', () => {
    const newState = contentReducer(state.content, loadSectionSuccess({
      language: 'en',
      sectionPath: 'welcome/bar',
      content: [{ t: 'p', c: 'bar' }],
    }))
    expect(newState.currentSectionPath).toEqual('welcome/bar')
    expect(newState.data.en.sections).toEqual({
      'TEST01/foo/bar': [{ t: 'Para', c: 'Lorem ipsum.' }],
      'welcome/bar': [{ t: 'p', c: 'bar' }],
    })
  })

  test('LOAD_SECTION_FAILURE', () => {
    const error = { msg: 'Mighty Errror!' }
    const newState = contentReducer(state.content, loadSectionFailure(error))
    expect(newState.error).toEqual(error)
  })

  test('SET_CONTENT_ROOT', () => {
    const newState = contentReducer(initialContentState, setContentRoot('https://content.foo.bar'))
    expect(newState.contentRoot).toEqual('https://content.foo.bar')
  })

  test('CHANGE_LANGUAGE (en -> de)', () => {
    const newState = contentReducer(state.content, changeLanguage('de'))
    expect(newState.data.en).toEqual(state.content.data.en)
    expect(newState.data.de).toEqual(defaultContentData)
  })

  test('CHANGE_LANGUAGE (en -> en)', () => {
    const newState = contentReducer(state.content, changeLanguage('en'))
    expect(newState.data.en).toEqual(state.content.data.en)
    expect(newState.data.de).not.toBeDefined()
  })
})
