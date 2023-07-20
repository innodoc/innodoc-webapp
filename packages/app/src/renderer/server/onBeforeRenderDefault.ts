import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { PageContextOnBeforeRender, PageContextUpdate } from '@innodoc/server/types'
import makeStore from '@innodoc/store'
import { changeRouteInfo } from '@innodoc/store/slices/app'
import courses from '@innodoc/store/slices/content/courses'
import pages from '@innodoc/store/slices/content/pages'
import sections from '@innodoc/store/slices/content/sections'
import type { ApiCourse } from '@innodoc/types/entities'

const routeManager = getRouteManager()

async function onBeforeRenderDefault({
  needRedirect,
  routeInfo: routeInfoInput,
  routeParams,
  urlOriginal,
}: PageContextOnBeforeRender): Promise<PageContextUpdate> {
  let course: ApiCourse | undefined = undefined

  const pageContextUpdate = {
    // Merge info from route function
    routeInfo: { ...routeInfoInput, ...routeParams },

    // Initialize store
    store: makeStore(),
  }

  // Set current route info
  pageContextUpdate.store.dispatch(changeRouteInfo(pageContextUpdate.routeInfo))

  // Populate store with necessary data
  if (pageContextUpdate.routeInfo.courseSlug !== null) {
    const courseParam = { courseSlug: pageContextUpdate.routeInfo.courseSlug }

    // Load course
    await pageContextUpdate.store.dispatch(courses.endpoints.getCourse.initiate(courseParam))

    // Select course
    const selectCurrentCourse = courses.endpoints.getCourse.select(courseParam)
    const { data } = selectCurrentCourse(pageContextUpdate.store.getState())
    if (data === undefined) {
      throw RenderErrorPage({
        pageContext: {
          ...pageContextUpdate,
          errorMsg: `Course ${pageContextUpdate.routeInfo.courseSlug} not found`,
        },
      })
    }
    course = data

    // Assert we received locales from manifest
    if (course.locales.length < 1) {
      throw RenderErrorPage({
        pageContext: { ...pageContextUpdate, errorMsg: 'Course has no locales' },
      })
    }

    // Check if current locale is valid
    if (
      pageContextUpdate.routeInfo.locale &&
      !course.locales.includes(pageContextUpdate.routeInfo.locale)
    ) {
      const redirectTo = routeManager.generate({
        ...pageContextUpdate.routeInfo,
        locale: course.locales[0],
      })
      return { pageContext: { ...pageContextUpdate, redirectTo } }
    }
  }

  // Redirect to proper URL if info couldn't be extracted
  if (needRedirect) {
    const redirectTo = routeManager.generate(pageContextUpdate.routeInfo)
    return { pageContext: { ...pageContextUpdate, redirectTo } }
  }

  if (pageContextUpdate.routeInfo.courseSlug !== null) {
    const courseParam = { courseSlug: pageContextUpdate.routeInfo.courseSlug }

    // Load pages sections
    await pageContextUpdate.store.dispatch(pages.endpoints.getCoursePages.initiate(courseParam))
    await pageContextUpdate.store.dispatch(
      sections.endpoints.getCourseSections.initiate(courseParam)
    )

    // Load fragment content
    // TODO
    // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_A }))
    // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_B }))
  }

  // TODO: how to handle this correctly?
  if (urlOriginal === '/fake-404-url') {
    pageContextUpdate.routeInfo.locale = 'en'
  }

  return {
    pageContext: {
      ...pageContextUpdate,

      // Grab populated state
      preloadedState: pageContextUpdate.store.getState(),
    },
  }
}

export default onBeforeRenderDefault
