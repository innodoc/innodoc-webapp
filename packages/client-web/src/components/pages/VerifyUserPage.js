import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'

import Layout from '../Layout'
import VerifyUserResult from '../user/VerifyUserResult'

const VerifyUserPage = ({ token }) => (
  <Layout disableSidebar>
    <Row justify="space-around" align="middle">
      <Col xs={24} sm={20} md={18} lg={16}>
        <VerifyUserResult token={token} />
      </Col>
    </Row>
  </Layout>
)

VerifyUserPage.getInitialProps = ({ query }) => ({ token: query.token })

VerifyUserPage.propTypes = {
  token: PropTypes.string.isRequired,
}

export default VerifyUserPage
