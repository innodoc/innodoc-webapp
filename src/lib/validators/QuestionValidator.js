class QuestionValidator {
  static validate() {
    throw Error('QuestionValidator.validate: you must overwrite the validate function in your validator.')
  }
}

export default QuestionValidator
