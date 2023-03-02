import { RenderErrorPage } from 'vite-plugin-ssr'

import { DEFAULT_ROUTE_NAME } from '#constants'
import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import getRouteManager from '#routes/getRouteManager'
import courses from '#store/slices/entities/courses'
import type { ApiCourse } from '#types/entities/course'
import type { PageContextServer } from '#types/pageContext'

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
    const selectCurrentCourse = courses.endpoints.getCourse.select({
      courseSlug: pageContext.routeInfo.courseSlug,
    })
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

    return {
      pageContext: {
        redirectTo: routeManager.generateFromSpecifier(
          course.homeLink,
          pageContext.routeInfo.locale
        ),
      },
    }
  }

  throw RenderErrorPage({
    pageContext: { errorMsg: 'No course loaded' },
  })
}

export { onBeforeRender }
