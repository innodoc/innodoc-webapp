import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'
import { notationParserIn, rawParse, outsideDistance } from './util'

const interval = (input, solution, attrs) => {
  const messages = []

  if (input === '') {
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
    return [RESULT_VALUE.NEUTRAL, messages]
  }

  let b = notationParserIn(input.trim())
  b = b.replace(/;/gi, ',') // Allow commas and semicolon in input

  let typl = 0 // 0 = unknown, 1 = open, 2 = closed
  let typr = 0
  let btypl = 0
  let btypr = 0
  let leftok = true
  let rightok = true
  let ok = RESULT_VALUE.INCORRECT

  const matchSol = solution.match(
    /([([\]]{1})([^()[\],]*),([^()[\],]*)([)[\]]{1})/
  )

  if (!matchSol) {
    throw new Error(`Solution interval is erroneous: ${solution}`)
  }

  // Alternatives for "infty"
  b = b.replace(/infinity/g, 'infty')
  b = b.replace(/unendlich/g, 'infty')

  const matchUser = b.match(/([([\]]{1})([^()[\],]*),([^()[\],]*)([)[\]]{1})/)
  if (matchUser) {
    if (matchSol[1] === '(' || matchSol[1] === ']') typl = 1
    if (matchSol[1] === '[') typl = 2

    if (matchUser[1] === '(' || matchUser[1] === ']') btypl = 1
    if (matchUser[1] === '[') btypl = 2

    if (matchSol[4] === ')' || matchSol[4] === '[') typr = 1
    if (matchSol[4] === ']') typr = 2

    if (matchUser[4] === ')' || matchUser[4] === '[') btypr = 1
    if (matchUser[4] === ']') btypr = 2

    if (typl === btypl && typr === btypr) {
      if (matchSol[2].trim() !== matchUser[2].trim()) {
        const leftUser = rawParse(matchUser[2])
        if (
          Number.isNaN(leftUser) ||
          outsideDistance(leftUser, rawParse(matchSol[2]), attrs.precision)
        )
          leftok = false
      }

      if (matchSol[3].trim() !== matchUser[3].trim()) {
        const rightUser = rawParse(matchUser[3])
        if (
          Number.isNaN(rightUser) ||
          outsideDistance(rightUser, rawParse(matchSol[3]), attrs.precision)
        )
          rightok = false
      }

      if (rightok && leftok) {
        ok = RESULT_VALUE.CORRECT
        messages.push({ msg: 'correct-answer', type: 'success' })
      }
    }
  }

  if (ok === RESULT_VALUE.INCORRECT) {
    messages.push({ msg: 'incorrect-interval', type: 'error' })
  }

  // TODO latexcode
  return [ok, messages]
}

export default interval
