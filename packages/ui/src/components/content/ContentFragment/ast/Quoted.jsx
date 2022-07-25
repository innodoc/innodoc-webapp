import PropTypes from 'prop-types'

import ContentFragment from '../ContentFragment.jsx'

function Quoted({ data: [, content] }) {
  return (
    <>
      &ldquo;
      <ContentFragment content={content} />
      &rdquo;
    </>
  )
}

Quoted.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
}

export default Quoted
