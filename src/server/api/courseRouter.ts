import camelcaseKeys from 'camelcase-keys'
import { type RequestHandler, Router } from 'express'

import getCourse from '#server/database/queries/getCourse'

const courseRouter = Router()
  // Course
  .get('/:courseName', (async (req, res) => {
    const course = await getCourse(req.params.courseName)
    if (course === null) return res.sendStatus(404)
    res.json(camelcaseKeys(course[0]))
  }) as RequestHandler)

// Get page content
// .get('/:courseName/page/:pageName', (async (req, res) => {
//   const course = await getPage(req.params.courseName)
//   if (course === null) return res.sendStatus(404)
//   res.json(camelcaseKeys(course[0]))
// }) as RequestHandler)

export default courseRouter
