import mongoose from 'mongoose'

import { connectDb } from './db'

jest.mock('mongoose')

describe('connectDb', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should connect to mongodb', async () => {
    await connectDb({
      mongoUrl: 'mongodb://mongohost/coll',
      nodeEnv: 'development',
    })
    expect(mongoose.connect).toBeCalledWith('mongodb://mongohost/coll', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  })

  it.each([true, false])('should set debug mode %s', async (dev) => {
    await connectDb({
      mongoUrl: 'mongodb://mongohost/coll',
      nodeEnv: dev ? 'development' : 'production',
    })
    expect(mongoose.set).toBeCalledWith('debug', dev)
  })
})
