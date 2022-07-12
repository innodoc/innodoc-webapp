// Extract antd default variables so we can use them in our stylesheets

const fs = require('fs').promises
const path = require('path')

const less = require('less')
const LessPluginVariablesOutput = require('less-plugin-variables-output')

// Path to antd default theme
const antdThemePath = require.resolve('antd/lib/style/themes/default.less')

// Output path for antd default vars
const antdVarsFilename = path.resolve(__dirname, '..', '..', 'src', 'style', 'antd-vars.json')

module.exports = async (phase, config) => {
  try {
    const buffer = await fs.readFile(antdThemePath)
    less.render(buffer.toString(), {
      filename: antdThemePath,
      javascriptEnabled: true,
      plugins: [new LessPluginVariablesOutput({ filename: antdVarsFilename })],
    })
  } catch (err) {
    console.error('Error: Failed to extract antd default variables!')
    console.error(err)
    process.exit(-1)
  }

  return config
}
