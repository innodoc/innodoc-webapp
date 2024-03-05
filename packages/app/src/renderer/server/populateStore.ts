import { redirect, render } from 'vike/abort'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import courses from '@innodoc/store/slices/content/courses'
import pages from '@innodoc/store/slices/content/pages'
import sections from '@innodoc/store/slices/content/sections'
import type { AppRouteInfo } from '@innodoc/routes/types'
import type { Store } from '@innodoc/store/types'

const routeManager = getRouteManager()

async function populateStore(store: Store, routeInfo: AppRouteInfo) {
  const { courseSlug, locale } = routeInfo
  if (!courseSlug) {
    return
  }

  // Load course
  const { isSuccess: courseFound } = await store.dispatch(
    courses.endpoints.getCourse.initiate({ courseSlug }),
  )
  if (!courseFound) {
    throw render(404, `Course ${courseSlug} not found`)
  }

  // Select course
  const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug })
  const { data: course } = selectCurrentCourse(store.getState())
  if (course === undefined) {
    throw render(500, 'Unable to select course')
  }

  // Assert we received locales from manifest
  if (course.locales.length < 1) {
    throw render(500, 'Course has no locales')
  }

  // Check if current locale is valid
  if (!course.locales.includes(locale)) {
    const redirectUrl = routeManager.generate({ ...routeInfo, locale: course.locales[0] })
    throw redirect(redirectUrl)
  }

  // Load pages sections
  await store.dispatch(pages.endpoints.getCoursePages.initiate({ courseSlug }))
  await store.dispatch(sections.endpoints.getCourseSections.initiate({ courseSlug }))

  // Load fragment content
  // TODO
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_A }))
  // await fetchContent(store, getContent({ locale, path: FRAGMENT_TYPE_FOOTER_B }))
}

export default populateStore
