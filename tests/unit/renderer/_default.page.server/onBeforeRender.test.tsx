import type { LanguageCode } from 'iso-639-1'

import type { PageContextOnBeforeRender } from '#types/pageContext'

async function setupMocks(opts?: {
  context?: Partial<PageContextOnBeforeRender>
  course?: { locales: LanguageCode[] }
}) {
  const mergedOpts = {
    context: {},
    course: { locales: ['en', 'be'] },
    ...opts,
  }
  vi.resetModules()

  const store = {
    dispatch: vi.fn(),
    getState: vi.fn().mockReturnValue({ mock: 'state' }),
  }

  vi.doMock('#store/makeStore', () => ({ default: () => store }))

  const changeCourseId = vi.fn()
  const changeRouteInfo = vi.fn()

  vi.doMock('#store/slices/appSlice', () => ({
    changeCourseId: changeCourseId,
    changeRouteInfo: changeRouteInfo,
    selectRouteInfo: vi.fn().mockReturnValue({ courseSlug: 'testcourse' }),
  }))

  const sectionsGetCourse = vi.fn()
  const sectionsGetPages = vi.fn()
  const sectionsGetSections = vi.fn()

  vi.doMock('#store/slices/entities/courses', () => ({
    default: {
      endpoints: {
        getCourse: {
          initiate: sectionsGetCourse,
          select: vi.fn().mockReturnValue(() => ({ data: mergedOpts.course })),
        },
      },
    },
  }))

  vi.doMock('#store/slices/entities/pages', () => ({
    default: {
      endpoints: { getCoursePages: { initiate: sectionsGetPages } },
    },
  }))

  vi.doMock('#store/slices/entities/sections', () => ({
    default: {
      endpoints: { getCourseSections: { initiate: sectionsGetSections } },
    },
  }))

  const { onBeforeRender } = await import('#renderer/_default.page.server')

  const pageContextServer: PageContextOnBeforeRender = {
    routeInfo: {
      courseSlug: 'testcourse',
      routeName: 'app:page',
      locale: 'be',
    },
    routeParams: { pageSlug: 'foo-bar' },
    urlOriginal: '/en/pagetest/foo-bar',
    needRedirect: false,
    ...mergedOpts.context,
  }

  return {
    mocks: {
      changeCourseId,
      changeRouteInfo,
      course: mergedOpts.course,
      sectionsGetCourse,
      sectionsGetSections,
      sectionsGetPages,
      store,
    },
    onBeforeRender,
    pageContextServer,
  }
}

afterEach(() => {
  vi.doUnmock('#store/makeStore')
  vi.doUnmock('#store/slices/appSlice')
  vi.doUnmock('#store/slices/entities/courses')
  vi.doUnmock('#store/slices/entities/pages')
  vi.doUnmock('#store/slices/entities/sections')
  vi.doUnmock('#server/database/queries/courses')
})

test('onBeforeRender', async () => {
  const { pageContextServer, onBeforeRender, mocks } = await setupMocks()
  const { pageContext } = await onBeforeRender(pageContextServer)

  // Store initialization
  expect(mocks.changeRouteInfo).toHaveBeenCalledWith({
    courseSlug: 'testcourse',
    routeName: 'app:page',
    locale: 'be',
    pageSlug: 'foo-bar',
  })

  // Should fetch data
  expect(mocks.sectionsGetCourse).toHaveBeenCalledWith({ courseSlug: 'testcourse' })
  expect(mocks.sectionsGetPages).toHaveBeenCalledWith({ courseSlug: 'testcourse' })
  expect(mocks.sectionsGetSections).toHaveBeenCalledWith({ courseSlug: 'testcourse' })

  // Page context update
  expect(pageContext.preloadedState).toStrictEqual({ mock: 'state' })
  expect(pageContext.routeInfo).toStrictEqual({
    courseSlug: 'testcourse',
    routeName: 'app:page',
    locale: 'be',
    pageSlug: 'foo-bar',
  })
  expect(pageContext.store).toBe(mocks.store)
})

test('onBeforeRender (invalid locale)', async () => {
  const { pageContextServer, onBeforeRender } = await setupMocks({
    course: { locales: ['fr', 'da'] },
  })
  await expect(onBeforeRender(pageContextServer)).rejects.toThrow(/RenderErrorPage/)
})

test('onBeforeRender (invalid course)', async () => {
  const { pageContextServer, onBeforeRender } = await setupMocks({
    course: undefined,
  })
  await expect(onBeforeRender(pageContextServer)).rejects.toThrow(/RenderErrorPage/)
})
