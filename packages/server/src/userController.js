import { Router } from 'express'
import passport from 'passport'
import i18nextHttpMiddleware from 'i18next-http-middleware'

import getLogger from './logger'
import User from './models/User'
import UserProgress from './models/UserProgress'
import { resetPasswordMail, verificationMail } from './mails'

const userController = async ({ appRoot, jwtSecret }) => {
  const router = Router()
  const logger = getLogger('user')
  const secureCookie = new URL(appRoot).protocol === 'https'

  // Late import of i18n, as it depends on Next.js configuration
  const nextI18next = await import('@innodoc/common/src/i18n')
  router.use(i18nextHttpMiddleware.handle(nextI18next.i18n))

  router.get(
    '/progress',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      try {
        const progress = await UserProgress.findOne({
          user_id: req.user._id,
        }).lean()
        res.status(200).json({
          result: 'ok',
          progress: progress
            ? {
                answeredQuestions: progress.answeredQuestions.map((q) => ({
                  id: q.id,
                  exerciseId: q.exerciseId,
                  answer: q.answer,
                  answeredTimestamp: q.answeredTimestamp,
                  result: q.result,
                  points: q.points,
                })),
                visitedSections: progress.visitedSections,
              }
            : null,
        })
      } catch (err) {
        next(err)
      }
    }
  )

  router.post(
    '/progress',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      const { progress } = req.body
      if (
        !progress ||
        !Array.isArray(progress.answeredQuestions) ||
        !Array.isArray(progress.visitedSections)
      ) {
        res.status(400).json({ result: 'MalformedRequest' })
        return
      }

      try {
        const filter = { user_id: req.user._id }
        const update = {
          answeredQuestions: progress.answeredQuestions,
          visitedSections: progress.visitedSections,
        }
        const opts = { upsert: true }
        await UserProgress.findOneAndUpdate(filter, update, opts)
        res.status(200).json({ result: 'ok' })
      } catch (err) {
        next(err)
      }
    }
  )

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
    async (req, res, next) => {
      try {
        const { user } = await User.authenticate()(req.user.email, req.body.password)
        if (user) {
          await UserProgress.deleteOne({ user_id: req.user._id })
          req.logout()
          res.clearCookie('accessToken', {
            httpOnly: true,
            secure: secureCookie,
          })
          await user.delete()
          logger.info(`Account deleted: ${user.email}`)
          res.status(200).json({ result: 'ok' })
        } else {
          res.status(400).json({ result: 'DeleteAccountError' })
        }
      } catch (err) {
        next(err)
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
    } catch {
      res.status(400).json({ result: 'UserExistsError' })
    }
    try {
      await req.app.locals.sendMail(
        verificationMail(req.t, appRoot, email, user.emailVerificationToken)
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
    async (req, res) => {
      const { oldPassword, password } = req.body
      try {
        await req.user.changePassword(oldPassword, password)
        res.status(200).json({ result: 'ok' })
      } catch {
        res.status(400).json({ result: 'ChangePasswordError' })
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
          resetPasswordMail(req.t, appRoot, email, user.passwordResetToken)
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
          verificationMail(req.t, appRoot, email, user.emailVerificationToken)
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
