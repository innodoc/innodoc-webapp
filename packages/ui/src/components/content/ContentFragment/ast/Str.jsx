import PropTypes from 'prop-types'

function Str({ data }) {
  return data
}

Str.propTypes = {
  data: PropTypes.string.isRequired,
}

export default Str
