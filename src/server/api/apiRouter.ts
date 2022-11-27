import { Router } from 'express'

import { COURSE_PREFIX } from '#routes'
import type { ServerConfig } from '#server/config'

import courseRouter from './courseRouter'

function apiRouter(config: ServerConfig) {
  const router = Router()

  if (!config.isProduction) {
    router.use((req, res, next) => {
      console.log(`API request: ${req.url}`)
      next()
    })
  }

  return (
    router
      .use(COURSE_PREFIX, courseRouter)
      // Catch-all 404 handler
      .use((req, res) => {
        res.status(404).json({ status: 404, message: 'Not found' })
      })
  )
}

export default apiRouter
