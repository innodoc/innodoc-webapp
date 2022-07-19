const mongoose = require('mongoose')
const jestPlaywrightSetup = require('jest-playwright-preset/setup')

const setup = async (jestConfig) => {
  await jestPlaywrightSetup(jestConfig)
  await mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

module.exports = setup
