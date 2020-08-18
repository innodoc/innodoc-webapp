import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'

import errorHandler from './errorHandler'
import { nextController, userController } from './controllers'
import { requestLoggerMiddleware } from './logger'
import {
  passConfigMiddleware,
  passportMiddleware,
  sendMailMiddleware,
  verifyAccessTokenMiddleware,
} from './middlewares'

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
    .use(passConfigMiddleware(config))
    .use(sendMailMiddleware(config.smtp))
    .use(verifyAccessTokenMiddleware(config))
    .use(passportMiddleware(config))
    .use(nextController(config, nextApp))
    .use('/user', userController(config))
    .use(errorHandler(config))
}

export default createExpressApp
