import crypto from 'crypto'

import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

import { validatePassword } from '@innodoc/client-misc/src/passwordDef'

const TOKEN_LENGTH = 16
export const tokenRegexp = `[a-f0-9]{${TOKEN_LENGTH}}`

const findByUsername = (model, queryParameters) =>
  model.findOne({ ...queryParameters, emailVerified: true })

const User = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  emailVerificationToken: String,
  emailVerified: {
    default: false,
    type: Boolean,
  },
  passwordResetExpires: Date,
  passwordResetToken: String,
})

User.plugin(passportLocalMongoose, {
  findByUsername,
  usernameField: 'email',
  usernameLowerCase: true,
  passwordValidator: (password, cb) => {
    const errorList = validatePassword(password)
    if (errorList.length) {
      return cb(new Error('passwordValidationError'))
    }
    return cb()
  },
})

User.methods.generateAccessToken = function generateAccessToken(jwtSecret, issuer) {
  return jwt.sign({ sub: this.email }, jwtSecret, {
    expiresIn: '30d',
    issuer,
  })
}

User.statics.generateToken = () => crypto.randomBytes(TOKEN_LENGTH / 2).toString('hex')

export default mongoose.model('User', User)
