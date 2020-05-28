/*
 * Additional mathJS functions
 *
 * Copyright (C) 2015 MINT-Kolleg Baden-Württemberg (www.mint-kolleg.de)
 *
 *  This file is part of the VE&MINT program compilation
 *  (see www.ve-und-mint.de).
 * */

import { create, all } from 'mathjs/number'

const mathJS = create(all)

const factorialOrig = mathJS.factorial

// Delta for which a floating point value should be regarded an integer
const epsilonDistance = 0.0001

const mathJSFunctions = {}

mathJSFunctions.ln = (x) => mathJS.log(x)

/*
 * Evaluate integrals, sums and products
 *
 * type: "int", "sum" or "prod"
 * variable: variable of integration/summation/multiplication
 * lower: lower bound
 * upper: upper bound
 * content: content of the construct
 * steps: number of calculation steps (only relevant for integrals)
 * */
mathJSFunctions.konstrukt = (args, mathJSInstance, scopeOrig) => {
  const scope = scopeOrig

  // parse arguments
  let [type, variable, lower, upper, content, steps] = args
  type = type.toString()
  variable = variable.toString()
  lower = mathJSInstance.evaluate(lower.toString(), scope)
  upper = mathJSInstance.evaluate(upper.toString(), scope)
  content = content.toString()
  steps = steps ? mathJSInstance.evaluate(steps.toString(), scope) : 1000

  const code = mathJSInstance.compile(content)
  const calculate = (value) => {
    scope[`supportvar_${variable}`] = value
    return code.evaluate(scope)
  }

  // if integral, swap bounds if necessary
  let factor = 1
  if (lower > upper && type === 'int') {
    const swap = upper
    upper = lower
    lower = swap
    factor = -1
  }

  // Size of the calculation steps
  let stepSize

  // Operation that gets calculated in every step ( operation( total, current, next, stepSize ) )
  let operation

  // Initial value
  let value

  // Define operation and step size for respective types
  switch (type) {
    case 'sum':
      operation = (total, current) => mathJSInstance.add(total, current)
      stepSize = 1
      value = 0
      steps = mathJSInstance.add(mathJSInstance.subtract(upper, lower), 1)
      break
    case 'prod':
      operation = (total, current) => mathJSInstance.multiply(total, current)
      stepSize = 1
      value = 1
      steps = mathJSInstance.add(mathJSInstance.subtract(upper, lower), 1)
      break
    case 'int':
      operation = (total, current, next, intStepSize) =>
        mathJSInstance.add(
          total,
          mathJSInstance.multiply(
            mathJSInstance.divide(mathJSInstance.add(current, next), 2),
            intStepSize
          )
        ) // middle sum
      stepSize = mathJSInstance.divide(
        mathJSInstance.subtract(upper, lower),
        steps
      )
      value = 0
      break
    default:
      return 0
  }

  // abort if when step size if 0
  if (stepSize === 0) {
    return 0
  }

  // evaluate the construct
  let current = calculate(lower)
  let next
  for (let i = 0; i < steps; i += 1) {
    next = calculate(
      mathJSInstance.add(
        lower,
        mathJSInstance.multiply(mathJSInstance.add(i, 1), stepSize)
      )
    )
    value = operation(value, current, next, stepSize)
    current = next
  }
  return mathJSInstance.multiply(factor, value)
}

// Enable custom argument parsing for konstrukt()
// https://mathjs.org/examples/advanced/custom_argument_parsing.js.html
mathJSFunctions.konstrukt.rawArgs = true

/*
 * Calculate the factorial of a number.
 *
 * Special feature: If the value differs from an integer by 'epsilonDistance'
 * then it get's rounded to the respective integer.
 * */
mathJSFunctions.factorial = (number) =>
  mathJS.subtract(number, mathJS.round(number)) <= epsilonDistance
    ? factorialOrig(mathJS.round(number))
    : factorialOrig(number)

/*
 * Calculate the binomial n over k.
 *
 * As with factorial, this respects 'epsilonDistance'.
 *
 * This is a modified version of the algorithm used here:
 * https://de.wikipedia.org/wiki/Binomialkoeffizient
 * */
mathJSFunctions.binomial = (nOrig, kOrig) => {
  if (kOrig < 0) {
    throw new Error('Negative k for binomial coefficient')
  }
  if (kOrig > nOrig) {
    throw new Error('In the binomial coefficient k must not be greater than n.')
  }

  let n
  let k

  // Convert values to integers (if they differ maximally by 'epsilonDistance')
  if (mathJS.subtract(nOrig, mathJS.round(nOrig)) <= epsilonDistance) {
    n = mathJS.round(nOrig)
  }
  if (mathJS.subtract(kOrig, mathJS.round(kOrig)) <= epsilonDistance) {
    k = mathJS.round(kOrig)
  }

  // Calculation
  if (mathJS.multiply(2, k) > n) {
    k = mathJS.subtract(n, k) // k = n-k
  }

  if (k === 0) {
    return 1
  }
  let result = mathJS.add(mathJS.subtract(n, k), 1) // result = n-k + 1
  for (let i = 2; i <= k; i = mathJS.add(i, 1)) {
    result = mathJS.divide(
      mathJS.multiply(result, mathJS.add(mathJS.subtract(n, k), i)),
      i
    ) // result *= (n - k + i)/i
  }
  return result
}

/*
 * Calculate expressions of the form sqrt[2^k](n).
 *
 * @param {Number} twosExponent
 * @param {Number} radicand
 */
mathJSFunctions.broot = (twosExponentOrig, radicandOrig) => {
  let twosExponent = twosExponentOrig
  let radicand = radicandOrig

  const isNonNegativeInteger = (number) => number % 1 === 0 && number >= 0

  if (twosExponent === 0) {
    return radicand
  }
  if (radicand === 0) {
    return 0
  }
  if (!isNonNegativeInteger(twosExponent)) {
    return new TypeError('broot: The exponent must be a natural number.')
  }
  if (radicand < 0) {
    return new TypeError('broot: The radicand must be a positive number.')
  }

  for (; twosExponent > 0; twosExponent -= 1) {
    radicand = mathJS.sqrt(radicand)
  }

  return radicand
}

// Add some aliases
mathJSFunctions.arcsin = mathJS.asin
mathJSFunctions.arccos = mathJS.acos
mathJSFunctions.arctan = mathJS.atan
mathJSFunctions.arccot = mathJS.acot
mathJSFunctions.arcsinh = mathJS.asinh
mathJSFunctions.arccosh = mathJS.acosh
mathJSFunctions.arctanh = mathJS.atanh
mathJSFunctions.arccoth = mathJS.acoth

// Import functions into mathjs
mathJS.import(mathJSFunctions, { override: true })

export { mathJS }
export default mathJSFunctions
