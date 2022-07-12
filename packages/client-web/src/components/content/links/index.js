import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Typography } from 'antd'

import { useTranslation } from 'next-i18next'
import { propTypes, util } from '@innodoc/client-misc'
import pageSelectors from '@innodoc/client-store/src/selectors/page'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import makeContentLink from './makeContentLink'

const PageLink = makeContentLink(pageSelectors.makeGetPageLink, 'page')
const SectionLink = makeContentLink(sectionSelectors.makeGetSectionLink, 'section')

const specialPages = {
  ___INDEX_PAGE___: ['/index-page', 'index.title'],
  ___TOC___: ['/toc', 'common.toc'],
  ___PROGRESS___: ['/progress', 'progress.title'],
}

// takes href like '/section/...' or '/page/...'
const InternalLink = ({ children, href }) => {
  const { t } = useTranslation()
  let contentType
  let contentId

  if (Object.keys(specialPages).includes(href)) {
    const [pageHref, i18nKey] = specialPages[href]
    const title = t(i18nKey)

    const newChildren = children ? React.cloneElement(children, { title }) : <a>{title}</a>

    return <Link href={pageHref}>{newChildren}</Link>
  }

  try {
    ;[contentType, contentId] = util.parseLink(href)
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

InternalLink.defaultProps = {
  children: null,
}

InternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: propTypes.childrenType,
}

export { InternalLink, PageLink, SectionLink }
