import React from 'react'
import classNames from 'classnames'
import MathJax from '@innodoc/react-mathjax-node'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

import Layout from '../Layout'
import Index from '../Index'
import PageTitle from '../PageTitle'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import css from '../content/style.sss'

const IndexPage = () => {
  const { t } = useTranslation()
  const title = t('index.title')
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Layout>
        <div className={css.sidebarToggle}>
          <SidebarToggleButton />
        </div>
        <h1 className={classNames(css.header, 'clearfix')}>{title}</h1>
        <MathJax.Provider>
          <Index />
        </MathJax.Provider>
      </Layout>
    </>
  )
}

export default IndexPage
