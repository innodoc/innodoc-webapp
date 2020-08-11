import { verificationMail, resetPasswordMail } from './mails'

const t = (s, int) => {
  if (int) {
    const intStr = Object.keys(int).reduce((acc, key) => `${acc}${key}=${int[key]}`, '')
    return `${s}_${intStr}`
  }
  return s
}
const appRoot = 'https://app.example.com/'

describe('verificationMail', () => {
  it('should generate mail', () => {
    expect(verificationMail(t, appRoot, 'alice@example.com', '123abcdef')).toEqual({
      to: 'alice@example.com',
      subject: 'emails.emailVerification.subject',
      text:
        'emails.emailVerification.text_verificationLink=https://app.example.com/verify-user/123abcdef',
    })
  })
})

describe('resetPasswordMail', () => {
  it('should generate mail', () => {
    expect(resetPasswordMail(t, appRoot, 'alice@example.com', '123abcdef')).toEqual({
      to: 'alice@example.com',
      subject: 'emails.passwordReset.subject',
      text:
        'emails.passwordReset.text_passwordResetLink=https://app.example.com/reset-password/123abcdef',
    })
  })
})
