import { onBeforeRender as onBeforeRenderDefault } from '#renderer/_default.page.server'
import courses from '#store/slices/entities/courses'
import type { PageContextServer } from '#types/pageContext'
import { generateUrlFromSpecifier } from '#utils/url'

// Redirect / -> homeLink
async function onBeforeRender(pageContextInput: PageContextServer) {
  const { pageContext } = await onBeforeRenderDefault(pageContextInput)

  if (pageContext.courseId === undefined) throw new Error('courseId undefined')
  if (pageContext.store === undefined) throw new Error('store undefined')
  if (pageContext.routeInfo === undefined) throw new Error('routeInfo undefined')
  if (pageContext.routeInfo.locale === undefined) throw new Error('locale undefined')

  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseId: pageContext.courseId })
  const { data: course } = selectCurrentCourse(pageContext.store.getState())
  if (course === undefined) throw new Error('No course loaded')

  return {
    pageContext: {
      redirectTo: generateUrlFromSpecifier(course.homeLink, pageContext.routeInfo.locale),
    },
  }
}

export { onBeforeRender }
