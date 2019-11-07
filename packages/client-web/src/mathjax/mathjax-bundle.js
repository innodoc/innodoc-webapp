require('mathjax-full/components/src/startup/lib/startup.js')
const { Loader } = require('mathjax-full/js/components/loader')

Loader.preLoad(
  'loader',
  'startup',
  'core',

  'input/tex-base',
  '[tex]/ams',
  '[tex]/newcommand',

  'output/chtml',
  'output/chtml/fonts/tex.js'
)

require('mathjax-full/components/src/core/core.js')

require('mathjax-full/components/src/input/tex-base/tex-base.js')
require('mathjax-full/components/src/input/tex/extensions/ams/ams.js')
require('mathjax-full/components/src/input/tex/extensions/newcommand/newcommand.js')

window.MathJax.config.tex.packages.push('ams', 'newcommand')

require('mathjax-full/components/src/output/chtml/chtml.js')
require('mathjax-full/components/src/output/chtml/fonts/tex/tex.js')

// This will cause all the normal startup operations to be performed.
require('mathjax-full/components/src/startup/startup.js')
