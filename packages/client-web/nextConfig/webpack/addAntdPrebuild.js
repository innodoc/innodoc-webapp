/* eslint-disable no-console */

/**
 * 1) Extract Ant Design default variables to JSON file.
 * 2) Extract overridden variables from antd-theme.sss and output as JSON to stdout.
 */

const fs = require('fs')
const path = require('path')

const less = require('less')
const LessPluginVariablesOutput = require('less-plugin-variables-output')
const postcss = require('postcss')
const postcssrc = require('postcss-load-config')

// TODO https://yarnpkg.com/features/pnp#packages-are-stored-inside-zip-archives-how-can-i-access-their-files

// Antd default vars
const antd = require('antd')
console.log(antd)

process.exit(0)

// const antdThemeFilename = require('antd/lib/style/themes/default.less')
// console.log(antdThemeFilename)

// Output path for antd default vars
const antdVarsFilename = path.resolve(__dirname, '..', '..', 'src', 'style', 'antd-vars.json')

const extractAntdDefaultVariables = () =>
  less
    .render(fs.readFileSync(antdThemeFilename).toString(), {
      filename: antdThemeFilename,
      javascriptEnabled: true,
      plugins: [new LessPluginVariablesOutput({ filename: antdVarsFilename })],
    })
    .catch((err) => {
      console.error('Failed to extract antd default variables!')
      console.error(err)
      process.exit(-1)
    })

// Overridden antd variables
const antdVarsOverrideFilename = path.resolve(__dirname, '..', 'src', 'style', 'antd-theme.sss')

const generateVarsForAntd = () =>
  postcssrc(
    {
      // Don't use postcss-import-json so only overridden variables are exported
      disablePostcssImportJson: true,
      file: { extname: path.extname(antdVarsOverrideFilename) },
    },
    path.resolve(__dirname, 'postcss.config.js')
  ).then(({ plugins, options }) =>
    postcss(plugins)
      .process(fs.readFileSync(antdVarsOverrideFilename).toString(), {
        ...options,
        from: antdVarsOverrideFilename,
      })
      .then((result) => result.root.variables)
      .catch((err) => {
        console.error('Failed to generate variables for Ant Design!')
        console.log(err)
        process.exit(-1)
      })
  )

const main = async () => {
  try {
    await extractAntdDefaultVariables()
    console.log(JSON.stringify(await generateVarsForAntd()))
  } catch (e) {
    console.error(e)
  }
}

if (require.main === module) {
  main()
}
