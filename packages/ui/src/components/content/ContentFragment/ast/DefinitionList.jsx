import PropTypes from 'prop-types'
import { Fragment } from 'react'

import ContentFragment from '../ContentFragment.jsx'

import css from './ast.module.sss'

function DefinitionList({ data }) {
  const listItems = data.map((item, i) => (
    <Fragment key={i.toString()}>
      <dt>
        <ContentFragment content={item[0]} />
      </dt>
      <dd>
        {item[1].map((dd, j) => (
          <ContentFragment content={dd} key={j.toString()} />
        ))}
      </dd>
    </Fragment>
  ))
  return <dl className={css.defList}>{listItems}</dl>
}

DefinitionList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default DefinitionList
