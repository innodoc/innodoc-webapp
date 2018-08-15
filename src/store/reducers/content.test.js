import contentReducer, { selectors } from './content'
import { loadSection, loadSectionSuccess } from '../actions/content'
import { changeLanguage } from '../actions/i18n'
import defaultInitialState, { defaultContentData } from '../defaultInitialState'

const state = {
  content: {
    loading: false,
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

describe('contentSelectors', () => {
  test('getContentLoading', () => {
    expect(selectors.getContentLoading(state)).toEqual(false)
  })

  test('getCurrentSectionId', () => {
    expect(selectors.getCurrentSectionId(state)).toEqual('TEST01/foo/bar')
  })

  it('should return languageContent', () => {
    expect(selectors.getLanguageContent(state, 'en')).toEqual(state.content.data.en)
  })

  test('getSectionContent', () => {
    expect(selectors.getSectionContent(state, 'en', 'TEST01/foo/bar')).toEqual(
      [{ t: 'Para', c: 'Lorem ipsum.' }]
    )
  })

  test('getToc', () => {
    expect(selectors.getToc(state, 'en')).toEqual(state.content.data.en.toc)
  })

  test('getSection', () => {
    expect(selectors.getSection(state, 'en', 'TEST01/foo/bar')).toEqual({
      title: 'bar section',
      id: 'bar',
    })
  })

  test('getSectionLevel', () => {
    expect(selectors.getSectionLevel(state, 'TEST01/foo/bar')).toEqual(3)
  })

  test('getCurrentBreadcrumbSections', () => {
    expect(selectors.getCurrentBreadcrumbSections(state, 'en'))
      .toEqual(
        [
          {
            id: 'TEST01',
            title: 'TEST01 section',
          },
          {
            id: 'TEST01/foo',
            title: 'foo section',
          },
          {
            id: 'TEST01/foo/bar',
            title: 'bar section',
          },
        ]
      )
  })
})

describe('contentReducer', () => {
  const initialContentState = defaultInitialState.content

  test('initialState', () => {
    expect(contentReducer(undefined, {})).toEqual(initialContentState)
  })

  test('LOAD_SECTION', () => {
    const newState = contentReducer(initialContentState, loadSection(78))
    expect(newState.loading).toEqual(true)
    expect(newState.currentSectionId).toEqual(null)
  })

  test('LOAD_SECTION_SUCCESS', () => {
    const newState = contentReducer(state.content, loadSectionSuccess({
      language: 'en',
      id: 'welcome/bar',
      content: [{ t: 'p', c: 'bar' }],
    }))
    expect(newState.loading).toEqual(false)
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
