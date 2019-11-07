import { Configuration } from 'mathjax-full/js/input/tex/Configuration'
import { CommandMap } from 'mathjax-full/js/input/tex/SymbolMap'

import innodocMethods from './innodocMethods'

CommandMap('innodoc', { decmarker: ['decmarker', 'decmarker'] }, innodocMethods)

export default Configuration.create('innodoc', { handler: { macro: ['innodoc'] } })
