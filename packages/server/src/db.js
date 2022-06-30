import mongoose from 'mongoose'

const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.set('debug', process.env.NODE_ENV !== 'production')
}

const disconnectDb = () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.close()
  }
  return Promise.resolve()
}

export { connectDb, disconnectDb }
