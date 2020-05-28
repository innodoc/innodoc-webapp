import { Model, attr, fk } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import { actionTypes } from '../actions/question'

export default class Question extends Model {
  static get modelName() {
    return 'Question'
  }

  static get fields() {
    return {
      id: attr(),
      answer: attr(),
      result: attr({ getDefault: () => RESULT_VALUE.NEUTRAL }),
      points: attr({ getDefault: () => 0 }),
      exerciseId: fk('Exercise', 'questions'),
      messages: attr({ getDefault: () => [] }),
      latexCode: attr(),
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
      case actionTypes.QUESTION_EVALUATED:
        QuestionModel.upsert({
          id: action.id,
          messages: action.messages,
          result: action.result,
          latexCode: action.latexCode,
        })
        break
      default:
        break
    }
  }
}
