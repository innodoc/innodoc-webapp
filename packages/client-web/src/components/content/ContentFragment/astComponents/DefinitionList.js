import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '..'
import css from './ast.module.sss'

const DefinitionList = ({ data }) => {
  const listItems = data.map((item, i) => (
    <React.Fragment key={i.toString()}>
      <dt>
        <ContentFragment content={item[0]} />
      </dt>
      <dd>
        {item[1].map((dd, j) => (
          <ContentFragment content={dd} key={j.toString()} />
        ))}
      </dd>
    </React.Fragment>
  ))
  return <dl className={css.defList}>{listItems}</dl>
}

DefinitionList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default DefinitionList
