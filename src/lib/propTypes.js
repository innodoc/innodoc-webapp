import PropTypes from 'prop-types'

const childrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
])
const contentType = PropTypes.arrayOf(PropTypes.object)
const tocTreeType = PropTypes.arrayOf(PropTypes.object)
const sectionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: contentType.isRequired,
  children: tocTreeType,
})
const messageType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
})

export {
  childrenType,
  contentType,
  messageType,
  sectionType,
  tocTreeType,
}
