const path = require('path')
const { default: MongodbMemoryServer } = require('mongodb-memory-server')

const startMongod = async ({ hostname, port, pathname }) =>
  new MongodbMemoryServer({
    autoStart: false,
    binary: {
      downloadDir: path.resolve(__dirname, '..', '..', '..', '..', '.yarn', 'mongodb-binaries'),
      skipMD5: true,
    },
    instance: {
      ip: hostname,
      dbName: pathname.substr(1),
      port: parseInt(port, 10),
    },
  }).start()

if (require.main === module) {
  startMongod(new URL(process.argv[2]))
}
