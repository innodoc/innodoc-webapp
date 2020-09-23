const mongoose = require('mongoose')
const jestPlaywrightTeardown = require('jest-playwright-preset/teardown')

const teardown = async (jestConfig) => {
  await mongoose.disconnect()
  await jestPlaywrightTeardown(jestConfig)
}

module.exports = teardown
