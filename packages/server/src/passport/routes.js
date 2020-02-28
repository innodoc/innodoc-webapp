import passport from 'passport'
import { errors } from 'passport-local-mongoose'

import User from './models/User'

const userRoutes = (app) => {
  app.post('/register', (req, res, next) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err) => {
        if (err) {
          if (err instanceof errors.UserExistsError) {
            res.status(400).json({ result: err.name, message: err.message })
          } else {
            next(err)
          }
        } else {
          passport.authenticate('local')(req, res, () => {
            res.status(200).json({ result: 'ok' })
          })
        }
      }
    )
  })

  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/')
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/ping', (req, res) => {
    res.status(200).send('pong!')
  })
}

export default userRoutes
