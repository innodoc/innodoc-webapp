export const verificationMail = (t, appRoot, email, token) => ({
  to: email,
  subject: t('emails.emailVerification.subject'),
  text: t('emails.emailVerification.text', {
    verificationLink: `${appRoot}verify-user/${token}`,
  }),
})

export const resetPasswordMail = (t, appRoot, email, token) => ({
  to: email,
  subject: t('emails.passwordReset.subject'),
  text: t('emails.passwordReset.text', {
    passwordResetLink: `${appRoot}reset-password/${token}`,
  }),
})
