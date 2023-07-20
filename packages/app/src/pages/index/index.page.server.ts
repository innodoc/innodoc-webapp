import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage'

import { DEFAULT_ROUTE_NAME } from '@innodoc/constants'
import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import type { PageContextServer } from '@innodoc/server/types'
import courses from '@innodoc/store/slices/content/courses'
import type { ApiCourse } from '@innodoc/types/entities'

import { onBeforeRender as onBeforeRenderDefault } from '#renderer/server'

const routeManager = getRouteManager()

// Redirect / -> homeLink
async function onBeforeRender(pageContextInput: PageContextServer) {
  let course: ApiCourse | undefined = undefined

  const { pageContext } = await onBeforeRenderDefault(pageContextInput)

  if (pageContext.store === undefined) {
    throw new Error('store undefined')
  }
  if (pageContext.routeInfo === undefined) {
    throw new Error('routeInfo undefined')
  }
  if (pageContext.routeInfo.locale === undefined) {
    throw new Error('locale undefined')
  }

  if (pageContext.routeInfo.courseSlug) {
    const { courseSlug } = pageContext.routeInfo

    const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug })
    const { data } = selectCurrentCourse(pageContext.store.getState())
    if (data === undefined) {
      throw new Error('No course loaded')
    }
    course = data

    // Prevent a redirection loop
    if (course.homeLink === DEFAULT_ROUTE_NAME) {
      throw RenderErrorPage({
        pageContext: { errorMsg: 'Route app:index cannot redirect to itself' },
      })
    }

    const redirectTo = routeManager.generate({
      courseSlug,
      locale: pageContext.routeInfo.locale,
      ...routeManager.parseLinkSpecifier(course.homeLink),
    })

    return { pageContext: { redirectTo } }
  }

  throw RenderErrorPage({
    pageContext: { errorMsg: 'No course loaded' },
  })
}

export { onBeforeRender }
