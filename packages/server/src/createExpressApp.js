import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'

import { nextController, userController } from './controllers'
import {
  passConfigMiddleware,
  passportMiddleware,
  sendMailMiddleware,
  verifyAccessTokenMiddleware,
} from './middlewares'

const createExpressApp = (config, nextApp) =>
  express()
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
    .use('/user', userController(config))
    .use(nextController(config, nextApp))

export default createExpressApp
