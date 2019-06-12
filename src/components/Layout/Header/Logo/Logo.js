import React from 'react'
import PropTypes from 'prop-types'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

import { withTranslation } from '../../../../lib/i18n'
import css from './style.sass'

const Logo = ({ t }) => (
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

Logo.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withTranslation()(Logo)
