import React from 'react'
import PropTypes from 'prop-types'
import AntLayout from 'antd/lib/layout'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import List from 'antd/lib/list'
import { withNamespaces, Trans } from 'react-i18next'

import css from './style.sass'

const Footer = ({ t }) => (
  <AntLayout.Footer className={css.footer}>
    <Row>
      <Col xs={24} sm={24} md={6} lg={6} xl={6} className={css.footerCol}>
        <div className={css.footerSegment}>
          <h4>
            {t('footer.course')}
          </h4>
          <List>
            <List.Item>
              <a>
                {t('footer.viewIndex')}
              </a>
            </List.Item>
            <List.Item>
              <a>
                {t('footer.displayOfFormulas')}
              </a>
            </List.Item>
          </List>
        </div>
        <div className={css.footerSegment}>
          <h4>
            {t('footer.aboutThisProject')}
          </h4>
          <List>
            <List.Item>
              <a>
                {t('footer.courseInformation')}
              </a>
            </List.Item>
            <List.Item>
              <a>
                {t('footer.contact')}
              </a>
            </List.Item>
            <List.Item>
              <a>
                {t('footer.authors')}
              </a>
            </List.Item>
            <List.Item>
              <a>
                {t('footer.imprint')}
              </a>
            </List.Item>
            <List.Item>
              <a>
                {t('footer.liability')}
              </a>
            </List.Item>
          </List>
        </div>
      </Col>
      <Col xs={24} sm={24} md={11} lg={11} xl={11} className={css.footerCol}>
        <div className={css.footerSegment}>
          <h4>
            {t('footer.license')}
          </h4>
          <p>
            <Trans i18nKey="footer.licensePhrase">
              License:
              <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">
                License
              </a>
            </Trans>
          </p>
          <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">
            <img src="/static/img/cc-by-sa/cc-icon-white-x2.png" alt="CC icon" className={css.licenseIcon} />
            <img src="/static/img/cc-by-sa/attribution-icon-white-x2.png" alt="Attribution icon" className={css.licenseIcon} />
            <img src="/static/img/cc-by-sa/sa-white-x2.png" alt="SA icon" className={css.licenseIcon} />
          </a>
        </div>
      </Col>
      <Col xs={24} sm={24} md={7} lg={7} xl={7} className={css.footerCol}>
        <div className={css.footerSegment}>
          <h4>
            {t('footer.institutions')}
          </h4>
          <p>
            <Trans i18nKey="footer.projectPhrase">
              Project link:
              <a href="http://www.ve-und-mint.de/" target="_blank" rel="noopener noreferrer">
                Project name
              </a>
            </Trans>
          </p>
        </div>
        <div className={css.footerSegment}>
          <p>
            {t('footer.institutionsPhrase')}
          </p>
          <p>
            TODO
          </p>
        </div>
      </Col>
    </Row>
  </AntLayout.Footer>
)

Footer.propTypes = {
  t: PropTypes.func.isRequired,
}

export { Footer } // for testing
export default withNamespaces()(Footer)
