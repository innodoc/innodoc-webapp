import { Router } from 'express'
import passport from 'passport'
import { errors } from 'passport-local-mongoose'

import User from './models/User'

const router = Router()

router.post('/checkEmail', async (req, res) => {
  if (await User.exists({ email: req.body.email })) {
    res.status(400).json({ result: 'UserExistsError' })
  } else {
    res.status(200).json({ result: 'ok' })
  }
})

router.post('/register', (req, res, next) => {
  User.register(
    new User({ email: req.body.email }),
    req.body.password,
    (err) => {
      if (err) {
        if (err instanceof errors.UserExistsError) {
          res.status(400).json({ result: err.name, message: err.message })
        }
        return next(err)
      }
      // TODO activation?
      passport.authenticate('local')(req, res, () => {
        res.status(200).json({ result: 'ok' })
      })
      return undefined
    }
  )
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ result: 'ok' })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/ping', (req, res) => {
  res.status(200).send('pong!')
})

export default router
