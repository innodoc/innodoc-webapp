module.exports = {
  preset: 'jest-puppeteer',
  rootDir: '..',
  roots: ['e2e/tests'],
  verbose: true,
  // this should become setupFilesAfterEnv when
  // https://github.com/smooth-code/jest-puppeteer/pull/196 is released
  setupTestFrameworkScriptFile: '<rootDir>/e2e/setup.js',
}
