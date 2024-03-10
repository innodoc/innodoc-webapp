import { redirect, render } from 'vike/abort'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import courses from '@innodoc/store/slices/content/courses'
import pages from '@innodoc/store/slices/content/pages'
import sections from '@innodoc/store/slices/content/sections'
import { isArbitraryObject } from '@innodoc/typeguards/common'
import { isErrorWithMessage } from '@innodoc/typeguards/errors'
import type { AppRouteInfo, CourseRouteInfo } from '@innodoc/routes/types/routeInfos'
import type { ApiCourse } from '@innodoc/schema/types'
import type { Store } from '@innodoc/store/types'

const routeManager = getRouteManager()

/** Type guard for `FetchBaseQueryError` */
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return isArbitraryObject(error) && 'status' in error
}

interface FetchError {
  status: 'FETCH_ERROR'
  error: string
}
function isFetchError(error: unknown): error is FetchError {
  return isArbitraryObject(error) && error.status === 'FETCH_ERROR'
}

// TODO: better error handling
function queryError(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    if (error.status === 404) {
      return render(404, 'API entity was not found')
    }
    if (isFetchError(error)) {
      return render(500, `Fetch error: ${error.error}`)
    }
    if (isErrorWithMessage(error)) {
      return render(500, error.message)
    }
  }
  console.error(error)
  return render(500, 'Internal Server Error')
}

async function populateStore(store: Store, routeInfo: CourseRouteInfo) {
  const { courseSlug, locale } = routeInfo

  // Load course
  let course: ApiCourse
  try {
    course = await store.dispatch(courses.endpoints.getCourse.initiate({ courseSlug })).unwrap()
  } catch (error) {
    throw queryError(error)
  }

  // Assert we received locales from manifest
  if (course.locales.length === 0) {
    throw render(500, 'Course has no locales')
  }

  // Check if current locale is valid
  if (!course.locales.includes(locale)) {
    const newRouteInfo = { ...routeInfo, locale: course.locales[0] } as AppRouteInfo
    const redirectUrl = routeManager.appUrl(newRouteInfo)
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
