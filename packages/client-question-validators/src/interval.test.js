import interval from './interval'

createTests('interval', interval, [
  {
    solution: '[3,infty)',
    correct: [
      ['[3;infty[', '\\left[3;\\infty\\right)'],
      ['[3;infty)', '\\left[3;\\infty\\right)'],
      ['[3,infty)', '\\left[3;\\infty\\right)'],
      ['[1+1+1;infty)', '\\left[1+1+1;\\infty\\right)'],
      ['[2.999999;infty)', '\\left[2.999999;\\infty\\right)'],
      ['[2.999999,infty)', '\\left[2.999999;\\infty\\right)'],
    ],
    incorrect: [
      ['[3;3[', '\\left[3;3\\right)', ['incorrect-interval']],
      ['[3;infty]', '\\left[3;\\infty\\right]', ['incorrect-interval']],
      [
        '[2.99999,infty)',
        '\\left[2.99999;\\infty\\right)',
        ['incorrect-interval'],
      ],
    ],
    attrs: { precision: 5 },
  },
  {
    solution: '(-infty,11/6)',
    correct: [
      ['(-infty;11/6)', '\\left({-\\infty};{\\frac{11}{6}}\\right)'],
      ['(-infty,11/6)', '\\left({-\\infty};{\\frac{11}{6}}\\right)'],
      [']-infty;11/6[', '\\left({-\\infty};{\\frac{11}{6}}\\right)'],
      [']-infty;1.833333[', '\\left({-\\infty};1.833333\\right)'],
      [']-infty;1+5/6[', '\\left({-\\infty};1+{\\frac{5}{6}}\\right)'],
    ],
    incorrect: [
      [
        '(-3;11/6)',
        '\\left({-3};{\\frac{11}{6}}\\right)',
        ['incorrect-interval'],
      ],
      [']3;11/6[', '\\left(3;{\\frac{11}{6}}\\right)', ['incorrect-interval']],
    ],
    attrs: { precision: 3 },
  },
  {
    solution: '(0,e)',
    correct: [['(0;e)', '\\left(0;e\\right)']],
    incorrect: [],
    attrs: { precision: 3 },
  },
  {
    solution: '(3/2-1/2*sqrt(5),3/2+1/2*sqrt(5))',
    correct: [
      [
        '(3/2-1/2*sqrt(5);3/2+1/2*sqrt(5))',
        '\\left({\\frac{3}{2}}-{\\frac{1}{2}} {\\cdot} \\sqrt{5};{\\frac{3}{2}}+{\\frac{1}{2}} {\\cdot} \\sqrt{5}\\right)',
      ],
      [
        '(3/2-1/2*sqrt(5),3/2+1/2*sqrt(5))',
        '\\left({\\frac{3}{2}}-{\\frac{1}{2}} {\\cdot} \\sqrt{5};{\\frac{3}{2}}+{\\frac{1}{2}} {\\cdot} \\sqrt{5}\\right)',
      ],
      [
        '(1/2*(3-sqrt(5));1/2*(3+sqrt(5)))',
        '\\left({\\frac{1}{2}} {\\cdot} \\left(3-\\sqrt{5}\\right);{\\frac{1}{2}} {\\cdot} \\left(3+\\sqrt{5}\\right)\\right)',
      ],
      ['(0.3819660;2.6180339)', '\\left(0.3819660;2.6180339\\right)'],
      ['(0.3819660,2.6180339)', '\\left(0.3819660;2.6180339\\right)'],
    ],
    incorrect: [
      ['(0.39;2.6180)', '\\left(0.39;2.6180\\right)', ['incorrect-interval']],
    ],
    attrs: { precision: 3 },
  },
])
