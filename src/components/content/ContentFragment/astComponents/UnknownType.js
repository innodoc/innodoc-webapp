import React, { useState } from 'react'
import PropTypes from 'prop-types'

import css from './style.sass'

const dataType = PropTypes.arrayOf(PropTypes.object)

const UnknownTypeData = ({ data }) => (
  <pre className={css.componentData}>
    {JSON.stringify(data, null, 2)}
  </pre>
)
UnknownTypeData.propTypes = { data: dataType.isRequired }

const UnknownType = ({ data, name }) => {
  const [showData, setShowData] = useState(false)
  const toggleData = () => setShowData(!showData)
  return (
    <div
      className={css.unknownComponent}
      onClick={toggleData}
      onKeyPress={toggleData}
      role="button"
      tabIndex={0}
    >
      <span>
        { showData ? '➖' : '➕' }
        {' '}
        Unknown component:
        {' '}
        <strong><code>{name}</code></strong>
      </span>
      {showData ? <UnknownTypeData data={data} /> : null}
    </div>
  )
}

UnknownType.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any),
}
UnknownType.defaultProps = { data: [] }

export default UnknownType
