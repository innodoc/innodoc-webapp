import type { LanguageCode } from 'iso-639-1'
import { rest } from 'msw'
import type { ResponseComposition, RestContext, RestRequest } from 'msw'

import type { Content } from './fakeData/types'
import getData from './getData'

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
  const base = (path: string) => new URL(path, baseUrl).toString()

  const courses = getData()

  const getCourse = (req: RestRequest) => courses[getIntParam(req, 'courseId')]

  const handlers = [
    rest.get(base('/api/course/:courseId'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(getCourse(req).data))
    ),

    rest.get(base('/api/course/:courseId/pages'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(Object.values(getCourse(req).pages).map((page) => page[0])))
    ),

    rest.get(base('/api/course/:courseId/sections'), (req, res, ctx) =>
      res(ctx.status(200), ctx.json(Object.values(getCourse(req).sections).map((sec) => sec[0])))
    ),

    rest.get(base('/api/course/:courseId/fragment/:locale/footer-a'), (req, res, ctx) =>
      getContent(req, res, ctx, getCourse(req).footerContent.a)
    ),

    rest.get(base('/api/course/:courseId/fragment/:locale/footer-b'), (req, res, ctx) =>
      getContent(req, res, ctx, getCourse(req).footerContent.b)
    ),

    rest.get(base('/api/course/:courseId/page/:locale/:pageId'), (req, res, ctx) =>
      getContent(req, res, ctx, getCourse(req).pages[getIntParam(req, 'pageId')][1])
    ),

    rest.get(base('/api/course/:courseId/section/:locale/:sectionId'), (req, res, ctx) =>
      getContent(req, res, ctx, getCourse(req).sections[getIntParam(req, 'sectionId')][1])
    ),
  ]

  return handlers
}

export default getHandlers
