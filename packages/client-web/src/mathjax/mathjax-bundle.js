require('mathjax-full/components/src/startup/lib/startup.js')

const { Loader } = require('mathjax-full/js/components/loader.js')

Loader.preLoad(
  'loader',
  'startup',
  'core',
  'input/tex-full',
  'output/chtml'
)

require('mathjax-full/components/src/core/core.js')
require('mathjax-full/components/src/input/tex-full/tex-full.js')
require('mathjax-full/components/src/output/chtml/chtml.js')
require('mathjax-full/components/src/startup/startup.js')
