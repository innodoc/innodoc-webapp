import parsed from './parsed'

createTests('parsed', parsed, [
  {
    solution: '5',
    correct: [
      ['5', '5'],
      ['10/2.0', '{\\frac{10}{2.0}}'],
      ['(-14+24)/2', '{\\frac{\\left(-14+24\\right)}{2}}'],
      ['5.00049999999999', '5.00049999999999'],
    ],
    incorrect: [
      ['6', '6', ['incorrect-value']],
      ['5.0005', '5.0005', ['incorrect-value']],
      ['alpha', '\\alpha', ['incorrect-value']],
    ],
    attrs: { precision: 3 },
  },
  {
    solution: '1,1',
    correct: [
      ['{1}', '\\left\\lbrace 1 \\right\\rbrace'],
      ['{1.}', '\\left\\lbrace 1. \\right\\rbrace'],
      ['{1;1}', '\\left\\lbrace 1,1 \\right\\rbrace'],
      ['{1;1;1}', '\\left\\lbrace 1,1,1 \\right\\rbrace'],
      ['{1;1;1.0000499999}', '\\left\\lbrace 1,1,1.0000499999 \\right\\rbrace'],
      ['{1.0000499999999}', '\\left\\lbrace 1.0000499999999 \\right\\rbrace'],
      ['{2-1}', '\\left\\lbrace 2-1 \\right\\rbrace'],
      ['{2/2}', '\\left\\lbrace {\\frac{2}{2}} \\right\\rbrace'],
      [
        '{5.0001/5.0000}',
        '\\left\\lbrace {\\frac{5.0001}{5.0000}} \\right\\rbrace',
      ],
    ],
    incorrect: [
      ['{2}', '\\left\\lbrace 2 \\right\\rbrace', ['incorrect-solution-set']],
      [
        '{1.00005}',
        '\\left\\lbrace 1.00005 \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
      [
        '{1,1}',
        '\\left\\lbrace 1.1 \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
      [
        '{1,1,1}',
        '\\left\\lbrace 1.1.1 \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
      ['{', undefined, ['incorrect-solution-set']],
      ['{{', undefined, ['incorrect-solution-set']],
      ['}', undefined, ['incorrect-solution-set']],
    ],
    attrs: { precision: 4 },
  },
  {
    solution: '',
    correct: [
      ['{}', '\\left\\lbrace\\right\\rbrace'],
      ['{ }', '\\left\\lbrace\\right\\rbrace'],
      ['{     }', '\\left\\lbrace\\right\\rbrace', []],
    ],
    incorrect: [
      ['{1}', '\\left\\lbrace 1 \\right\\rbrace', ['incorrect-solution-set']],
      ['{2}', '\\left\\lbrace 2 \\right\\rbrace', ['incorrect-solution-set']],
      ['{2,}', '\\left\\lbrace 2. \\right\\rbrace', ['incorrect-solution-set']],
      [
        '{2.00005}',
        '\\left\\lbrace 2.00005 \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
      ['{,}', '\\left\\lbrace . \\right\\rbrace', ['incorrect-solution-set']],
      ['{', undefined, ['incorrect-solution-set']],
    ],
    attrs: { precision: 4 },
  },
  {
    solution: '3/2+sqrt(45/4),3/2+sqrt(45/4)',
    correct: [
      [
        '{3/2+sqrt(45/4)}',
        '\\left\\lbrace {\\frac{3}{2}}+\\sqrt{{\\frac{45}{4}}} \\right\\rbrace',
      ],
      [
        '{(3/2)+sqrt(45/4)}',
        '\\left\\lbrace \\left({\\frac{3}{2}}\\right)+\\sqrt{{\\frac{45}{4}}} \\right\\rbrace',
      ],
      [
        '{sqrt(45/4)+3/2}',
        '\\left\\lbrace \\sqrt{{\\frac{45}{4}}}+{\\frac{3}{2}} \\right\\rbrace',
      ],
      [
        '{sqrt(45/4)+1.5}',
        '\\left\\lbrace \\sqrt{{\\frac{45}{4}}}+1.5 \\right\\rbrace',
      ],
      ['{sqrt(11.25)+1.5}', '\\left\\lbrace \\sqrt{11.25}+1.5 \\right\\rbrace'],
      ['{4.8541}', '\\left\\lbrace 4.8541 \\right\\rbrace'],
    ],
    incorrect: [
      [
        '{4.8542}',
        '\\left\\lbrace 4.8542 \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
    ],
    attrs: { precision: 4 },
  },
  {
    solution: '11/2,-5/2',
    correct: [
      [
        '{11/2;-5/2}',
        '\\left\\lbrace {\\frac{11}{2}},{\\frac{{-5}}{2}} \\right\\rbrace',
      ],
      ['{5.5;-2.5}', '\\left\\lbrace 5.5,{-2.5} \\right\\rbrace'],
      ['{-2.5;5.5}', '\\left\\lbrace {-2.5},5.5 \\right\\rbrace'],
    ],
    incorrect: [
      [
        '{11/2}',
        '\\left\\lbrace {\\frac{11}{2}} \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
      [
        '{11/2,-5/2}',
        '\\left\\lbrace {\\frac{11}{2}}.-{\\frac{5}{2}} \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
      [
        '{5.5,-2.5}',
        '\\left\\lbrace 5.5.-2.5 \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
    ],
    attrs: { precision: 5 },
  },
  {
    solution: '4-sqrt(15),4+sqrt(15)',
    correct: [
      [
        '{4-sqrt(15);4+sqrt(15)}',
        '\\left\\lbrace 4-\\sqrt{15},4+\\sqrt{15} \\right\\rbrace',
      ],
      [
        '{4-sqrt(15);4+sqrt(15)}',
        '\\left\\lbrace 4-\\sqrt{15},4+\\sqrt{15} \\right\\rbrace',
      ],
      ['{0.127016;7.87298}', '\\left\\lbrace 0.127016,7.87298 \\right\\rbrace'],
      ['{7.87298;0.127016}', '\\left\\lbrace 7.87298,0.127016 \\right\\rbrace'],
    ],
    incorrect: [
      [
        '{0.127016;7.8729}',
        '\\left\\lbrace 0.127016,7.8729 \\right\\rbrace',
        ['incorrect-solution-set'],
      ],
    ],
    attrs: { precision: 5 },
  },
])
