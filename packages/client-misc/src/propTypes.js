import PropTypes from 'prop-types'

import { messageLevels, messageTypes } from './messageDef'

const attributeType = PropTypes.PropTypes.arrayOf(PropTypes.array)

const childrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
])

const contentType = PropTypes.arrayOf(PropTypes.object)

const messageType = PropTypes.shape({
  level: PropTypes.oneOf(messageLevels).isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(messageTypes).isRequired,
})

const sectionType = PropTypes.shape({
  content: PropTypes.objectOf(contentType),
  id: PropTypes.string.isRequired,
  ord: PropTypes.arrayOf(PropTypes.number).isRequired,
  parentId: PropTypes.string,
  title: PropTypes.objectOf(PropTypes.string).isRequired,
})

export { attributeType, childrenType, contentType, messageType, sectionType }
