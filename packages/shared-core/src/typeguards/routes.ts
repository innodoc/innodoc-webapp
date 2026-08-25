import builtinRoutes from '#routes/builtin-routes'
import courseRoutes, { courseContentRoutes } from '#routes/course-routes'
import userRoutes from '#routes/user-routes'
import type {
  CourseContentRouteName,
  CoursePageRouteInfo,
  CourseRouteInfo,
  CourseSectionRouteInfo,
  FrontendRouteInfo,
  FrontendRouteName,
} from '#types'
import { isArbitraryObject } from './common.js'

let courseContentRouteNames: Set<string> | null = null
let appRouteNames: Set<string> | null = null

function getCourseContentRouteNames() {
  courseContentRouteNames ??= new Set(Object.keys(courseContentRoutes))
  return courseContentRouteNames
}

function getAppRouteNames() {
  appRouteNames ??= new Set(Object.keys({ ...builtinRoutes, ...courseRoutes, ...userRoutes }))
  return appRouteNames
}

/** Type guard for `FrontendRouteName` */
function isFrontendRouteName(routeName: unknown): routeName is FrontendRouteName {
  return typeof routeName === 'string' && getAppRouteNames().has(routeName)
}

/** Type guard for `CourseContentRouteName` */
function isCourseContentRouteName(routeName: unknown): routeName is CourseContentRouteName {
  return typeof routeName === 'string' && getCourseContentRouteNames().has(routeName)
}

/** Type guard for `FrontendRouteInfo` */
function isFrontendRouteInfo(routeInfo: unknown): routeInfo is FrontendRouteInfo {
  return isArbitraryObject(routeInfo) && isFrontendRouteName(routeInfo.name)
}

/** Type guard for `CourseRouteInfo` */
function isCourseRouteInfo(routeInfo: unknown): routeInfo is CourseRouteInfo {
  return isFrontendRouteInfo(routeInfo) && typeof (routeInfo as CourseRouteInfo).courseSlug === 'string'
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
  isCourseContentRouteName,
  isCoursePageRouteInfo,
  isCourseRouteInfo,
  isCourseSectionRouteInfo,
  isFrontendRouteInfo,
  isFrontendRouteName,
}
