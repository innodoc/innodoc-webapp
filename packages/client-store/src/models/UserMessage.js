import { Model, attr } from 'redux-orm'

import { actionTypes as uiActionTypes } from '../actions/ui'

export default class UserMessage extends Model {
  static get modelName() {
    return 'UserMessage'
  }

  static get fields() {
    return {
      id: attr({ getDefault: () => 0 }),
      level: attr(),
      text: attr(),
      type: attr(),
    }
  }

  static reducer(action, UserMessageModel) {
    switch (action.type) {
      case uiActionTypes.CLOSE_MESSAGE:
        UserMessageModel.withId(action.id).delete()
        break
      case uiActionTypes.SHOW_MESSAGE:
        UserMessageModel.create({
          level: action.level,
          text: action.text,
          type: action.messageType,
        })
        break
      default:
        break
    }
  }
}
