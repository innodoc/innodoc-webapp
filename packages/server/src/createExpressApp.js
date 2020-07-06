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
  lookupUserMiddleware,
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
    .use(passportMiddleware(config))
    .use(lookupUserMiddleware(config))
    .use('/user', userController(config))
    .use(nextController(config, nextApp))
    .use(errorHandler(config))
}

export default createExpressApp
