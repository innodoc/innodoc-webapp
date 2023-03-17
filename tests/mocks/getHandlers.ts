import type { LanguageCode } from 'iso-639-1'
import { rest } from 'msw'
import type { ResponseComposition, RestContext, RestRequest } from 'msw'

import type RouteManager from '#routes/RouteManager'
import type { RouteName } from '#types/routes'
import { isFragmentType } from '#types/typeGuards'

import type { Content } from './fakeData/types'
import getCourses from './getCourses'

const getStringParam = (req: RestRequest, name: string) => {
  const val = req.params[name]
  if (typeof val !== 'string') {
    throw new Error('Wrong parameter type')
  }
  return val
}

const getContent = (
  req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext,
  content: Content | undefined
) => {
  if (content === undefined) {
    return res(ctx.status(404))
  }
  const locale = getStringParam(req, 'locale') as LanguageCode
  const text = content[locale]
  if (text === undefined) {
    return res(ctx.status(404))
  }
  return res(ctx.status(200), ctx.text(text))
}

function getHandlers(baseUrl: string, routeManager: RouteManager) {
  const courses = getCourses()

  // Remove trailing `/` from baseUrl
  const baseUrlTrimmed = baseUrl.endsWith('/') ? baseUrl.slice(0, baseUrl.length - 1) : baseUrl

  const apiRoutes = routeManager.getApiRoutes()

  const makePath = (routeName: RouteName) => {
    let pattern = apiRoutes[routeName]
    if (pattern === undefined) {
      throw new Error(`Unknown API route: ${routeName}`)
    }

    // Special case: MSW supports wildcard but no regex params
    pattern = pattern.replace(/:sectionPath\(.+\)/, '*')

    return `${baseUrlTrimmed}${pattern}`
  }

  const getCourse = (req: RestRequest) => {
    const courseSlug = getStringParam(req, 'courseSlug')
    const course = courses.find((c) => c.data.slug === courseSlug)
    if (course === undefined) {
      throw new Error(`Course not found ${courseSlug}`)
    }
    return course
  }

  return [
    // Course
    rest.get(makePath('api:course'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(getCourse(req).data))
    ),

    // Page
    rest.get(makePath('api:course:pages'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(getCourse(req).pages.map((page) => page.data)))
    ),
    rest.get(makePath('api:course:page:content'), (req, res, ctx) => {
      const pageSlug = getStringParam(req, 'pageSlug')
      const page = getCourse(req).pages.find((p) => p.data.slug === pageSlug)
      return getContent(req, res, ctx, page?.content)
    }),

    // Section
    rest.get(makePath('api:course:sections'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(getCourse(req).sections.map((sec) => sec.data)))
    ),
    rest.get(makePath('api:course:section:content'), (req, res, ctx) => {
      const sectionPath = req.params[0]
      const section = getCourse(req).sections.find((s) => s.data.path === sectionPath)
      return getContent(req, res, ctx, section?.content)
    }),

    // Fragment
    rest.get(makePath('api:course:fragment:content'), (req, res, ctx) => {
      const fragmentType = getStringParam(req, 'fragmentType')
      if (!isFragmentType(fragmentType)) {
        throw new Error(`Unknown fragment type: ${fragmentType}`)
      }
      return getContent(req, res, ctx, getCourse(req).footerContent[fragmentType])
    }),
  ]
}

export default getHandlers
