import { Model, attr, fk } from 'redux-orm'

import { actionTypes as contentActionTypes } from '../actions/content'

export default class Box extends Model {
  static get modelName() {
    return 'Box'
  }

  static get fields() {
    return {
      id: attr(),
      number: attr(),
      sectionId: fk('Section', 'boxes'),
      type: attr(),
    }
  }

  static reducer(action, BoxModel) {
    switch (action.type) {
      case contentActionTypes.LOAD_MANIFEST_SUCCESS: {
        const { boxes } = action.data.content
        if (boxes) {
          Object.keys(boxes).forEach((sectionId) => {
            const sectionBoxes = boxes[sectionId]
            sectionBoxes.forEach(([number, type]) =>
              BoxModel.create({ number, type, sectionId })
            )
          })
        }
        break
      }
      default:
        break
    }
  }
}
