import mathjax from 'mathjax-full/js/mathjax' // MathJax core
import TeX from 'mathjax-full/js/input/tex' // TeX input
import AllPackages from 'mathjax-full/js/input/tex/AllPackages' // all TeX packages

// browser DOM
// import browser from 'mathjax-full/js/adaptors/browserAdaptor.js').browserAdaptor
// Register = require('mathjax-full/js/handlers/html.js').RegisterHTMLHandler    // the HTML handler

// const STATE = require('mathjax-full/js/core/MathItem.js').STATE

//
//  Register the HTML handler with the browser adaptor and add the semantic enrichment
//
// Enrich(Register(browser()), new MathML())

//  Initialize mathjax with a blank DOM.
const html = mathjax.document('', {
  //  Create the TeX input jax
  InputJax: new TeX({
    packages: AllPackages,
    macros: { require: ['', 1] }, // Make \require a no-op since all packages are loaded
  }),
})

//  The user's configuration object
// const CONFIG = window.MathJax || {}

//
//  The global MathJax object
//
window.MathJax = {
  version: mathjax.version,
  html,
}

//
// Perform ready function, if there is one
//
// if (CONFIG.ready) {
//   sreReady.then(CONFIG.ready)
// }
