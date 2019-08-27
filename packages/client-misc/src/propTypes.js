import PropTypes from 'prop-types'

const attributeType = PropTypes.PropTypes.arrayOf(PropTypes.array)

const childrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
])

const contentType = PropTypes.arrayOf(PropTypes.object)

const courseType = PropTypes.shape({
  currentSection: PropTypes.string,
  homeLink: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.shape({}),
})

const messageType = PropTypes.shape({
  level: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
})

const sectionType = PropTypes.shape({
  content: PropTypes.objectOf(contentType),
  id: PropTypes.string.isRequired,
  ord: PropTypes.arrayOf(PropTypes.number).isRequired,
  parentId: PropTypes.string,
  title: PropTypes.objectOf(PropTypes.string).isRequired,
})

export {
  attributeType,
  childrenType,
  contentType,
  courseType,
  messageType,
  sectionType,
}
