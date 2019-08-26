import React from 'react'
import classNames from 'classnames'

import Layout from '../Layout'
import Index from '../Index'
import SidebarToggleButton from '../Layout/Sidebar/ToggleButton'
import { useTranslation } from '../../lib/i18n'
import css from './style.sass'
import contentCss from '../content/style.sass'

const IndexPage = () => {
  const { t } = useTranslation()
  return (
    <Layout>
      <div className={css.sidebarToggle}>
        <SidebarToggleButton />
      </div>
      <h1 className={classNames(contentCss.header, 'clearfix')}>
        {t('common.index')}
      </h1>
      <Index />
    </Layout>
  )
}

export default IndexPage