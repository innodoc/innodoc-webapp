import PropTypes from 'prop-types'

import { MESSAGE_LEVELS, MESSAGE_TYPES } from './messageDef'

const attributeType = PropTypes.PropTypes.arrayOf(PropTypes.array)

const childrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
])

const contentType = PropTypes.arrayOf(PropTypes.object)

const messageType = PropTypes.shape({
  closable: PropTypes.bool.isRequired,
  level: PropTypes.oneOf(MESSAGE_LEVELS).isRequired,
  text: PropTypes.string,
  type: PropTypes.oneOf(MESSAGE_TYPES).isRequired,
})

const sectionType = PropTypes.shape({
  content: PropTypes.objectOf(contentType),
  id: PropTypes.string.isRequired,
  ord: PropTypes.arrayOf(PropTypes.number).isRequired,
  parentId: PropTypes.string,
  title: PropTypes.objectOf(PropTypes.string).isRequired,
})

export { attributeType, childrenType, contentType, messageType, sectionType }
