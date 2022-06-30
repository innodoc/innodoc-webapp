import transport from './emailTransport'
import getLogger from './logger'

const errorHandler = (smtpConfig) => async (err, req, res, next) => {
  if (res.headersSent) {
    next(err)
  } else {
    const errMsg = `Exception occured. user: ${res.locals.loggedInEmail} path: ${req.path}\n${err.stack}`
    getLogger('request').error(errMsg)

    if (process.env.NODE_ENV === 'production') {
      await transport(smtpConfig).sendMail({
        subject: `Exception on ${process.env.APP_ROOT}: ${err.name}`,
        text: errMsg,
        to: process.env.LOG_ERROR_EMAIL,
      })
    }

    res.status(err.status || 500)
    const msg = process.env.NODE_ENV === 'production' ? 'Oops. Something went wrong!' : err.stack
    if (req.xhr) {
      res.json({ result: 'error', msg })
    } else {
      res.send(msg)
    }
  }
}

export default errorHandler
