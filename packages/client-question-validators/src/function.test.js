import func from './function'

createTests('function', func, [
  // No simplification

  {
    solution: '2*alpha^2',
    correct: [
      ['2*alpha^2', '2 {\\cdot} {\\alpha^{2}}'],
      ['alpha^2*2', '{\\alpha^{2}} {\\cdot} 2'],
      ['alpha^2+alpha^2', '{\\alpha^{2}}+{\\alpha^{2}}'],
      [
        'alpha*alpha+alpha*alpha',
        '\\alpha {\\cdot} \\alpha+\\alpha {\\cdot} \\alpha',
      ],
      ['2*alpha*alpha', '2 {\\cdot} \\alpha {\\cdot} \\alpha'],
      ['2*(alpha^(2))', '2 {\\cdot} \\left({\\alpha^{2}}\\right)'],
    ],
    incorrect: [
      ['alpha^2', '{\\alpha^{2}}', ['still-incorrect-answer']],
      ['alpha^', undefined, ['malformed-input']],
      [
        '2alpha^2',
        '2{\\alpha^{2}}',
        ['correct-answer', 'simplification.product-form'],
      ],
    ],
    attrs: { 'supporting-points': '5', variables: 'alpha', precision: '5' },
  },
  {
    solution: '4+(t+1)^2',
    correct: [
      ['4+(t+1)^2', '4+{\\left(t+1\\right)^{2}}'],
      ['t*(t+2)+5', 't {\\cdot} \\left(t+2\\right)+5'],
      ['t^2+2*t+5', '{t^{2}}+2 {\\cdot} t+5'],
      ['+2*t+t*t+15-10', '+2 {\\cdot} t+t {\\cdot} t+15-10'],
    ],
    incorrect: [
      ['alpha^2', '{\\alpha^{2}}', ['still-incorrect-answer']],
      ['t(t+2)+5', '{t\\left(t+2\\right)}+5', ['malformed-input']],
      [
        't^2+2t+5',
        '{t^{2}}+2t+5',
        ['correct-answer', 'simplification.product-form'],
      ],
    ],
    attrs: { 'supporting-points': '5', variables: 't', precision: '5' },
  },

  // General checks

  {
    solution: 'abs(4)',
    correct: [['abs(4)', '\\left|4\\right|']],
    incorrect: [['|4|', undefined, ['simplification.abs']]],
  },
  {
    solution: 'exp(4)',
    correct: [['exp(4)', '\\exp\\left(4\\right)']],
    incorrect: [['e^4', '{e^{4}}', ['correct-answer', 'simplification.exp']]],
  },
  {
    solution: '1',
    correct: [
      ['1', '1'],
      ['\\1', '1', ['simplification.backslash']],
    ],
    incorrect: [
      ['\\2', '2', ['still-incorrect-answer', 'simplification.backslash']],
    ],
  },
  {
    solution: '(2)*(3)',
    correct: [
      ['(2)*(3)', '\\left(2\\right) {\\cdot} \\left(3\\right)'],
      ['6', '6'],
    ],
    incorrect: [
      [
        '(2)(3)',
        '\\left(2\\right)\\left(3\\right)',
        ['correct-answer', 'simplification.product-brackets'],
      ],
    ],
  },
  {
    solution: '1*x',
    correct: [['1*x', '1 {\\cdot} x']],
    incorrect: [
      ['1x', '1x', ['correct-answer', 'simplification.product-form']],
    ],
    attrs: { 'supporting-points': '5', variables: 'x', precision: '5' },
  },

  // Simplifications

  {
    solution: 'a*(b+c)+c*(a+b)',
    correct: [
      [
        'a*b+a*c+c*a+c*b',
        'a {\\cdot} b+a {\\cdot} c+c {\\cdot} a+c {\\cdot} b',
      ],
      ['a*b+2*a*c+c*b', 'a {\\cdot} b+2 {\\cdot} a {\\cdot} c+c {\\cdot} b'],
    ],
    incorrect: [
      [
        'a*(b+c)+c*(a+b)',
        'a {\\cdot} \\left(b+c\\right)+c {\\cdot} \\left(a+b\\right)',
        ['correct-answer', 'simplification.solution-not-simplified'],
      ],
      [
        'c*(a+b)+a*(b+c)',
        'c {\\cdot} \\left(a+b\\right)+a {\\cdot} \\left(b+c\\right)',
        ['correct-answer', 'simplification.solution-not-simplified'],
      ],
      [
        'c*(a+b)',
        'c {\\cdot} \\left(a+b\\right)',
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
    correct: [
      ['3/8', '{\\frac{3}{8}}'],
      ['6/16', '{\\frac{6}{16}}'],
      ['0.375', '0.375'],
    ],
    incorrect: [
      [
        '-1/8+1/2',
        '{\\frac{{-1}}{8}}+{\\frac{1}{2}}',
        ['correct-answer', 'simplification.fraction-not-combined'],
      ],
      [
        '1/2-1/8',
        '{\\frac{1}{2}}-{\\frac{1}{8}}',
        ['correct-answer', 'simplification.fraction-not-combined'],
      ],
      ['1/8', '{\\frac{1}{8}}', ['still-incorrect-answer']],
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
    correct: [
      ['a^(-1/2)*b^2', '{a^{-{\\frac{1}{2}}}} {\\cdot} {b^{2}}'],
      ['b^2*a^(-1/2)', '{b^{2}} {\\cdot} {a^{-{\\frac{1}{2}}}}'],
    ],
    incorrect: [
      [
        '1/sqrt(a)*b^2',
        '{\\frac{1}{\\sqrt{a}}} {\\cdot} {b^{2}}',
        ['correct-answer', 'simplification.roots-as-exponents'],
      ],
      [
        'b^2*1/sqrt(a)',
        '{b^{2}} {\\cdot} {\\frac{1}{\\sqrt{a}}}',
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
      [
        'if(x>=4,2*x-8,-2*x+8)',
        '{\\left\\lbrace\\begin{matrix}{2 {\\cdot} x-8}&{\\mbox{falls}\\;{x{\\geq}4}}\\\\{-2 {\\cdot} x+8}&\\mbox{sonst}\\end{matrix}\\right.}',
      ],
      [
        'falls(x>=4,2*x-8,-2*x+8)',
        '{\\left\\lbrace\\begin{matrix}{2 {\\cdot} x-8}&{\\mbox{falls}\\;{x{\\geq}4}}\\\\{-2 {\\cdot} x+8}&\\mbox{sonst}\\end{matrix}\\right.}',
      ],
      [
        'if(x<4,-2*x+8,2*x-8)',
        '{\\left\\lbrace\\begin{matrix}{-2 {\\cdot} x+8}&{\\mbox{falls}\\;{x<4}}\\\\{2 {\\cdot} x-8}&\\mbox{sonst}\\end{matrix}\\right.}',
      ],
    ],
    incorrect: [
      [
        'abs(x-4)',
        '\\left|x-4\\right|',
        [
          'still-incorrect-answer',
          'simplification.case-differentiation-required',
        ],
      ],
      ['|x-4|', undefined, ['simplification.abs']],
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
    correct: [
      ['125', '125'],
      ['5*5*5', '5 {\\cdot} 5 {\\cdot} 5'],
    ],
    incorrect: [
      [
        '5^3',
        '{5^{3}}',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      ['5', '5', ['still-incorrect-answer']],
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
    correct: [
      ['-8', '{-8}'],
      ['-2*2*2', '{-2} {\\cdot} 2 {\\cdot} 2'],
    ],
    incorrect: [
      [
        '(-1/2)^(-3)',
        '{\\left(-{\\frac{1}{2}}\\right)^{-3}}',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      [
        '(-0.5)^(-3)',
        '{\\left(-0.5\\right)^{-3}}',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      [
        '-2*2/(1/2)',
        '{-2} {\\cdot} {\\frac{2}{\\left({\\frac{1}{2}}\\right)}}',
        ['correct-answer', 'simplification.no-denominator-or-exponentiation'],
      ],
      ['5', '5', ['still-incorrect-answer']],
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
    correct: [['1010025', '1010025']],
    incorrect: [
      [
        '1005^2',
        '{1005^{2}}',
        ['correct-answer', 'simplification.natural-number-required'],
      ],
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
    correct: [['3^7', '{3^{7}}']],
    incorrect: [
      [
        '3^3*3^5*3^(-1)',
        '{3^{3}} {\\cdot} {3^{5}} {\\cdot} {3^{-1}}',
        ['correct-answer', 'simplification.exponentiation-not-combined'],
      ],
      [
        '4374/2',
        '{\\frac{4374}{2}}',
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
    correct: [
      ['x^(3/2)', '{x^{{\\frac{3}{2}}}}'],
      ['x^1.5', '{x^{1.5}}'],
      ['x^(1.5)', '{x^{1.5}}'],
    ],
    incorrect: [
      [
        'x^3/sqrt(x)^3',
        '{\\frac{{x^{3}}}{{\\sqrt{x}^{3}}}}',
        ['correct-answer', 'simplification.exponentiation-not-combined'],
      ],
      [
        '(x^3)/(x^(3/2))',
        '{\\frac{\\left({x^{3}}\\right)}{\\left({x^{{\\frac{3}{2}}}}\\right)}}',
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
    correct: [['exp(x+2)', '\\exp\\left(x+2\\right)']],
    incorrect: [['x^2', '{x^{2}}', ['still-incorrect-answer']]],
    attrs: {
      'supporting-points': '10',
      variables: 'x',
      precision: '4',
      simplification: 'antiderivative',
    },
  },
])
