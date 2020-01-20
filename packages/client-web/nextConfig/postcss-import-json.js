const { readFile } = require('fs')
const path = require('path')
const postcss = require('postcss')

// Implement @import-json rule that imports variables from JSON file.
module.exports = postcss.plugin('postcss-import-json', () => (root) => {
  const rulePromises = []
  root.walkAtRules('import-json', (rule) => {
    const importParam = rule.params.replace(/^['"](.+)['"]$/, '$1')
    const importFilepath = path.resolve(
      path.dirname(rule.source.input.file),
      importParam
    )
    rulePromises.push(
      new Promise((resolve, reject) =>
        readFile(importFilepath, (err, fileData) => {
          if (err) {
            reject(err)
          } else {
            try {
              const vars = JSON.parse(fileData)
              const varNames = Object.keys(vars)
              for (let i = 0; i < varNames.length; i += 1) {
                const varName = varNames[i]
                const varNode = postcss.decl({
                  prop: `$${varName}`,
                  value: vars[varName],
                })
                varNode.source = rule.source
                rule.parent.insertBefore(rule, varNode)
              }
              rule.remove()
              resolve()
            } catch (e) {
              reject(e)
            }
          }
        })
      )
    )
  })
  return Promise.all(rulePromises)
})
