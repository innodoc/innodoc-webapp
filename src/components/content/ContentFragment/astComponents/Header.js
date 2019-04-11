import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ContentFragment from '..'
import css from '../../header.sass'

const Header = ({ data }) => {
  const [level, [id, classes], content] = data
  const HeaderTag = `h${level}`
  return (
    <HeaderTag id={id} className={classNames(classes, css.header)}>
      <ContentFragment content={content} />
    </HeaderTag>
  )
}

Header.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default Header
