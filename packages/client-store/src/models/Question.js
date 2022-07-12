import { Model, attr, fk } from 'redux-orm'

import { constants } from '@innodoc/client-misc'

import { actionTypes as exerciseActionTypes } from '../actions/exercise'
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
      result: attr({ getDefault: () => constants.RESULT.NEUTRAL }),
      points: attr({ getDefault: () => 0 }),
      exerciseId: fk('Exercise', 'questions'),
      messages: attr({ getDefault: () => [] }),
      latexCode: attr(),
      invalid: attr({ getDefault: () => false }),
    }
  }

  static reducer(action, QuestionModel, session) {
    switch (action.type) {
      case exerciseActionTypes.RESET_EXERCISE:
        QuestionModel.filter({ exerciseId: action.id })
          .toModelArray()
          .forEach((question) => question.clear())
        break

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

      case questionActionTypes.QUESTION_INVALID:
        QuestionModel.upsert({
          id: action.id,
          invalid: true,
          messages: [{ msg: action.message, type: 'error' }],
        })
        break

      case userActionTypes.CLEAR_PROGRESS:
        QuestionModel.all()
          .toModelArray()
          .forEach((question) => question.clear())
        break

      case userActionTypes.RESET_TEST: {
        const section = session.Section.withId(action.sectionId)
        if (section.exercises) {
          section.exercises
            .toModelArray()
            .forEach((ex) => ex.questions.toModelArray().forEach((q) => q.clear()))
        }
        break
      }

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

  clear() {
    this.update({
      answer: undefined,
      answeredTimestamp: Date.now(),
      result: constants.RESULT.NEUTRAL,
      messages: [],
      latexCode: undefined,
    })
  }
}
