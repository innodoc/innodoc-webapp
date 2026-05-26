import { http } from 'msw'
import { type HttpHandler, HttpResponse } from 'msw'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { ApiRouteName, RouteParams } from '@innodoc/shared-core/types'
import makeCourses from '#courses'

const courses = makeCourses()

const makePath = (baseUrl: string, routes: Partial<Record<ApiRouteName, string>>, routeName: ApiRouteName): string => {
  let pattern = routes[routeName]
  if (pattern === undefined) {
    throw new Error(`Unknown API route: ${routeName}`)
  }

  // Special case: MSW supports wildcard but no regex params
  pattern = pattern.replace(/:sectionPath\(.+\)/, '*')

  return `${baseUrl}${pattern}`
}

const getCourse = (courseSlug: string) => courses.find((c) => c.data.slug === courseSlug)

function getHandlers(baseUrlOrig: string, routeManager: RouteManager): HttpHandler[] {
  // Remove trailing `/` from baseUrl
  const baseUrl = baseUrlOrig.endsWith('/') ? baseUrlOrig.slice(0, -1) : baseUrlOrig
  const routes = routeManager.getApiRoutes()
  const p = (routeName: ApiRouteName) => makePath(baseUrl, routes, routeName)

  return [
    // Course
    http.get<RouteParams<'api:course'>>(p('api:course'), ({ params: { courseSlug } }) => {
      const course = getCourse(courseSlug)
      return course ? HttpResponse.json(course.data, { status: 200 }) : new HttpResponse(null, { status: 404 })
    }),

    // Page
    http.get<RouteParams<'api:course:pages'>>(p('api:course:pages'), ({ params: { courseSlug } }) => {
      const course = getCourse(courseSlug)
      return course
        ? HttpResponse.json(
            course.pages.map((page) => page.data),
            { status: 200 },
          )
        : new HttpResponse(null, { status: 404 })
    }),

    // Page content
    http.get<RouteParams<'api:course:page:content'>>(
      p('api:course:page:content'),
      ({ params: { courseSlug, locale, pageSlug } }) => {
        const content = getCourse(courseSlug)?.pages.find((page) => page.data.slug === pageSlug)?.content[locale]
        return content ? HttpResponse.text(content, { status: 200 }) : new HttpResponse(null, { status: 404 })
      },
    ),

    // Section
    http.get<RouteParams<'api:course:sections'>>(p('api:course:sections'), ({ params: { courseSlug } }) => {
      const course = getCourse(courseSlug)
      return course
        ? HttpResponse.json(
            course.sections.map((section) => section.data),
            { status: 200 },
          )
        : new HttpResponse(null, { status: 404 })
    }),

    // Section content
    http.get<RouteParams<'api:course:section:content'>>(
      p('api:course:section:content'),
      ({ params: { courseSlug, locale, sectionPath } }) => {
        const section = getCourse(courseSlug)?.sections.find((section) => section.data.path === sectionPath)
        const content = section?.content[locale]
        return content ? HttpResponse.text(content, { status: 200 }) : new HttpResponse(null, { status: 404 })
      },
    ),

    // Fragment content
    http.get<RouteParams<'api:course:fragment:content'>>(
      p('api:course:fragment:content'),
      ({ params: { courseSlug, locale, fragmentType } }) => {
        const content = getCourse(courseSlug)?.fragments[fragmentType]?.[locale]
        return content ? HttpResponse.text(content, { status: 200 }) : new HttpResponse(null, { status: 404 })
      },
    ),
  ]
}

export default getHandlers
