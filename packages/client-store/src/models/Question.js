import { Model, attr, fk } from 'redux-orm'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import { actionTypes as questionActionTypes } from '../actions/question'
import { actionTypes as userActionTypes } from '../actions/user'

export default class Question extends Model {
  static get modelName() {
    return 'Question'
  }

  static get fields() {
    return {
      id: attr(),
      answer: attr(),
      answeredTimestamp: attr(),
      result: attr({ getDefault: () => RESULT_VALUE.NEUTRAL }),
      points: attr({ getDefault: () => 0 }),
      exerciseId: fk('Exercise', 'questions'),
      messages: attr({ getDefault: () => [] }),
      latexCode: attr(),
    }
  }

  static reducer(action, QuestionModel) {
    switch (action.type) {
      case questionActionTypes.ADD_QUESTION:
        QuestionModel.upsert({
          id: action.questionId,
          exerciseId: action.exerciseId,
          points: action.points,
        })
        break

      case questionActionTypes.QUESTION_ANSWERED:
        QuestionModel.upsert({
          id: action.id,
          answer: action.answer,
        })
        break

      case questionActionTypes.QUESTION_EVALUATED:
        QuestionModel.upsert({
          id: action.id,
          answeredTimestamp: Date.now(),
          messages: action.messages,
          result: action.result,
          latexCode: action.latexCode,
        })
        break

      case userActionTypes.CLEAR_PROGRESS:
        QuestionModel.all()
          .toModelArray()
          .forEach((section) =>
            section.update({
              answer: null,
              result: RESULT_VALUE.NEUTRAL,
              messages: [],
              latexCode: null,
            })
          )
        break

      case userActionTypes.LOAD_PROGRESS:
        // Merge questions (newer timestamp wins)
        action.answeredQuestions.forEach((q1) => {
          const q2 = QuestionModel.withId(q1.id)
          if (!q2 || !q2.answeredTimestamp) {
            QuestionModel.upsert(q1)
          } else if (q1.answeredTimestamp >= q2.answeredTimestamp) {
            q2.update(q1)
          }
        })
        break

      default:
        break
    }
  }
}
