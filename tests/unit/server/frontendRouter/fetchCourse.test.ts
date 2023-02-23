import type { NextFunction, Request, Response } from 'express'

import type { ApiCourse } from '#types/entities/course'

async function setupMocks(courseSlugMode: string, findsCourse = true) {
  vi.resetModules()

  vi.doMock('#server/config', () => ({ default: { courseSlugMode, defaultCourseSlug: 'default' } }))

  const mockCourse = { slug: 'innodoc' } as ApiCourse
  const getCourseMock = vi.fn().mockResolvedValueOnce(findsCourse ? mockCourse : undefined)
  vi.doMock('#server/database/queries/courses', () => ({ getCourse: getCourseMock }))

  const fetchCourse_ = (await import('#server/frontendRouter/fetchCourse')).default
  const res = { sendStatus: vi.fn() } as unknown as Response
  const next = vi.fn()
  const fetchCourse = fetchCourse_ as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>

  return { fetchCourse, getCourseMock, mockCourse, next, res }
}

afterEach(() => {
  vi.doUnmock('#server/config')
  vi.doUnmock('#server/database/queries/courses')
})

test('fetchCourse (SUBDOMAIN)', async () => {
  const req = { headers: { host: 'innodoc.example.com' }, urlWithoutLocale: '/page/bar' } as Request
  const { fetchCourse, getCourseMock, mockCourse, next, res } = await setupMocks('SUBDOMAIN')
  await fetchCourse(req, res, next)

  expect(getCourseMock).toHaveBeenCalledWith({ courseSlug: 'innodoc' })
  expect(req.course).toBe(mockCourse)
  expect(req.urlWithoutLocale).toBe('/page/bar')
  expect(next).toHaveBeenCalledWith()
})

test('fetchCourse (URL)', async () => {
  const req = { headers: {}, urlWithoutLocale: '/foo/page/bar' } as Request
  const { fetchCourse, getCourseMock, mockCourse, next, res } = await setupMocks('URL')
  await fetchCourse(req, res, next)

  expect(getCourseMock).toHaveBeenCalledWith({ courseSlug: 'foo' })
  expect(req.course).toBe(mockCourse)
  expect(req.urlWithoutLocale).toBe('/page/bar')
  expect(next).toHaveBeenCalledWith()
})

test('fetchCourse (URL, invalid slug)', async () => {
  const req = { headers: {}, urlWithoutLocale: '/Bad_$lug/page/bar' } as Request
  const { fetchCourse, getCourseMock, mockCourse, next, res } = await setupMocks('URL')
  await fetchCourse(req, res, next)

  expect(getCourseMock).toHaveBeenCalledWith({ courseSlug: 'default' })
  expect(req.course).toBe(mockCourse)
  expect(req.urlWithoutLocale).toBe('/page/bar')
  expect(next).toHaveBeenCalledWith()
})

test('fetchCourse (URL, unknown course)', async () => {
  const req = { headers: {}, urlWithoutLocale: '/does-not-exist/page/bar' } as Request
  const { fetchCourse, getCourseMock, next, res } = await setupMocks('URL', false)
  await fetchCourse(req, res, next)

  expect(getCourseMock).toHaveBeenCalledWith({ courseSlug: 'does-not-exist' })
  expect(req.course).toBeUndefined()
  expect(next).not.toHaveBeenCalledWith()
  expect(res.sendStatus).toHaveBeenCalledWith(404)
})
