/**
 *
 *  innodoc.js - innoDoc MathJax extension
 *
 *  Implements the \num command inspired by the siunitx package. It uses
 *  dot or comma as decimal marker depending on the HTML lang attribute.
 *
 *  We allow \num{0.23} and \num{0,23} to define decimal fractions.
 *
 *  Use \decmarker to output the decimal marker.
 *
 *  Use \coordsep to insert a coordination point separator (x; y)
 *
 */

import { combineWithMathJax } from 'mathjax-full/js/components/global'

import InnodocConfiguration from './innodocConfiguration'
import InnodocMethods from './innodocMethods'

combineWithMathJax({
  _: {
    input: {
      tex: {
        innodoc: {
          InnodocConfiguration,
          InnodocMethods,
        },
      },
    },
  },
})
