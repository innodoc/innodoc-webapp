import getLinkInfo from './getLinkInfo'

describe('getLinkInfo', () => {
  it('should return link info with hash', () => {
    const linkInfo = getLinkInfo('section', 'foo/bar', 'baz')
    expect(linkInfo).toEqual({
      href: {
        pathname: '/[contentPrefix]/[...fragments]',
        query: { contentPrefix: 'section', fragments: ['foo', 'bar'] },
      },
      as: {
        pathname: '/section/foo/bar',
        hash: '#baz',
      },
    })
  })

  it('should return link info w/o hash', () => {
    const linkInfo = getLinkInfo('section', 'foo/bar')
    expect(linkInfo).toEqual({
      href: {
        pathname: '/[contentPrefix]/[...fragments]',
        query: { contentPrefix: 'section', fragments: ['foo', 'bar'] },
      },
      as: {
        pathname: '/section/foo/bar',
      },
    })
  })
})
