import type { Request, Response } from 'express'

import extractLocale from '#server/frontendRouter/extractLocale'

function setupMocks(originalUrl: string) {
  const req = {
    originalUrl,
    rawLocale: { language: 'de' },
  } as Request
  const res = { redirect: vi.fn() } as unknown as Response
  return { next: vi.fn(), req, res }
}

test('extractLocale (from url)', () => {
  const { next, req, res } = setupMocks('/en/foo/bar')
  extractLocale(req, res, next)

  expect(req.locale).toBe('en')
  expect(req.urlWithoutLocale).toBe('/foo/bar')
  expect(next).toHaveBeenCalledWith()
})

test('extractLocale (from header)', () => {
  const { next, req, res } = setupMocks('/foo/bar')
  extractLocale(req, res, next)

  expect(req.locale).toBe('de')
  expect(req.urlWithoutLocale).toBe('/foo/bar')
})

test('extractLocale (ensure locale in url path)', () => {
  const { next, req, res } = setupMocks('/foo/bar')
  extractLocale(req, res, next)

  expect(next).not.toHaveBeenCalledWith()
  expect(res.redirect).toHaveBeenCalledWith(307, '/de/foo/bar')
})
