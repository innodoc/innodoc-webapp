import { Router } from 'express'

import { tokenRegexp } from '../models/User'
import { getContentPath, handleCustomRoute } from './util'

const nextController = ({ sectionPathPrefix, pagePathPrefix }, nextApp) => {
  const router = Router()

  router
    .get(`/reset-password/:token(${tokenRegexp})`, (req, res) =>
      nextApp.render(req, res, '/reset-password', req.params)
    )
    .get(`/verify-user/:token(${tokenRegexp})`, (req, res) =>
      nextApp.render(req, res, '/verify-user', req.params)
    )
    .get(
      getContentPath(sectionPathPrefix),
      handleCustomRoute(nextApp, '/section')
    )
    .get(getContentPath(pagePathPrefix), handleCustomRoute(nextApp, '/page'))
    .get('*', nextApp.getRequestHandler())

  return router
}

export default nextController
