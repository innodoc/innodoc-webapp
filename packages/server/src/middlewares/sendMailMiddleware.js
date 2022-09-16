import transport from '../emailTransport'

const sendMailMiddleware = (smtp) => (req, res, next) => {
  req.app.locals.sendMail = transport(smtp).sendMail
  next()
}

export default sendMailMiddleware
