import equality from './equality'

createTests('equality', equality, [
  {
    solution: 'foo',
    correct: ['foo'],
    incorrect: [['bar', null, ['still-incorrect-answer']]],
  },
  {
    solution: 'bar',
    correct: ['bar'],
    incorrect: [['foo', null, ['still-incorrect-answer']]],
  },
  {
    solution: true,
    correct: [true],
    incorrect: [
      [false, null, ['still-incorrect-answer']],
      ['true', null, ['still-incorrect-answer']],
      [1, null, ['still-incorrect-answer']],
      ['foo', null, ['still-incorrect-answer']],
    ],
  },
  {
    solution: false,
    correct: [false],
    incorrect: [
      [true, null, ['still-incorrect-answer']],
      ['false', null, ['still-incorrect-answer']],
      [0, null, ['still-incorrect-answer']],
    ],
  },
])
