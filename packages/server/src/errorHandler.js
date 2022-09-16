import transport from './emailTransport'
import getLogger from './logger'

const errorHandler = ({ appRoot, logErrorEmail, nodeEnv, smtp }) => async (err, req, res, next) => {
  if (res.headersSent) {
    next(err)
  } else {
    const errMsg = `Exception occured. user: ${res.locals.loggedInEmail} path: ${req.path}\n${err.stack}`
    getLogger('request').error(errMsg)

    if (nodeEnv === 'production') {
      try {
        await transport(smtp).sendMail({
          subject: `Exception on ${appRoot}: ${err.name}`,
          text: errMsg,
          to: logErrorEmail,
        })
      } catch {
        getLogger('email').error(
          `Could not send verification request mail. Response: ${err.response}`
        )
      }
    }

    res.status(err.status || 500)
    const msg = nodeEnv === 'production' ? 'Oops. Something went wrong!' : err.stack
    if (req.xhr) {
      res.json({ result: 'error', msg })
    } else {
      res.send(msg)
    }
  }
}

export default errorHandler
