const fs = require('fs')

const config = {
  roots: ['src'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  verbose: true,
}

if (fs.existsSync('/etc/alpine-release')) {
  config.testEnvironment = 'node'
} else {
  config.preset = '@shelf/jest-mongodb'
}

module.exports = config
