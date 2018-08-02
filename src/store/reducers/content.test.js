import contentReducer, { selectors } from './content'
import { loadSection, loadSectionSuccess } from '../actions/content'
import defaultInitialState from '../defaultInitialState'

describe('contentSelectors', () => {
  const state = {
    content: {
      loading: false,
      currentSectionId: 'TEST01/foo/bar',
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
  }

  test('getContentLoading', () => {
    expect(selectors.getContentLoading(state)).toEqual(false)
  })

  test('getCurrentSectionId', () => {
    expect(selectors.getCurrentSectionId(state)).toEqual('TEST01/foo/bar')
  })

  test('getSectionContent', () => {
    expect(selectors.getSectionContent(state, 'TEST01/foo/bar')).toEqual(
      [{ t: 'Para', c: 'Lorem ipsum.' }]
    )
  })

  test('getToc', () => {
    expect(selectors.getToc(state)).toEqual(state.content.toc)
  })

  test('getSectionMeta', () => {
    expect(selectors.getSectionMeta(state, 'TEST01/foo/bar')).toEqual({
      title: 'bar section',
      id: 'bar',
    })
  })

  test('getSectionLevel', () => {
    expect(selectors.getSectionLevel(state, 'TEST01/foo/bar')).toEqual(3)
  })

  test('getBreadcrumbSections', () => {
    expect(selectors.getBreadcrumbSections(state, selectors.getCurrentSectionId(state)))
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
    expect(selectors.getPrevSectionId(state, 'TEST01/foo/bar'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getPrevSectionId(state, 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo')
    expect(selectors.getPrevSectionId(state, 'TEST01/foo'))
      .toEqual('TEST01')
    expect(selectors.getPrevSectionId(state, 'TEST01'))
      .toEqual(undefined)
  })

  test('getNextSectionId', () => {
    expect(selectors.getNextSectionId(state, 'TEST01'))
      .toEqual('TEST01/foo')
    expect(selectors.getNextSectionId(state, 'TEST01/foo'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getNextSectionId(state, 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo/bar')
    expect(selectors.getNextSectionId(state, 'TEST01/foo/bar'))
      .toEqual(undefined)
  })
})

describe('contentReducer', () => {
  const initialState = defaultInitialState.content

  test('initialState', () => {
    expect(contentReducer(undefined, {})).toEqual(initialState)
  })

  const sectionData = {
    id: 78,
    content: [{ t: 'p', c: 'foo' }],
  }

  test('LOAD_SECTION', () => {
    const newState = contentReducer(initialState, loadSection(sectionData.id))
    expect(newState.loading).toEqual(true)
    expect(newState.currentSectionId).toEqual(null)
  })

  test('LOAD_SECTION_SUCCESS', () => {
    const newState = contentReducer(initialState, loadSectionSuccess(sectionData))
    expect(newState.loading).toEqual(false)
    expect(newState.currentSectionId).toEqual(sectionData.id)
    expect(newState.sections[sectionData.id]).toEqual(sectionData.content)
  })
})
