import jwt from 'jsonwebtoken'

import User from '../models/User'

// Extract email, lookup user and attach to request
const lookupUserMiddleware =
  ({ appRoot, jwtSecret }) =>
  async (req, res, next) => {
    if (req.cookies.accessToken) {
      try {
        // Actual token verify for auth is happening in passport middleware
        const { sub } = jwt.verify(req.cookies.accessToken, jwtSecret, {
          issuer: appRoot,
        })
        const user = await User.findByUsername(sub)
        if (user) {
          req.user = user
        }
      } catch {
        // ignore
      }
    }
    next()
  }

export default lookupUserMiddleware
