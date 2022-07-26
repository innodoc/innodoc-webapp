import Head from 'next/head'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { selectCourse } from '@innodoc/store/selectors/content'
import { useTranslatedContent } from '@innodoc/ui/hooks'

function PageTitle({ children }) {
  const translateContent = useTranslatedContent()

  const transTitle = translateContent(useSelector(selectCourse).title)
  const pageTitle = children ? `${children} · ${transTitle}` : transTitle

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  )
}

PageTitle.defaultProps = { children: null }
PageTitle.propTypes = { children: PropTypes.string }

export default PageTitle
