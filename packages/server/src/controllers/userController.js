import { Router } from 'express'
import passport from 'passport'
import i18nextHttpMiddleware from 'i18next-http-middleware'

import nextI18next from '@innodoc/client-misc/src/i18n'
import getLogger from '../logger'
import User from '../models/User'
import { resetPasswordMail, verificationMail } from '../mails'

const userController = ({ appRoot, jwtSecret }) => {
  const router = Router()
  const logger = getLogger('user')
  const secureCookie = new URL(appRoot).protocol === 'https'
  router.use(i18nextHttpMiddleware.handle(nextI18next.i18n))

  router.post('/check-email', async (req, res) => {
    if (await User.exists({ email: req.body.email })) {
      res.status(400).json({ result: 'UserExistsError' })
    } else {
      res.status(200).json({ result: 'ok' })
    }
  })

  router.post(
    '/delete-account',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      const deleteAccountErr = () => res.status(400).json({ result: 'DeleteAccountError' })
      const { loggedInEmail } = res.locals
      if (loggedInEmail) {
        try {
          const { user } = await User.authenticate()(loggedInEmail, req.body.password)
          if (user) {
            // TODO delete user progress
            await user.delete()
            req.logout()
            res.clearCookie('accessToken', {
              httpOnly: true,
              secure: secureCookie,
            })
            logger.info(`Account deleted: ${user.email}`)
            res.status(200).json({ result: 'ok' })
          } else {
            deleteAccountErr()
          }
        } catch {
          deleteAccountErr()
        }
      } else {
        deleteAccountErr()
      }
    }
  )

  router.post('/register', async (req, res, next) => {
    let user
    const { email, password } = req.body
    try {
      user = await User.register(
        new User({ email, emailVerificationToken: User.generateToken() }),
        password
      )
    } catch (err) {
      res.status(400).json({ result: 'UserExistsError' })
    }
    try {
      await req.app.locals.sendMail(
        verificationMail(req.t, res.locals.appRoot, email, user.emailVerificationToken)
      )
      logger.info(`Account registered: ${user.email}`)
      res.status(200).json({ result: 'ok' })
    } catch (err) {
      if (user) {
        await user.delete()
      }
      next(err)
    }
  })

  router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    const accessToken = req.user.generateAccessToken(jwtSecret, appRoot)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: secureCookie,
    })
    res.status(200).json({ result: 'ok' })
  })

  router.post('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    req.logout()
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: secureCookie,
    })
    res.status(200).json({ result: 'ok' })
  })

  router.post(
    '/change-password',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      const changePwdErr = () => res.status(400).json({ result: 'ChangePasswordError' })
      try {
        const { oldPassword, password } = req.body
        const user = await User.findByUsername(res.locals.loggedInEmail)
        if (user) {
          try {
            await user.changePassword(oldPassword, password)
            res.status(200).json({ result: 'ok' })
          } catch {
            changePwdErr()
          }
        } else {
          changePwdErr()
        }
      } catch (err) {
        next(err)
      }
    }
  )

  router.post('/reset-password', async (req, res, next) => {
    try {
      const { password, token: passwordResetToken } = req.body
      const user = await User.findOne({
        emailVerified: true,
        passwordResetToken,
        passwordResetExpires: { $gt: new Date() },
      })
      if (user) {
        await user.setPassword(password)
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()
        res.status(200).json({ result: 'ok' })
      } else {
        res.status(400).json({ result: 'NoMatchingTokenFound' })
      }
    } catch (err) {
      next(err)
    }
  })

  router.post('/verify', async (req, res, next) => {
    try {
      if (!req.body.token) {
        res.status(400).json({ result: 'NoMatchingTokenFound' })
      } else {
        const user = await User.findOne({
          emailVerificationToken: req.body.token,
          emailVerified: false,
        })
        if (user) {
          user.emailVerified = true
          await user.save()
          res.status(200).json({ result: 'ok' })
        } else {
          res.status(400).json({ result: 'NoMatchingTokenFound' })
        }
      }
    } catch (err) {
      next(err)
    }
  })

  router.post('/request-password-reset', async (req, res, next) => {
    try {
      const { email } = req.body
      const user = await User.findByUsername(email)
      if (user) {
        user.passwordResetToken = User.generateToken()
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour
        await req.app.locals.sendMail(
          resetPasswordMail(req.t, res.locals.appRoot, email, user.passwordResetToken)
        )
        await user.save()
        res.status(200).json({ result: 'ok' })
      } else {
        res.status(400).json({ result: 'NoMatchingEmailFound' })
      }
    } catch (err) {
      next(err)
    }
  })

  router.post('/request-verification', async (req, res, next) => {
    try {
      const { email } = req.body
      const user = await User.findOne({
        email,
        emailVerified: false,
      })
      if (user) {
        await req.app.locals.sendMail(
          verificationMail(req.t, res.locals.appRoot, email, user.emailVerificationToken)
        )
        res.status(200).json({ result: 'ok' })
      } else {
        res.status(400).json({ result: 'NoMatchingEmailFound' })
      }
    } catch (err) {
      next(err)
    }
  })

  return router
}

export default userController
