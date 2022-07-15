// Extract antd default variables so we can use them in our stylesheets

import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'

import less from 'less'
import LessPluginVariablesOutput from 'less-plugin-variables-output'

const require = createRequire(import.meta.url)

// Path to antd default theme
const antdThemePath = require.resolve('antd/lib/style/themes/default.less')

// Output path for antd default vars
const antdVarsFilename = path.resolve(
  new URL('.', import.meta.url).pathname,
  '..',
  '..',
  'src',
  'style',
  'antd-vars.json'
)

const config = async (phase, config) => {
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

export default config
