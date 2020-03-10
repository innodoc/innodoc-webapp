import passConfigMiddleware from './passConfigMiddleware'

const config = {
  contentRoot: 'https://example.com/content/',
  staticRoot: 'https://example.com/static/',
  sectionPathPrefix: 'section',
  pagePathPrefix: 'page',
}

describe('passConfigMiddleware', () => {
  it('should pass config to res.locals', () => {
    const middleware = passConfigMiddleware(config)
    const nextHandler = jest.fn()
    const res = { locals: {} }
    middleware({}, res, nextHandler)
    expect(res.locals.contentRoot).toBe(config.contentRoot)
    expect(res.locals.staticRoot).toBe(config.staticRoot)
    expect(res.locals.sectionPathPrefix).toBe(config.sectionPathPrefix)
    expect(res.locals.pagePathPrefix).toBe(config.pagePathPrefix)
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })
})
