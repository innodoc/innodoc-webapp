import indexRedirectHandler from './indexRedirectHandler'

const mockConfig = {
  pagePathPrefix: 'p',
  sectionPathPrefix: 's',
}

describe('indexRedirectHandler', () => {
  it.each(['page', 'section'])('should redirect to homeLink /%s/foo', (contentType) => {
    const handler = indexRedirectHandler({
      ...mockConfig,
      manifest: { home_link: `/${contentType}/foo` },
    })
    const redirect = jest.fn()
    handler({}, { redirect })
    expect(redirect).toBeCalledWith(308, contentType === 'page' ? '/p/foo' : '/s/foo')
  })

  it('should fail with invalid homeLink', () => {
    expect(() => {
      indexRedirectHandler({ ...mockConfig, manifest: { home_link: '/p/foo' } })
    }).toThrow('Malformed home_link encountered')
  })
})
