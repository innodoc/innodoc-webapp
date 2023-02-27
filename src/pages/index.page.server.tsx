import courses from '#store/slices/entities/courses'
import type { PageContextServer } from '#types/pageContext'
import { generateUrlFromSpecifier } from '#utils/url'

// Redirect / -> homeLink
export function render({ courseId, locale, store }: PageContextServer) {
  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseId })
  const { data: course } = selectCurrentCourse(store.getState())
  if (course === undefined) throw new Error('No course loaded')

  return {
    pageContext: {
      redirectTo: generateUrlFromSpecifier(course.homeLink, locale),
    },
  }
}
