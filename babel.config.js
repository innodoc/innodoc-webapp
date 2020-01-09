const path = require('path')

module.exports = {
  presets: ['next/babel'],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    [
      'import',
      {
        libraryName: 'antd',
        customName: (name) =>
          path.resolve(__dirname, 'node_modules', 'antd', 'es', name),
        style: (name) => path.resolve(name, 'style'),
      },
    ],
  ],
}
