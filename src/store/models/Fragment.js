import { Model, attr } from 'redux-orm'

import { actionTypes } from '../actions/content'

export default class Fragment extends Model {
  static get modelName() {
    return 'Fragment'
  }

  static get fields() {
    return {
      id: attr(),
      content: attr(),
    }
  }

  static reducer(action, FragmentModel) {
    switch (action.type) {
      case actionTypes.LOAD_FRAGMENT_SUCCESS:
        FragmentModel.upsert({
          id: action.data.contentId,
          content: {
            [action.data.language]: action.data.content,
          },
        })
        break
      default:
        break
    }
  }
}
