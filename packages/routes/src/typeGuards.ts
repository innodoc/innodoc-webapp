import { isArbitraryObject } from '@innodoc/typeguards/common'

import apiRoutes from './routes/apiRoutes'
import builtinRoutes from './routes/builtinRoutes'
import courseRoutes, { courseContentRoutes } from './routes/courseRoutes'
import userRoutes from './routes/userRoutes'
import type { AppRouteInfo, CoursePageRouteInfo, CourseRouteInfo, CourseSectionRouteInfo } from './types/routeInfos'
import type { AppRouteName, CourseContentRouteName, RouteName } from './types/routeNames'

const apiRouteNames = Object.keys(apiRoutes)
const appRouteNames = Object.keys({ ...builtinRoutes, ...courseRoutes, ...userRoutes })
const courseContentRoutenames = Object.keys(courseContentRoutes)
const allRouteName = new Set([...apiRouteNames, ...appRouteNames])

/** Type guard for `AppRouteName` */
function isRouteName(routeName: unknown): routeName is RouteName {
  return typeof routeName === 'string' && allRouteName.has(routeName)
}

/** Type guard for `AppRouteName` */
function isAppRouteName(routeName: unknown): routeName is AppRouteName {
  return typeof routeName === 'string' && appRouteNames.includes(routeName)
}

/** Type guard for `CourseContentRouteName` */
function isCourseContentRouteName(routeName: unknown): routeName is CourseContentRouteName {
  return typeof routeName === 'string' && courseContentRoutenames.includes(routeName)
}

/** Type guard for `AppRouteInfo` */
function isAppRouteInfo(routeInfo: unknown): routeInfo is AppRouteInfo {
  return isArbitraryObject(routeInfo) && isAppRouteName(routeInfo.name)
}

/** Type guard for `CourseRouteInfo` */
function isCourseRouteInfo(routeInfo: unknown): routeInfo is CourseRouteInfo {
  return isAppRouteInfo(routeInfo) && typeof (routeInfo as CourseRouteInfo).courseSlug === 'string'
}

/** Type guard for `CourseSectionRouteInfo` */
function isCourseSectionRouteInfo(routeInfo: unknown): routeInfo is CourseSectionRouteInfo {
  return (
    isCourseRouteInfo(routeInfo) &&
    routeInfo.name === 'app:course:section' &&
    typeof (routeInfo as CourseSectionRouteInfo).sectionPath === 'string'
  )
}

/** Type guard for `CoursePageRouteInfo` */
function isCoursePageRouteInfo(routeInfo: unknown): routeInfo is CoursePageRouteInfo {
  return (
    isCourseRouteInfo(routeInfo) &&
    routeInfo.name === 'app:course:page' &&
    typeof (routeInfo as CoursePageRouteInfo).pageSlug === 'string'
  )
}

export {
  isAppRouteInfo,
  isAppRouteName,
  isCourseContentRouteName,
  isCoursePageRouteInfo,
  isCourseRouteInfo,
  isCourseSectionRouteInfo,
  isRouteName,
}
