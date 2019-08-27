import { Model, attr } from 'redux-orm'

import { actionTypes } from '../actions/question'

export default class Question extends Model {
  static get modelName() {
    return 'Question'
  }

  static get fields() {
    return {
      id: attr(),
      answer: attr(),
      correct: attr(),
    }
  }

  static reducer(action, QuestionModel) {
    switch (action.type) {
      case actionTypes.QUESTION_ANSWERED:
        QuestionModel.upsert({
          id: action.data.questionId,
          answer: action.data.answer,
        })
        break
      case actionTypes.QUESTION_SOLVED:
        QuestionModel.upsert({
          id: action.data.questionId,
          correct: action.data.correct,
        })
        break
      default:
        break
    }
  }
}
