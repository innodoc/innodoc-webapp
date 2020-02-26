import makePassConfigMiddleware from './makePassConfigMiddleware'

const config = {
  contentRoot: 'https://example.com/content/',
  staticRoot: 'https://example.com/static/',
  sectionPathPrefix: 'section',
  pagePathPrefix: 'page',
}

describe('makePassConfigMiddleware', () => {
  it('should pass config to res.locals', () => {
    const passConfigMiddleware = makePassConfigMiddleware(config)
    const nextHandler = jest.fn()
    const res = { locals: {} }
    passConfigMiddleware({}, res, nextHandler)
    expect(res.locals.contentRoot).toBe(config.contentRoot)
    expect(res.locals.staticRoot).toBe(config.staticRoot)
    expect(res.locals.sectionPathPrefix).toBe(config.sectionPathPrefix)
    expect(res.locals.pagePathPrefix).toBe(config.pagePathPrefix)
    expect(nextHandler).toHaveBeenCalledTimes(1)
  })
})
