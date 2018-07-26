import { selectors } from './content'

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

  it('should select TOC titles from section ID', () => {
    expect(selectors.getCurrentTOCTitles(state)).toEqual(['TEST01 section', 'foo section', 'bar section'])
  })
})
