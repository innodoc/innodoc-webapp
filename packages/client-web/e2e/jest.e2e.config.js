const path = require('path')

const rootDir = path.resolve(__dirname, '..')

module.exports = {
  preset: 'jest-puppeteer',
  rootDir,
  roots: [path.resolve(rootDir, 'e2e', 'tests')],
  verbose: true,
  setupFilesAfterEnv: [path.resolve(rootDir, 'e2e', 'setup.js')],
}
