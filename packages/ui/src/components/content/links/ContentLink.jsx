import { Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { cloneElement } from 'react'

import { childrenType } from '@innodoc/misc/propTypes'
import { parseLink } from '@innodoc/misc/utils'

import PageLink from './PageLink.js'
import SectionLink from './SectionLink.js'

const specialPages = {
  ___INDEX_PAGE___: ['/index-page', 'index.title'],
  ___TOC___: ['/toc', 'common.toc'],
  ___PROGRESS___: ['/progress', 'progress.title'],
}

// takes href like '/section/...' or '/page/...'
function ContentLink({ children, href }) {
  const { t } = useTranslation()
  let contentType
  let contentId

  if (Object.keys(specialPages).includes(href)) {
    const [pageHref, i18nKey] = specialPages[href]
    const title = t(i18nKey)

    const newChildren = children ? cloneElement(children, { title }) : <a>{title}</a>

    return <Link href={pageHref}>{newChildren}</Link>
  }

  try {
    ;[contentType, contentId] = parseLink(href)
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <Typography.Text type="danger">
          {children} (Unhandled internal link: <code>{href}</code>)
        </Typography.Text>
      )
    }
    return children
  }
  const LinkComponent = contentType === 'page' ? PageLink : SectionLink
  return <LinkComponent contentId={contentId}>{children}</LinkComponent>
}

ContentLink.defaultProps = {
  children: null,
}

ContentLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: childrenType,
}

export { ContentLink, PageLink, SectionLink }
