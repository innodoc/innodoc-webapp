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

  test('getSectionMeta', () => {
    expect(selectors.getSectionMeta(state, 'en', 'TEST01/foo/bar')).toEqual({
      title: 'bar section',
      id: 'bar',
    })
  })

  test('getSectionLevel', () => {
    expect(selectors.getSectionLevel(state, 'TEST01/foo/bar')).toEqual(3)
  })

  test('getSectionTitle', () => {
    expect(selectors.getSectionTitle(state, 'en', 'TEST01'))
      .toEqual('TEST01 section')
    expect(selectors.getSectionTitle(state, 'en', 'TEST01/foo'))
      .toEqual('foo section')
    expect(selectors.getSectionTitle(state, 'en', 'TEST01/foo/foo-test'))
      .toEqual('foo test section')
    expect(selectors.getSectionTitle(state, 'en', 'bla'))
      .toEqual(undefined)
    expect(selectors.getSectionTitle(state, 'en', undefined))
      .toEqual(undefined)
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

  test('getPrevSectionId', () => {
    expect(selectors.getPrevSectionId(state, 'en', 'TEST01/foo/bar'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getPrevSectionId(state, 'en', 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo')
    expect(selectors.getPrevSectionId(state, 'en', 'TEST01/foo'))
      .toEqual('TEST01')
    expect(selectors.getPrevSectionId(state, 'en', 'TEST01'))
      .toEqual(undefined)
  })

  test('getNextSectionId', () => {
    expect(selectors.getNextSectionId(state, 'en', 'TEST01'))
      .toEqual('TEST01/foo')
    expect(selectors.getNextSectionId(state, 'en', 'TEST01/foo'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getNextSectionId(state, 'en', 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo/bar')
    expect(selectors.getNextSectionId(state, 'en', 'TEST01/foo/bar'))
      .toEqual(undefined)
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
