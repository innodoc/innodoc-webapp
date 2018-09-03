import selectors from './content'

const state = {
  content: {
    contentRoot: 'https://content.foo.bar.com',
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
  test('getContentRoot', () => {
    expect(selectors.getContentRoot(state)).toEqual('https://content.foo.bar.com')
  })

  test('getCurrentSectionPath', () => {
    expect(selectors.getCurrentSectionPath(state)).toEqual('TEST01/foo/bar')
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

  test('getPrevSectionPath', () => {
    expect(selectors.getPrevSectionPath(state, 'en', 'TEST01/foo/bar'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getPrevSectionPath(state, 'en', 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo')
    expect(selectors.getPrevSectionPath(state, 'en', 'TEST01/foo'))
      .toEqual('TEST01')
    expect(selectors.getPrevSectionPath(state, 'en', 'TEST01'))
      .toEqual(undefined)
  })

  test('getNextSectionPath', () => {
    expect(selectors.getNextSectionPath(state, 'en', 'TEST01'))
      .toEqual('TEST01/foo')
    expect(selectors.getNextSectionPath(state, 'en', 'TEST01/foo'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getNextSectionPath(state, 'en', 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo/bar')
    expect(selectors.getNextSectionPath(state, 'en', 'TEST01/foo/bar'))
      .toEqual(undefined)
  })
})
