import func from './function'

createTests('function', func, [
  // No simplification

  {
    solution: '2*alpha^2',
    correct: [
      '2*alpha^2',
      'alpha^2*2',
      'alpha^2+alpha^2',
      'alpha*alpha+alpha*alpha',
      '2*alpha*alpha',
      '2*(alpha^(2))',
    ],
    incorrect: [
      ['alpha^2', ['still-incorrect-answer']],
      ['alpha^', ['malformed-input']],
      ['2alpha^2', ['correct-answer', 'simplification.product-form']],
    ],
    attrs: { 'supporting-points': '5', variables: 'alpha', precision: '5' },
  },
  {
    solution: '4+(t+1)^2',
    correct: ['4+(t+1)^2', 't*(t+2)+5', 't^2+2*t+5', '+2*t+t*t+15-10'],
    incorrect: [
      ['alpha^2', ['still-incorrect-answer']],
      ['t(t+2)+5', ['malformed-input']],
      ['t^2+2t+5', ['correct-answer', 'simplification.product-form']],
    ],
    attrs: { 'supporting-points': '5', variables: 't', precision: '5' },
  },

  // General checks

  {
    solution: 'abs(4)',
    correct: ['abs(4)'],
    incorrect: [['|4|', ['simplification.abs']]],
  },
  {
    solution: 'exp(4)',
    correct: ['exp(4)'],
    incorrect: [['e^4', ['correct-answer', 'simplification.exp']]],
  },
  {
    solution: '1',
    correct: ['1', ['\\1', ['simplification.backslash']]],
    incorrect: [
      ['\\2', ['still-incorrect-answer', 'simplification.backslash']],
    ],
  },
  {
    solution: '(2)*(3)',
    correct: ['(2)*(3)', '6'],
    incorrect: [
      ['(2)(3)', ['correct-answer', 'simplification.product-brackets']],
    ],
  },
  {
    solution: '1*x',
    correct: ['1*x'],
    incorrect: [['1x', ['correct-answer', 'simplification.product-form']]],
    attrs: { 'supporting-points': '5', variables: 'x', precision: '5' },
  },

  // Simplifications

  {
    solution: 'a*(b+c)+c*(a+b)',
    correct: ['a*b+a*c+c*a+c*b', 'a*b+2*a*c+c*b'],
    incorrect: [
      [
        'a*(b+c)+c*(a+b)',
        ['correct-answer', 'simplification.solution-not-simplified'],
      ],
      [
        'c*(a+b)+a*(b+c)',
        ['correct-answer', 'simplification.solution-not-simplified'],
      ],
      [
        'c*(a+b)',
        ['still-incorrect-answer', 'simplification.solution-not-simplified'],
      ],
    ],
    attrs: {
      'supporting-points': '3',
      variables: 'a,b,c',
      precision: '3',
      simplification: 'no-brackets',
    },
  },
  {
    solution: '-1/8+1/2',
    correct: ['3/8', '6/16', '0.375'],
    incorrect: [
      ['-1/8+1/2', ['correct-answer', 'simplification.fraction-not-combined']],
      ['1/2-1/8', ['correct-answer', 'simplification.fraction-not-combined']],
      ['1/8', ['still-incorrect-answer']],
    ],
    attrs: {
      'supporting-points': '4',
      variables: '',
      precision: '4',
      simplification: 'only-one-slash',
    },
  },
  {
    solution: 'a^(-1/2)*b^2',
    correct: ['a^(-1/2)*b^2', 'b^2*a^(-1/2)'],
    incorrect: [
      [
        '1/sqrt(a)*b^2',
        ['correct-answer', 'simplification.roots-as-exponents'],
      ],
      [
        'b^2*1/sqrt(a)',
        ['correct-answer', 'simplification.roots-as-exponents'],
      ],
    ],
    attrs: {
      'supporting-points': '1',
      variables: 'a,b',
      precision: '10',
      simplification: 'no-sqrt',
    },
  },
  {
    solution: 'if(x>=4,2*(x-4),-2*(x-4))',
    correct: [
      'if(x>=4,2*x-8,-2*x+8)',
      'falls(x>=4,2*x-8,-2*x+8)',
      'if(x<4,-2*x+8,2*x-8)',
    ],
    incorrect: [
      [
        'abs(x-4)',
        [
          'still-incorrect-answer',
          'simplification.case-differentiation-required',
        ],
      ],
      ['|x-4|', ['simplification.abs']],
    ],
    attrs: {
      'supporting-points': '8',
      variables: 'x',
      precision: '3',
      simplification: 'no-abs',
    },
  },
  {
    solution: '5^3',
    correct: ['125', '5*5*5'],
    incorrect: [
      [
        '5^3',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      ['5', ['still-incorrect-answer']],
    ],
    attrs: {
      'supporting-points': '5',
      variables: '',
      precision: '5',
      simplification: 'no-fractions-no-powers',
    },
  },
  {
    solution: '-8',
    correct: ['-8', '-2*2*2'],
    incorrect: [
      [
        '(-1/2)^(-3)',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      [
        '(-0.5)^(-3)',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      [
        '-2*2/(1/2)',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      ['5', ['still-incorrect-answer']],
    ],
    attrs: {
      'supporting-points': '5',
      variables: '',
      precision: '5',
      simplification: 'no-fractions-no-powers',
    },
  },
  {
    solution: '1010025',
    correct: ['1010025'],
    incorrect: [
      ['1005^2', ['correct-answer', 'simplification.natural-number-required']],
    ],
    attrs: {
      'supporting-points': '5',
      variables: 'x',
      precision: '5',
      simplification: 'only-natural-number',
    },
  },
  {
    solution: '3^7',
    correct: ['3^7'],
    incorrect: [
      [
        '3^3*3^5*3^(-1)',
        ['correct-answer', 'simplification.exponentiation-not-combined'],
      ],
      [
        '4374/2',
        ['correct-answer', 'simplification.resolve-denominators-and-factors'],
      ],
    ],
    attrs: {
      'supporting-points': '5',
      variables: '',
      precision: '5',
      simplification: 'one-power-no-mult-or-div',
    },
  },
  {
    solution: 'x^(3/2)',
    correct: ['x^(3/2)', 'x^1.5', 'x^(1.5)'],
    incorrect: [
      [
        'x^3/sqrt(x)^3',
        ['correct-answer', 'simplification.exponentiation-not-combined'],
      ],
      [
        '(x^3)/(x^(3/2))',
        ['correct-answer', 'simplification.exponentiation-not-combined'],
      ],
    ],
    attrs: {
      'supporting-points': '10',
      variables: 'x',
      precision: '4',
      simplification: 'one-power-no-mult-or-div,special-support-points',
    },
  },
  {
    solution: 'exp(x+2)',
    correct: ['exp(x+2)'],
    incorrect: [['x^2', ['still-incorrect-answer']]],
    attrs: {
      'supporting-points': '10',
      variables: 'x',
      precision: '4',
      simplification: 'antiderivative',
    },
  },
])
