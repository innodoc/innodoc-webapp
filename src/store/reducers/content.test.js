import contentReducer from './content'
import { loadSection, loadSectionSuccess } from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import defaultInitialState, { defaultContentData } from '../defaultInitialState'

const state = {
  content: {
    currentSectionId: 'TEST01/foo/bar',
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

  test('LOAD_SECTION', () => {
    const newState = contentReducer(initialContentState, loadSection(78))
    expect(newState.currentSectionId).toEqual(null)
  })

  test('LOAD_SECTION_SUCCESS', () => {
    const newState = contentReducer(state.content, loadSectionSuccess({
      language: 'en',
      id: 'welcome/bar',
      content: [{ t: 'p', c: 'bar' }],
    }))
    expect(newState.currentSectionId).toEqual('welcome/bar')
    expect(newState.data.en.sections).toEqual({
      'TEST01/foo/bar': [{ t: 'Para', c: 'Lorem ipsum.' }],
      'welcome/bar': [{ t: 'p', c: 'bar' }],
    })
  })

  test('CHANGE_LANGUAGE', () => {
    const newState = contentReducer(initialContentState, changeLanguage('de'))
    expect(newState.data.de).toEqual(defaultContentData)
  })
})
