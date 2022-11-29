import { type RequestHandler, Router } from 'express'
import { param, validationResult } from 'express-validator'
import type { LanguageCode } from 'iso-639-1'

import { API_COURSE_PREFIX, type RoutesDefinition } from '#routes'
import { getCourse } from '#server/database/queries/courses'
import { getFragmentContent } from '#server/database/queries/fragments'
import { getCoursePages, getPageContent } from '#server/database/queries/pages'
import { getCourseSections, getSectionContent } from '#server/database/queries/sections'
import { getRoutePath } from '#server/utils'
import type { FragmentType } from '#types/entities/base'
import { isFragmentType } from '#utils/content'

const p = (path: keyof RoutesDefinition) => getRoutePath(path, `${API_COURSE_PREFIX}`)

const checkErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  next()
}

const courseRouter = Router()
  // Get course by course slug
  .get(p('api/course'), param('courseId').isInt(), checkErrors, (async (req, res) => {
    const course = await getCourse({ courseId: parseInt(req.params.courseId) })
    if (!course) return res.sendStatus(404)

    res.json(course)
  }) as RequestHandler)

  // Get course pages
  .get(p('api/course/pages'), param('courseId').isInt(), checkErrors, (async (req, res) => {
    const pages = await getCoursePages(parseInt(req.params.courseId))
    res.json(pages)
  }) as RequestHandler)

  // Get page content
  .get(
    p('api/course/page/content'),
    param('courseId').isInt(),
    param('locale').isLocale(),
    param('pageId').isInt(),
    checkErrors,
    (async (req, res) => {
      const pageContent = await getPageContent(
        parseInt(req.params.courseId),
        req.params.locale as LanguageCode,
        parseInt(req.params.pageId)
      )
      if (pageContent === undefined) res.status(404)

      res.json(pageContent)
    }) as RequestHandler
  )

  // Get course sections
  .get(p('api/course/sections'), param('courseId').isInt(), checkErrors, (async (req, res) => {
    const sections = await getCourseSections(parseInt(req.params.courseId))
    res.json(sections)
  }) as RequestHandler)

  // Get section content
  .get(
    p('api/course/section/content'),
    param('courseId').isInt(),
    param('locale').isLocale(),
    param('sectionId').isInt(),
    checkErrors,
    (async (req, res) => {
      const sectionContent = await getSectionContent(
        parseInt(req.params.courseId),
        req.params.locale as LanguageCode,
        parseInt(req.params.sectionId)
      )
      if (sectionContent === undefined) res.status(404)

      res.json(sectionContent)
    }) as RequestHandler
  )

  // Get fragment content
  .get(
    p('api/course/fragment/content'),
    param('locale').isLocale(),
    param('courseId').isInt(),
    param('fragmentType').custom(isFragmentType),
    checkErrors,
    (async (req, res) => {
      const sectionContent = await getFragmentContent(
        parseInt(req.params.courseId),
        req.params.locale as LanguageCode,
        req.params.fragmentType as FragmentType
      )

      if (sectionContent === undefined) {
        res.status(404)
      }

      res.json(sectionContent)
    }) as RequestHandler
  )

export default courseRouter
