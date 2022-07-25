import { Typography } from 'antd'
import PropTypes from 'prop-types'
import { useState } from 'react'

import css from './ast.module.sss'

function UnknownTypeData({ data }) {
  return <span className={css.componentData}>{JSON.stringify(data, null, 2)}</span>
}

UnknownTypeData.propTypes = { data: PropTypes.any.isRequired }

function UnknownType({ data, name }) {
  const [showData, setShowData] = useState(false)
  const toggleData = () => setShowData(!showData)
  return (
    <span
      className={css.unknownComponent}
      onClick={toggleData}
      onKeyPress={toggleData}
      role="button"
      tabIndex={0}
    >
      <span>
        {showData ? '➖' : '➕'} Unknown component: <Typography.Text code>{name}</Typography.Text>
      </span>
      {showData ? <UnknownTypeData data={data} /> : null}
    </span>
  )
}

UnknownType.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any),
}

UnknownType.defaultProps = { data: [] }

export default UnknownType
