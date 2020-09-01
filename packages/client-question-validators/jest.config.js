const nodeModulesEs = ['mathjs']

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // TODO: pnp
  transformIgnorePatterns: [`/node_modules/(?!(${nodeModulesEs.join('|')})/)`],
}
