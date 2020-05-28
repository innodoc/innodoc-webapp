import parsed from './parsed'

createTests('parsed', parsed, [
  {
    solution: '5',
    correct: ['5', '10/2.0', '(-14+24)/2', '5.00049999999999'],
    incorrect: [
      ['6', ['incorrect-value']],
      ['5.0005', ['incorrect-value']],
      ['alpha', ['incorrect-value']],
    ],
    attrs: { precision: 3 },
  },
  {
    solution: '1,1',
    correct: [
      '{1}',
      '{1.}',
      '{1;1}',
      '{1;1;1}',
      '{1;1;1.0000499999}',
      '{1.0000499999999}',
      '{2-1}',
      '{2/2}',
      '{5.0001/5.0000}',
    ],
    incorrect: [
      ['{2}', ['incorrect-solution-set']],
      ['{1.00005}', ['incorrect-solution-set']],
      ['{1,1}', ['incorrect-solution-set']],
      ['{1,1,1}', ['incorrect-solution-set']],
      ['{', ['incorrect-solution-set']],
      ['{{', ['incorrect-solution-set']],
      ['}', ['incorrect-solution-set']],
    ],
    attrs: { precision: 4 },
  },
  {
    solution: '',
    correct: ['{}', '{ }', '{     }'],
    incorrect: [
      ['{1}', ['incorrect-solution-set']],
      ['{2}', ['incorrect-solution-set']],
      ['{2,}', ['incorrect-solution-set']],
      ['{2.00005}', ['incorrect-solution-set']],
      ['{,}', ['incorrect-solution-set']],
      ['{', ['incorrect-solution-set']],
    ],
    attrs: { precision: 4 },
  },
  {
    solution: '3/2+sqrt(45/4),3/2+sqrt(45/4)',
    correct: [
      '{3/2+sqrt(45/4)}',
      '{(3/2)+sqrt(45/4)}',
      '{sqrt(45/4)+3/2}',
      '{sqrt(45/4)+1.5}',
      '{sqrt(11.25)+1.5}',
      '{4.8541}',
    ],
    incorrect: [['{4.8542}', ['incorrect-solution-set']]],
    attrs: { precision: 4 },
  },
  {
    solution: '11/2,-5/2',
    correct: ['{11/2;-5/2}', '{5.5;-2.5}', '{-2.5;5.5}'],
    incorrect: [
      ['{11/2}', ['incorrect-solution-set']],
      ['{11/2,-5/2}', ['incorrect-solution-set']],
      ['{5.5,-2.5}', ['incorrect-solution-set']],
    ],
    attrs: { precision: 5 },
  },
  {
    solution: '4-sqrt(15),4+sqrt(15)',
    correct: [
      '{4-sqrt(15);4+sqrt(15)}',
      '{4-sqrt(15);4+sqrt(15)}',
      '{0.127016;7.87298}',
      '{7.87298;0.127016}',
    ],
    incorrect: [['{0.127016;7.8729}', ['incorrect-solution-set']]],
    attrs: { precision: 5 },
  },
])
