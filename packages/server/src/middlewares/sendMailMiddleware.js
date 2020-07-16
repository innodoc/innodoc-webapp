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
    const transportOpts = { host, port }
    if (user && password) {
      transportOpts.auth = { user, pass: password }
    }
    const transport = nodemailer.createTransport(transportOpts)
    req.app.locals.sendMail = (params) =>
      transport.sendMail({
        ...params,
        from: senderAddress,
      })
  }
  next()
}

export default sendMailMiddleware
