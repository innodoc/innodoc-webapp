import PropTypes from 'prop-types'

import ContentFragment from '../ContentFragment.jsx'

import css from './ast.module.sss'

function BulletList({ data }) {
  const listItems = data.map((item, i) => (
    <li key={i.toString()}>
      <ContentFragment content={item} />
    </li>
  ))
  return <ul className={css.list}>{listItems}</ul>
}

BulletList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
}

export default BulletList
