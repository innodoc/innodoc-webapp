import interval from './interval'

createTests('interval', interval, [
  {
    solution: '[3,infty)',
    correct: [
      '[3;infty[',
      '[3;infty[',
      '[3;infty)',
      '[3;infty)',
      '[1+1+1;infty)',
      '[2.999999;infty)',
    ],
    incorrect: [
      ['[3,infty]', ['incorrect-interval']],
      ['[2.99999,infty)', ['incorrect-interval']],
    ],
    attrs: { precision: 5 },
  },
])
