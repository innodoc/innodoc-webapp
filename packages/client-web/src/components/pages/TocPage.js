import React from 'react'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import Toc from '../Toc'
import css from '../content/style.sss'

const TocPage = () => {
  const { t } = useTranslation()
  const title = t('common.toc')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout disableSidebar>
        <h1 className={css.header}>{t('common.toc')}</h1>
        <Toc expandAll />
      </Layout>
    </>
  )
}

export default TocPage
