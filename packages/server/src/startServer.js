import path from 'path'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import express from 'express'
import mongoose from 'mongoose'
import next from 'next'
import nextI18NextMiddleware from 'next-i18next/middleware'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'

import nextI18next from '@innodoc/client-misc/src/i18n'
import getConfig from './getConfig'
import { getContentPath, handleCustomRoute } from './util'
import {
  verifyAccessTokenMiddleware,
  passConfigMiddleware,
  sendMailMiddleware,
} from './middlewares'
import { User, userRoutes, tokenRegexp } from './user'

const startServer = async (rootDir) => {
  const srcDir = path.resolve(rootDir, 'packages', 'client-web', 'src')
  const config = getConfig(rootDir)

  const nextApp = next({
    dir: srcDir,
    dev: config.nodeEnv === 'development',
  })
  await nextApp.prepare()

  mongoose.connect(config.mongodbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.set('debug', config.nodeEnv === 'development')

  const jwtStrategy = new JwtStrategy(
    {
      issuer: config.appRoot,
      jwtFromRequest: (req) =>
        req && req.cookies ? req.cookies.accessToken : null,
      secretOrKey: config.jwtSecret,
    },
    ({ sub }, done) => {
      try {
        return done(null, sub)
      } catch (error) {
        return done(error)
      }
    }
  )

  const passportMiddleware = passport.initialize()
  passport.use(jwtStrategy)
  passport.use(User.createStrategy())
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  const expressApp = express()
  expressApp
    .use(bodyParser.json())
    .use(cookieParser())
    .use(
      csrf({
        cookie: { secure: config.nodeEnv === 'production' },
        value: (req) => req.headers['csrf-token'],
      })
    )
    .use(passConfigMiddleware(config))
    .use(sendMailMiddleware(config.smtp))
    .use(nextI18NextMiddleware(nextI18next))
    .use(verifyAccessTokenMiddleware(config))
    .get(`/reset-password/:token(${tokenRegexp})`, (req, res) =>
      nextApp.render(req, res, '/reset-password', req.params)
    )
    .get(`/verify-user/:token(${tokenRegexp})`, (req, res) =>
      nextApp.render(req, res, '/verify-user', req.params)
    )
    .get(
      getContentPath(config.sectionPathPrefix),
      handleCustomRoute(nextApp, '/section')
    )
    .get(
      getContentPath(config.pagePathPrefix),
      handleCustomRoute(nextApp, '/page')
    )
    .use(passportMiddleware)
    .use('/user', userRoutes(config))
    .get('*', nextApp.getRequestHandler())

  await expressApp.listen(config.port)
  return config
}

export default startServer
