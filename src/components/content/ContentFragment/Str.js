import PropTypes from 'prop-types'

const Str = ({ data }) => data
Str.propTypes = {
  data: PropTypes.string.isRequired,
}

export default Str
