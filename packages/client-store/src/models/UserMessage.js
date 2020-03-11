import { Model, attr } from 'redux-orm'

import { actionTypes as uiActionTypes } from '../actions/ui'

export default class UserMessage extends Model {
  static get modelName() {
    return 'UserMessage'
  }

  static get fields() {
    return {
      id: attr(),
      closable: attr(),
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
      case uiActionTypes.CLOSE_MESSAGES:
        UserMessageModel.filter((msg) =>
          action.messageTypes.includes(msg.type)
        ).delete()
        break
      case uiActionTypes.SHOW_MESSAGE:
        UserMessageModel.create(action.msg)
        break
      default:
        break
    }
  }
}
