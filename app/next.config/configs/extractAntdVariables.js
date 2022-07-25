// Extract antd default variables so we can use them in our stylesheets

import fs from 'fs/promises'
import { createRequire } from 'module'

import less from 'less'
import LessPluginVariablesOutput from 'less-plugin-variables-output'

import { antdExtractedVarsTmp } from './common.js'

const require = createRequire(import.meta.url)

// Path to antd default theme
const antdThemePath = require.resolve('antd/lib/style/themes/default.less')

export default async (phase, config) => {
  try {
    const buffer = await fs.readFile(antdThemePath)
    less.render(buffer.toString(), {
      filename: antdThemePath,
      javascriptEnabled: true,
      plugins: [new LessPluginVariablesOutput({ filename: antdExtractedVarsTmp.name })],
    })
  } catch (err) {
    console.error('Error: Failed to extract antd default variables!')
    console.error(err)
    process.exit(-1)
  }

  return config
}
