import { constants } from '@innodoc/client-misc'

import { convertMathInput, notationParserIn, rawParse, withinDistance } from './util'

// Input field with real solution, parsed, exactly up to precision places after the comma
// solution formats:
//  - Empty string: Empty set is required (not empty string)
//  - Several comma-separated values in solution: Finite set is requested as input
//  - Several semicolon-separated values in solution: Finite set is requested as input
//    (Only entered values, the solution must always be written with commas)
// solution:
//  - More than one solution (which can be the same): set brackets are required in input,
//    even if it is only one solution
//  - Only one solution: No quantity brackets allowed in solution input.
const parsed = (input, solution, attrs) => {
  const messages = []

  if (input === '') {
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
    return [constants.RESULT.NEUTRAL, messages]
  }

  let soluta = solution.split(',') // never has set brackets

  let valuta = {}
  let ok = constants.RESULT.CORRECT
  // empty set asked (otherwise not recognized because split returns
  // one element (empty string))
  let solleer = 0
  if (solution === '') {
    solleer = 1
    // the empty set as empty array of possible values
    soluta = {}
  }
  let latexCode

  if (soluta.length === 1 && solleer === 0) {
    // An element without set brackets is required
    valuta = notationParserIn(input).split(',')
    if (valuta.length !== 1 || valuta[0].indexOf('{') !== -1 || valuta[0].indexOf('}') !== -1) {
      ok = constants.RESULT.INCORRECT
    }
    const result = convertMathInput(input)
    if (!result.errorList.length) {
      latexCode = result.latex
    }
  } else {
    // A set (possibly empty or with one element) is requested
    const tr = notationParserIn(input).trim()

    if (tr.indexOf('{') !== 0 || tr.indexOf('}') !== tr.length - 1) {
      ok = constants.RESULT.INCORRECT // Curly brackets not set correctly or not there
    } else {
      const st = tr.substr(1, tr.length - 2)
      if (st.trim() === '') {
        // User entered empty set
        valuta = {}
        latexCode = '\\left\\lbrace\\right\\rbrace'
      } else {
        valuta = st.split(',')
        if (valuta.length === 1) {
          // Semicolon also possible, but only if no comma is found
          valuta = st.split(';')
        }

        latexCode = '\\left\\lbrace '
        for (let i = 0; i < valuta.length; i += 1) {
          const result = convertMathInput(valuta[i])
          if (!result.errorList.length) {
            latexCode += result.latex
            if (i !== valuta.length - 1) {
              latexCode += ','
            }
          }
        }
        latexCode += ' \\right\\rbrace'
      }
    }
  }

  // Check both subset relations, i.e. double listings of elements are considered correct
  for (let vj = 0; vj < valuta.length && ok === constants.RESULT.CORRECT; vj += 1) {
    let c = 0
    const v = rawParse(valuta[vj])
    for (let sj = 0; sj < soluta.length && c === 0; sj += 1) {
      const s = rawParse(soluta[sj])
      if (withinDistance(v, s, attrs.precision)) c = 1
    }
    if (c === 0) {
      ok = constants.RESULT.INCORRECT
    }
  }
  for (let sj = 0; sj < soluta.length && ok === constants.RESULT.CORRECT; sj += 1) {
    let c = 0
    const s = rawParse(soluta[sj])
    for (let vj = 0; vj < valuta.length && c === 0; vj += 1) {
      const v = rawParse(valuta[vj])
      if (withinDistance(v, s, attrs.precision)) c = 1
    }
    if (c === 0) {
      ok = constants.RESULT.INCORRECT
    }
  }

  if (ok === constants.RESULT.INCORRECT) {
    if (soluta.length === 1 && solleer === 0) {
      messages.push({ msg: 'incorrect-value', type: 'error' })
    } else {
      messages.push({ msg: 'incorrect-solution-set', type: 'error' })
    }
  } else if (ok === constants.RESULT.CORRECT) {
    messages.push({ msg: 'correct-answer', type: 'success' })
  }

  return [ok, messages, latexCode]
}

export default parsed
