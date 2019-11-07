import { mathjax } from 'mathjax-full/js/mathjax' // MathJax core
import { TeX } from 'mathjax-full/js/input/tex' // TeX input
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages' // all TeX packages
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor' // browser DOM
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html' // the HTML handler

// const STATE = require('mathjax-full/js/core/MathItem.js').STATE

// Register the HTML handler with the browser adaptor
RegisterHTMLHandler(browserAdaptor())

// Initialize mathjax with a blank DOM.
const html = mathjax.document('', {
  // Create the TeX input jax
  InputJax: new TeX({
    packages: AllPackages,
    macros: { require: ['', 1] }, // Make \require a no-op since all packages are loaded
  }),
})

// The user's configuration object
const config = window.MathJax || {}

// The global MathJax object
window.MathJax = {
  version: mathjax.version,
  html,
}

// Startup callback
if (config.ready) {
  config.ready()
}
