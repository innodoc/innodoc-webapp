import type { NextFunction, Request, Response } from 'express'

import type { PageContextInit } from '#server/frontendRouter/frontendHandler'

async function setupMocks(httpResponse = true, redirectTo?: string) {
  vi.resetModules()

  const mockPageContext = {
    httpResponse: httpResponse
      ? {
          body: '<html></html>',
          contentType: 'text/html',
          statusCode: 200,
        }
      : undefined,
    redirectTo: redirectTo !== undefined ? redirectTo : undefined,
  }
  const renderPageMock = vi.fn().mockResolvedValueOnce(mockPageContext)
  vi.doUnmock('vite-plugin-ssr')
  vi.doMock('vite-plugin-ssr', () => ({ renderPage: renderPageMock }))

  const frontendHandler = (await import('#server/frontendRouter/frontendHandler')).default as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>

  const req = {
    course: { id: 12 },
    locale: 'de',
    urlWithoutLocale: '/foo/bar',
  } as Request

  const res = {
    redirect: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    type: vi.fn().mockReturnThis(),
  } as unknown as Response

  return { frontendHandler, next: vi.fn(), renderPageMock, req, res }
}

test('frontendHandler renders page', async () => {
  const { frontendHandler, next, renderPageMock, req, res } = await setupMocks()
  await frontendHandler(req, res, next)

  const pageContextInit = renderPageMock.mock.calls[0][0] as PageContextInit
  expect(pageContextInit.locale).toBe('de')
  expect(pageContextInit.urlOriginal).toBe('/foo/bar')
  expect(pageContextInit.courseId).toBe(12)

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
