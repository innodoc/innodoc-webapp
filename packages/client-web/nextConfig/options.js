const path = require('path')
const { execSync } = require('child_process')

const webpack = require('./webpack')

// Extract antd default vars to JSON file and prepare overridden vars
const prepareScript = path.resolve(__dirname, 'preBuild.js')
const output = execSync(`node ${prepareScript}`).toString()
let antdVars
try {
  antdVars = JSON.parse(output)
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(`${e}\n${output}`)
}

module.exports = {
  // Only use .js (not .jsx)
  pageExtensions: ['js'],
  lessLoaderOptions: {
    // Needed by antd less code
    javascriptEnabled: true,
    // Pass custom variables to antd
    modifyVars: antdVars,
  },
  // GZIP compression should happen in reverse proxy
  compress: false,
  // CSS modules with local scope
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack,
}
