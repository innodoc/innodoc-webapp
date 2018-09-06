module.exports = {
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  roots: ['src'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/static/**',
    '!src/.next/**',
  ],
  moduleNameMapper: {
    '\\.sass$': 'identity-obj-proxy',
  },
  verbose: true,
}
