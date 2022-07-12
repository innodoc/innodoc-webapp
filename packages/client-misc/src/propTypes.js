import PropTypes from 'prop-types'

import { MESSAGE_LEVELS, MESSAGE_TYPES, RESULT } from './constants.js'

export const attributeType = PropTypes.PropTypes.arrayOf(PropTypes.array)

export const childrenType = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])

export const contentType = PropTypes.arrayOf(PropTypes.object)

export const feedbackMessageType = PropTypes.exact({
  msg: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  interp: PropTypes.object,
})

export const feedbackMessagesType = PropTypes.arrayOf(feedbackMessageType)

export const messageType = PropTypes.shape({
  closable: PropTypes.bool.isRequired,
  level: PropTypes.oneOf(MESSAGE_LEVELS).isRequired,
  text: PropTypes.string,
  type: PropTypes.oneOf(MESSAGE_TYPES).isRequired,
})

export const sectionType = PropTypes.shape({
  content: PropTypes.objectOf(contentType),
  id: PropTypes.string.isRequired,
  ord: PropTypes.arrayOf(PropTypes.number).isRequired,
  parentId: PropTypes.string,
  title: PropTypes.objectOf(PropTypes.string).isRequired,
})

export const resultType = PropTypes.oneOf(Object.values(RESULT))
