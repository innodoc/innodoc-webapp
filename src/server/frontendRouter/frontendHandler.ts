import { type RequestHandler } from 'express'
import type { LanguageCode } from 'iso-639-1'
import { renderPage } from 'vite-plugin-ssr'

import type { ApiCourse } from '#types/entities/course'

const frontendHandler = (async (req, res, next) => {
  const urlWithoutLocale = req.urlWithoutLocale
  const locale = req.locale as LanguageCode
  const course = req.course

  if (urlWithoutLocale === undefined) return next(new Error('urlWithoutLocale not present'))
  if (course === undefined) return next(new Error('urlWithoutLocale not present'))

  // Create page context
  const pageContextInit: PageContextInit = {
    locale,
    urlOriginal: urlWithoutLocale,
    courseId: course.id,
  }

  // Render page
  const pageContext = await renderPage(pageContextInit)

  // Follow redirection directive from app
  if (pageContext.redirectTo !== undefined) return res.redirect(307, pageContext.redirectTo)

  if (!pageContext.httpResponse) return next(new Error("renderPage() didn't return httpResponse"))

  const { body, statusCode, contentType } = pageContext.httpResponse
  return res.status(statusCode).type(contentType).send(body)
}) as RequestHandler // workaround until https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871 is resolved

export interface PageContextInit {
  locale: LanguageCode
  courseId: ApiCourse['id']
  urlOriginal: string
  redirectTo?: string
}

export default frontendHandler
