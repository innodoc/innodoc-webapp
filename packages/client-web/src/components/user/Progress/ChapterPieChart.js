import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Progress, Typography } from 'antd'

import css from './style.sss'

const ChapterPieChart = ({ description, percent, status, title, wideLayout }) => (
  <Col xs={24} sm={24} md={8}>
    <Row justify="space-between" align="middle" gutter={[0, wideLayout ? 0 : 16]}>
      <Col className={css.centerCol} xs={8} sm={6} md={24}>
        <Progress
          format={(p) => `${p} %`}
          type="circle"
          percent={percent}
          status={status}
          width={wideLayout ? undefined : 100}
        />
      </Col>
      <Col className={wideLayout ? css.wide : null} xs={16} sm={18} md={24}>
        <Typography.Text strong>{title}</Typography.Text>
        <br />
        {description}
      </Col>
    </Row>
  </Col>
)

ChapterPieChart.propTypes = {
  description: PropTypes.node.isRequired,
  percent: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['normal', 'success', 'exception']).isRequired,
  title: PropTypes.string.isRequired,
  wideLayout: PropTypes.bool.isRequired,
}

export default ChapterPieChart
