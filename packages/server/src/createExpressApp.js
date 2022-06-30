import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'

import errorHandler from './errorHandler'
import indexRedirectHandler from './indexRedirectHandler'
import userController from './userController'
import { requestLoggerMiddleware } from './logger'
import { passportMiddleware, sendMailMiddleware, lookupUserMiddleware } from './middlewares'

const createExpressApp = async (nextApp) => {
  const app = express()

  if (process.env.NODE_ENV !== 'production') {
    app.use(requestLoggerMiddleware())
  }

  const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    senderAddress: process.env.SMTP_SENDER,
    skipMails: process.env.SMTP_SKIP_MAILS === 'yes',
  }

  return app
    .use(bodyParser.json())
    .use(cookieParser())
    .use(
      csrf({
        cookie: { secure: new URL(process.env.APP_ROOT).protocol === 'https' },
        value: (req) => req.headers['csrf-token'],
      })
    )
    .get('/', indexRedirectHandler())
    .use(sendMailMiddleware(smtpConfig))
    .use(passportMiddleware())
    .use(lookupUserMiddleware())
    .use('/user', userController())
    .get('*', nextApp.getRequestHandler())
    .use(errorHandler(smtpConfig))
}

export default createExpressApp
