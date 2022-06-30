import crypto from 'crypto'
import querystring from 'querystring'

import { Router } from 'express'
import passport from 'passport'
import i18next from 'i18next'
import i18nextHttpMiddleware from 'i18next-http-middleware'

import getLogger from './logger'
import User from './models/User'
import UserProgress from './models/UserProgress'
import { resetPasswordMail, verificationMail } from './mails'

i18next.use(i18nextHttpMiddleware.LanguageDetector).init({
  preload: ['en', 'de'],
})

const userController = () => {
  const router = Router()
  const logger = getLogger('user')
  const secureCookie = new URL(process.env.APP_ROOT).protocol === 'https'

  // Late import of i18n, as it depends on Next.js configuration
  router.use(i18nextHttpMiddleware.handle(i18next))

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
                testScores: progress.testScores,
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
        !progress.testScores ||
        !typeof progress.testScores === 'object' ||
        Object.keys(progress.testScores).some(
          (k) => typeof k !== 'string' || !Number.isInteger(progress.testScores[k])
        ) ||
        !Array.isArray(progress.visitedSections)
      ) {
        res.status(400).json({ result: 'MalformedRequest' })
        return
      }

      try {
        const filter = { user_id: req.user._id }
        const update = {
          answeredQuestions: progress.answeredQuestions,
          testScores: progress.testScores,
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
        verificationMail(req.t, process.env.APP_ROOT, email, user.emailVerificationToken)
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
    const accessToken = req.user.generateAccessToken(process.env.JWT_SECRET, process.env.APP_ROOT)
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
          resetPasswordMail(req.t, process.env.APP_ROOT, email, user.passwordResetToken)
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
          verificationMail(req.t, process.env.APP_ROOT, email, user.emailVerificationToken)
        )
        res.status(200).json({ result: 'ok' })
      } else {
        res.status(400).json({ result: 'NoMatchingEmailFound' })
      }
    } catch (err) {
      next(err)
    }
  })

  // Discourse SSO implementation
  // https://meta.discourse.org/t/discourseconnect-official-single-sign-on-for-discourse-sso/13045
  if (process.env.DISCOURSE_URL && process.env.DISCOURSE_SSO_SECRET) {
    router.get('/discourse-sso', (req, res, next) => {
      passport.authenticate('jwt', (err, user) => {
        if (err) {
          next(err)
        } else if (!user) {
          // If not logged in, redirect to /login with redirect_to query param
          const redirectAfterLogin = new URL(process.env.DISCOURSE_URL)
          redirectAfterLogin.pathname = '/session/sso'
          const qs = querystring.stringify({ redirect_to: redirectAfterLogin.toString() })
          res.redirect(`/login?${qs}`)
        } else
          try {
            // Verify SSO payload
            const { sso, sig } = req.query
            const digest = crypto
              .createHmac('sha256', process.env.DISCOURSE_SSO_SECRET)
              .update(sso)
              .digest('hex')
            if (digest !== sig) {
              throw new Error('Could not verify signature!')
            }
            const payload = Buffer.from(sso, 'base64').toString()
            const { nonce, return_sso_url: returnSsoUrl } = querystring.parse(payload)

            // Create return payload
            const payloadQuerystring = querystring.stringify({
              email: user.email,
              external_id: user.id,
              nonce,
            })
            const returnPayload = Buffer.from(payloadQuerystring).toString('base64')
            const returnSig = crypto
              .createHmac('sha256', process.env.DISCOURSE_SSO_SECRET)
              .update(returnPayload)
              .digest('hex')

            // Redirect to Discourse SSO endpoint
            const url = new URL(returnSsoUrl)
            url.searchParams.set('sso', returnPayload)
            url.searchParams.set('sig', returnSig)
            res.redirect(url.toString())
          } catch {
            res.status(403).end()
          }
      })(req, res, next)
    })
  }

  return router
}

export default userController
