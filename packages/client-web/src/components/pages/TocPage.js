import React from 'react'
import { Typography } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
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

export default TocPage
