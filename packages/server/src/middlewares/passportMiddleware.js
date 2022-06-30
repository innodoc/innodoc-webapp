import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'

import User from '../models/User'

export const jwtFromRequest = (req) => (req && req.cookies ? req.cookies.accessToken : undefined)

// User lookup already done in lookupUserMiddleware
export const verify = (req, jwtPayload, done) => done(null, req.user ? req.user : false)

const passportMiddleware = () => {
  const jwtStrategy = new JwtStrategy(
    {
      issuer: process.env.APP_ROOT,
      jwtFromRequest,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
    },
    verify
  )

  const middleware = passport.initialize()
  passport.use(jwtStrategy)
  passport.use(User.createStrategy())
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  return middleware
}

export default passportMiddleware
