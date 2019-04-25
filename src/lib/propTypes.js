import PropTypes from 'prop-types'

const childrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
])

const contentType = PropTypes.arrayOf(PropTypes.object)

const tocTreeType = PropTypes.arrayOf(PropTypes.object)

const sectionType = PropTypes.shape({
  id: PropTypes.string,
  path: PropTypes.string,
  title: PropTypes.object,
})

const messageType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
})

const courseType = PropTypes.shape({
  currentSection: PropTypes.string,
  homeLink: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.shape({}),
})

export {
  childrenType,
  courseType,
  contentType,
  messageType,
  sectionType,
  tocTreeType,
}
