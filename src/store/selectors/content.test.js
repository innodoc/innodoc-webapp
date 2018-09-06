import selectors from './content'

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

  test('getPrevSectionPath', () => {
    expect(selectors.getPrevSectionPath(state, 'TEST01/foo/bar'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getPrevSectionPath(state, 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo')
    expect(selectors.getPrevSectionPath(state, 'TEST01/foo'))
      .toEqual('TEST01')
    expect(selectors.getPrevSectionPath(state, 'TEST01'))
      .toEqual(undefined)
  })

  test('getNextSectionPath', () => {
    expect(selectors.getNextSectionPath(state, 'TEST01'))
      .toEqual('TEST01/foo')
    expect(selectors.getNextSectionPath(state, 'TEST01/foo'))
      .toEqual('TEST01/foo/foo-test')
    expect(selectors.getNextSectionPath(state, 'TEST01/foo/foo-test'))
      .toEqual('TEST01/foo/bar')
    expect(selectors.getNextSectionPath(state, 'TEST01/foo/bar'))
      .toEqual(undefined)
  })
})
