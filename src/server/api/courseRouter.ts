import camelcaseKeys from 'camelcase-keys'
import { type RequestHandler, Router } from 'express'
import type { LanguageCode } from 'iso-639-1'

import { getCourse, getCoursePages, getPageContent } from '#server/database/queries/course'

const courseRouter = Router()
  // Course
  .get('/:courseName', (async (req, res) => {
    const course = await getCourse(req.params.courseName)
    if (course === null) return res.sendStatus(404)
    res.json(camelcaseKeys(course))
  }) as RequestHandler)

  // Get course pages
  .get('/:courseName/pages', (async (req, res) => {
    const pages = await getCoursePages(req.params.courseName)
    res.json(camelcaseKeys(pages))
  }) as RequestHandler)

  // Get course pages
  .get('/:courseName/:locale/page/:pageName', (async (req, res) => {
    const pages = await getPageContent(
      req.params.courseName,
      req.params.locale as LanguageCode,
      req.params.pageName
    )
    res.json(pages)
  }) as RequestHandler)

export default courseRouter
