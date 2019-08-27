import React from 'react'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import Toc from '../Toc'
import css from '../content/style.sass'

const TocPage = () => {
  const { t } = useTranslation()
  return (
    <Layout disableSidebar>
      <h1 className={css.header}>{t('common.toc')}</h1>
      <Toc expandAll />
    </Layout>
  )
}

export default TocPage
