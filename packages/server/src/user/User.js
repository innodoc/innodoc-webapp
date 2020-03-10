import crypto from 'crypto'

import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const TOKEN_LENGTH = 16
const tokenRegexp = `[a-f0-9]{${TOKEN_LENGTH}}`

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
  password: String,
  passwordResetExpires: Date,
  passwordResetToken: String,
})

User.plugin(passportLocalMongoose, {
  findByUsername: (model, queryParameters) =>
    model.findOne({ ...queryParameters, emailVerified: true }),
  usernameField: 'email',
  usernameLowerCase: true,
  // TODO: passwordValidator
})

User.statics.generateToken = () =>
  crypto.randomBytes(TOKEN_LENGTH / 2).toString('hex')

export { tokenRegexp }
export default mongoose.model('User', User)
