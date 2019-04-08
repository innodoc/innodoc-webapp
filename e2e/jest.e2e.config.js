module.exports = {
  preset: 'jest-puppeteer',
  rootDir: '..',
  roots: ['e2e/tests'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/e2e/setup.js'],
}
