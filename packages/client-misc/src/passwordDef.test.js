import { validatePassword } from './passwordDef'

describe('validatePassword', () => {
  it.each([
    ['', ['min', 'uppercase', 'lowercase', 'digits', 'symbols']],
    ['12345678', ['uppercase', 'lowercase', 'symbols']],
    [
      'A.0gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      ['max'],
    ],
    ['abcabcabc0!', ['uppercase']],
    ['1%ABCEFGHIJ', ['lowercase']],
    ['1aEFGHIJ', ['symbols']],
    ['1aEF GHIJ!', ['spaces']],
  ])('should not validate "%s"', (pwd, exp) => {
    const list = validatePassword(pwd)
    exp.forEach((item) => {
      expect(list).toContain(item)
      list.splice(list.indexOf(item), 1)
    })
    expect(list).toHaveLength(0)
  })

  it.each(['123abcABC!', ";ZB*8$'_6x\\}", '\\"Aw?da}$n,4', 'W!_\\}t",Z~4;'])(
    'should validate "%s"',
    (pwd) => {
      expect(validatePassword(pwd)).toHaveLength(0)
    }
  )
})
