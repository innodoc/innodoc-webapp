const { resolve } = require('path')

const rootDir = resolve(__dirname, '..', '..')

module.exports = {
  preset: 'jest-puppeteer',
  rootDir,
  roots: [resolve(rootDir, 'e2e', 'tests')],
  setupFilesAfterEnv: [resolve(rootDir, 'e2e', 'jest', 'setupAfterEnv.js')],
  verbose: true,
}
