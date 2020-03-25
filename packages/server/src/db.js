import mongoose from 'mongoose'

const connectDb = async ({ mongoUrl, nodeEnv }) => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.set('debug', nodeEnv === 'development')
}

export default connectDb
