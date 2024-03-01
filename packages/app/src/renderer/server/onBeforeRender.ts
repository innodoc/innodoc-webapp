import { isPromise } from 'util/types'
import { redirect, render } from 'vike/abort'
import type { Config, OnBeforeRenderAsync } from 'vike/types'

import getRouteManager from '@innodoc/routes/vite/getRouteManager'
import makeStore from '@innodoc/store'
import { changeRouteInfo } from '@innodoc/store/slices/app'
import courses from '@innodoc/store/slices/content/courses'
import pages from '@innodoc/store/slices/content/pages'
import sections from '@innodoc/store/slices/content/sections'
import { isCallable } from '@innodoc/utils/typeGuards'
import type { ApiCourse } from '@innodoc/types/entities'

const routeManager = getRouteManager()

const onBeforeRender: OnBeforeRenderAsync = async function ({
  routeInfo: routeInfoInput,
  routeParams,
  urlOriginal,
  config,
}) {
  let course: ApiCourse | undefined = undefined

  // Merge data extracted in route function
  const routeInfo = { ...routeInfoInput, ...routeParams }
  const { courseSlug, locale } = routeInfo

  // Initialize store
  const store = makeStore()

  // Set current route info
  store.dispatch(changeRouteInfo(routeInfo))

  // Populate store with necessary data
  if (courseSlug !== null) {
    // Load course
    await store.dispatch(courses.endpoints.getCourse.initiate({ courseSlug }))

    // Select course
    const selectCurrentCourse = courses.endpoints.getCourse.select({ courseSlug })
    const { data } = selectCurrentCourse(store.getState())
    if (data === undefined) {
      throw render(404, `Course ${courseSlug} not found`)
    }
    course = data

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

  // TODO: how to handle this correctly?
  if (urlOriginal === '/fake-404-url') {
    routeInfo.locale = 'en'
  }

  // onInit hook
  const { onInit } = config as Config // TODO: once vikejs/vike#1532 is released
  if (isCallable(onInit)) {
    const ret = onInit({ routeInfo, store })
    if (isPromise(ret)) {
      await ret
    }
  }

  return {
    pageContext: {
      routeInfo,
      store,
      preloadedState: store.getState(),
    },
  }
}

export default onBeforeRender
