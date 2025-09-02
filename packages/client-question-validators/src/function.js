/* eslint no-bitwise: "off" */

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import {
  convertMathInput,
  mathJS,
  mathJSFunctions,
  notationParserIn,
  rawParse,
  withinDistance,
} from './util'

// taken from jQuery-3.1.1
const isNumeric = (obj) =>
  (typeof obj === 'number' || typeof obj === 'string') && !Number.isNaN(obj - parseFloat(obj))

function isProperNumber(str) {
  if (
    // exclude hexadecimal
    str.indexOf('x') !== -1 ||
    // exclude binary
    str.indexOf('b') !== -1 ||
    // exclude octal
    str.indexOf('o') !== -1
  ) {
    return false
  }
  return isNumeric(str)
}

// Try to parse point input
function parseVector(input) {
  // Check if input matches point format (x,y)
  if (input.match(/^\s*\(/) && input.match(/\)\s*$/)) {
    const elems = input
      .replace(/^\s*\(/, '')
      .replace(/\)\s*$/, '')
      .split(',')

    return elems.length > 1 ? elems : null
  }

  return null
}

function checkSimplification(simplification, inp) {
  let input = inp
  const msgs = []

  // General checks

  if (input.indexOf('e^') !== -1) {
    msgs.push({
      msg: 'exp',
      interp: { got: 'e^TERM', need: 'exp(TERM)' },
      type: 'warning',
    })
  }

  if (input.indexOf('\\') !== -1) {
    msgs.push({ msg: 'backslash', type: 'info' })
  }

  if (input.indexOf(')(') !== -1) {
    msgs.push({
      msg: 'product-brackets',
      interp: { got: '(…)(…)', need: '(…)*(…)' },
      type: 'warning',
    })
  }

  const rx = /(\d+)([a-zA-Z(]+)/
  const res = rx.exec(input)
  if (res !== null) {
    if (res.length >= 3) {
      msgs.push({
        msg: 'product-form',
        interp: { got: `${res[1]}${res[2]}`, need: `${res[1]}*${res[2]}` },
        type: 'warning',
      })
    }
  }

  // Simplifications

  if (simplification.includes('no-brackets')) {
    // Replace all brackets by round brackets
    let rex = new RegExp('\\[', 'gi')
    input = input.replace(rex, '(')
    rex = new RegExp('\\]', 'gi')
    input = input.replace(rex, ')')
    if (input.indexOf('(') !== -1 || input.indexOf(')') !== -1) {
      msgs.push({
        msg: 'solution-not-simplified',
        type: 'warning',
      })
    }
  }

  // TODO: factor-notation and sum-notation not implemented
  //       factor-notation is actually used in tub_mathe

  // if ((type & 15) === 3) {
  //   // Hoechste Operation muss Addition/Subtraktion sein, Addition/Subtraktion darf auf tieferen Ebenen nicht vorkommen
  //   // Alle Klammern durch runde Klammern ersetzen
  //   let rex = new RegExp('\\[', 'gi')
  //   input = input.replace(rex, '(')
  //   rex = new RegExp('\\]', 'gi')
  //   input = input.replace(rex, ')')
  // }

  // Only one slash (fraction line) allowed
  if (simplification.includes('only-one-slash')) {
    if (input.indexOf('/') !== -1) {
      if (input.indexOf('/') !== input.lastIndexOf('/')) {
        msgs.push({
          msg: 'fraction-not-combined',
          type: 'warning',
        })
      }
    }
  }

  // Use of sqrt() disallowed
  if (simplification.includes('no-sqrt')) {
    if (input.indexOf('sqrt') !== -1) {
      msgs.push({
        msg: 'roots-as-exponents',
        type: 'warning',
      })
    }
  }

  // Use of abs() disallowed
  if (simplification.includes('no-abs')) {
    if (input.indexOf('abs') !== -1 || input.indexOf('|') !== -1) {
      msgs.push({
        msg: 'case-differentiation-required',
        type: 'warning',
      })
    }
  }

  // No fractions/powers allowed
  if (simplification.includes('no-fractions-no-powers')) {
    if (input.indexOf('^') !== -1 || input.indexOf('/') !== -1) {
      msgs.push({
        msg: 'no-denominator-or-exponentiation',
        type: 'warning',
      })
    }
  }

  // Only natural number allowed
  if (simplification.includes('only-natural-number')) {
    const t = input.trim()
    if (isProperNumber(t) === false) {
      msgs.push({
        msg: 'natural-number-required',
        type: 'warning',
      })
    }
  }

  // Max. 1 ^ and no / or * allowed
  if (simplification.includes('one-power-no-mult-or-div')) {
    if (input.indexOf('^') !== -1) {
      if (input.indexOf('^') !== input.lastIndexOf('^')) {
        msgs.push({
          msg: 'exponentiation-not-combined',
          type: 'warning',
        })
      }
    } else if (input.indexOf('/') !== -1 || input.indexOf('*') !== -1) {
      msgs.push({
        msg: 'resolve-denominators-and-factors',
        type: 'warning',
      })
    }
  }

  return msgs
}

function evalSupportingPoints(simplification, spoints, precision, varia, valcode, solcode) {
  let c1
  let c2

  // Antiderivative requested: normalize both terms to f(1.234) = 0 (and assume its just one variable!)
  if (simplification.includes('antiderivative')) {
    const scope = {}
    scope[varia[0]] = 1.234
    c1 = valcode.evaluate(scope)
    c2 = solcode.evaluate(scope)
  }

  // TODO: copy current implementation from ml_parsedfunction.js (bitbucket) ??
  let first
  if (simplification.includes('special-support-points')) {
    // Special supporting points requested: only positive ones and weakly rational,
    // separate variables get separate evaluation positions
    first = 1.195785684 // should not occur as fraction somewhere
  } else {
    // Regular supporting points (positive and negative, almost symmetrical, zero is hit if >1 point is requested
    first = 1 - spoints * 0.5 // first supporting point
  }

  let vj
  let s
  let v

  const vv = []
  for (vj = 0; vj < varia.length; vj += 1) {
    vv[vj] = first
  }

  let iterations = 0

  try {
    let fini = false

    while (fini === false) {
      // Evaluate at support points in vv
      const scope = mathJSFunctions
      for (vj = 0; vj < varia.length; vj += 1) {
        scope[varia[vj]] = vv[vj]
      }

      s = solcode.evaluate(scope)
      v = valcode.evaluate(scope)

      if (simplification.includes('antiderivative')) {
        s -= c2
        v -= c1
      }

      const pd = `norm(${s} - ${v})`
      const ed = rawParse(pd)

      if (!withinDistance(ed, 0, precision)) {
        fini = true
        return 'still-incorrect-answer'
      }

      // Increment array of support points
      let index = 0
      let inc = true
      while (inc === true) {
        vv[index] += 1
        if (vv[index] > spoints) {
          vv[index] = first
          index += 1
          if (index === varia.length) {
            // Done incrementing array
            inc = false
            fini = true
          }
        } else {
          inc = false
        }
      }

      iterations += 1
      if (iterations > 50) {
        break
      }
    }
  } catch (e) {
    return 'malformed-input'
  }

  return undefined
}

// Input as function expression
// Comparison at supporting points 1,2,..., number, shifted number/2 to the left
const func = (input, solution, attrs) => {
  const messages = []

  const addMessage = (msg) => {
    if (!messages.some((m) => m.msg === msg.msg && m.type === msg.type)) {
      messages.push(msg)
    }
  }

  if (input === '') {
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
    return [RESULT_VALUE.NEUTRAL, messages]
  }

  // Doing check here, otherwise math.js would choke on '|'
  if (input.indexOf('|') !== -1) {
    messages.push({
      msg: 'simplification.abs',
      interp: { got: '|…|', need: 'abs(…)' },
      type: 'warning',
    })
    return [RESULT_VALUE.INCORRECT, messages]
  }

  let latexCode
  let ok = RESULT_VALUE.CORRECT
  let isVector = false

  // Attributes
  const varia = typeof attrs.variables === 'string' ? attrs.variables.split(',') : []
  let spoints =
    typeof attrs['supporting-points'] === 'string' ? Number(attrs['supporting-points']) : 5
  spoints = Math.min(15, spoints)
  const precision = typeof attrs.precision === 'string' ? Number(attrs.precision) : 5
  const simplification =
    typeof attrs.simplification === 'string' ? attrs.simplification.split(',') : []

  const inputParsed = notationParserIn(input)

  // Try to parse as vector
  let inputVec = parseVector(inputParsed)
  let solVec = parseVector(solution)

  // Vector validation
  if (inputVec !== null && solVec !== null) {
    isVector = true
    if (inputVec.length !== solVec.length) {
      messages.push({ msg: 'still-incorrect-answer', type: 'error' })
      return [RESULT_VALUE.INCORRECT, messages]
    }

    const inputRt = convertMathInput(inputParsed)
    // return [ok, messages, inputRt.latex]
    latexCode = inputRt.latex
  }

  // Single expression
  else {
    inputVec = [inputParsed]
    solVec = [solution]
  }

  // Sanity checks
  if (inputVec.length !== solVec.length || inputVec.length > 10) {
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
    return [RESULT_VALUE.INCORRECT, messages]
  }

  let allSupportingPointsOk = true

  // Validate supporting points for each expression
  for (let i = 0; i < inputVec.length; i += 1) {
    const sol = solVec[i]
    const inp = inputVec[i]

    let rt
    let solcode
    try {
      rt = convertMathInput(sol)
      solcode = mathJS.compile(rt.mathjs)
    } catch (e) {
      throw new Error(
        `Solution could not be parsed: sol='${sol}' rt='${rt}' solcode='${solcode}': ${e}`
      )
    }

    let inputRt
    let valcode
    try {
      inputRt = convertMathInput(inp)
      if (!isVector) {
        latexCode = inputRt.latex
      }
      valcode = mathJS.compile(inputRt.mathjs)
    } catch (e) {
      messages.push({ msg: 'malformed-input', type: 'error' })
      return [RESULT_VALUE.INCORRECT, messages]
    }

    const result = evalSupportingPoints(simplification, spoints, precision, varia, valcode, solcode)
    if (typeof result === 'string') {
      ok = RESULT_VALUE.INCORRECT
      allSupportingPointsOk = false
      addMessage({ msg: result, type: 'error' })
    }

    // Check simplifications
    const simplMessages = checkSimplification(simplification, inp)
    for (let j = 0; j < simplMessages.length; j += 1) {
      const message = simplMessages[j]
      const msg = { msg: `simplification.${message.msg}`, type: message.type }
      if (message.interp) {
        msg.interp = message.interp
      }
      messages.push(msg)
      if (['error', 'warning'].includes(message.type)) {
        ok = RESULT_VALUE.INCORRECT
      }
    }

    if (ok !== RESULT_VALUE.CORRECT) {
      break
    }
  }

  if (allSupportingPointsOk) {
    addMessage({ msg: 'correct-answer', type: 'success' })
  }

  return [ok, messages, latexCode]
}

export default func
