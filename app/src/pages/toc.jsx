import { Typography } from 'antd'
import { useTranslation } from 'next-i18next'

import { PageTitle } from '@innodoc/ui/common'
import Layout from '@innodoc/ui/layout'
import TocComponent from '@innodoc/ui/toc'

import getTranslationProps from '../lib/getTranslationProps.js'
import serversideBootstrap from '../lib/serversideBootstrap.js'

function Toc() {
  const { t } = useTranslation()
  const title = t('common.toc')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Typography.Title>{t('common.toc')}</Typography.Title>
        <TocComponent expandAll />
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getTranslationProps)

export { getStaticProps }
export default Toc
