import math from 'mathjs'

import QuestionValidator from './QuestionValidator'

class MathFormulaValidator extends QuestionValidator {
  static validate(input, solution) {
    let parsedInput
    let parsedSolution
    try {
      parsedInput = math.simplify(math.parse(input))
      parsedSolution = math.simplify(math.parse(solution))
    } catch (e) {
      if (e instanceof SyntaxError) {
        return false
      }
    }

    if (typeof parsedInput !== 'undefined') {
      return parsedInput.equals(parsedSolution)
    }

    return false
  }
}

export default MathFormulaValidator
