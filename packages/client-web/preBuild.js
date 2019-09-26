/* eslint-disable no-console */

// 1) Extract Ant Design default variables to JSON file.
// 2) Extract and return overridden variables from antd-theme.sss.

const fs = require('fs')
const path = require('path')

const less = require('less')
const LessPluginVariablesOutput = require('less-plugin-variables-output')
const postcss = require('postcss')
const sugarss = require('sugarss')

const getPostcssConfig = require('./postcss.config')

// antd default vars
const antdThemeFilename = path.resolve(
  __dirname, '..', '..', 'node_modules', 'antd', 'lib', 'style', 'themes', 'default.less'
)

// output path for antd default vars
const antdVarsFilename = path.resolve(__dirname, 'src', 'style', 'antd-vars.json')

const extractAntdDefaultVariables = () => (
  less.render(fs.readFileSync(antdThemeFilename).toString(), {
    filename: antdThemeFilename,
    javascriptEnabled: true,
    plugins: [new LessPluginVariablesOutput({ filename: antdVarsFilename })],
  }).catch((err) => {
    console.error('Failed to extract antd default variables!')
    console.error(err)
    process.exit(-1)
  })
)

// overridden antd variables
const antdVarsOverrideFilename = path.resolve(__dirname, 'src', 'style', 'antd-theme.sss')

const postcssConfig = getPostcssConfig(
  { file: { extname: path.extname(antdVarsOverrideFilename) } }
)

const generateVarsForAntd = () => postcss(postcssConfig.plugins)
  .process(
    fs.readFileSync(antdVarsOverrideFilename).toString(),
    {
      from: antdVarsOverrideFilename,
      parser: sugarss.parse,
    }
  )
  .then((result) => result.root.variables)
  .catch((err) => {
    console.error('Failed to generate variables for Ant Design!')
    console.log(err)
    process.exit(-1)
  });

(async () => {
  await extractAntdDefaultVariables()
  const vars = await generateVarsForAntd()
  console.log(JSON.stringify(vars))
})()
