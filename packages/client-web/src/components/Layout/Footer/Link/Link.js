import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { List } from 'antd'
import { BorderOutlined } from '@ant-design/icons'

import css from './style.sss'

const FooterLink = ({ active, icon, renderLink, shortTitle, title }) => {
  const iconSpan = icon ? (
    <span className={css.icon}>{icon}</span>
  ) : (
    <span className={classNames(css.icon, css.iconPlaceholder)}>
      <BorderOutlined />
    </span>
  )

  const children = (
    <a className={classNames(css.pageLink, { [css.active]: active })} title={title}>
      {iconSpan}
      <span>{shortTitle || title}</span>
    </a>
  )

  const linkContent = React.cloneElement(renderLink(), { children })
  return <List.Item>{linkContent}</List.Item>
}

FooterLink.defaultProps = {
  active: false,
  icon: null,
  shortTitle: null,
}

FooterLink.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.node,
  renderLink: PropTypes.func.isRequired,
  shortTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
}

export default FooterLink
