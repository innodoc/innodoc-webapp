import { Router } from 'express'

import extractLocale from './extractLocale'
import fetchCourse from './fetchCourse'
import frontendHandler from './frontendHandler'

const frontendRouter = Router()
  .use(extractLocale)
  .use(fetchCourse)
  .get('*', frontendHandler)
  // Catch-all 404 handler
  .use((req, res) => {
    // TODO: error handler
    res.status(404).json({ status: 404, message: 'Not found' })
  })

export default frontendRouter
