const path = require('path')
const PACKAGE = require('mathjax-full/components/webpack.common.js')

const pkg = PACKAGE(
  // the package to build
  'mathjax-bundle',
  // location of the MathJax js library
  path.resolve('..', '..', '..', '..', 'node_modules', 'mathjax-full', 'js'),
  // an array of components that we assume are already loaded
  [],
  // our directory
  __dirname,
  // output directory
  path.resolve('..', 'public', 'js', 'MathJax'),
)

// patch webpack config to make it work with Babel 7
pkg.module.rules[0].use.options.presets = ['@babel/preset-env']

// minification only for production build
if (process.env.NODE_ENV !== 'production') {
  pkg.optimization.minimizer = []
}

module.exports = pkg
