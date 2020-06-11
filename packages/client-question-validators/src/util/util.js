import { mathJS } from './mathJSFunctions'
import convertMathInput from './convertMathInput'

// Parse string going from the user to internal processing
// (will always process math in unotation)
export const notationParserIn = (s) => {
  let r = s
  // OMB+ Notation laid down by the Coordination Group
  // TODO: support other variants?
  r = r.replace(/,/g, '.') // std -> unotation: decimal point instead of comma
  r = r.replace(/;/g, ',') // std -> unotation: comma instead of semicolon

  // Do not pass chaining ^ and _ at the end to parser
  if (['^', '_'].includes(r.substr(r.length - 1))) {
    r = r.slice(0, r.length - 1)
  }

  // Replace HTML tags which might show up when user does copy/paste
  r.replace(/&nbsp;/g, ' ')
  r.replace(/\t/g, ' ')

  return r
}

// Help function that encapsulates convertMathInput.
// The expression must be evaluable to a fixed number.
export const rawParse = (input) => {
  try {
    return mathJS.compile(convertMathInput(input, 2).mathjs).evaluate()
  } catch (e) {
    return NaN
  }
}

// Help function that encapsulates convertMathInput, preserves LaTeX representation.
// The expression must be evaluable to a fixed number.
export const rawParseWithLatex = (input) => {
  try {
    const ret = convertMathInput(input, 2)
    return [mathJS.compile(ret.mathjs).evaluate(), ret.latex]
  } catch (e) {
    return [NaN, undefined]
  }
}

const extround = (number, nPos) => {
  const i = 10 ** nPos
  return Math.round(number * i) / i
}

export const outsideDistance = (a, b, precision) =>
  Math.abs(extround(a, precision) - extround(b, precision)) >
  10 ** ((precision + 2) * -1)

export const withinDistance = (a, b, precision) =>
  Math.abs(extround(a, precision) - extround(b, precision)) <=
  10 ** ((precision + 2) * -1)
