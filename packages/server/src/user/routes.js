import jwt from 'jsonwebtoken'
import { Router } from 'express'
import passport from 'passport'

import User from './User'
import { resetPasswordMail, verificationMail } from './mails'

const userRoutes = ({ appRoot, jwtSecret, nodeEnv }) => {
  const router = Router()

  router.post('/check-email', async (req, res) => {
    if (await User.exists({ email: req.body.email })) {
      res.status(400).json({ result: 'UserExistsError' })
    } else {
      res.status(200).json({ result: 'ok' })
    }
  })

  router.post('/register', async (req, res, next) => {
    let user
    try {
      const { email, password } = req.body
      user = await User.register(
        new User({ email, emailVerificationToken: User.generateToken() }),
        password
      )
      await req.app.locals.sendMail(
        verificationMail(
          req.t,
          res.locals.appRoot,
          email,
          user.emailVerificationToken
        )
      )
      res.status(200).json({ result: 'ok' })
    } catch (err) {
      if (user) {
        await user.delete()
      }
      next(err)
    }
  })

  router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    async (req, res) => {
      const accessToken = await jwt.sign({ sub: req.user.email }, jwtSecret, {
        expiresIn: '30d',
        issuer: appRoot,
      })
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: nodeEnv === 'production',
      })
      res.status(200).json({ result: 'ok' })
    }
  )

  router.post(
    '/logout',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      req.logout()
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: nodeEnv === 'production',
      })
      res.status(200).json({ result: 'ok' })
    }
  )

  router.post(
    '/change-password',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      try {
        const { email, oldPassword, password } = req.body
        const user = await User.findOne({
          email,
          emailVerified: true,
        })
        if (user) {
          await user.changePassword(oldPassword, password)
          res.status(200).json({ result: 'ok' })
        } else {
          res.status(400).json({ result: 'ChangePasswordError' })
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
      const { token: emailVerificationToken } = req.body
      const user = await User.findOne({
        emailVerificationToken,
        emailVerified: false,
      })
      if (user) {
        user.emailVerified = true
        await user.save()
        res.status(200).json({ result: 'ok' })
      } else {
        res.status(400).json({ result: 'NoMatchingTokenFound' })
      }
    } catch (err) {
      next(err)
    }
  })

  router.post('/request-password-reset', async (req, res, next) => {
    try {
      const { email } = req.body
      const user = await User.findOne({
        email,
        emailVerified: true,
      })
      if (user) {
        user.passwordResetToken = User.generateToken()
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour
        await user.save()
        await req.app.locals.sendMail(
          resetPasswordMail(
            req.t,
            res.locals.appRoot,
            email,
            user.passwordResetToken
          )
        )
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
          verificationMail(
            req.t,
            res.locals.appRoot,
            email,
            user.emailVerificationToken
          )
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

export default userRoutes
