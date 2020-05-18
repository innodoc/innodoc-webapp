import React from 'react'
import { Typography } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import PageTitle from '../PageTitle'
import UserResults from '../user/Results'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import css from '../content/style.sss'

const ResultsPage = () => {
  const { t } = useTranslation()
  const title = t('results.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout>
        <div className={css.sidebarToggle}>
          <SidebarToggleButton />
        </div>
        <Typography.Title>{title}</Typography.Title>
        <UserResults />
      </Layout>
    </>
  )
}

export default ResultsPage
