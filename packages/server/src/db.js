import mongoose from 'mongoose'

const connectDb = async ({ mongoUrl, nodeEnv }) => {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.set('debug', nodeEnv === 'development')
}

const disconnectDb = () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.close()
  }
  return Promise.resolve()
}

export { connectDb, disconnectDb }
