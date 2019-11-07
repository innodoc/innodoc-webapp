/*************************************************************
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

import { Configuration } from 'mathjax-full/js/input/tex/Configuration'
import { CommandMap } from 'mathjax-full/js/input/tex/SymbolMap'
import TexError from 'mathjax-full/js/input/tex/TexError'

const innodocMethods = {
  decmarker(parser, name, type) {
    console.log('decmarker called')
    console.log(parser, name, type)
  },
}

CommandMap('innodoc', {
  decmarker: ['decmarker', 'decmarker'],
}, innodocMethods)

Configuration.create('innodoc', { handler: { macro: ['innodoc'] } })
