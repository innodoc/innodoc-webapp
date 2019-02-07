module.exports = {
  roots: ['e2e'],
  verbose: true,
  testEnvironment: './e2e/NightmareEnvironment.js',
  setupFilesAfterEnv: ['<rootDir>/e2e/jest.setup.js'],
}
