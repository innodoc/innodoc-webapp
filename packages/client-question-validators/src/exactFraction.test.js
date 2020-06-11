import exactFraction from './exactFraction'

createTests('exactFraction', exactFraction, [
  {
    solution: '5/6',
    correct: [['5/6', '{\\frac{5}{6}}']],
    incorrect: [
      ['5/', '5/', ['exact-fraction.denominator-not-integer']],
      ['5.0/6', '{\\frac{5.0}{6}}', ['exact-fraction.numerator-not-integer']],
      ['5/6.0', '{\\frac{5}{6.0}}', ['exact-fraction.denominator-not-integer']],
      ['15/18', '{\\frac{15}{18}}', ['exact-fraction.fraction-not-reduced']],
      ['5//6', '5//6', ['malformed-input']],
      [
        '0.8333333333333334',
        '0.8333333333333334',
        ['exact-fraction.only-integer'],
      ],
      ['alpha^2', '{\\alpha^{2}}', ['exact-fraction.only-integer']],
    ],
    attrs: { precision: '5' },
  },
  {
    solution: '2/1',
    correct: [
      ['2', '2'],
      ['2/1', '{\\frac{2}{1}}'],
    ],
    incorrect: [
      ['20/10', '{\\frac{20}{10}}', ['exact-fraction.fraction-not-reduced']],
    ],
    attrs: { precision: '5' },
  },
])
