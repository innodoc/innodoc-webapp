import math from 'mathjs'

import QuestionValidator from './QuestionValidator'

class MathExpressionEqualityValidator extends QuestionValidator {
  static validate(input, solution, data) {
    // TODO is this mathematecally correct (creates the same wrongs and corrects
    // as before?
    let epsilon = data.precision
    epsilon = math.eval(`1e-${epsilon}`)
    math.config({
      epsilon,
    })

    let evalInput
    let evalSolution

    try {
      evalInput = math.eval(input)
      evalSolution = math.eval(solution)
    } catch (e) {
      if (e instanceof SyntaxError) {
        return false
      }
    }
    if (typeof evalInput !== 'undefined') {
      return math.equal(evalInput, evalSolution)
    }
    return false
  }
}

export default MathExpressionEqualityValidator
