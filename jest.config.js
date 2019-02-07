module.exports = {
  testEnvironment: 'enzyme',
  roots: ['src'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/static/**',
    '!src/.next/**',
  ],
  moduleNameMapper: {
    '\\.(sass|svg)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/enzyme.config.js'],
  verbose: true,
}
