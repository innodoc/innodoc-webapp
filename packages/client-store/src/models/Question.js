import { Model, attr, fk } from 'redux-orm'

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
      points: attr({ getDefault: () => 0 }),
      exerciseId: fk('Exercise', 'questions'),
    }
  }

  static reducer(action, QuestionModel) {
    switch (action.type) {
      case actionTypes.ADD_QUESTION:
        QuestionModel.upsert({
          id: action.questionId,
          exerciseId: action.exerciseId,
          points: action.points,
        })
        break
      case actionTypes.QUESTION_ANSWERED:
        QuestionModel.upsert({
          id: action.id,
          answer: action.answer,
        })
        break
      case actionTypes.QUESTION_SOLVED:
        QuestionModel.upsert({
          id: action.id,
          correct: action.correct,
        })
        break
      default:
        break
    }
  }
}
