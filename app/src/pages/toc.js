import { Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import getStaticPageProps from '../lib/getStaticPageProps'
import serversideBootstrap from '../lib/serversideBootstrap'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import Toc from '../Toc'

const TocPage = () => {
  const { t } = useTranslation()
  const title = t('common.toc')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <Typography.Title>{t('common.toc')}</Typography.Title>
        <Toc expandAll />
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getStaticPageProps)

export { getStaticProps }
export default TocPage
