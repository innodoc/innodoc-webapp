import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

// TODO support/test latexcode

global.createTests = (name, validatorFunc, cases) => {
  const defaultAttrs = {
    'supporting-points': '5',
    variables: '',
    precision: '5',
  }

  describe(name, () => {
    it('should return neutral result for empty string', () => {
      const [result, messages] = validatorFunc('', '', defaultAttrs)
      expect(result).toBe(RESULT_VALUE.NEUTRAL)
      expect(messages).toHaveLength(1)
      expect(messages[0].msg).toBe('still-incorrect-answer')
    })

    describe('cases', () => {
      cases.forEach(
        ({ solution, correct, incorrect, attrs = defaultAttrs }) => {
          const attrStr = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')
          describe(`solution="${solution}" (${attrStr})`, () => {
            correct.forEach((inp) => {
              let input = inp
              let expMessages = []
              if (Array.isArray(inp)) {
                ;[input, expMessages] = inp
              }
              expMessages.push('correct-answer')
              const expMessagesStr = expMessages.length
                ? ` (${expMessages})`
                : ''
              test(`✓ "${input}${expMessagesStr}"`, () => {
                const [result, messages] = validatorFunc(input, solution, attrs)
                expect(result).toBe(RESULT_VALUE.CORRECT)
                expect(messages).toHaveLength(expMessages.length)
                expect(messages.map((m) => m.msg)).toEqual(
                  expect.arrayContaining(expMessages)
                )
              })
            })

            incorrect.forEach(([inp, expMessages]) => {
              test(`✕ "${inp}" (${expMessages})`, () => {
                const [result, messages] = validatorFunc(inp, solution, attrs)
                expect(result).toBe(RESULT_VALUE.INCORRECT)
                expect(messages).toHaveLength(expMessages.length)
                expect(messages.map((m) => m.msg)).toEqual(
                  expect.arrayContaining(expMessages)
                )
              })
            })
          })
        }
      )
    })
  })
}
