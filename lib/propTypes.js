import PropTypes from 'prop-types'

const childrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
])
const contentType = PropTypes.arrayOf(PropTypes.object)
const tocTreeType = PropTypes.objectOf(PropTypes.object)

export { childrenType, contentType, tocTreeType }
