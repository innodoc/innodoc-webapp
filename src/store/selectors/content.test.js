import selectors, { findLastSubSectionPath } from './content'

jest.mock('./i18n.js', () => ({ getLanguage: () => 'en' }))

const state = {
  content: {
    contentRoot: 'https://content.foo.bar.com',
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

describe('contentSelectors helpers', () => {
  test('findLastSubSectionPath', () => {
    const { toc } = state.content.data.en
    expect(findLastSubSectionPath(toc, 'TEST01')).toEqual('TEST01/foo/bar')
    expect(findLastSubSectionPath(toc, 'TEST01/foo')).toEqual('TEST01/foo/bar')
    expect(findLastSubSectionPath(toc, 'TEST01/foo/foo-test')).toEqual('TEST01/foo/foo-test')
    expect(findLastSubSectionPath(toc, 'TEST01/foo/bar')).toEqual('TEST01/foo/bar')
  })
})

describe('contentSelectors', () => {
  test('getContentRoot', () => {
    expect(selectors.getContentRoot(state)).toEqual('https://content.foo.bar.com')
  })

  test('getCurrentSectionPath', () => {
    expect(selectors.getCurrentSectionPath(state)).toEqual('TEST01/foo/bar')
  })

  it('getContent', () => {
    expect(selectors.getContent(state)).toEqual(state.content.data.en)
  })

  test('getSectionContent', () => {
    expect(selectors.getSectionContent(state, 'TEST01/foo/bar')).toEqual(
      [{ t: 'Para', c: 'Lorem ipsum.' }]
    )
  })

  test('getToc', () => {
    expect(selectors.getToc(state)).toEqual(state.content.data.en.toc)
  })

  test('getSection', () => {
    expect(selectors.getSection(state, 'TEST01/foo/bar')).toEqual({
      title: 'bar section',
      id: 'bar',
    })
  })

  test('getSectionLevel', () => {
    expect(selectors.getSectionLevel(state, 'TEST01/foo/bar')).toEqual(3)
  })

  test('getSectionTitle', () => {
    expect(selectors.getSectionTitle(state, 'TEST01'))
      .toEqual('TEST01 section')
    expect(selectors.getSectionTitle(state, 'TEST01/foo'))
      .toEqual('foo section')
    expect(selectors.getSectionTitle(state, 'TEST01/foo/foo-test'))
      .toEqual('foo test section')
    expect(selectors.getSectionTitle(state, 'bla'))
      .toEqual(undefined)
    expect(selectors.getSectionTitle(state, undefined))
      .toEqual(undefined)
  })

  test('getBreadcrumbSections', () => {
    expect(selectors.getBreadcrumbSections(state))
      .toEqual(
        [
          {
            path: 'TEST01',
            title: 'TEST01 section',
          },
          {
            path: 'TEST01/foo',
            title: 'foo section',
          },
          {
            path: 'TEST01/foo/bar',
            title: 'bar section',
          },
        ]
      )
  })

  describe('prev/next section path', () => {
    test('getPrevSectionPath', () => {
      expect(selectors.getPrevSectionPath(state, 'TEST01/foo/bar')).toEqual('TEST01/foo/foo-test')
      expect(selectors.getPrevSectionPath(state, 'TEST01/foo/foo-test')).toEqual('TEST01/foo')
      expect(selectors.getPrevSectionPath(state, 'TEST01/foo')).toEqual('TEST01')
      expect(selectors.getPrevSectionPath(state, 'TEST01')).toEqual(undefined)
      expect(selectors.getPrevSectionPath(state, null)).toEqual(undefined)
    })

    test('getNextSectionPath', () => {
      expect(selectors.getNextSectionPath(state, 'TEST01')).toEqual('TEST01/foo')
      expect(selectors.getNextSectionPath(state, 'TEST01/foo')).toEqual('TEST01/foo/foo-test')
      expect(selectors.getNextSectionPath(state, 'TEST01/foo/foo-test')).toEqual('TEST01/foo/bar')
      expect(selectors.getNextSectionPath(state, 'TEST01/foo/bar')).toEqual(undefined)
      expect(selectors.getNextSectionPath(state, null)).toEqual(undefined)
    })
  })

  describe('getNavSections', () => {
    test('only prev', () => {
      expect(selectors.getNavSections(state)).toEqual({
        prev: {
          title: 'foo test section',
          path: 'TEST01/foo/foo-test',
        },
      })
    })

    test('only next', () => {
      const testState = {
        content: {
          ...state.content,
          currentSectionPath: 'TEST01',
        },
      }
      expect(selectors.getNavSections(testState)).toEqual({
        next: {
          title: 'foo section',
          path: 'TEST01/foo',
        },
      })
    })

    test('both prev and next', () => {
      const testState = {
        content: {
          ...state.content,
          currentSectionPath: 'TEST01/foo',
        },
      }
      expect(selectors.getNavSections(testState)).toEqual({
        prev: {
          title: 'TEST01 section',
          path: 'TEST01',
        },
        next: {
          title: 'foo test section',
          path: 'TEST01/foo/foo-test',
        },
      })
    })
  })
})
