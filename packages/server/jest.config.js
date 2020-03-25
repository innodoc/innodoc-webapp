module.exports = {
  preset: '@shelf/jest-mongodb',
  roots: ['src'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  verbose: true,
}
