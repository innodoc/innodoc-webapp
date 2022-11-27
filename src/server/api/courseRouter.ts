import camelcaseKeys from 'camelcase-keys'
import { type RequestHandler, Router } from 'express'
import type { LanguageCode } from 'iso-639-1'

import { API_COURSE_PREFIX, type RoutesDefinition } from '#routes'
import {
  getCourse,
  getCoursePages,
  getCourseSections,
  getFragmentContent,
  getPageContent,
  getSectionContent,
} from '#server/database/queries/course'
import { getRoutePath } from '#server/utils'

const p = (name: keyof RoutesDefinition) => getRoutePath(name, `${API_COURSE_PREFIX}`)

const courseRouter = Router()
  // Get course by course name
  .get(p('api/course'), (async (req, res) => {
    const course = await getCourse(req.params.courseName)
    if (!course) return res.sendStatus(404)
    res.json(camelcaseKeys(course))
  }) as RequestHandler)

  // Get course pages
  .get(p('api/course/pages'), (async (req, res) => {
    const pages = await getCoursePages(req.params.courseName)
    res.json(camelcaseKeys(pages))
  }) as RequestHandler)

  // Get page content
  .get(p('api/course/page/content'), (async (req, res) => {
    const pageContent = await getPageContent(
      req.params.courseName,
      req.params.locale as LanguageCode,
      req.params.pageName
    )

    if (pageContent === undefined) {
      res.status(404).json({ status: 404, message: 'Not found' })
    }

    res.json(pageContent)
  }) as RequestHandler)

  // Get course sections
  .get(p('api/course/sections'), (async (req, res) => {
    const sections = await getCourseSections(req.params.courseName)
    res.json(camelcaseKeys(sections))
  }) as RequestHandler)

  // Get section content
  .get(p('api/course/section/content'), (async (req, res) => {
    const sectionContent = await getSectionContent(
      req.params.courseName,
      req.params.locale as LanguageCode,
      parseInt(req.params.sectionId)
    )

    if (sectionContent === undefined) {
      res.status(404).json({ status: 404, message: 'Not found' })
    }

    res.json(sectionContent)
  }) as RequestHandler)

  // Get fragment content
  .get(p('api/course/fragment/content'), (async (req, res) => {
    const sectionContent = await getSectionContent(
      req.params.courseName,
      req.params.locale as LanguageCode,
      parseInt(req.params.sectionId)
    )

    if (sectionContent === undefined) {
      res.status(404).json({ status: 404, message: 'Not found' })
    }

    res.json(sectionContent)
  }) as RequestHandler)

  // Get fragment content
  .get(p('api/course/fragment/content'), (async (req, res) => {
    const fragmentContent = await getFragmentContent(
      req.params.fragmentName,
      req.params.locale as LanguageCode,
      parseInt(req.params.sectionId)
    )

    if (fragmentContent === undefined) {
      res.status(404).json({ status: 404, message: 'Not found' })
    }

    res.json(fragmentContent)
  }) as RequestHandler)

export default courseRouter
