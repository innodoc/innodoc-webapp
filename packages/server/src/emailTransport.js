import nodemailer from 'nodemailer'

import getLogger from './logger'

let transport

const emailTransport = ({ host, port, user, password, skipMails }) => {
  if (!transport) {
    const transportOpts = { host, port }
    if (user && password) {
      transportOpts.auth = { user, pass: password }
    }
    transport = nodemailer.createTransport(transportOpts)
    if (skipMails) {
      // Skip mail sending entirely (E2E tests)
      transport.sendMail = () => {}
    } else {
      const origSendMail = transport.sendMail
      transport.sendMail = (opts) =>
        origSendMail.call(transport, opts).then((result) => {
          getLogger('email').info(`To: ${opts.to} Subject: "${opts.subject}"`)
          return result
        })
    }
  }
  return transport
}

export default emailTransport
