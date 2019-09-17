import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from 'antd/es/icon'
import List from 'antd/es/list'

import css from './style.sass'

const FooterLink = ({
  active,
  iconType,
  renderLink,
  shortTitle,
  title,
}) => {
  const icon = iconType
    ? <Icon type={iconType} />
    : <Icon type="border" className={css.iconPlaceholder} />

  const children = (
    <a className={classNames(css.pageLink, { [css.active]: active })} title={title}>
      {icon}
      <span>{shortTitle || title}</span>
    </a>
  )

  const linkContent = React.cloneElement(renderLink(), { children })
  return (
    <List.Item>
      {linkContent}
    </List.Item>
  )
}

FooterLink.defaultProps = {
  active: false,
  iconType: null,
  shortTitle: null,
}

FooterLink.propTypes = {
  active: PropTypes.bool,
  iconType: PropTypes.string,
  renderLink: PropTypes.func.isRequired,
  shortTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
}

export default FooterLink
