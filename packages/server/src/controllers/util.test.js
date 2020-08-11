import { getContentPath, handleCustomRoute } from './util'

describe('getContentPath', () => {
  it.each(['section', 'page'])('should return prefixed contentPath (%s)', (prefix) => {
    expect(getContentPath(prefix).startsWith(`/${prefix}/`)).toBe(true)
  })
})

describe('handleCustomRoute', () => {
  const dest = '/section'
  const nextApp = { render: jest.fn() }
  const res = { redirect: jest.fn() }
  let middleware
  beforeEach(() => {
    jest.clearAllMocks()
    middleware = handleCustomRoute(nextApp, dest)
  })

  it('should redirect with trailing slash', () => {
    const req = { params: { contentId: 'foo/' }, path: '/section/foo/' }
    middleware(req, res)
    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith('/section/foo')
    expect(nextApp.render).not.toHaveBeenCalled()
  })

  it('should call app.render otherwise', () => {
    const req = { params: { contentId: 'foo' }, path: '/section/foo' }
    middleware(req, res)
    expect(res.redirect).not.toHaveBeenCalled()
    expect(nextApp.render).toHaveBeenCalledWith(req, res, dest, req.params)
  })
})
