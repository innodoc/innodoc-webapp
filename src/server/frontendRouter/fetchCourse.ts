import type { RequestHandler } from 'express'

import { SLUG_RE } from '#constants'
import config from '#server/config'
import { getCourse } from '#server/database/queries/courses'

const slugRegExp = new RegExp(`^${SLUG_RE}$`)

/** Fetch course from database */
const fetchCourse = (async (req, res, next) => {
  // Default slug
  let courseSlug = config.defaultCourseSlug

  // Extract slug from domain
  if (config.courseSlugMode === 'SUBDOMAIN' && req.headers.host !== undefined) {
    const domainParts = req.headers.host.split('.')
    if (domainParts.length > 2) courseSlug = domainParts[0]
  }

  // Extract slug from url path
  else if (config.courseSlugMode === 'URL') {
    const urlParts = req.urlWithoutLocale?.split('/')
    if (urlParts !== undefined && urlParts.length > 0) {
      courseSlug = urlParts[1]
      req.urlWithoutLocale = `/${urlParts.slice(2).join('/')}`
    }
  }

  // Validate slug
  if (!slugRegExp.exec(courseSlug)) courseSlug = config.defaultCourseSlug

  // Fetch course
  const course = await getCourse({ courseSlug })
  if (!course) {
    res.sendStatus(404)
    return
  }

  req.course = course
  next()
}) as RequestHandler

export default fetchCourse
