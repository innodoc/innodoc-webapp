module.exports = {
  testEnvironment: 'node',
  roots: ['src'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  verbose: true,
}
