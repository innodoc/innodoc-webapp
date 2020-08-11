import jwt from 'jsonwebtoken'

const verifyAccessTokenMiddleware = ({ appRoot, jwtSecret }) => (req, res, next) => {
  if (req.cookies.accessToken) {
    try {
      const { sub } = jwt.verify(req.cookies.accessToken, jwtSecret, {
        issuer: appRoot,
      })
      res.locals.loggedInEmail = sub
    } catch {
      // ignore
    }
  }
  next()
}

export default verifyAccessTokenMiddleware
