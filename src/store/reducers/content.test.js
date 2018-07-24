import contentReducer, { selectors } from './content'
import { loadSection, loadSectionSuccess } from '../actions/content'
import defaultInitialState from '../defaultInitialState'

describe('content selectors', () => {
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

  it('should select loading', () => {
    expect(selectors.getContentLoading(state)).toEqual(false)
  })

  it('should select current section ID', () => {
    expect(selectors.getCurrentSectionId(state)).toEqual('TEST01/foo/bar')
  })

  it('should select section content', () => {
    expect(selectors.getSectionContent(state, 'TEST01/foo/bar')).toEqual(
      [{ t: 'Para', c: 'Lorem ipsum.' }]
    )
  })

  it('should select TOC', () => {
    expect(selectors.getToc(state)).toEqual(state.content.toc)
  })

  it('should select section meta', () => {
    expect(selectors.getSectionMeta(state, 'TEST01/foo/bar')).toEqual({
      title: 'bar section',
      id: 'bar',
    })
  })

  it('should select section level', () => {
    expect(selectors.getSectionLevel(state, 'TEST01/foo/bar')).toEqual(3)
  })
})

describe('content reducer', () => {
  const initialState = defaultInitialState.content

  it('should return the initial state', () => {
    expect(contentReducer(undefined, {})).toEqual(initialState)
  })

  const sectionData = {
    id: 78,
    content: [{ t: 'p', c: 'foo' }],
  }

  it('should handle LOAD_SECTION', () => {
    const newState = contentReducer(initialState, loadSection(sectionData.id))
    expect(newState.loading).toEqual(true)
    expect(newState.currentSectionId).toEqual(null)
  })

  it('should handle LOAD_SECTION_SUCCESS', () => {
    const newState = contentReducer(initialState, loadSectionSuccess(sectionData))
    expect(newState.loading).toEqual(false)
    expect(newState.currentSectionId).toEqual(sectionData.id)
    expect(newState.sections[sectionData.id]).toEqual(sectionData.content)
  })
})
