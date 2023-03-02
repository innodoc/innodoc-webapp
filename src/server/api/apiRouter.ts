import { Router } from 'express'

import { COURSE_PREFIX } from '#constants'
import config from '#server/config'

import courseRouter from './courseRouter'

const apiRouter = Router()

if (!config.isProduction) {
  apiRouter.use((req, res, next) => {
    console.log(`API request: ${req.originalUrl}`)
    next()
  })
}

apiRouter
  .use(COURSE_PREFIX, courseRouter)
  // Catch-all 404 handler
  .use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' })
  })

export default apiRouter
