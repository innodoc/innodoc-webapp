import { Router } from 'express'

import courseRouter from './courseRouter'

const apiRouter = Router()
  .use('/course', courseRouter)
  // Catch-all 404 handler
  .use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' })
  })

export default apiRouter
