import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import { notationParserIn, outsideDistance, rawParse, rawParseWithLatex } from './util'

// Find greatest common divisor
const gcd = (a, b) => (b ? gcd(b, a % b) : a)

// Input must be equivalent to the solution, irreducible and with positive
// denominator.
const exactFraction = (input, solution, attrs) => {
  const messages = []

  if (input === '') {
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
    return [RESULT_VALUE.NEUTRAL, messages]
  }

  const { precision } = attrs
  const s = solution
  let latexCode
  let b = notationParserIn(input)

  let ok
  let sp = -1.2
  let l = 0

  if (b.trim() === '') {
    // Empty string is not a correct entry
    l = NaN
    ok = RESULT_VALUE.INCORRECT
    messages.push({ msg: 'still-incorrect-answer', type: 'error' })
  } else {
    ;[l, latexCode] = rawParseWithLatex(b)
    sp = rawParse(s)
    ok = RESULT_VALUE.CORRECT
  }

  // Correct value (within precision)?
  if (outsideDistance(l, sp, precision)) {
    messages.push({ msg: 'incorrect-value', type: 'error' })
    ok = RESULT_VALUE.INCORRECT
  }

  // test non-fraction
  if (b.indexOf('/') === -1) {
    const rx = /(-?\d+)/
    const m = rx.exec(b)
    if (m !== null) {
      if (m[1] !== b) {
        messages.push({ msg: 'exact-fraction.only-integer', type: 'warning' })
        ok = RESULT_VALUE.INCORRECT
      }
    } else {
      ok = RESULT_VALUE.INCORRECT
      messages.push({ msg: 'exact-fraction.only-integer', type: 'warning' })
    }
  } else {
    // test fraction
    const fr = b.split('/')
    if (fr.length !== 2) {
      ok = RESULT_VALUE.INCORRECT
      messages.push({ msg: 'malformed-input', type: 'error' })
    } else {
      fr[0] = fr[0].trim()
      fr[1] = fr[1].trim()
      const rex = /(-?\d+)/
      let u = rex.exec(fr[0])
      if (u !== null) {
        if (u[1] === fr[0]) {
          u = rex.exec(fr[1])
          if (u !== null) {
            if (u[1] === fr[1]) {
              let a = rawParse(fr[0])
              if (a < 0) {
                a = -a
              }
              b = rawParse(fr[1])
              const g = gcd(a, b)

              if (g !== 1) {
                ok = RESULT_VALUE.INCORRECT
                messages.push({
                  msg: 'exact-fraction.fraction-not-reduced',
                  type: 'warning',
                })
              }

              if (b <= 0) {
                ok = RESULT_VALUE.INCORRECT
                messages.push({
                  msg: 'exact-fraction.denominator-not-positive',
                  type: 'warning',
                })
              }
            } else {
              ok = RESULT_VALUE.INCORRECT
              messages.push({
                msg: 'exact-fraction.denominator-not-integer',
                type: 'warning',
              })
            }
          } else {
            ok = RESULT_VALUE.INCORRECT
            messages.push({
              msg: 'exact-fraction.denominator-not-integer',
              type: 'warning',
            })
          }
        } else {
          ok = RESULT_VALUE.INCORRECT
          messages.push({
            msg: 'exact-fraction.numerator-not-integer',
            type: 'warning',
          })
        }
      } else {
        ok = RESULT_VALUE.INCORRECT
        messages.push({
          msg: 'exact-fraction.numerator-not-integer',
          type: 'warning',
        })
      }
    }
  }

  if (ok === RESULT_VALUE.CORRECT) {
    messages.push({ msg: 'correct-answer', type: 'success' })
  }

  return [ok, messages, latexCode]
}

export default exactFraction
