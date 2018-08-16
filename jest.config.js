module.exports = {
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  roots: ['src'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/static/**',
    '!src/.next/**',
  ],
  coverageReporters: [
    'text',
    'text-summary',
  ],
  moduleNameMapper: {
    '\\.sass$': 'identity-obj-proxy',
  },
  verbose: true,
}
