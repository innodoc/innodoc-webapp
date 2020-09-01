const path = require('path')

module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      downloadDir: path.resolve(__dirname, '.yarn', 'mongodb-binaries'),
    },
    autoStart: false,
    instance: {},
  },
}
