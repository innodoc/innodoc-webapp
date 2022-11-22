import { Router } from 'express'

import type { ServerConfig } from '#server/getConfig'

import contentRouter from './contentRouter'

function apiRouter(config: ServerConfig) {
  return (
    Router()
      .use('/content', contentRouter(config))
      // Catch-all 404 handler
      .use((req, res) => {
        res.status(404).json({ status: 404, message: 'Not found' })
      })
  )
}

export default apiRouter
