import nodemailer from 'nodemailer'

const sendMailMiddleware = ({
  host,
  port,
  user,
  password,
  senderAddress,
  skipMails,
}) => (req, res, next) => {
  if (skipMails) {
    // Skip mail sending entirely (for E2E testing)
    req.app.locals.sendMail = () => {}
  } else {
    const transport = nodemailer.createTransport({
      host,
      port,
      auth: { user, pass: password },
    })
    req.app.locals.sendMail = (params) =>
      transport.sendMail({
        ...params,
        from: senderAddress,
      })
  }
  next()
}

export default sendMailMiddleware
