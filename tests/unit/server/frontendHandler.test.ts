import type { NextFunction, Request, Response } from 'express'

async function setupMocks(httpResponse = true, redirectTo?: string, errorWhileRendering?: unknown) {
  vi.resetModules()

  const mockPageContext = {
    errorWhileRendering,
    httpResponse: httpResponse
      ? {
          body: '<html></html>',
          contentType: 'text/html',
          statusCode: 200,
        }
      : null,
    redirectTo: redirectTo !== undefined ? redirectTo : undefined,
  }
  const renderPageMock = vi.fn().mockResolvedValueOnce(mockPageContext)
  vi.doMock('vite-plugin-ssr/server', () => ({ renderPage: renderPageMock }))

  const frontendHandler = (await import('#server/frontendHandler')).default as (
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction
  ) => Promise<void>

  const req = {
    headers: { host: 'www.example.com' },
    originalUrl: '/en/foo/bar',
    rawLocale: { language: 'de' },
  } as Partial<Request>

  const res = {
    redirect: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    type: vi.fn().mockReturnThis(),
  } as Partial<Response>

  return { frontendHandler, next: vi.fn(), renderPageMock, req, res }
}

afterEach(() => {
  vi.doUnmock('vite-plugin-ssr/server')
})

test('frontendHandler renders page', async () => {
  const { frontendHandler, next, renderPageMock, req, res } = await setupMocks()
  await frontendHandler(req, res, next)

  const pageContextInit = renderPageMock.mock.calls[0][0] as Record<string, unknown>
  expect(pageContextInit.requestLocale).toBe('de')
  expect(pageContextInit.urlOriginal).toBe('/en/foo/bar')
  expect(pageContextInit.host).toBe('www.example.com')

  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.type).toHaveBeenCalledWith('text/html')
  expect(res.send).toHaveBeenCalledWith('<html></html>')
  expect(res.redirect).not.toHaveBeenCalled()
  expect(next).not.toHaveBeenCalled()
})

test('frontendHandler respects redirectTo', async () => {
  const { frontendHandler, next, req, res } = await setupMocks(false, '/bar/baz')
  await frontendHandler(req, res, next)

  expect(res.status).not.toHaveBeenCalled()
  expect(res.type).not.toHaveBeenCalled()
  expect(res.send).not.toHaveBeenCalled()
  expect(res.redirect).toHaveBeenCalledWith(307, '/bar/baz')
  expect(next).not.toHaveBeenCalled()
})

test("frontendHandler doesn't receive httpResponse", async () => {
  const { frontendHandler, next, req, res } = await setupMocks(false)
  await frontendHandler(req, res, next)

  expect(res.status).not.toHaveBeenCalled()
  expect(res.type).not.toHaveBeenCalled()
  expect(res.send).not.toHaveBeenCalled()
  expect(res.redirect).not.toHaveBeenCalled()
  expect(next).toHaveBeenCalledWith(expect.any(Error))
})

test('frontendHandler handles errorWhileRendering', async () => {
  const { frontendHandler, next, req, res } = await setupMocks(false, undefined, 'render error')
  await frontendHandler(req, res, next)

  expect(res.status).not.toHaveBeenCalled()
  expect(res.type).not.toHaveBeenCalled()
  expect(res.send).not.toHaveBeenCalled()
  expect(res.redirect).not.toHaveBeenCalled()
  expect(next).toHaveBeenCalledWith('render error')
})
