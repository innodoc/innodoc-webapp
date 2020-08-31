const isCI = process.env.INNODOC_WEBAPP_CI === 'true'

const config = {
  roots: ['src'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  verbose: true,
}

if (isCI) {
  config.testEnvironment = 'node'
} else {
  config.preset = '@shelf/jest-mongodb'
}

module.exports = config
