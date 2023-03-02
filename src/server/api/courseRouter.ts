import { type RequestHandler, Router } from 'express'
import { param, validationResult } from 'express-validator'
import type { LanguageCode } from 'iso-639-1'

import { API_COURSE_PREFIX } from '#constants'
import { getCourse } from '#server/database/queries/courses'
import { getFragmentContent } from '#server/database/queries/fragments'
import { getCoursePages, getPageContent } from '#server/database/queries/pages'
import {
  getCourseSections,
  getSectionContent,
  getSectionIdByPath,
} from '#server/database/queries/sections'
import { getRoutePath } from '#server/utils'
import type { FragmentType } from '#types/entities/base'
import type { ApiRouteName } from '#types/routes'
import { isFragmentType, isLanguageCode } from '#types/typeGuards'

import { isSectionPath, isSlug } from './validators'

const p = (name: ApiRouteName) => getRoutePath(name, API_COURSE_PREFIX)

const checkErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

const courseRouter = Router()
  // Get course by ID
  .get(p('api:course'), param('courseSlug').custom(isSlug), checkErrors, (async (req, res) => {
    const course = await getCourse(req.params.courseSlug)
    if (!course) {
      return res.sendStatus(404)
    }

    res.json(course)
  }) as RequestHandler)

  // Get course pages
  .get(p('api:course:pages'), param('courseSlug').custom(isSlug), checkErrors, (async (
    req,
    res
  ) => {
    const pages = await getCoursePages(req.params.courseSlug)
    res.json(pages)
  }) as RequestHandler)

  // Get page content
  .get(
    p('api:course:page:content'),
    param('courseSlug').custom(isSlug),
    param('locale').custom(isLanguageCode),
    param('pageSlug').custom(isSlug),
    checkErrors,
    (async (req, res) => {
      const pageContent = await getPageContent(
        req.params.courseSlug,
        req.params.locale as LanguageCode,
        req.params.pageSlug
      )
      if (pageContent === undefined) {
        return res.sendStatus(404)
      }

      res.type('text/markdown').send(pageContent)
    }) as RequestHandler
  )

  // Get course sections
  .get(p('api:course:sections'), param('courseSlug').custom(isSlug), checkErrors, (async (
    req,
    res
  ) => {
    const sections = await getCourseSections(req.params.courseSlug)
    res.json(sections)
  }) as RequestHandler)

  // Get section content
  .get(
    p('api:course:section:content'),
    param('courseSlug').custom(isSlug),
    param('locale').custom(isLanguageCode),
    param('sectionPath').custom(isSectionPath),
    checkErrors,
    (async (req, res) => {
      const sectionId = await getSectionIdByPath(req.params.courseSlug, req.params.sectionPath)
      if (sectionId === undefined) {
        return res.sendStatus(404)
      }

      const sectionContent = await getSectionContent(
        req.params.courseSlug,
        req.params.locale as LanguageCode,
        sectionId
      )
      if (sectionContent === undefined) {
        return res.sendStatus(404)
      }

      res.type('text/markdown').send(sectionContent)
    }) as RequestHandler
  )

  // Get fragment content
  .get(
    p('api:course:fragment:content'),
    param('courseSlug').custom(isSlug),
    param('locale').custom(isLanguageCode),
    param('fragmentType').custom(isFragmentType),
    checkErrors,
    (async (req, res) => {
      const fragmentContent = await getFragmentContent(
        req.params.courseSlug,
        req.params.locale as LanguageCode,
        req.params.fragmentType as FragmentType
      )

      if (fragmentContent === undefined) {
        return res.sendStatus(404)
      }

      res.type('text/markdown').send(fragmentContent)
    }) as RequestHandler
  )

export default courseRouter
