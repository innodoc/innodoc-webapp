const path = require('path')

// rule config for monorepo that also considers root package.json
module.exports = (dirname) => ({
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: true,
      packageDir: [dirname, path.resolve(dirname, '..', '..')],
    },
  ],
})
