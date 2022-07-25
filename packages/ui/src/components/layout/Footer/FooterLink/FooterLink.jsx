import { BorderOutlined } from '@ant-design/icons'
import { List } from 'antd'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { cloneElement } from 'react'

import css from './Link.module.sss'

function FooterLink({ active, icon, renderLink, shortTitle, title }) {
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

  const linkContent = cloneElement(renderLink(), { children })
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
