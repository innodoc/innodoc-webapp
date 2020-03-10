import nodemailer from 'nodemailer'

const sendMailMiddleware = ({ host, port, user, password, senderAddress }) => (
  req,
  res,
  next
) => {
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
  next()
}

export default sendMailMiddleware
