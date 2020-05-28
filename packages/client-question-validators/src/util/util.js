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

// Help function that encapsulates convertMathInput for the case that only a
// simple translation and no error processing and LaTeX representation is necessary.
// The expression must be evaluable to a fixed number.
export const rawParse = (input) => {
  try {
    return mathJS.compile(convertMathInput(input, 2).mathjs).evaluate()
  } catch (e) {
    return NaN
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
