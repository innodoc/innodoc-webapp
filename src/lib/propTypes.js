import PropTypes from 'prop-types'

const childrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
])
const contentType = PropTypes.arrayOf(PropTypes.object)
const messageType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
})
const tocTreeType = PropTypes.arrayOf(PropTypes.object)

export {
  childrenType,
  contentType,
  messageType,
  tocTreeType,
}
