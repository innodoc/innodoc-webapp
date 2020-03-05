import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'

import User from './models/User'
import router from './routes'

const setupExpressPassport = (app) => {
  app
    .use(bodyParser.json())
    .use(
      session({
        secret: 'passport-tutorial',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
      })
    )
    .use(passport.initialize())
    .use(passport.session())
    .use('/user', router)

  passport.use(User.createStrategy())
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  mongoose.connect('mongodb://localhost/innodoc-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.set('debug', true)
}

export default setupExpressPassport
