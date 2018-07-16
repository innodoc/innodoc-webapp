import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ContentFragment from '.'

const Header = ({ data }) => {
  const [level, [id, classes, content]] = data
  const HeaderTag = `h${level}`
  return (
    <HeaderTag id={id} className={classNames(classes)}>
      <ContentFragment content={content} />
    </HeaderTag>
  )
}

Header.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default Header
