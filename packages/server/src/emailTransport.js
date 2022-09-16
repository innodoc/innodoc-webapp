import nodemailer from 'nodemailer'

import getLogger from './logger'

let transport

const emailTransport = ({ host, port, user, password, skipMails, senderAddress }) => {
  if (!transport) {
    const transportOpts = { host, port, secure: false }
    if (user && password) {
      transportOpts.auth = { user, pass: password }
    }
    transport = nodemailer.createTransport(transportOpts, { from: senderAddress })
    if (skipMails) {
      // Skip mail sending entirely (E2E tests)
      transport.sendMail = () => {}
    } else {
      const origSendMail = transport.sendMail
      transport.sendMail = async (opts) => {
        await origSendMail.call(transport, opts)
        getLogger('email').info(`To: ${opts.to} Subject: "${opts.subject}"`)
      }
    }
  }
  return transport
}

export default emailTransport
