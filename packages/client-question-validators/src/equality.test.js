import equality from './equality'

createTests('equality', equality, [
  {
    solution: 'foo',
    correct: ['foo'],
    incorrect: [['bar', ['still-incorrect-answer']]],
  },
  {
    solution: 'bar',
    correct: ['bar'],
    incorrect: [['foo', ['still-incorrect-answer']]],
  },
  {
    solution: true,
    correct: [true],
    incorrect: [
      [false, ['still-incorrect-answer']],
      ['true', ['still-incorrect-answer']],
      [1, ['still-incorrect-answer']],
      ['foo', ['still-incorrect-answer']],
    ],
  },
  {
    solution: false,
    correct: [false],
    incorrect: [
      [true, ['still-incorrect-answer']],
      ['false', ['still-incorrect-answer']],
      [0, ['still-incorrect-answer']],
    ],
  },
])
