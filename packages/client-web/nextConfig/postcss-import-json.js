const { readFileSync } = require('fs')
const path = require('path')

// @import-json rule that imports variables from JSON file.
module.exports = () => ({
  postcssPlugin: 'postcss-import-json',
  Once: (root, { decl, result }) => {
    root.walkAtRules('import-json', (atRule) => {
      const importParam = atRule.params.replace(/^['"](.+)['"]$/, '$1')
      const importFilepath = path.resolve(path.dirname(atRule.source.input.file), importParam)

      const fileData = readFileSync(importFilepath)

      result.messages.push({
        type: 'dependency',
        plugin: 'postcss-import-json',
        file: importFilepath,
        parent: result.opts.from,
      })

      const varList = JSON.parse(fileData)
      atRule.parent.insertBefore(
        atRule,
        Object.keys(varList).map((varName) =>
          decl({
            prop: `$${varName}`,
            value: varList[varName],
            source: atRule.source,
          })
        )
      )

      atRule.remove()
    })
  },
})

module.exports.postcss = true
