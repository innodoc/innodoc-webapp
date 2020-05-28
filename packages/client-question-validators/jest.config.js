const nodeModulesEs = ['mathjs']

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [`/node_modules/(?!(${nodeModulesEs.join('|')})/)`],
}
