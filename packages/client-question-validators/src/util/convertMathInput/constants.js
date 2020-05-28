export const BRACKET_PAIRS = {
  '(': ')',
  '{': '}',
  '[': ']',
  '|': '|', // '|' only useful for replacing, not searching (because opening and closing characters are identical)
}

// The following strings get treated as differentials if preceded by a 'd'
export const DIFFERENTIALS = ['x', 'y', 'z', 't', 'u']

/*
 * Expressions to be replaced (without brackets)
 *
 * array of objects of the form:
 *
 *	{	expr: [ "a", "b" ], 	//Array of expressions
 *		replace: {
 *			"latex": "LaTeXString",
 *			"mathjs": "Parserstring"
 *			//replaces "$0" by the expression
 *		},
 *		word: true	//should the expression be replaced as entire word only (no letters or '\' before/after the expression [important distinction because some expressions are subsets of others] )
 *	}
 * */
export const TO_REPLACE = [
  {
    expr: [
      'alpha',
      'beta',
      'gamma',
      'Gamma',
      'delta',
      'Delta',
      'zeta',
      'eta',
      'Theta',
      'iota',
      'kappa',
      'lambda',
      'Lambda',
      'nu',
      'xi',
      'Xi',
      'omicron',
      'pi',
      'Pi',
      'sigma',
      'Sigma',
      'tau',
      'upsilon',
      'Upsilon',
      'Phi',
      'chi',
      'psi',
      'Psi',
      'omega',
      'Omega',
    ],
    replace: {
      latex: '\\$0',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Alpha'],
    replace: {
      latex: 'A',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Beta'],
    replace: {
      latex: 'B',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Epsilon'],
    replace: {
      latex: 'E',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Zeta'],
    replace: {
      latex: 'Z',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Eta'],
    replace: {
      latex: 'H',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Iota'],
    replace: {
      latex: 'I',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Kappa'],
    replace: {
      latex: 'K',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Mu'],
    replace: {
      latex: 'M',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Nu'],
    replace: {
      latex: 'N',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Omicron'],
    replace: {
      latex: 'O',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Rho'],
    replace: {
      latex: 'P',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Tau'],
    replace: {
      latex: 'T',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['Chi'],
    replace: {
      latex: 'X',
      mathjs: '$0',
    },
    word: true,
  },
  {
    expr: ['epsilon', 'varepsilon'],
    replace: {
      latex: '\\varepsilon',
      mathjs: 'epsilon',
    },
    word: true,
  },
  {
    expr: ['theta', 'vartheta'],
    replace: {
      latex: '\\vartheta',
      mathjs: 'theta',
    },
    word: true,
  },
  {
    expr: ['µ', 'mu'],
    replace: {
      latex: '\\mu',
      mathjs: 'mu',
    },
    word: true,
  },
  {
    expr: ['rho', 'varrho'],
    replace: {
      latex: '\\varrho',
      mathjs: 'rho',
    },
    word: true,
  },
  {
    expr: ['phi', 'varphi'],
    replace: {
      latex: '\\varphi',
      mathjs: 'phi',
    },
    word: true,
  },
  {
    expr: ['infty', 'Infty', 'infinity', 'Infinity', 'unendlich', 'Unendlich'],
    replace: {
      latex: '\\infty',
      mathjs: 'infty',
    },
    word: true,
  },
  {
    expr: ['prod', 'produkt'],
    replace: {
      latex: '\\prod',
      mathjs: 'prod',
    },
    word: true,
  },
  {
    expr: ['sum', 'summe'],
    replace: {
      latex: '\\sum',
      mathjs: 'sum',
    },
    word: true,
  },
  {
    expr: ['int', 'integral'],
    replace: {
      latex: '\\int',
      mathjs: 'int',
    },
    word: true,
  },
  {
    expr: ['°'],
    replace: {
      latex: '^{\\circ}',
      mathjs: '°',
    },
    word: false,
  },
  {
    expr: ['¹'],
    replace: {
      latex: ' ^{1}', // NOTE: the space is important
      mathjs: '^1',
    },
    word: false,
  },
  {
    expr: ['²'],
    replace: {
      latex: ' ^{2}', // NOTE: the space is important
      mathjs: '^2',
    },
    word: false,
  },
  {
    expr: ['³'],
    replace: {
      latex: ' ^{3}', // NOTE: the space is important
      mathjs: '^3',
    },
    word: false,
  },
  {
    expr: ['*'],
    replace: {
      latex: ' {\\cdot} ',
      mathjs: '*',
    },
    word: false,
  },
  {
    expr: ['_', '^'], // important for parenthesis
    replace: {
      latex: ' $0',
      mathjs: '$0',
    },
    word: false,
  },
  {
    expr: ['>='],
    replace: {
      latex: '{\\geq}',
      mathjs: '>=',
    },
    word: false,
  },
  {
    expr: ['<='],
    replace: {
      latex: '{\\leq}',
      mathjs: '<=',
    },
    word: false,
  },
]

// expressions that need other parentheses when used in LaTeX
// {
//     expr: "expression to search for",
//     replace: {
//        0: "replacement for an arbitrary number of parameters",
//        1: "replacement for expression with one parameter",
//        2: "replacement for expression with two parameters"
//        //$1 gets replaced by the first parameter, $2 by te second ...
//        //$0 gets replaced by the expression itself
//        },
//     brackets: "all of the brackets for which the expression applies"
//
// }
//
// In case of 0 (meaning an arbitrary number of parameters) the object looks like the following:
// 0: {
// 	begin: "beginning of the resulting expression",
// 	argument: "what the argument gets replaced by",
// 	divider: "Divider between arguments",
// 	end: "ending of the resulting expression"
// }
// In case of an arbitrary number of parameters, $i gets replaced by the respective parameter
export const TO_REPLACE_BRACKETS = [
  {
    // trigonometric and other functions that can be converted to latex by adding '\\' at the beginning of the string
    expr: [
      'sin',
      'cos',
      'tan',
      'cot',
      'arcsin',
      'arccos',
      'arctan',
      'sinh',
      'cosh',
      'tanh',
      'coth',
      'exp',
      'ln',
    ],
    replace: {
      latex: {
        1: '\\$0($1)',
      },
      mathjs: {
        1: '$0($1)',
      },
    },
  },
  {
    expr: ['log'],
    replace: {
      latex: {
        1: '\\log($1)',
        2: '\\log($1,$2)',
      },
      mathjs: {
        1: 'log($1)',
        2: 'log($1,$2)',
      },
    },
  },
  {
    expr: ['asin'],
    replace: {
      latex: {
        1: '\\arcsin($1)',
      },
      mathjs: {
        1: 'asin($1)',
      },
    },
  },
  {
    expr: ['acos'],
    replace: {
      latex: {
        1: '\\arccos($1)',
      },
      mathjs: {
        1: 'acos($1)',
      },
    },
  },
  {
    expr: ['atan'],
    replace: {
      latex: {
        1: '\\arctan($1)',
      },
      mathjs: {
        1: 'atan($1)',
      },
    },
  },
  {
    expr: ['acot', 'arccot'],
    replace: {
      latex: {
        1: '\\cot^{-1}($1)',
      },
      mathjs: {
        1: 'acot($1)',
      },
    },
  },
  {
    expr: ['asinh', 'arcsinh'],
    replace: {
      latex: {
        1: '\\sinh^{-1}($1)',
      },
      mathjs: {
        1: 'asinh($1)',
      },
    },
  },
  {
    expr: ['acosh', 'arccosh'],
    replace: {
      latex: {
        1: '\\cosh^{-1}($1)',
      },
      mathjs: {
        1: 'acosh($1)',
      },
    },
  },
  {
    expr: ['atanh', 'arctanh'],
    replace: {
      latex: {
        1: '\\tanh^{-1}($1)',
      },
      mathjs: {
        1: 'atanh($1)',
      },
    },
  },
  {
    expr: ['acoth', 'arccoth'],
    replace: {
      latex: {
        1: '\\coth^{-1}($1)',
      },
      mathjs: {
        1: 'acoth($1)',
      },
    },
  },
  {
    expr: ['^'],
    replace: {
      latex: {
        1: '^{$1}',
      },
      mathjs: {
        1: '^($1)',
      },
    },
  },
  {
    expr: ['_'],
    replace: {
      latex: {
        1: '_{$1}',
      },
      mathjs: {
        1: '_($1)',
      },
    },
  },
  {
    expr: ['sqrt', 'wurzel', 'Wurzel'],
    replace: {
      latex: {
        1: '\\sqrt{$1}',
        2: '\\sqrt[$1]{$2}',
      },
      mathjs: {
        1: 'sqrt($1)',
        2: 'nthRoot($2,$1)',
      },
    },
  },
  {
    expr: ['sum', 'Sum', 'summe', 'Summe', '\\sum'],
    replace: {
      latex: {
        3: '\\sum_{$1}^{$2}($3)',
      },
      mathjs: {
        3: 'sum_($1)^($2)($3)',
      },
    },
  },
  {
    expr: ['int', 'Int', 'integral', 'Integral', '\\int'],
    replace: {
      latex: {
        3: '\\int_{$1}^{$2}{$3}',
      },
      mathjs: {
        3: 'int_($1)^($2)($3)',
      },
    },
  },
  {
    expr: ['prod', 'Prod', 'produkt', 'Produkt', '\\prod'],
    replace: {
      latex: {
        3: '\\prod_{$1}^{$2}($3)',
      },
      mathjs: {
        3: 'prod_($1)^($2)($3)',
      },
    },
  },
  {
    expr: ['abs', 'betrag', 'Betrag'],
    replace: {
      latex: {
        1: '\\left|$1\\right|',
      },
      mathjs: {
        1: 'abs($1)',
      },
    },
  },
  {
    expr: [
      'factorial',
      'Factorial',
      'fakultaet',
      'Fakultaet',
      'fakultät',
      'Fakultät',
    ],
    replace: {
      latex: {
        1: '{($1)!}',
      },
      mathjs: {
        1: 'factorial($1)',
      },
    },
  },
  {
    expr: [
      'binomial',
      'Binomial',
      'binomialkoeff',
      'Binomialkoeff',
      'binomialkoeffizient',
      'Binomialkoeffizient',
    ],
    replace: {
      latex: {
        2: '{\\binom{$1}{$2}}',
      },
      mathjs: {
        2: 'binomial($1,$2)',
      },
    },
  },
  {
    expr: ['falls', 'Falls', 'if', 'If'],
    replace: {
      latex: {
        3: '{\\left\\lbrace\\begin{matrix}{$2}&{\\mbox{falls}\\;{$1}}\\\\{$3}&\\mbox{sonst}\\end{matrix}\\right.}',
      },
      mathjs: {
        3: '(($1)?($2):($3))',
      },
    },
  },
  {
    // differentials
    expr: ['d'],
    replace: {
      latex: {
        1: ' {~d{$1}} ', // NOTE: The spaces are important
      },
      mathjs: {
        1: '(d($1))',
      },
    },
  },
  // IMPORTANT: The entry for vectors has to be the last one because the empty
  // string will always be matched --> subsequent entries will be ignored!
  {
    // vectors and brackets
    expr: [''],
    replace: {
      latex: {
        0: {
          begin: '{\\left(\\begin{matrix}',
          argument: '{$i}',
          divider: '\\\\',
          end: '\\end{matrix}\\right)}',
        },
        1: '\\left($1\\right)',
      },
      mathjs: {
        0: {
          begin: '[',
          argument: '$i',
          divider: ',',
          end: ']',
        },
        1: '($1)',
      },
    },
    brackets: '([',
  },
]
