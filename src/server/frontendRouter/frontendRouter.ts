import { Router } from 'express'

import type { ServerConfig } from '#server/config'

import extractLocale from './extractLocale'
import fetchCourse from './fetchCourse'
import frontendHandler from './frontendHandler'

function frontendRouter(config: ServerConfig) {
  const router = Router()

  return (
    router
      .use(extractLocale)
      .use(fetchCourse(config))
      .get('*', frontendHandler)
      // Catch-all 404 handler
      .use((req, res) => {
        // TODO: error handler
        res.status(404).json({ status: 404, message: 'Not found' })
      })
  )
}

export default frontendRouter
