import { Model, attr, fk } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'

export default class Exercise extends Model {
  static get modelName() {
    return 'Exercise'
  }

  static get fields() {
    return {
      id: attr(),
      number: attr(),
      points: attr({ getDefault: () => 0 }),
      questionCount: attr({ getDefault: () => 0 }),
      sectionId: fk('Section', 'exercises'),
    }
  }

  static reducer(action, ExerciseModel) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS: {
        const { cards } = action.data.content
        if (cards) {
          Object.keys(cards).forEach((sectionId) => {
            const sectionCards = cards[sectionId]
            if (sectionCards) {
              sectionCards.forEach((cardData) => {
                if (cardData[2] === 'exercise') {
                  const [id, number, , points, questionCount] = cardData
                  ExerciseModel.create({
                    id: `${sectionId}#${id}`,
                    number,
                    points,
                    questionCount,
                    sectionId,
                  })
                }
              })
            }
          })
        }
        break
      }

      default:
        break
    }
  }
}
