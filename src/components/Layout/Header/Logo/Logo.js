import React from 'react'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

import css from './style.sass'
import { useTranslation } from '../../../../lib/i18n'

const Logo = () => {
  const { t } = useTranslation()
  return (
    <a className={css.logoLink}>
      <Row>
        <Col xs={6} sm={6} md={8} lg={8} xl={8} className={css.headerLogoWrapper}>
          <img
            alt={t('header.tmpTitle')}
            src="/static/img/m4r-logo-simple.png"
          />
        </Col>
        <Col xs={18} sm={18} md={16} lg={16} xl={16}>
          <span>
            {t('header.tmpTitle')}
          </span>
        </Col>
      </Row>
    </a>
  )
}

export default Logo
