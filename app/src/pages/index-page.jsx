import { Typography } from 'antd'
import MathJax from '@innodoc/react-mathjax-node'

import { useTranslation } from 'next-i18next'

import getTranslationProps from '../lib/getTranslationProps.js'
import serversideBootstrap from '../lib/serversideBootstrap.js'
import Layout from '../Layout'
import Index from '../Index'
import PageTitle from '../common/PageTitle'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import css from '../content/content.module.sss'

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
        <Typography.Title>{title}</Typography.Title>
        <MathJax.Provider>
          <Index />
        </MathJax.Provider>
      </Layout>
    </>
  )
}

const getStaticProps = serversideBootstrap(getTranslationProps)

export { getStaticProps }
export default IndexPage
