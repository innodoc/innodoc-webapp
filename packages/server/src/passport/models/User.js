import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const User = new mongoose.Schema({
  activated: Boolean,
  email: String,
  password: String,
})

User.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameLowerCase: true,
})

export default mongoose.model('User', User)
