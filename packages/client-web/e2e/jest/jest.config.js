const { resolve } = require('path')

const rootDir = resolve(__dirname, '..', '..')
const e2eJestDir = resolve(rootDir, 'e2e', 'jest')

module.exports = {
  globalSetup: resolve(e2eJestDir, 'globalSetup.js'),
  globalTeardown: resolve(e2eJestDir, 'globalTeardown.js'),
  rootDir,
  roots: [resolve(rootDir, 'e2e', 'tests')],
  setupFilesAfterEnv: [resolve(e2eJestDir, 'setupAfterEnv.js')],
  testEnvironment: resolve(e2eJestDir, 'WendigoEnvironment.js'),
  verbose: true,
}
