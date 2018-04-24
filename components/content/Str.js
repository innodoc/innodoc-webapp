import PropTypes from 'prop-types'

const Str = ({data}) => data
Str.propTypes = {
  content: PropTypes.string.isRequired
}

export default Str
