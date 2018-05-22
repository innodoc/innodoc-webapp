import QuestionValidator from './QuestionValidator'

class StringEqualityValidator extends QuestionValidator {
  static validate(input, solution) {
    return input === solution
  }
}

export default StringEqualityValidator
