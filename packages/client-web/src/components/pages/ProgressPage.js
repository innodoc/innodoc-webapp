import React from 'react'
import { Typography } from 'antd'

import { useTranslation } from 'next-i18next'

import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import UserProgress from '../user/Progress'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import css from '../content/content.module.sss'

const ProgressPage = () => {
  const { t } = useTranslation()
  const title = t('progress.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout>
        <div className={css.sidebarToggle}>
          <SidebarToggleButton />
        </div>
        <Typography.Title>{title}</Typography.Title>
        <UserProgress />
      </Layout>
    </>
  )
}

export default ProgressPage
