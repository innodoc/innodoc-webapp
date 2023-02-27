import type { LanguageCode } from 'iso-639-1'
import { rest } from 'msw'
import type { ResponseComposition, RestContext, RestRequest } from 'msw'

import getRoutes from '#routes/getRoutes'
import { isFragmentType } from '#types/typeGuards'

import type { Content } from './fakeData/types'
import getData from './getData'

const { routes } = getRoutes()

const getStringParam = (req: RestRequest, name: string) => {
  const val = req.params[name]
  if (typeof val !== 'string') throw new Error('Wrong parameter type')
  return val
}

const getIntParam = (req: RestRequest, name: string) => parseInt(getStringParam(req, name))

const getContent = (
  req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext,
  content: Content
) => {
  const locale = getStringParam(req, 'locale') as LanguageCode
  const text = content[locale]
  if (text === undefined) return res(ctx.status(404))
  return res(ctx.status(200), ctx.text(text))
}

function getHandlers(baseUrl: string) {
  const makePath = (name: string) => {
    // Remove trailing `/` from baseUrl
    const baseUrlTrimmed = baseUrl.endsWith('/') ? baseUrl.slice(0, baseUrl.length - 1) : baseUrl
    return (
      `${baseUrlTrimmed}${routes[name]}`
        // remove regexp patterns as msw doesn't seem to support them
        .replace(/\([^/]+/g, '')
    )
  }

  const getCourse = (req: RestRequest) => getData()[getIntParam(req, 'courseId')]

  const handlers = [
    // Course
    rest.get(makePath('api:course'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(getCourse(req).data))
    ),

    // Page
    rest.get(makePath('api:course:pages'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(Object.values(getCourse(req).pages).map((page) => page[0])))
    ),
    rest.get(makePath('api:course:page:content'), (req, res, ctx) =>
      getContent(req, res, ctx, getCourse(req).pages[getIntParam(req, 'pageId')][1])
    ),

    // Section
    rest.get(makePath('api:course:sections'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(Object.values(getCourse(req).sections).map((sec) => sec[0])))
    ),
    rest.get(makePath('api:course:section:content'), (req, res, ctx) =>
      getContent(req, res, ctx, getCourse(req).sections[getIntParam(req, 'sectionId')][1])
    ),

    // Fragment
    rest.get(makePath('api:course:fragment:content'), (req, res, ctx) => {
      const fragmentType = getStringParam(req, 'fragmentType')
      if (!isFragmentType(fragmentType)) throw new Error(`Unknown fragment type: ${fragmentType}`)
      return getContent(req, res, ctx, getCourse(req).footerContent[fragmentType])
    }),
  ]

  return handlers
}

export default getHandlers
