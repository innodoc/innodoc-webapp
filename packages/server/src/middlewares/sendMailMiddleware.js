import transport from '../emailTransport'

const sendMailMiddleware = (smtp) => (req, res, next) => {
  req.app.locals.sendMail = (params) =>
    transport(smtp).sendMail({
      ...params,
      from: smtp.senderAddress,
    })
  next()
}

export default sendMailMiddleware
