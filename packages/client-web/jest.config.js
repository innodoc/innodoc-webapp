const nodeModulesEs = require('./nodeModulesEs')

module.exports = {
  testEnvironment: 'enzyme',
  roots: ['src'],
  collectCoverageFrom: ['src/**/*.js', '!src/public/**', '!src/.next/**'],
  moduleNameMapper: {
    '\\.(less|sss|svg)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/enzyme.config.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/.next/'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '!enzyme\\.config\\.js',
    `/node_modules/(?!(${nodeModulesEs.join('|')})/)`,
  ],
  verbose: true,
}
