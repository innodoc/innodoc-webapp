import React from 'react'

import Layout from '../Layout'
import Toc from '../Toc'
import { useTranslation } from '../../lib/i18n'
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
