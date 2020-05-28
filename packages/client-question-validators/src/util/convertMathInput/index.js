/*
 * Copyright (C) 2015 MINT-Kolleg Baden-Württemberg (www.mint-kolleg.de)
 *
 *  This file is part of the VE&MINT program compilation
 *  (see www.ve-und-mint.de).
 * */

import {
  CHAR_CLASS_OPEN,
  bracketReplace,
  checkBrackets,
  encloseFunctions,
  encloseLatexConstructs,
  encloseLatexPower,
  latexFractions,
  preprocessDifferentials,
  regexEscape,
  replaceAllMatches,
  replaceConstructs,
  simpleReplace,
  swapBoundaries,
} from './util'

/*
 * Converts a string (which has been entered into a textfield for example) into
 * a LaTeX string that can be displayed by MathJax and a string that can be parsed
 * and evaluated by math.js.
 *
 * This is achieved by going through the entire string mutliple times an replacing
 * parts of it until the endresult ist complete.
 *
 * integrationSteps: number of steps when integrating
 *
 * This returns an object of the following form:
 *  {
 *     latex: "{\sum_{i=1}^{10}i}",
 *     mathjs: "konstrukt(sum,i,1,10,(supportvar_i),100)"
 *     errorList: Array containing every error that occured. If it isn't empty,
 *                the output shouldn't be used.
 *  }
 *  example: "sum_(i=0)^(10)i"
 * */
const convertMathInput = (input_, integrationSteps = 1000) => {
  // remove "\" from input
  const input = input_.replace(RegExp('\\\\', 'g'), '')

  // LaTeX string for displaying with MathJax
  let latex = input
  // String for parsing with mathjs
  let mathjs = input
  // Error keys
  const errorList = []

  // Perform simple replacements (without bracket expressions)
  latex = simpleReplace(latex, 'latex')
  mathjs = simpleReplace(mathjs, 'mathjs')

  // Process bracket expressions
  latex = bracketReplace(latex, 'latex', errorList)
  mathjs = bracketReplace(mathjs, 'mathjs', errorList)

  // Enclose functions with curly braces
  latex = encloseFunctions(latex, '{', errorList)
  mathjs = encloseFunctions(mathjs, '(', errorList)

  // Enclose bounds/exponents in brackets
  // _74.3 -> _{74.3}, ^\alpha -> ^{\alpha} ...
  let rex = RegExp('(_|\\^)(-?\\\\?[a-z]+|-?[0-9]+(?:\\.[0-9]+)?)', 'gi')
  latex = latex.replace(rex, ' $1{$2}')
  mathjs = mathjs.replace(rex, '$1($2)')

  // Enclose negative numbers in brackets to ease parsing
  rex = RegExp(
    `([+\\-*/]|^)(-\\\\?[a-z]+|-[0-9]+(?:\\.[0-9]+)?)([^a-z${regexEscape(
      CHAR_CLASS_OPEN
    )}]|$)`,
    'gi'
  )
  latex = replaceAllMatches(latex, rex, '$1{$2}$3')

  // Replace differentials in the LaTeX string with '{d{..}}'
  latex = preprocessDifferentials(latex, '{')
  // Enclose constucts in brackets to prepare for fractions
  latex = encloseLatexConstructs(latex, errorList)
  // Enclose exponentiation in brackets to prepare for fractions
  latex = encloseLatexPower(latex, errorList)
  // Create LaTeX fractions
  latex = latexFractions(latex, errorList)

  // '(value)!' -> 'value!' in LaTeX
  rex = RegExp('(\\()(\\\\?[a-z]+|[0-9]+(\\.[0-9]+)?)(\\))!', 'gi') // numbers or variables in brackest with factorial
  latex = latex.replace(rex, '$2!')

  // Postprocess mathjs string
  rex = RegExp('[{]', 'g') // opening bracktes
  mathjs = mathjs.replace(rex, '(')
  rex = RegExp('[}]', 'g') // closing brackets
  mathjs = mathjs.replace(rex, ')')
  // Replace differentials (IMPORTANT: This needs to be done after replacing brackets and before removing whitespaces)
  mathjs = preprocessDifferentials(mathjs, '(', errorList)
  rex = RegExp('\\s+', 'g') // whitespaces
  mathjs = mathjs.replace(rex, '')

  // Swap upper and lower bounds if necessary
  mathjs = swapBoundaries(mathjs, errorList)

  // Process constructs ( prod, int, sum )
  mathjs = replaceConstructs(mathjs, integrationSteps, errorList).mathjs

  // Replace brackets in the LaTeX string with '\left' and '\right'.
  // In the first step every '\left' and '\right' gets removed because I
  // couldn't find a simple regex that does this in one step.
  rex = RegExp('(\\\\left|\\\\right)(\\(|\\))', 'g')
  latex = latex.replace(rex, '$2')
  latex = latex.replace(/\(/g, '\\left(')
  latex = latex.replace(/\)/g, '\\right)')

  // Remove '\left' and '\right' from the LaTeX string if the brackets
  // aren't complete (necessary for the preview)
  if (!checkBrackets(latex)) {
    latex = latex.replace(/\\left\(/g, '(')
    latex = latex.replace(/\\right\)/g, ')')
  }

  return { latex, mathjs, errorList }
}

export default convertMathInput
