import { constants } from '@innodoc/client-misc'

global.createTests = (name, validatorFunc, cases) => {
  const defaultAttrs = {
    'supporting-points': '5',
    variables: '',
    precision: '5',
  }

  describe(name, () => {
    it('should return neutral result for empty string', () => {
      const [result, messages] = validatorFunc('', '', defaultAttrs)
      expect(result).toBe(constants.RESULT.NEUTRAL)
      expect(messages).toHaveLength(1)
      expect(messages[0].msg).toBe('still-incorrect-answer')
    })

    describe('cases', () => {
      cases.forEach(({ solution, correct = [], incorrect = [], attrs = defaultAttrs }) => {
        const attrStr = Object.entries(attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')

        describe(`solution="${solution}" (${attrStr})`, () => {
          correct.forEach((inp) => {
            let input = inp
            let expMessages = []
            let expLatex
            if (Array.isArray(inp)) {
              if (inp.length === 2) {
                ;[input, expLatex] = inp
              } else {
                ;[input, expLatex, expMessages] = inp
              }
            }
            expMessages.push('correct-answer')
            const expMessagesStr = expMessages.length ? ` (${expMessages})` : ''
            const expLatexStr = typeof expLatex !== 'undefined' ? ` (${expLatex})` : ''
            test(`✓ "${input}${expMessagesStr}${expLatexStr}"`, () => {
              const [result, messages, latex] = validatorFunc(input, solution, attrs)
              expect(result).toBe(constants.RESULT.CORRECT)
              if (expLatex !== null) {
                expect(latex).toBe(expLatex)
              }
              expect(messages).toHaveLength(expMessages.length)
              expect(messages.map((m) => m.msg)).toEqual(expect.arrayContaining(expMessages))
            })
          })

          incorrect.forEach(([inp, expLatex, expMessages]) => {
            const expLatexStr = expLatex ? ` (${expLatex})` : ''
            test(`✕ "${inp}" (${expMessages})${expLatexStr}`, () => {
              const [result, messages, latex] = validatorFunc(inp, solution, attrs)
              expect(result).toBe(constants.RESULT.INCORRECT)
              if (expLatex !== null) {
                expect(latex).toBe(expLatex)
              }
              expect(messages).toHaveLength(expMessages.length)
              expect(messages.map((m) => m.msg)).toEqual(expect.arrayContaining(expMessages))
            })
          })
        })
      })
    })
  })
}
