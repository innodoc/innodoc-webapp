import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'

import errorHandler from './errorHandler'
import userController from './userController'
import { requestLoggerMiddleware } from './logger'
import { passportMiddleware, sendMailMiddleware, lookupUserMiddleware } from './middlewares'

const createExpressApp = (config, nextApp) => {
  const app = express()

  if (config.nodeEnv !== 'production') {
    app.use(requestLoggerMiddleware())
  }

  return app
    .use(bodyParser.json())
    .use(cookieParser())
    .use(
      csrf({
        cookie: { secure: new URL(config.appRoot).protocol === 'https' },
        value: (req) => req.headers['csrf-token'],
      })
    )
    .use(sendMailMiddleware(config.smtp))
    .use(passportMiddleware(config))
    .use(lookupUserMiddleware(config))
    .use('/user', userController(config))
    .get('*', nextApp.getRequestHandler())
    .use(errorHandler(config))
}

export default createExpressApp
