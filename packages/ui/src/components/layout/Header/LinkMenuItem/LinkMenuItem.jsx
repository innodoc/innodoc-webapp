import { Menu } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'

import PageLink from '../../../content/links/PageLink.js'

import css from './LinkMenuItem.module.sss'

function LinkMenuItem({ itemActive, href, icon, pageId, title, titleLong, ...otherProps }) {
  let link

  const anchor = (
    <a className={itemActive ? css.active : undefined} title={titleLong || title}>
      {icon}
      {title}
    </a>
  )

  if (href) {
    link = <Link href={href}>{anchor}</Link>
  } else if (pageId) {
    link = <PageLink contentId={pageId}>{anchor}</PageLink>
  } else {
    throw new Error('Must specify either href or pageId!')
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Menu.Item {...otherProps}>{link}</Menu.Item>
  )
}

LinkMenuItem.defaultProps = {
  href: undefined,
  itemActive: false,
  pageId: undefined,
  titleLong: undefined,
}

LinkMenuItem.propTypes = {
  itemActive: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.node.isRequired,
  pageId: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleLong: PropTypes.string,
}

export default LinkMenuItem
