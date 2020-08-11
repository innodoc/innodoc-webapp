import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'

import User from '../models/User'

export const jwtFromRequest = (req) => (req && req.cookies ? req.cookies.accessToken : undefined)

export const verify = ({ sub }, done) => {
  try {
    return done(null, sub)
  } catch (error) {
    return done(error)
  }
}

const passportMiddleware = ({ appRoot, jwtSecret }) => {
  const jwtStrategy = new JwtStrategy(
    {
      issuer: appRoot,
      jwtFromRequest,
      secretOrKey: jwtSecret,
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
